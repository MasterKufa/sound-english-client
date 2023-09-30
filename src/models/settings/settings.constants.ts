import { QueueStrategy, Settings } from "../../shared/settings.types";

export const DEFAULT_SETTINGS: Settings = {
  queueStrategy: QueueStrategy.sequence,
  //min 2 to correct sequence enqueue
  playerQueueSize: 2,
  lastPlayedRemindersSize: 1,
  delayPlayerSourceToTarget: 0,
  delayPlayerWordToWord: 0,
  sourceVoice: "",
  targetVoice: "",
  repeatSourceCount: 1,
  repeatTargetCount: 1,
  repeatWordCount: 1,
  repeatSourceDelay: 0,
  repeatTargetDelay: 0,
  isCustomAudioPreferable: false,
};

export const SETTINGS_WORD_INVALIDATORS: Array<keyof Settings> = [
  "isCustomAudioPreferable",
  "delayPlayerSourceToTarget",
  "delayPlayerWordToWord",
  "sourceVoice",
  "targetVoice",
  "repeatSourceCount",
  "repeatTargetCount",
  "repeatSourceDelay",
  "repeatTargetDelay",
];
