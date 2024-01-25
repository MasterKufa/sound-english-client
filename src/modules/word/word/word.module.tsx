import { useUnit } from "effector-react";
import { settingsModel, vocabularyModel } from "models";
import { Box, Checkbox, IconButton } from "@mui/material";
import { Word as WordType } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word.styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Paths } from "app/app.types";
import { navigation } from "shared/navigate";
import { wordSelectors } from "../../../models/word";
import { LangTextChip } from "../../../components";

type WordProps = {
  word: WordType;
};

export const Word = ({ word }: WordProps) => {
  const selectedIds = useUnit(vocabularyModel.$selectedIds);
  const { sourceLang, targetLang } = useUnit(settingsModel.$settings);
  const actions = useUnit({
    toggleSelectedWord: vocabularyModel.toggleSelectedWord,
  });

  return (
    <Box sx={Container}>
      <IconButton
        onClick={() => navigation.navigate(Paths.vocabulary + `/${word.id}`)}
      >
        <ModeEditIcon />
      </IconButton>
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
      <Checkbox
        checked={selectedIds.includes(word.id)}
        onClick={() => actions.toggleSelectedWord(word.id)}
      />
    </Box>
  );
};
