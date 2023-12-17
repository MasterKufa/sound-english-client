import { createEffect, createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import {
  BulkUploadFailedRecord,
  BulkUploadProgress,
  WordDefinitionView,
} from "../../shared/vocabulary.types";
import { vocabularyApi } from "../../api";
import { nanoid } from "nanoid";
import { pick, values } from "lodash";
import { Notification, socket } from "@master_kufa/client-tools";
import { Lang } from "../../shared/settings.types";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";
import { ACTIONS } from "../../api/actions";
import { appModel } from "../app";
import { setLoadingProgress } from "../app/app.model";

export const FileUploadGate = createGate();

export const $words = createStore<Array<WordDefinitionView>>([]);
export const $wordsFailed = createStore<Array<BulkUploadFailedRecord>>([]);
export const $bulkUploadProgress = createStore<BulkUploadProgress | null>(null);
export const $file = createStore<File | null>(null);

export const $selectedWordsCount = $words.map(
  (words) => words.filter((word) => word.isSelected).length
);

export const selectFile = createEvent<File>();
export const clearSelectedFile = createEvent();
export const processFile = createEvent();
export const toggleWordSelection = createEvent<string>();
export const toggleSelectAll = createEvent();
export const bulkUploadWords = createEvent();
export const closeFileUpload = createEvent();

sample({
  clock: appModel.AppGate.open,
  target: createEffect(() =>
    socket.client.on(
      ACTIONS.BULK_UPLOAD_PROGRESS,
      (progress: BulkUploadProgress) =>
        setLoadingProgress(progress.handled / progress.total)
    )
  ),
});

sample({
  clock: selectFile,
  target: $file,
});

$file.reset(clearSelectedFile);
$words.reset(clearSelectedFile);
$wordsFailed.reset(clearSelectedFile);

sample({
  clock: processFile,
  source: $file,
  filter: Boolean,
  target: vocabularyApi.fileUploadFx,
});

sample({
  clock: vocabularyApi.fileUploadFx.doneData,
  fn: ({ records }) =>
    records.map<WordDefinitionView>((word) => ({
      ...word,
      id: nanoid(),
      isSelected: true,
    })),
  target: $words,
});

sample({
  clock: vocabularyApi.fileUploadFx.doneData,
  fn: ({ failedRecords }) => failedRecords,
  target: $wordsFailed,
});

sample({
  clock: toggleWordSelection,
  source: $words,
  fn: (words, id) =>
    words.map((word) =>
      word.id === id ? { ...word, isSelected: !word.isSelected } : word
    ),
  target: $words,
});

sample({
  clock: toggleSelectAll,
  source: [$words, $selectedWordsCount] as const,
  fn: ([words, selectedWordsCount]) =>
    words.map((word) => ({
      ...word,
      isSelected: !Boolean(selectedWordsCount),
    })),
  target: $words,
});

sample({
  clock: bulkUploadWords,
  source: $words,
  fn: (words) =>
    words
      .filter((word) => word.isSelected)
      .map((word) => pick(word, ...values(Lang))),
  target: vocabularyApi.bulkUploadWordsFx,
});

sample({
  clock: vocabularyApi.bulkUploadWordsFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Words successfully uploaded",
  }),
  target: Notification.add,
});

$bulkUploadProgress.reset(vocabularyApi.bulkUploadWordsFx.finally);

sample({
  clock: vocabularyApi.bulkUploadWordsFx.done,
  target: createEffect(() => navigation.navigate(Paths.vocabulary)),
});

sample({
  clock: FileUploadGate.status,
  filter: (isOpen) => !isOpen,
  target: closeFileUpload,
});

$words.reset(closeFileUpload);
$wordsFailed.reset(closeFileUpload);
$file.reset(closeFileUpload);
