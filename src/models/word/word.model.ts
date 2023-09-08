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
import { vocabularyModel, vocabularySelectors } from "../vocabulary";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";
import {
  CONFIRM_DELETE_TEXT,
  CONFIRM_DELETE_TITLE,
} from "../vocabulary/vocabulary.constants";
import { set } from "lodash";

export const $word = createStore<NewWord | Word>(DEFAULT_WORD);

export const $isTranslatePending = wordApi.translateWordFx.pending;

export const saveClicked = createEvent();
export const wordTextChanged = createEvent<ChangeTextPayload>();
export const deleteWordClicked = createEvent<number>();
export const translateClicked = createEvent();

export const deleteWordFx = attach({ effect: vocabularyApi.deleteWordFx });
export const backToVocabularyFx = createEffect(() =>
  navigation.navigate(Paths.vocabulary)
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

$word.reset(backToVocabularyFx.done);

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
