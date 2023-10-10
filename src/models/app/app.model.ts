import { appApi, vocabularyApi, wordApi } from "api";
import { createEvent, createStore, merge, sample } from "effector";
import { Notification, socket } from "@master_kufa/client-tools";
import { createGate } from "effector-react";

export const $isLoading = createStore<boolean>(false);
export const $loadingProgress = createStore<number>(NaN);

export const setIsLoading = createEvent<boolean>();
export const setLoadingProgress = createEvent<number>();

const resetLoading = merge([
  wordApi.saveWordFx.finally,
  wordApi.translateWordFx.finally,
  vocabularyApi.bulkUploadWordsFx.finally,
  vocabularyApi.deleteWordFx.finally,
  vocabularyApi.deleteWordsBulkFx.finally,
  vocabularyApi.fileUploadFx.finally,
  vocabularyApi.loadWordFx.finally,
  vocabularyApi.loadWordsFx.finally,
]);

export const AppGate = createGate();

sample({
  clock: AppGate.open,
  target: appApi.connectSocketFx,
});

sample({
  clock: [
    wordApi.saveWordFx.fail,
    wordApi.translateWordFx.fail,
    vocabularyApi.deleteWordFx.fail,
    vocabularyApi.deleteWordsBulkFx.fail,
    vocabularyApi.bulkUploadWordsFx.fail,
    vocabularyApi.fileUploadFx.fail,
  ],
  fn: (data): Notification.PayloadType => ({
    type: "error",
    message: data.error.error || "An error occurred. Please try again later.",
  }),
  target: Notification.add,
});

sample({
  clock: setIsLoading,
  target: $isLoading,
});

sample({
  clock: setLoadingProgress,
  target: $loadingProgress,
});

$isLoading.reset(resetLoading);
$loadingProgress.reset(resetLoading);

sample({
  clock: [
    wordApi.saveWordFx.pending,
    wordApi.translateWordFx.pending,
    vocabularyApi.bulkUploadWordsFx.pending,
    vocabularyApi.deleteWordFx.pending,
    vocabularyApi.deleteWordsBulkFx.pending,
    vocabularyApi.fileUploadFx.pending,
    vocabularyApi.loadWordFx.pending,
    vocabularyApi.loadWordsFx.pending,
    socket.$isConnected.map((isConnected) => !isConnected),
  ],
  filter: Boolean,
  target: $isLoading,
});
