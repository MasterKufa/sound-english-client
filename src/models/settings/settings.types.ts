import { Settings } from "../../shared/settings.types";

export type ChangeSettingsPayload = {
  field: keyof Settings;
  value: Settings[keyof Settings];
  withConstraints?: boolean;
};

export type SettingsConstraint = {
  min: number;
  max: number;
};
