import { settingsConstraints } from "../../models/settings";
import { Settings, Voice } from "../../shared/settings.types";

export const buildVoiceOptions = (voices: Array<Voice>) =>
  voices.map((voice) => ({
    value: voice.name,
    label: `(${voice.gender}): ${voice.name}`,
  }));

export const buildAllowedText = (field: keyof Settings) =>
  `Allowed values are ${settingsConstraints[field]!.min}-${
    settingsConstraints[field]!.max
  }.`;
