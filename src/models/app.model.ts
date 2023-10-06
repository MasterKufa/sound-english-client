import { appApi, vocabularyApi, wordApi } from "../api";
import { sample } from "effector";
import { Notification } from "@master_kufa/client-tools";
import { createGate } from "effector-react";

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
