import { appApi } from "../api";
import { sample } from "effector";
import { createGate } from "effector-react";

export const AppGate = createGate();

sample({
  clock: AppGate.open,
  target: appApi.connectSocketFx,
});
