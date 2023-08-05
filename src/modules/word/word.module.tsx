import { useUnit } from "effector-react";
import { vocabularyModel } from "../../models";
import { Box, Chip, IconButton } from "@mui/material";
import { Word as WordType } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word.styles";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Paths } from "../../app/app.types";
import { navigation } from "../../shared/navigate";

type WordProps = {
  word: WordType;
};

export const Word = ({ word }: WordProps) => {
  const actions = useUnit({
    deleteWordClicked: vocabularyModel.deleteWordClicked,
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
      <IconButton onClick={() => actions.deleteWordClicked(word.id)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
