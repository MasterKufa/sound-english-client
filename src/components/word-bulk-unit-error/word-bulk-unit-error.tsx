import { Box, Chip, Typography } from "@mui/material";
import { BulkUploadError, WordDefinition } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word-bulk-unit-error.styles";
import { Lang } from "../../shared/settings.types";
import { errorMapping } from "./word-bulk-unit.constants";

type WordBulkUnitErrorProps = {
  word: WordDefinition;
  error: BulkUploadError;
};

export const WordBulkUnitError = ({ word, error }: WordBulkUnitErrorProps) => (
  <Box sx={Container}>
    <Box sx={WordContainer}>
      <Typography color="error" variant="caption" align="center">
        {errorMapping[error]}
      </Typography>
      <Chip label={word[Lang.en]} />
      <Chip label={word[Lang.ru]} variant="outlined" />
    </Box>
  </Box>
);
