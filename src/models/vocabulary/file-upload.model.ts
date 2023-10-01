import { createEffect, createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { WordDefinitionView } from "../../shared/vocabulary.types";
import { vocabularyApi } from "../../api";
import { nanoid } from "nanoid";
import { pick } from "lodash";
import { Notification } from "@master_kufa/client-tools";
import { Lang } from "../../shared/settings.types";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";

export const FileUploadGate = createGate();

export const $words = createStore<Array<WordDefinitionView>>([]);
export const $file = createStore<File | null>(null);

export const $processFilePending = vocabularyApi.fileUploadFx.pending;
export const $bulkUploadPending = vocabularyApi.bulkUploadWordsFx.pending;

export const selectFile = createEvent<File>();
export const clearSelectedFile = createEvent();
export const processFile = createEvent();
export const toggleWordSelection = createEvent<string>();
export const bulkUploadWords = createEvent();
export const closeFileUpload = createEvent();

sample({
  clock: selectFile,
  target: $file,
});

$file.reset(clearSelectedFile);

sample({
  clock: processFile,
  source: $file,
  filter: Boolean,
  target: vocabularyApi.fileUploadFx,
});

sample({
  clock: vocabularyApi.fileUploadFx.doneData,
  fn: (words) =>
    words.map<WordDefinitionView>((word) => ({
      ...word,
      id: nanoid(),
      isSelected: true,
    })),
  target: $words,
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
  clock: bulkUploadWords,
  source: $words,
  fn: (words) => words.map((word) => pick(word, Lang.en, Lang.ru)),
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
$file.reset(closeFileUpload);
