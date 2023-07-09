import { useUnit } from "effector-react";
import { vocabularyModel } from "../../models";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Word } from "modules";
import { Container } from "./vocabulary.styles";
import { VOCABULARY_LABEL } from "./vocabulary.constants";

export const Vocabulary = () => {
  const words = useUnit(vocabularyModel.$words);
  const actions = useUnit({ addWord: vocabularyModel.addWord });

  return (
    <Box sx={Container}>
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
