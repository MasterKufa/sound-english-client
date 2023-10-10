import { Box, Typography } from "@mui/material";
import { ScreenContainer } from "../../shared/styles";
import { FILE_UPLOAD_LABEL } from "./file-upload.constants";
import { useGate } from "effector-react";
import { fileUploadModel } from "../../models";
import { WordBulkControls, WordsBulkList } from "../../modules";

export const FileUpload = () => {
  useGate(fileUploadModel.FileUploadGate);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{FILE_UPLOAD_LABEL}</Typography>
      <WordBulkControls />
      <WordsBulkList />
    </Box>
  );
};
