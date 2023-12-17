import { Box, Button } from "@mui/material";
import { useUnit } from "effector-react";
import { wordModel } from "models";
import { CustomAudio } from "../custom-audio";
import { WordTranslateContainer } from "./word-translate.styles";

export const WordTranslate = () => {
  const selectedLanguages = useUnit(wordModel.$selectedLanguages);
  const actions = useUnit({
    translateClicked: wordModel.translateClicked,
  });

  return (
    <Box sx={WordTranslateContainer}>
      <Button
        disabled={true}
        variant="contained"
        onClick={actions.translateClicked}
      >
        Translate from English
      </Button>
      {selectedLanguages.map((lang) => (
        <CustomAudio key={lang} lang={lang} />
      ))}
    </Box>
  );
};
