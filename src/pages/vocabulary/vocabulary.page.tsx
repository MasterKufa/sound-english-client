import { useGate, useUnit } from "effector-react";
import { vocabularyFiltersModel, vocabularyModel } from "../../models";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import { VOCABULARY_LABEL } from "./vocabulary.constants";
import {
  PlaylistsControls,
  VocabularyControls,
  VocabularyFilters,
  Word,
} from "../../modules";
import { ScreenContainer } from "../../shared/styles";
import { PaginationContainer } from "./vocabulary.styles";
import { playlistsModel } from "models/playlists";

export const Vocabulary = () => {
  const pageNumber = useUnit(vocabularyFiltersModel.$pageNumber);
  const totalPages = useUnit(vocabularyFiltersModel.$totalPages);
  const shownWords = useUnit(vocabularyFiltersModel.$shownWords);
  const selectedIds = useUnit(vocabularyModel.$selectedIds);

  const isPlaylistsManagementVisible = useUnit(
    playlistsModel.$isPlaylistsManagementVisible
  );

  const actions = useUnit({
    changePageNumber: vocabularyFiltersModel.changePageNumber,
    toggleSelectedWord: vocabularyModel.toggleSelectedWord,
  });

  useGate(vocabularyModel.VocabularyGate);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{VOCABULARY_LABEL}</Typography>
      <VocabularyControls />
      {isPlaylistsManagementVisible && <PlaylistsControls />}
      <VocabularyFilters />
      <Stack>
        {shownWords.map((word) => (
          <Word
            key={word.id}
            word={word}
            modifiers={["goto", "check"]}
            isSelected={selectedIds.includes(word.id)}
            toggleSelectedWord={actions.toggleSelectedWord}
          />
        ))}
      </Stack>
      {!Boolean(shownWords.length) && (
        <Typography textAlign="center" variant="caption">
          No words found
        </Typography>
      )}
      {Boolean(shownWords.length) && (
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
