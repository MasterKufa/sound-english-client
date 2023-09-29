import { Box, TextField } from "@mui/material";
import { useUnit } from "effector-react";
import { WordSpellingContainer } from "./word-spelling.styles";
import { wordModel } from "../../models";

export const WordSpelling = () => {
  const word = useUnit(wordModel.$word);
  const actions = useUnit({
    wordTextChanged: wordModel.wordTextChanged,
  });

  return (
    <Box sx={WordSpellingContainer}>
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
  );
};
