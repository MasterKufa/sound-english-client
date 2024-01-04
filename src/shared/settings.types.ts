export enum QueueStrategy {
  sequence = "sequence",
  random = "random",
}

export type Settings = {
  queueStrategy: QueueStrategy;
  playerQueueSize: number;
  lastPlayedRemindersSize: number;
  delayPlayerSourceToTarget: number;
  delayPlayerWordToWord: number;
  sourceVoice: string;
  targetVoice: string;
  repeatSourceCount: number;
  repeatTargetCount: number;
  repeatWordCount: number;
  repeatSourceDelay: number;
  repeatTargetDelay: number;
  isCustomAudioPreferable: boolean;
  sourceLang: Lang;
  targetLang: Lang;
};

export type LoadVoicesPayload = {
  lang: Lang;
};

export enum Lang {
  en = "en",
  ru = "ru",
}
