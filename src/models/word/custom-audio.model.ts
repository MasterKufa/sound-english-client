import { createStore, createEvent, createEffect, sample } from "effector";
import { fromPairs, toPairs } from "lodash";
import { Lang } from "shared/settings.types";
import { CustomAudios } from "shared/vocabulary.types";
import { recorder } from "./word-recording";
import { $word } from "./word.model";

export const $customAudioRecording = createStore<Lang | null>(null);
export const $customAudioPlaying = createStore<Lang | null>(null);
export const $isCustomAudioShown = createStore<boolean>(false);

export const customAudioRecordToggled = createEvent<Lang>();
export const customAudioCheckToggled = createEvent<Lang>();
export const customAudioDeleteClicked = createEvent<Lang>();
export const showCustomAudioBlock = createEvent<boolean>();

export const stopRecordCustomAudiFx = createEffect<Lang, Blob>(
  async () => await recorder.stop()
);
export const playCustomAudioFx = createEffect<
  [CustomAudios, Lang | null],
  void
>(
  ([customAudios, lang]) =>
    new Promise((resolve) => {
      const customAudio = lang && customAudios[lang];
      if (!customAudio) return;

      const url = URL.createObjectURL(
        new Blob([customAudio.buffer], { type: customAudio.mimeType })
      );
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        audio.remove();
        resolve();
      };
      audio.play();
    })
);

sample({
  clock: showCustomAudioBlock,
  target: $isCustomAudioShown,
});

// record custom audio
$customAudioRecording.on(customAudioRecordToggled, (value, payload) =>
  value === payload ? null : payload
);

sample({
  clock: customAudioRecordToggled,
  filter: () => !recorder.isRecording,
  target: createEffect(async () => {
    if (!recorder.isInitiated) await recorder.init();

    recorder.start();
  }),
});

sample({
  clock: customAudioRecordToggled,
  filter: () => recorder.isRecording,
  target: stopRecordCustomAudiFx,
});

sample({
  clock: stopRecordCustomAudiFx.done,
  source: $word,
  fn: (word, { params, result }) => ({
    ...word,
    customAudios: {
      ...word.customAudios,
      [params]: {
        buffer: result,
        mimeType: result.type.split(";")[0],
        isModified: true,
      },
    },
  }),
  target: $word,
});

//play custom audio to check
$customAudioPlaying.on(customAudioCheckToggled, (value, payload) =>
  value === payload ? null : payload
);

sample({
  clock: $customAudioPlaying,
  source: $word,
  fn: (word, payload) => [word.customAudios, payload] as const,
  target: playCustomAudioFx,
});

sample({
  clock: playCustomAudioFx.done,
  fn: () => null,
  target: $customAudioPlaying,
});

// delete customAudio
$word.on(customAudioDeleteClicked, (word, lang) => ({
  ...word,
  customAudios: fromPairs(
    toPairs(word.customAudios).map(([key, audio]) => [
      key,
      key === lang ? { isDeleted: true } : audio,
    ])
  ),
}));
