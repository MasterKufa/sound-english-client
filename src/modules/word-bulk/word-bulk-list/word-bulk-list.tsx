import { Box, Button, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { fileUploadModel } from "models";
import { WordBulkUnit } from "../word-bulk-unit";
import { Container, ControlsContainer } from "./word-bulk-list.styles";
import { WordBulkUnitError } from "components";

export const WordsBulkList = () => {
  const words = useUnit(fileUploadModel.$words);
  const wordsFailed = useUnit(fileUploadModel.$wordsFailed);
  const selectedWordsCount = useUnit(fileUploadModel.$selectedWordsCount);
  const actions = useUnit({
    bulkUploadWords: fileUploadModel.bulkUploadWords,
    toggleSelectAll: fileUploadModel.toggleSelectAll,
  });

  if (!words.length && !wordsFailed.length) return null;

  return (
    <Box sx={Container}>
      <Typography variant="h5">Words to add</Typography>
      <Box sx={ControlsContainer}>
        <Button
          disabled={!selectedWordsCount}
          onClick={actions.bulkUploadWords}
          variant="contained"
        >
          Upload words
        </Button>
        <Button onClick={actions.toggleSelectAll} variant="contained">
          Toggle all
        </Button>
      </Box>
      <Box>
        <Typography variant="body1">
          <b>Total</b> {words.length} words.
        </Typography>
        <Typography variant="body1">
          <b>Selected</b> {selectedWordsCount} words.
        </Typography>
      </Box>
      <Box>
        {words.map((word) => (
          <WordBulkUnit word={word} />
        ))}
      </Box>
      <Typography variant="h5">Failed to process</Typography>
      <Box>
        {wordsFailed.map(({ word, error }) => (
          <WordBulkUnitError word={word} error={error} />
        ))}
      </Box>
    </Box>
  );
};
