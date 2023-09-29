import { NewWord, Word } from "shared/vocabulary.types";
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
import { Confirm, Notification } from "@master_kufa/client-tools";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";
import {
  CONFIRM_DELETE_TEXT,
  CONFIRM_DELETE_TITLE,
} from "../vocabulary/vocabulary.constants";
import { isNumber, set } from "lodash";
import { AppGate } from "models/app.model";

export const $word = createStore<NewWord | Word>(DEFAULT_WORD);

export const $isTranslatePending = wordApi.translateWordFx.pending;
export const $isSavePending = wordApi.saveWordFx.pending;

export const saveClicked = createEvent();
export const wordTextChanged = createEvent<ChangeTextPayload>();
export const deleteWordClicked = createEvent<number>();
export const translateClicked = createEvent();

export const deleteWordFx = attach({ effect: vocabularyApi.deleteWordFx });
export const backToVocabularyFx = createEffect(() =>
  navigation.navigate(Paths.vocabulary)
);

export const WordGate = createGate<number>();

// AppGate open trigger after WordGate so need to handle it on first open link with word
sample({
  clock: [AppGate.open, WordGate.open],
  source: WordGate.state,
  filter: (wordId) => isNumber(wordId) && Boolean(wordId),
  target: vocabularyApi.loadWordFx,
});

sample({
  clock: vocabularyApi.loadWordFx.doneData,
  target: $word,
});

$word.on(wordTextChanged, changeWordText);

sample({
  clock: saveClicked,
  source: $word,
  fn: (word) => ({
    ...word,
    sourceWord: { ...word.sourceWord, text: word.sourceWord.text.trim() },
    targetWord: { ...word.targetWord, text: word.targetWord.text.trim() },
  }),
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
  clock: [
    wordApi.saveWordFx.fail,
    wordApi.translateWordFx.fail,
    deleteWordFx.fail,
  ],
  fn: (): Notification.PayloadType => ({
    type: "error",
    message: "An error occurred. Please try again later.",
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

sample({
  clock: WordGate.status,
  filter: (isOpen) => !isOpen,
  fn: () => DEFAULT_WORD,
  target: $word,
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
