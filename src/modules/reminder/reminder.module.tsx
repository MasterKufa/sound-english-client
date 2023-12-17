import { useStoreMap, useUnit } from "effector-react";
import { settingsModel, vocabularyModel } from "../../models";
import { Box, IconButton } from "@mui/material";
import { vocabularySelectors } from "../../models/vocabulary";
import { WordContainer } from "./reminder.styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";
import { wordSelectors } from "../../models/word";
import { LangTextChip } from "../../components";

type ReminderProps = {
  id: number;
};

export const Reminder = ({ id }: ReminderProps) => {
  const reminder = useStoreMap(
    vocabularyModel.$words,
    vocabularySelectors.findWordById(id)
  );

  const { sourceLang, targetLang } = useUnit(settingsModel.$settings);

  if (!reminder) return null;

  const sourceWord = wordSelectors.findUnitByLang(reminder.units, sourceLang);
  const targetWord = wordSelectors.findUnitByLang(reminder.units, targetLang);

  if (!sourceWord || !targetWord) return null;

  return (
    <Box sx={WordContainer}>
      <LangTextChip text={sourceWord.text} lang={sourceWord.lang} />
      <LangTextChip text={targetWord.text} lang={targetWord.lang} />
      <IconButton
        size="small"
        onClick={() => navigation.navigate(`${Paths.vocabulary}/${id}`)}
      >
        <OpenInNewIcon />
      </IconButton>
    </Box>
  );
};
