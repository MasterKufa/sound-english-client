import { useGate, useUnit } from "effector-react";
import { vocabularyModel } from "../../models";
import { Box, Button, Stack, Typography } from "@mui/material";
import { VOCABULARY_LABEL } from "./vocabulary.constants";
import { Word } from "../../modules";
import { ScreenContainer } from "../../shared/styles";
import { Paths } from "../../app/app.types";
import { navigation } from "../../shared/navigate";
import { FILE_UPLOAD_LABEL } from "../file-upload/file-upload.constants";

export const Vocabulary = () => {
  const words = useUnit(vocabularyModel.$words);

  useGate(vocabularyModel.VocabularyGate);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{VOCABULARY_LABEL}</Typography>
      <Button
        variant="contained"
        onClick={() => navigation.navigate(Paths.vocabulary + `/new`)}
      >
        Add word
      </Button>
      <Button
        variant="contained"
        onClick={() => navigation.navigate(Paths.fileUpload)}
      >
        {FILE_UPLOAD_LABEL}
      </Button>
      <Stack>
        {words.map((word) => (
          <Word key={word.id} word={word} />
        ))}
      </Stack>
    </Box>
  );
};
