import { createStore } from "effector";
import { QueueStrategy } from "shared/settings.types";

export const $queueStrategy = createStore<QueueStrategy>(
  QueueStrategy.sequence
);

//min 2 to correct sequence enqueue
export const $playerQueueSize = createStore<number>(2);

// test min number
export const $lastPlayedRemindersSize = createStore<number>(1);
export const $delayPlayerSourceToTarget = createStore<number>(0);
export const $delayPlayerWordToWord = createStore<number>(0);
export const $sourceVoice = createStore<string>("");
export const $targetVoice = createStore<string>("");
export const $repeatSourceCount = createStore<number>(1);
export const $repeatTargetCount = createStore<number>(1);
export const $repeatWordCount = createStore<number>(1);

// repeatWordCount           Int    @default(1)
// repeatSourceDelay         Int    @default(0)
// repeatTargetDelay         Int    @default(0)
// queueStrategy             String @default("sequence")

// playbackRate//toaddd
