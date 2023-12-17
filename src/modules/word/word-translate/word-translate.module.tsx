import { Box, Button } from "@mui/material";
import { useUnit } from "effector-react";
import { settingsModel, wordModel } from "models";
import { CustomAudio } from "../custom-audio";
import { WordTranslateContainer } from "./word-translate.styles";
import { findUnitByLang } from "../../../models/word/word.selectors";

export const WordTranslate = () => {
  const word = useUnit(wordModel.$word);
  const { sourceLang, targetLang } = useUnit(settingsModel.$settings);
  const actions = useUnit({
    translateClicked: wordModel.translateClicked,
  });

  return (
    <Box sx={WordTranslateContainer}>
      <Button
        disabled={!findUnitByLang(word.units, sourceLang)?.text}
        variant="contained"
        onClick={actions.translateClicked}
      >
        Translate from English
      </Button>

      <CustomAudio lang={sourceLang} />
      <CustomAudio lang={targetLang} />
    </Box>
  );
};
