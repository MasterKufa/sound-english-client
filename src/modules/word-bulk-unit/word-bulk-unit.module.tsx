import { useUnit } from "effector-react";
import { fileUploadModel } from "../../models";
import { Box, Checkbox, Chip } from "@mui/material";
import { WordDefinitionView } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word-bulk-unit.styles";
import { Lang } from "../../shared/settings.types";

type WordBulkUnitProps = {
  word: WordDefinitionView;
};

export const WordBulkUnit = ({ word }: WordBulkUnitProps) => {
  const actions = useUnit({
    toggleWordSelection: fileUploadModel.toggleWordSelection,
  });

  return (
    <Box sx={Container}>
      <Box sx={WordContainer}>
        <Chip label={word[Lang.en]} />
        <Chip label={word[Lang.ru]} variant="outlined" />
      </Box>
      <Checkbox
        checked={word.isSelected}
        onClick={() => actions.toggleWordSelection(word.id)}
      />
    </Box>
  );
};
