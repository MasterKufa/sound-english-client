import { useGate, useUnit } from "effector-react";
import { playerModel } from "../../models";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Container } from "./player.styles";
import { PLAYER_LABEL } from "./player.constants";
import { Reminder } from "../../modules/reminder";

export const Player = () => {
  const isPlaying = useUnit(playerModel.$isPlaying);
  const isPlayingTriggerEnabled = useUnit(playerModel.$isPlayingTriggerEnabled);
  const lastPlayedReminders = useUnit(playerModel.$lastPlayedReminders);

  const actions = useUnit({ triggerPlay: playerModel.triggerPlay });

  useGate(playerModel.PlayerGate);

  return (
    <Box sx={Container}>
      <Typography variant="h4">{PLAYER_LABEL}</Typography>
      <Button
        variant="contained"
        onClick={actions.triggerPlay}
        disabled={!isPlayingTriggerEnabled}
      >
        {isPlaying ? "Stop" : "Play"}
      </Button>
      <Stack>
        <Typography variant="h4">Last played</Typography>
        {lastPlayedReminders.map((reminderId, inx) => (
          <Reminder key={inx} id={reminderId} />
        ))}
      </Stack>
    </Box>
  );
};
