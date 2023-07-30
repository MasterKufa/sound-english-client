import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { Lang, QueueStrategy, Settings, Voice } from "shared/settings.types";
import { AppGate } from "../app.model";
import { settingsApi } from "../../api";
import { applySettingsConstraints } from "./settings.constraints";
import { ChangeSettingsPayload } from "./settings.types";

export const $settings = createStore<Settings>({
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
});

export const $sourceVoices = createStore<Array<Voice>>([]);
export const $targetVoices = createStore<Array<Voice>>([]);

export const changeSettings = createEvent<ChangeSettingsPayload>();

export const SettingsGate = createGate();

// load settings
sample({
  clock: AppGate.open,
  fn: () => ({ lang: Lang.en }),
  target: settingsApi.loadSettingsFx,
});

sample({
  source: settingsApi.loadSettingsFx.doneData,
  target: $settings,
});

// load voices
sample({
  clock: AppGate.open,
  fn: () => ({ lang: Lang.en }),
  target: settingsApi.loadVoicesFx,
});

sample({
  source: settingsApi.loadVoicesFx.done,
  filter: ({ params }) => params.lang === Lang.en,
  fn: ({ result }) => result,
  target: $sourceVoices,
});

sample({
  clock: AppGate.open,
  fn: () => ({ lang: Lang.ru }),
  target: settingsApi.loadVoicesFx,
});

sample({
  source: settingsApi.loadVoicesFx.done,
  filter: ({ params }) => params.lang === Lang.ru,
  fn: ({ result }) => result,
  target: $targetVoices,
});

// change settings
$settings.on(changeSettings, (settings, payload) => ({
  ...settings,
  [payload.field]: payload.withConstraints
    ? applySettingsConstraints(payload).value
    : payload.value,
}));

// save on quit tab
sample({
  clock: SettingsGate.status,
  source: $settings,
  filter: (_, isOpen) => !isOpen,
  target: settingsApi.changeSettingsFx,
});
