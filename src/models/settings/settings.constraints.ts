import { clamp } from "lodash";
import { ChangeSettingsPayload, SettingsConstraint } from "./settings.types";
import { Settings } from "../../shared/settings.types";

export const settingsConstraints: Partial<
  Record<keyof Settings, SettingsConstraint>
> = {
  playerQueueSize: {
    min: 2,
    max: 9,
  },
  lastPlayedRemindersSize: {
    min: 0,
    max: 10,
  },
  delayPlayerSourceToTarget: {
    min: 0,
    max: 3000,
  },
  delayPlayerWordToWord: {
    min: 0,
    max: 30000,
  },
  repeatSourceCount: {
    min: 1,
    max: 5,
  },
  repeatTargetCount: {
    min: 1,
    max: 5,
  },
  repeatWordCount: {
    min: 1,
    max: 5,
  },
  repeatSourceDelay: {
    min: 0,
    max: 3000,
  },
  repeatTargetDelay: {
    min: 0,
    max: 3000,
  },
};

const applyNumericConstraint = (payload: ChangeSettingsPayload) => ({
  ...payload,
  value: clamp(
    Number(payload.value),
    settingsConstraints[payload.field]!.min,
    settingsConstraints[payload.field]!.max
  ),
});

export const applySettingsConstraints = (payload: ChangeSettingsPayload) => {
  if (
    [
      "playerQueueSize",
      "lastPlayedRemindersSize",
      "delayPlayerSourceToTarget",
      "delayPlayerWordToWord",
      "repeatSourceCount",
      "repeatTargetCount",
      "repeatWordCount",
      "repeatSourceDelay",
      "repeatTargetDelay",
    ].includes(payload.field)
  )
    return applyNumericConstraint(payload);

  return payload;
};
