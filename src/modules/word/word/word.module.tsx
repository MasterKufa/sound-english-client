import { useUnit } from "effector-react";
import { vocabularyModel } from "models";
import { Box, Checkbox, IconButton } from "@mui/material";
import { Word as WordType } from "shared/vocabulary.types";
import { Container, WordContainer } from "./word.styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Paths } from "app/app.types";
import { navigation } from "shared/navigate";
import { wordSelectors } from "../../../models/word";
import { values } from "lodash";
import { Lang } from "../../../shared/settings.types";
import { LangTextChip } from "../../../components";

type WordProps = {
  word: WordType;
};

export const Word = ({ word }: WordProps) => {
  const selectedIds = useUnit(vocabularyModel.$selectedIds);
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
        {values(Lang).map((lang) => {
          const currentWord = wordSelectors.findUnitByLang(word.units, lang);

          if (!currentWord) return null;

          return (
            <LangTextChip text={currentWord.text} lang={currentWord.lang} />
          );
        })}
      </Box>
      <Checkbox
        checked={selectedIds.includes(word.id)}
        onClick={() => actions.toggleSelectedWord(word.id)}
      />
    </Box>
  );
};
