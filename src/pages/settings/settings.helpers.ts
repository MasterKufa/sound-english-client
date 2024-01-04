import { settingsConstraints } from "../../models/settings";
import { Settings } from "../../shared/settings.types";

export const buildVoiceOptions = (voices: Array<string>) =>
  voices.map((voice) => ({
    value: voice,
    label: voice,
  }));

export const buildAllowedText = (field: keyof Settings) =>
  `Allowed values are ${settingsConstraints[field]!.min}-${
    settingsConstraints[field]!.max
  }.`;
