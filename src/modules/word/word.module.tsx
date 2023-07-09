import { useUnit } from "effector-react";
import { vocabularyModel } from "../../models";
import { Box, IconButton, TextField } from "@mui/material";
import { Word as WordType } from "shared/types";
import { Container } from "./word.styles";
import DeleteIcon from "@mui/icons-material/Delete";

type WordProps = {
  word: WordType;
};

export const Word = ({ word }: WordProps) => {
  const actions = useUnit({
    wordTextChanged: vocabularyModel.wordTextChanged,
    deleteWordClicked: vocabularyModel.deleteWordClicked,
    saveWord: vocabularyModel.saveWord,
  });

  const onEditEnded = () => actions.saveWord(word);

  return (
    <Box sx={Container}>
      <TextField
        onBlur={onEditEnded}
        label={word.sourceWord.lang}
        value={word.sourceWord.text}
        onChange={({ target }) =>
          actions.wordTextChanged({
            text: target.value,
            wordId: word.id,
            targetKey: "sourceWord",
          })
        }
      />
      <TextField
        onBlur={onEditEnded}
        label={word.targetWord.lang}
        value={word.targetWord.text}
        onChange={({ target }) =>
          actions.wordTextChanged({
            text: target.value,
            wordId: word.id,
            targetKey: "targetWord",
          })
        }
      />

      <IconButton onClick={() => actions.deleteWordClicked({ id: word.id })}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
