import { useGate, useUnit } from "effector-react";
import { vocabularyFiltersModel, vocabularyModel } from "../../models";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import { VOCABULARY_LABEL } from "./vocabulary.constants";
import { VocabularyControls, VocabularyFilters, Word } from "../../modules";
import { ScreenContainer } from "../../shared/styles";
import { PaginationContainer } from "./vocabulary.styles";

export const Vocabulary = () => {
  const pageNumber = useUnit(vocabularyFiltersModel.$pageNumber);
  const totalPages = useUnit(vocabularyFiltersModel.$totalPages);
  const filteredWords = useUnit(vocabularyFiltersModel.$filteredWords);

  const actions = useUnit({
    changePageNumber: vocabularyFiltersModel.changePageNumber,
  });

  useGate(vocabularyModel.VocabularyGate);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{VOCABULARY_LABEL}</Typography>
      <VocabularyControls />
      <VocabularyFilters />
      <Stack>
        {filteredWords.map((word) => (
          <Word key={word.id} word={word} />
        ))}
      </Stack>
      {!Boolean(filteredWords.length) && (
        <Typography textAlign="center" variant="caption">
          No words found
        </Typography>
      )}
      {Boolean(filteredWords.length) && (
        <Pagination
          onChange={(_, pageNumber) => actions.changePageNumber(pageNumber)}
          sx={PaginationContainer}
          page={pageNumber}
          count={totalPages}
          variant="outlined"
        />
      )}
    </Box>
  );
};
