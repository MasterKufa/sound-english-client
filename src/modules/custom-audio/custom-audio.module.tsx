import { Box, Button, IconButton } from "@mui/material";
import { Lang } from "../../shared/settings.types";
import { useUnit } from "effector-react";
import { wordCustomAudioModel, wordModel } from "../../models";
import { Container, RecButton } from "./custom-audio.styles";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ClearIcon from "@mui/icons-material/Clear";

type CustomAudioProps = {
  lang: Lang;
};

export const CustomAudio = ({ lang }: CustomAudioProps) => {
  const customAudioRecording = useUnit(
    wordCustomAudioModel.$customAudioRecording
  );
  const customAudioPlaying = useUnit(wordCustomAudioModel.$customAudioPlaying);
  const { customAudios } = useUnit(wordModel.$word);
  const hasAudio = Boolean(customAudios[lang]);

  const actions = useUnit({
    customAudioRecordToggled: wordCustomAudioModel.customAudioRecordToggled,
    customAudioCheckToggled: wordCustomAudioModel.customAudioCheckToggled,
    customAudioDeleteClicked: wordCustomAudioModel.customAudioDeleteClicked,
  });

  return (
    <Box sx={Container}>
      <Button
        sx={RecButton}
        disabled={Boolean(
          customAudioRecording && customAudioRecording !== lang
        )}
        variant="contained"
        onClick={() => actions.customAudioRecordToggled(lang)}
      >
        {customAudioRecording === lang
          ? "Stop recording"
          : `Record custom audio ${lang}`}
      </Button>
      <MicIcon color={customAudioRecording === lang ? "primary" : "disabled"} />
      <IconButton
        disabled={Boolean(customAudioPlaying || !hasAudio)}
        onClick={() => actions.customAudioCheckToggled(lang)}
      >
        <PlayArrowIcon />
      </IconButton>
      <IconButton
        disabled={!hasAudio}
        onClick={() => actions.customAudioDeleteClicked(lang)}
      >
        <ClearIcon />
      </IconButton>
    </Box>
  );
};
