import { appApi, settingsApi, vocabularyApi, wordApi } from "api";
import { Store, combine, createEvent, createStore, sample } from "effector";
import { Notification, socket } from "@master_kufa/client-tools";
import { createGate } from "effector-react";

export const $isLoading = createStore<boolean>(true);
export const $loadingProgress = createStore<number>(NaN);

const $commonPendingRequests = combine(
  wordApi.saveWordFx.pending,
  wordApi.translateWordFx.pending,
  vocabularyApi.bulkUploadWordsFx.pending,
  vocabularyApi.deleteWordFx.pending,
  vocabularyApi.deleteWordsBulkFx.pending,
  vocabularyApi.fileUploadFx.pending,
  vocabularyApi.loadWordFx.pending,
  vocabularyApi.loadWordsFx.pending,
  settingsApi.loadVoicesFx.pending,
  settingsApi.changeSettingsFx.pending,
  settingsApi.loadSettingsFx.pending,
  socket.$isConnected.map((isConnected) => !isConnected),
  (...requests: Array<boolean>) => requests.some(Boolean)
) as unknown as Store<boolean>;

export const setIsLoading = createEvent<boolean>();
export const setLoadingProgress = createEvent<number>();

export const AppGate = createGate();

sample({
  clock: AppGate.open,
  target: appApi.connectSocketFx,
});

sample({
  clock: [
    wordApi.saveWordFx.failData,
    wordApi.translateWordFx.failData,
    vocabularyApi.deleteWordFx.failData,
    vocabularyApi.deleteWordsBulkFx.failData,
    vocabularyApi.bulkUploadWordsFx.failData,
    vocabularyApi.fileUploadFx.failData,
  ],
  fn: (error?: string): Notification.PayloadType => ({
    type: "error",
    message: error || "An error occurred. Please try again later.",
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

sample({
  clock: $commonPendingRequests,
  target: $isLoading,
});

sample({
  clock: $commonPendingRequests,
  filter: (commonPendingRequests) => !commonPendingRequests,
  fn: () => NaN,
  target: $loadingProgress,
});
