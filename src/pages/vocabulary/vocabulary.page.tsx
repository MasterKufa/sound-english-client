import { useGate, useUnit } from "effector-react";
import { vocabularyModel } from "../../models";
import { Box, Button, Stack, Typography } from "@mui/material";
import { VOCABULARY_LABEL } from "./vocabulary.constants";
import { Word } from "../../modules";
import { ScreenContainer } from "../../shared/styles";

export const Vocabulary = () => {
  const words = useUnit(vocabularyModel.$words);
  const actions = useUnit({ addWord: vocabularyModel.addWord });

  useGate(vocabularyModel.VocabularyGate);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{VOCABULARY_LABEL}</Typography>
      <Button variant="contained" onClick={actions.addWord}>
        Add word
      </Button>
      <Stack>
        {words.map((word) => (
          <Word key={word.id} word={word} />
        ))}
      </Stack>
    </Box>
  );
};
