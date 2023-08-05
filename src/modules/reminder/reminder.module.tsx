import { useStoreMap } from "effector-react";
import { vocabularyModel } from "../../models";
import { Box, Chip } from "@mui/material";
import { vocabularySelectors } from "../../models/vocabulary";
import { WordContainer } from "./reminder.styles";

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
    </Box>
  );
};
