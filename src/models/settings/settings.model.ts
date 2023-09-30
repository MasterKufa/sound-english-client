import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { createGate } from "effector-react";
import { Lang, Settings, Voice } from "shared/settings.types";
import { AppGate } from "../app.model";
import { settingsApi } from "../../api";
import { applySettingsConstraints } from "./settings.constraints";
import { ChangeSettingsPayload } from "./settings.types";
import {
  DEFAULT_SETTINGS,
  SETTINGS_WORD_INVALIDATORS,
} from "./settings.constants";
import { invalidateWordsCache } from "../player/player.vendor";

export const $settings = createStore<Settings>(DEFAULT_SETTINGS);
export const $settingsOnEditStarted = createStore<Settings>(DEFAULT_SETTINGS);

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

sample({
  clock: [SettingsGate.open, settingsApi.loadSettingsFx.doneData],
  source: $settings,
  target: $settingsOnEditStarted,
});

// change settings
$settings.on(changeSettings, (settings, payload) => ({
  ...settings,
  [payload.field]: applySettingsConstraints(payload).value,
}));

// save on quit tab
sample({
  clock: SettingsGate.status,
  source: [$settings, $settingsOnEditStarted] as const,
  filter: (_, isOpen) => !isOpen,
  target: [
    attach({
      effect: settingsApi.changeSettingsFx,
      mapParams: ([settings]: [Settings]) => settings,
    }),
    createEffect<[Settings, Settings], void>(
      ([settings, settingsOnEditStarted]) => {
        if (
          SETTINGS_WORD_INVALIDATORS.some(
            (key) => settings[key] !== settingsOnEditStarted[key]
          )
        ) {
          invalidateWordsCache();
        }
      }
    ),
  ],
});

window.addEventListener("beforeunload", SettingsGate.close);
