import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button,
  Box,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { useUnit } from "effector-react";
import { playlistsModel } from "models/playlists";
import { Word } from "modules/word";

export const PlaylistsControls = () => {
  const playlists = useUnit(playlistsModel.$playlists);
  const playlistsWords = useUnit(playlistsModel.$playlistsWords);
  const playlistSelectedWordIds = useUnit(
    playlistsModel.$playlistSelectedWordIds
  );

  const actions = useUnit({
    playlistNameChanged: playlistsModel.playlistNameChanged,
    createNewPlaylist: playlistsModel.createNewPlaylist,
    addWordAssignment: playlistsModel.addWordAssignment,
    removeWordAssignment: playlistsModel.removeWordAssignment,
    togglePlaylistSelectedWord: playlistsModel.togglePlaylistSelectedWord,
  });

  return (
    <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
      <Button
        fullWidth
        size="small"
        variant="outlined"
        startIcon={<QueueMusicIcon />}
        onClick={actions.createNewPlaylist}
      >
        Add playlist
      </Button>
      {playlists.map((playlist) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TextField
              sx={{ mr: 1 }}
              fullWidth
              size="small"
              placeholder="Name"
              variant="standard"
              name="PlaylistName"
              value={playlist.name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                actions.playlistNameChanged({
                  playlistId: playlist.id,
                  name: e.target.value,
                })
              }
            />
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              {playlistsWords[playlist.id].map((word) => (
                <Word
                  key={word.id}
                  word={word}
                  modifiers={["goto", "check"]}
                  toggleSelectedWord={() =>
                    actions.togglePlaylistSelectedWord({
                      playlistId: playlist.id,
                      wordId: word.id,
                    })
                  }
                  isSelected={playlistSelectedWordIds[playlist.id]?.includes(
                    word.id
                  )}
                />
              ))}
            </Stack>
            {!playlistsWords[playlist.id].length && (
              <Typography variant="caption" sx={{ textAlign: "center" }}>
                No words added.
              </Typography>
            )}
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={() => actions.removeWordAssignment(playlist.id)}>
              Remove selected
            </Button>
            <Button onClick={() => actions.addWordAssignment(playlist.id)}>
              Add selected
            </Button>
          </AccordionActions>
        </Accordion>
      ))}
      {!playlists.length && (
        <Typography
          variant="caption"
          sx={{ textAlign: "center", mt: 2, mb: 2 }}
        >
          No playlists added. Click 'Add playlist'.
        </Typography>
      )}
    </Box>
  );
};
