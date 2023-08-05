import { useGate, useUnit } from "effector-react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ScreenContainer } from "../../shared/styles";
import { wordModel } from "../../models/word";
import { useParams } from "react-router-dom";
import { WORD_EDIT_LABEL, WORD_NEW_LABEL } from "./word.constants";
import { WordControls, WordSpelling } from "./word.styles";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";

export const Word = () => {
  const word = useUnit(wordModel.$word);
  const actions = useUnit({
    saveClicked: wordModel.saveClicked,
    wordTextChanged: wordModel.wordTextChanged,
    deleteWordClicked: wordModel.deleteWordClicked,
  });
  const { id } = useParams();
  const wordId = Number(id);
  const isEdit = isFinite(wordId);

  useGate(wordModel.WordGate, wordId);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">
        {isEdit ? WORD_EDIT_LABEL : WORD_NEW_LABEL}
      </Typography>
      <Box sx={WordControls}>
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
      <Box sx={WordSpelling}>
        <TextField
          label={word.sourceWord.lang}
          value={word.sourceWord.text}
          onChange={({ target }) =>
            actions.wordTextChanged({
              text: target.value,
              targetKey: "sourceWord",
            })
          }
        />
        <TextField
          label={word.targetWord.lang}
          value={word.targetWord.text}
          onChange={({ target }) =>
            actions.wordTextChanged({
              text: target.value,
              targetKey: "targetWord",
            })
          }
        />
      </Box>
    </Box>
  );
};
