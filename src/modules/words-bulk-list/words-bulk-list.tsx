import { Box, Button, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { fileUploadModel } from "../../models";
import { WordBulkUnit } from "../word-bulk-unit";
import { Container } from "./words-bulk-list.styles";

export const WordsBulkList = () => {
  const words = useUnit(fileUploadModel.$words);
  const actions = useUnit({ bulkUploadWords: fileUploadModel.bulkUploadWords });

  return (
    <Box sx={Container}>
      {Boolean(words.length) && (
        <>
          <Typography variant="h5">Words to add</Typography>
          <Typography variant="body1">
            Only not duplicated words are shown here. You can select what words
            need to be uploaded.
          </Typography>
        </>
      )}
      {Boolean(words.length) && (
        <Button onClick={actions.bulkUploadWords} variant="contained">
          Upload words
        </Button>
      )}
      <Box>
        {words.map((word) => (
          <WordBulkUnit word={word} />
        ))}
      </Box>
    </Box>
  );
};
