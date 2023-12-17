import { useUnit } from "effector-react";
import { fileUploadModel } from "models";
import { Box, Checkbox } from "@mui/material";
import { WordDefinitionView } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word-bulk-unit.styles";
import { values } from "lodash";
import { Lang } from "../../../shared/settings.types";
import { LangTextChip } from "../../../components";

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
        {values(Lang)
          .filter((lang) => word[lang])
          .map((lang) => (
            <LangTextChip key={lang} text={word[lang] || ""} lang={lang} />
          ))}
      </Box>
      <Checkbox
        checked={word.isSelected}
        onClick={() => actions.toggleWordSelection(word.id)}
      />
    </Box>
  );
};
