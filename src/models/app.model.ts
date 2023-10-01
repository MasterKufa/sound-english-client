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
    vocabularyApi.bulkUploadWordsFx.done,
  ],
  fn: (): Notification.PayloadType => ({
    type: "error",
    message: "An error occurred. Please try again later.",
  }),
  target: Notification.add,
});
