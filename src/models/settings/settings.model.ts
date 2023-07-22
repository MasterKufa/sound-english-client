import { createStore } from "effector";
import { QueueStrategy } from "shared/settings.types";

export const $queueStrategy = createStore<QueueStrategy>(
  QueueStrategy.sequence
);
export const $playerQueueSize = createStore<number>(5);
export const $lastPlayedRemindersSize = createStore<number>(2);
export const $delayPlayerSourceToTarget = createStore<number>(1000);
export const $delayPlayerWordToWord = createStore<number>(2000);
