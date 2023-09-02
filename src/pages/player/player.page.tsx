import { useGate, useUnit } from "effector-react";
import { playerModel, settingsModel } from "../../models";
import { Box, Button, Stack, Typography } from "@mui/material";
import { PLAYER_LABEL } from "./player.constants";
import { Reminder } from "../../modules";
import { ScreenContainer } from "../../shared/styles";
import { nanoid } from "nanoid";

export const Player = () => {
  const isPlaying = useUnit(playerModel.$isPlaying);
  const isPlayingTriggerEnabled = useUnit(playerModel.$isPlayingTriggerEnabled);
  const lastPlayedReminders = useUnit(playerModel.$lastPlayedReminders);
  const { lastPlayedRemindersSize } = useUnit(settingsModel.$settings);

  const actions = useUnit({ triggerPlay: playerModel.triggerPlay });

  useGate(playerModel.PlayerGate);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{PLAYER_LABEL}</Typography>
      <Button
        variant="contained"
        onClick={actions.triggerPlay}
        disabled={!isPlayingTriggerEnabled}
      >
        {isPlaying ? "Stop" : "Play"}
      </Button>
      {Boolean(lastPlayedRemindersSize) && (
        <>
          <Typography variant="h4">Last played</Typography>
          <Stack>
            {lastPlayedReminders.length ? (
              lastPlayedReminders.map((reminderId, inx) => (
                <Reminder key={nanoid()} id={reminderId} />
              ))
            ) : (
              <Typography variant="body1">
                Still no played words in current player session
              </Typography>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};
