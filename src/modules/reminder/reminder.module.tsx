import { useStoreMap } from "effector-react";
import { vocabularyModel } from "../../models";
import { Box, Chip, IconButton } from "@mui/material";
import { vocabularySelectors } from "../../models/vocabulary";
import { WordContainer } from "./reminder.styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";

type ReminderProps = {
  id: number;
};

export const Reminder = ({ id }: ReminderProps) => {
  const reminder = useStoreMap(
    vocabularyModel.$words,
    vocabularySelectors.findWordById(id)
  );

  return (
    <Box sx={WordContainer}>
      <Chip label={reminder?.sourceWord.text} />
      <Chip label={reminder?.targetWord.text} variant="outlined" />
      <IconButton
        size="small"
        onClick={() => `${navigation.navigate(Paths.vocabulary)}/${id}`}
      >
        <OpenInNewIcon />
      </IconButton>
    </Box>
  );
};
