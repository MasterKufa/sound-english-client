import { Word } from "shared/vocabulary.types";
import { createEffect, createEvent, createStore, sample } from "effector";
import { vocabularyApi, wordApi } from "api";
import { AppGate } from "models/app.model";
import { createGate } from "effector-react";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { updateWord } from "./vocabulary.helpers";
import {
  CONFIRM_DELETE_TEXT,
  CONFIRM_DELETE_TITLE,
} from "./vocabulary.constants";

export const $words = createStore<Array<Word>>([]);

export const deleteWordClicked = createEvent<number>();

export const VocabularyGate = createGate();

sample({
  clock: AppGate.open,
  target: vocabularyApi.loadWordsFx,
});

sample({
  clock: vocabularyApi.loadWordsFx.doneData,
  target: $words,
});

$words.on(wordApi.saveWordFx.doneData, updateWord);

sample({
  clock: deleteWordClicked,
  target: createEffect<number, void>((payload) => {
    Confirm.show({
      title: CONFIRM_DELETE_TITLE,
      text: CONFIRM_DELETE_TEXT,
      onSubmit: () => vocabularyApi.deleteWordFx(payload),
    });
  }),
});

$words.on(vocabularyApi.deleteWordFx.done, (words, { params }) =>
  words.filter((word) => word.id !== params)
);

sample({
  clock: vocabularyApi.deleteWordFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Word successfully deleted",
  }),
  target: Notification.add,
});

sample({
  clock: vocabularyApi.bulkUploadWordsFx.doneData,
  source: $words,
  fn: (words, newWords) => [...newWords, ...words],
  target: $words,
});
