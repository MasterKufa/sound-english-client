import { useStoreMap } from "effector-react";
import { vocabularyModel } from "../../models";
import { Box, Typography } from "@mui/material";
import { Container } from "./reminder.styles";
import { vocabularySelectors } from "../../models/vocabulary";

type ReminderProps = {
  id: number;
};

export const Reminder = ({ id }: ReminderProps) => {
  const reminder = useStoreMap(
    vocabularyModel.$words,
    vocabularySelectors.findWordById(id),
  );

  return (
    <Box sx={Container}>
      <Typography variant="h5">{reminder?.sourceWord.text}</Typography>
      <Typography variant="h5">{reminder?.targetWord.text}</Typography>
    </Box>
  );
};
