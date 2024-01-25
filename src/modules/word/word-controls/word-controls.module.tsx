import { Box, Button } from "@mui/material";
import { Paths } from "app/app.types";
import { navigation } from "shared/navigate";
import { WordControlsContainer } from "./word-controls.styles";
import { useUnit } from "effector-react";
import { wordModel } from "models";
import { useParams } from "react-router-dom";

export const WordControls = () => {
  const actions = useUnit({
    saveClicked: wordModel.saveClicked,
    deleteWordClicked: wordModel.deleteWordClicked,
  });
  const { id } = useParams();
  const wordId = Number(id);
  const isEdit = isFinite(wordId);

  return (
    <Box sx={WordControlsContainer}>
      <Button
        variant="contained"
        onClick={() => navigation.navigate(Paths.vocabulary)}
      >
        Cancel
      </Button>
      <Button variant="contained" onClick={actions.saveClicked}>
        Save
      </Button>
      {isEdit && (
        <Button
          variant="contained"
          onClick={() => actions.deleteWordClicked(wordId)}
        >
          Delete
        </Button>
      )}
    </Box>
  );
};
