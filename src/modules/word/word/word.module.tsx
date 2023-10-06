import { useUnit } from "effector-react";
import { vocabularyModel } from "models";
import { Box, Checkbox, Chip, IconButton } from "@mui/material";
import { Word as WordType } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word.styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Paths } from "app/app.types";
import { navigation } from "shared/navigate";

type WordProps = {
  word: WordType;
};

export const Word = ({ word }: WordProps) => {
  const selectedIds = useUnit(vocabularyModel.$selectedIds);
  const actions = useUnit({
    toggleSelectedWord: vocabularyModel.toggleSelectedWord,
  });

  return (
    <Box sx={Container}>
      <IconButton
        onClick={() => navigation.navigate(Paths.vocabulary + `/${word.id}`)}
      >
        <ModeEditIcon />
      </IconButton>
      <Box sx={WordContainer}>
        <Chip label={word.sourceWord.text} />
        <Chip label={word.targetWord.text} variant="outlined" />
      </Box>
      <Checkbox
        checked={selectedIds.includes(word.id)}
        onClick={() => actions.toggleSelectedWord(word.id)}
      />
    </Box>
  );
};
