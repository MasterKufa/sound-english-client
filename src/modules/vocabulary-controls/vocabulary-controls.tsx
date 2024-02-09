import { Box, Button } from "@mui/material";
import { Paths } from "app/app.types";
import { useUnit } from "effector-react";
import { vocabularyModel } from "models";
import { FILE_UPLOAD_LABEL } from "pages";
import { navigation } from "shared/navigate";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { ButtonStyles, Container } from "./vocabulary-controls.styles";
import { playlistsModel } from "models/playlists";

export const VocabularyControls = () => {
  const selectedIds = useUnit(vocabularyModel.$selectedIds);
  const isPlaylistsManagementVisible = useUnit(
    playlistsModel.$isPlaylistsManagementVisible
  );
  const actions = useUnit({
    deleteWordClicked: vocabularyModel.deleteWordsBulk,
    toggleIsPlaylistsManagementVisible:
      playlistsModel.toggleIsPlaylistsManagementVisible,
  });

  return (
    <Box sx={Container}>
      <Button
        onClick={() => navigation.navigate(Paths.vocabulary + `/new`)}
        size="small"
        variant="outlined"
        startIcon={<AddIcon />}
        sx={ButtonStyles}
      >
        Add word
      </Button>
      <Button
        onClick={actions.deleteWordClicked}
        size="small"
        variant="outlined"
        startIcon={<DeleteIcon />}
        disabled={!selectedIds.length}
        sx={ButtonStyles}
      >
        Delete selected{" "}
        {Boolean(selectedIds.length) && `(${selectedIds.length})`}
      </Button>
      <Button
        onClick={() => navigation.navigate(Paths.fileUpload)}
        size="small"
        variant="outlined"
        startIcon={<FileUploadIcon />}
        sx={ButtonStyles}
      >
        {FILE_UPLOAD_LABEL}
      </Button>
      <Button
        onClick={actions.toggleIsPlaylistsManagementVisible}
        size="small"
        variant="outlined"
        startIcon={
          isPlaylistsManagementVisible ? (
            <PlaylistRemoveIcon />
          ) : (
            <PlaylistAddIcon />
          )
        }
        sx={ButtonStyles}
      >
        {isPlaylistsManagementVisible ? "Save playlists" : "Edit playlists"}
      </Button>
    </Box>
  );
};
