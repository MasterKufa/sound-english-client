import { Word } from "shared/vocabulary.types";
import { createEffect, createEvent, createStore, sample } from "effector";
import { vocabularyApi, wordApi } from "api";
import { appModel } from "../app";
import { createGate } from "effector-react";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { updateWord } from "./vocabulary.helpers";
import {
  CONFIRM_DELETE_TEXT,
  CONFIRM_DELETE_TITLE,
} from "./vocabulary.constants";
import { xor } from "lodash";

export const $words = createStore<Array<Word>>([]);
export const $selectedIds = createStore<Array<number>>([]);

export const $deleteWordsBulkPending = vocabularyApi.deleteWordsBulkFx.pending;

export const deleteWordsBulk = createEvent();
export const toggleSelectedWord = createEvent<number>();

export const VocabularyGate = createGate();

sample({
  clock: appModel.AppGate.open,
  target: vocabularyApi.loadWordsFx,
});

sample({
  clock: vocabularyApi.loadWordsFx.doneData,
  target: $words,
});

$words.on(wordApi.saveWordFx.doneData, updateWord);

sample({
  clock: toggleSelectedWord,
  source: $selectedIds,
  fn: (selectedIds, id) => xor(selectedIds, [id]),
  target: $selectedIds,
});

sample({
  clock: deleteWordsBulk,
  source: $selectedIds,
  target: createEffect<Array<number>, void>((payload) => {
    Confirm.show({
      title: CONFIRM_DELETE_TITLE,
      text: CONFIRM_DELETE_TEXT,
      onSubmit: () => vocabularyApi.deleteWordsBulkFx(payload),
    });
  }),
});

$words.on(vocabularyApi.deleteWordFx.done, (words, { params }) =>
  words.filter((word) => word.id !== params)
);

$words.on(vocabularyApi.deleteWordsBulkFx.done, (words, { params }) =>
  words.filter((word) => !params.includes(word.id))
);

$selectedIds.reset(vocabularyApi.deleteWordsBulkFx.done);

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
