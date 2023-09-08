import { vocabularyApi, wordApi } from "api";
import { createStore, createEvent, createEffect, sample } from "effector";
import { omit } from "lodash";
import { Lang } from "shared/settings.types";
import { CustomAudios, NewWord, Word } from "shared/vocabulary.types";
import { recorder } from "./word-recording";
import { WordGate, $word } from "./word.model";

export const $customAudios = createStore<CustomAudios>({});
export const $customAudioRecording = createStore<Lang | null>(null);
export const $customAudioPlaying = createStore<Lang | null>(null);

export const customAudioRecordToggled = createEvent<Lang>();
export const customAudioCheckToggled = createEvent<Lang>();
export const customAudioDeleteClicked = createEvent<Lang>();

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
// load custom audio
sample({
  clock: WordGate.open,
  source: $word,
  filter: (word: Word | NewWord): word is Word => Boolean((word as Word).id),
  fn: (word) => word.id,
  target: vocabularyApi.loadCustomAudioFx,
});

sample({
  clock: vocabularyApi.loadCustomAudioFx.doneData,
  target: $customAudios,
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
  source: $customAudios,
  fn: (customAudios, { params, result }) => ({
    ...customAudios,
    [params]: {
      buffer: result,
      mimeType: result.type.split(";")[0],
      isModified: true,
    },
  }),
  target: $customAudios,
});

//play custom audio to check
$customAudioPlaying.on(customAudioCheckToggled, (value, payload) =>
  value === payload ? null : payload
);

sample({
  clock: $customAudioPlaying,
  source: $customAudios,
  fn: (customAudios, payload) => [customAudios, payload] as const,
  target: playCustomAudioFx,
});

sample({
  clock: playCustomAudioFx.done,
  fn: () => null,
  target: $customAudioPlaying,
});

// delete customAudio
$customAudios.on(customAudioDeleteClicked, (word, lang) => omit(word, lang));

//save customAudio (wait for save and use generated id need for new words)
sample({
  clock: wordApi.saveWordFx.doneData,
  source: $customAudios,
  fn: (customAudios, word) => ({ wordId: word.id, customAudios }),
  target: vocabularyApi.saveCustomAudiosFx,
});

sample({
  clock: WordGate.status,
  filter: (isOpen) => !isOpen,
  fn: () => ({}),
  target: $customAudios,
});
