import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useUnit } from "effector-react";
import { wordModel, wordCustomAudioModel } from "models";
import { CustomAudioControl } from "./custom-audio-control";
import { ContainerVertical } from "./custom-audio.styles";

export const CustomAudio = () => {
  const selectedLanguages = useUnit(wordModel.$selectedLanguages);
  const isCustomAudioShown = useUnit(wordCustomAudioModel.$isCustomAudioShown);
  const actions = useUnit({
    showCustomAudioBlock: wordCustomAudioModel.showCustomAudioBlock,
  });

  return (
    <Box sx={ContainerVertical}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isCustomAudioShown}
            onClick={() => actions.showCustomAudioBlock(!isCustomAudioShown)}
          />
        }
        label="Show custom audios"
      />
      {isCustomAudioShown &&
        selectedLanguages.map((lang) => (
          <CustomAudioControl key={lang} lang={lang} />
        ))}
    </Box>
  );
};
