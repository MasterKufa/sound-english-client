import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { ScreenContainer } from "../../shared/styles";
import { FILE_UPLOAD_LABEL } from "./file-upload.constants";
import { useGate, useUnit } from "effector-react";
import { fileUploadModel } from "../../models";
import { WordBulkControls, WordsBulkList } from "../../modules";

export const FileUpload = () => {
  const processFilePending = useUnit(fileUploadModel.$processFilePending);
  const bulkUploadPending = useUnit(fileUploadModel.$bulkUploadPending);

  useGate(fileUploadModel.FileUploadGate);

  return (
    <Box sx={ScreenContainer}>
      <Typography variant="h4">{FILE_UPLOAD_LABEL}</Typography>
      <WordBulkControls />
      <WordsBulkList />
      <Backdrop open={processFilePending || bulkUploadPending}>
        <CircularProgress />
      </Backdrop>
    </Box>
  );
};
