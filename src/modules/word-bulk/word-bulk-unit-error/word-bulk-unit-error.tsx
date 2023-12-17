import { Box, Typography } from "@mui/material";
import { BulkUploadError, WordDefinition } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word-bulk-unit-error.styles";
import { errorMapping } from "./word-bulk-unit.constants";
import { values } from "lodash";
import { Lang } from "../../../shared/settings.types";
import { LangTextChip } from "../../../components";

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
      {values(Lang)
        .filter((lang) => word[lang])
        .map((lang) => (
          <LangTextChip text={word[lang] || ""} lang={lang} />
        ))}
    </Box>
  </Box>
);
