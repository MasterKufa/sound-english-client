import { useUnit } from "effector-react";
import { settingsModel } from "models";
import { Box, Checkbox, IconButton } from "@mui/material";
import { Word as WordType } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word.styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Paths } from "app/app.types";
import { navigation } from "shared/navigate";
import { wordSelectors } from "../../../models/word";
import { LangTextChip } from "../../../components";
import { WordModifier } from "./word.types";

type WordProps = {
  word: WordType;
  modifiers?: Array<WordModifier>;
  isSelected?: boolean;
  toggleSelectedWord?: (id: number) => void;
};

export const Word = ({
  word,
  modifiers = [],
  isSelected,
  toggleSelectedWord,
}: WordProps) => {
  const { sourceLang, targetLang } = useUnit(settingsModel.$settings);

  return (
    <Box sx={Container}>
      {modifiers.includes("goto") && (
        <IconButton
          onClick={() => navigation.navigate(Paths.vocabulary + `/${word.id}`)}
        >
          <ModeEditIcon />
        </IconButton>
      )}
      <Box sx={WordContainer}>
        <LangTextChip
          text={
            wordSelectors.findUnitByLang(word.units, sourceLang)?.text || "-"
          }
          lang={sourceLang}
        />
        <LangTextChip
          text={
            wordSelectors.findUnitByLang(word.units, targetLang)?.text || "-"
          }
          lang={targetLang}
        />
      </Box>
      {modifiers.includes("check") && (
        <Checkbox
          checked={isSelected}
          onClick={() => toggleSelectedWord?.(word.id)}
        />
      )}
    </Box>
  );
};
