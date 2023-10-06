import { Box, Button } from "@mui/material";
import { useUnit } from "effector-react";
import { wordModel } from "models";
import { Lang } from "shared/settings.types";
import { CustomAudio } from "../custom-audio";
import { WordTranslateContainer } from "./word-translate.styles";

export const WordTranslate = () => {
  const word = useUnit(wordModel.$word);
  const actions = useUnit({
    translateClicked: wordModel.translateClicked,
  });

  return (
    <Box sx={WordTranslateContainer}>
      <Button
        disabled={!word.sourceWord.text}
        variant="contained"
        onClick={actions.translateClicked}
      >
        Google translate from English
      </Button>

      <CustomAudio lang={Lang.en} />
      <CustomAudio lang={Lang.ru} />
    </Box>
  );
};
