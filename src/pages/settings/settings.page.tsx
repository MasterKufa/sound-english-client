import { useGate, useUnit } from "effector-react";
import { settingsModel } from "../../models";
import { Box, Stack, Typography } from "@mui/material";
import { SETTINGS_LABEL } from "./settings.constants";
import { ScreenContainer } from "../../shared/styles";
import { NumericInput, Select } from "../../components";
import {
  QueueStrategy,
  Settings as SettingType,
} from "../../shared/settings.types";
import { Container } from "./settings.styles";
import { buildAllowedText, buildVoiceOptions } from "./settings.helpers";

export const Settings = () => {
  const settings = useUnit(settingsModel.$settings);
  const sourceVoices = useUnit(settingsModel.$sourceVoices);
  const targetVoices = useUnit(settingsModel.$targetVoices);

  const actions = useUnit({ changeSettings: settingsModel.changeSettings });

  useGate(settingsModel.SettingsGate);

  const buildProps = (field: keyof SettingType, withAllowedText?: boolean) => ({
    field,
    value: settings[field],
    onChange: actions.changeSettings,
    helperText: withAllowedText ? buildAllowedText(field) : undefined,
  });

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{SETTINGS_LABEL}</Typography>
      <Stack sx={Container}>
        <Select
          {...buildProps("queueStrategy")}
          label="Queue Strategy"
          helperText="Strategy of words enqueuing"
          options={[
            { value: QueueStrategy.sequence, label: "Sequence" },
            { value: QueueStrategy.random, label: "Random" },
          ]}
        />
        <Select
          {...buildProps("sourceVoice")}
          label="Source voice"
          helperText="Voice of source language"
          options={buildVoiceOptions(sourceVoices)}
        />
        <Select
          {...buildProps("targetVoice")}
          label="Source voice"
          helperText="Voice of translation language"
          options={buildVoiceOptions(targetVoices)}
        />
        <NumericInput
          {...buildProps("repeatSourceCount", true)}
          label="Repeat source, times"
        />
        <NumericInput
          {...buildProps("repeatTargetCount", true)}
          label="Repeat translation, times"
        />
        <NumericInput
          {...buildProps("repeatWordCount", true)}
          label="Repeat word, times"
        />
        <NumericInput
          {...buildProps("lastPlayedRemindersSize")}
          label="Reminders size"
          helperText={`The number of displayed last played words.${buildAllowedText(
            "lastPlayedRemindersSize"
          )}`}
        />
        <NumericInput
          {...buildProps("playerQueueSize")}
          label="Player queue size"
          helperText={`The size of words preloaded queue. It's recommended to set more for unstable internet connection and less for the traffic economy. ${buildAllowedText(
            "playerQueueSize"
          )}`}
        />
        <NumericInput
          {...buildProps("delayPlayerSourceToTarget", true)}
          label="Source-Translation pause, milliseconds"
        />
        <NumericInput
          {...buildProps("delayPlayerWordToWord", true)}
          label="Word-Word pause, milliseconds"
        />
        <NumericInput
          {...buildProps("repeatSourceDelay", true)}
          label="Repeat Source-Source pause, milliseconds"
        />
        <NumericInput
          {...buildProps("repeatTargetDelay", true)}
          label="Repeat Source-Source pause, milliseconds"
        />
      </Stack>
    </Box>
  );
};
