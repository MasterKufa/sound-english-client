import { createStore } from "effector";
import { QueueMode } from "shared/settings.types";

export const $queueMode = createStore<QueueMode>(QueueMode.sequence);
