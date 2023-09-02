import { CustomAudios, NewWord, Word } from "shared/vocabulary.types";
import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { vocabularyApi, wordApi } from "api";
import { ChangeTextPayload } from "./word.types";
import { DEFAULT_WORD } from "./word.constants";
import { createGate } from "effector-react";
import { changeWordText } from "./word.helpers";
import { vocabularyModel, vocabularySelectors } from "../vocabulary";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";
import {
  CONFIRM_DELETE_TEXT,
  CONFIRM_DELETE_TITLE,
} from "../vocabulary/vocabulary.constants";
import { omit, set } from "lodash";
import { Lang } from "../../shared/settings.types";
import { recorder } from "./word-recording";

export const $word = createStore<NewWord | Word>(DEFAULT_WORD);
export const $customAudios = createStore<CustomAudios>({});
export const $customAudioRecording = createStore<Lang | null>(null);
export const $customAudioPlaying = createStore<Lang | null>(null);

export const $isTranslatePending = wordApi.translateWordFx.pending;

export const saveClicked = createEvent();
export const wordTextChanged = createEvent<ChangeTextPayload>();
export const deleteWordClicked = createEvent<number>();
export const translateClicked = createEvent();
export const customAudioRecordToggled = createEvent<Lang>();
export const customAudioCheckToggled = createEvent<Lang>();
export const customAudioDeleteClicked = createEvent<Lang>();

export const deleteWordFx = attach({ effect: vocabularyApi.deleteWordFx });
export const backToVocabularyFx = createEffect(() =>
  navigation.navigate(Paths.vocabulary)
);
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

export const WordGate = createGate<number | void>();

sample({
  clock: WordGate.open,
  source: vocabularyModel.$words,
  fn: (words, id) =>
    (id && vocabularySelectors.findWordById(id)(words)) || DEFAULT_WORD,
  target: $word,
});

$word.on(wordTextChanged, changeWordText);

sample({
  clock: saveClicked,
  source: $word,
  target: wordApi.saveWordFx,
});

sample({
  clock: wordApi.saveWordFx.done,
  target: backToVocabularyFx,
});

sample({
  clock: wordApi.saveWordFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Word successfully saved",
  }),
  target: Notification.add,
});

sample({
  clock: deleteWordClicked,
  target: createEffect<number, void>((payload) => {
    Confirm.show({
      title: CONFIRM_DELETE_TITLE,
      text: CONFIRM_DELETE_TEXT,
      onSubmit: () => deleteWordFx(payload),
    });
  }),
});

sample({
  clock: deleteWordFx.done,
  target: backToVocabularyFx,
});

// translate text
sample({
  clock: translateClicked,
  source: $word,
  fn: (src) => src.sourceWord,
  target: wordApi.translateWordFx,
});

sample({
  clock: wordApi.translateWordFx.doneData,
  source: $word,
  fn: (word, res) => set(word, "targetWord.text", res.text),
  target: $word,
});

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

//save customAudio
sample({
  clock: saveClicked,
  source: [$customAudios, $word] as const,
  fn: ([customAudios, word]) => ({ wordId: (word as Word).id, customAudios }),
  target: vocabularyApi.saveCustomAudiosFx,
});

sample({
  clock: WordGate.status,
  filter: (isOpen) => !isOpen,
  fn: () => ({}),
  target: $customAudios,
});
