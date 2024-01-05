import { useGate } from "effector-react";
import { Box, Typography } from "@mui/material";
import { ScreenContainer } from "../../shared/styles";
import { wordModel } from "../../models/word";
import { useParams } from "react-router-dom";
import { WORD_EDIT_LABEL, WORD_NEW_LABEL } from "./word.constants";
import {
  CustomAudio,
  WordControls,
  WordSpelling,
  WordTranslate,
} from "../../modules";

export const Word = () => {
  const { id } = useParams();
  const wordId = Number(id);
  const isEdit = isFinite(wordId);

  useGate(wordModel.WordGate, wordId);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">
        {isEdit ? WORD_EDIT_LABEL : WORD_NEW_LABEL}
      </Typography>
      <WordControls />
      <WordSpelling />
      <CustomAudio />
      <WordTranslate />
    </Box>
  );
};
