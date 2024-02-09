import { useGate, useUnit } from "effector-react";
import { playerModel, settingsModel } from "../../models";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { PLAYER_LABEL } from "./player.constants";
import { Reminder } from "../../modules";
import { ScreenContainer } from "../../shared/styles";
import { nanoid } from "nanoid";
import { PlayerSelectContainer, PlayerControl } from "./player.styles";
import { playlistsModel } from "models/playlists";

export const Player = () => {
  const isPlaying = useUnit(playerModel.$isPlaying);
  const playlists = useUnit(playlistsModel.$playlists);
  const currentPlaylistId = useUnit(playerModel.$currentPlaylistId);
  const isPlayingTriggerEnabled = useUnit(playerModel.$isPlayingTriggerEnabled);
  const lastPlayedReminders = useUnit(playerModel.$lastPlayedReminders);
  const { lastPlayedRemindersSize } = useUnit(settingsModel.$settings);

  const actions = useUnit({
    triggerPlay: playerModel.triggerPlay,
    selectPlaylist: playerModel.selectPlaylist,
  });

  useGate(playerModel.PlayerGate);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{PLAYER_LABEL}</Typography>
      <Box sx={PlayerSelectContainer}>
        <FormControl sx={PlayerControl}>
          <InputLabel size="small" id="playlist">
            Playlist
          </InputLabel>
          <Select
            size="small"
            labelId="playlist"
            label="Target"
            value={currentPlaylistId}
            onChange={({ target }) => actions.selectPlaylist(target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {playlists.map((list) => (
              <MenuItem
                key={list.id}
                value={list.id}
                disabled={!list.wordIds.length}
              >
                {list.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          sx={PlayerControl}
          variant="outlined"
          onClick={actions.triggerPlay}
          disabled={!isPlayingTriggerEnabled}
        >
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </Box>

      <Typography variant="caption">
        Only words with existed source and target lang spellings will be played
      </Typography>
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
