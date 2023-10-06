import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { ErrorContainer } from "./word-bulk-loading.styles";
import { useUnit } from "effector-react";
import { fileUploadModel } from "models";

export const WordBulkLoading = () => {
  const processFilePending = useUnit(fileUploadModel.$processFilePending);
  const bulkUploadPending = useUnit(fileUploadModel.$bulkUploadPending);
  const bulkUploadProgress = useUnit(fileUploadModel.$bulkUploadProgress);

  return (
    <Backdrop
      sx={ErrorContainer}
      open={processFilePending || bulkUploadPending}
    >
      <CircularProgress />
      {bulkUploadPending && (
        <Typography color={"primary.light"} align="center">
          {bulkUploadProgress
            ? `${bulkUploadProgress.handled}/${bulkUploadProgress.total}`
            : "..."}
          <br />
          In progress.
          <br />
          It could take some time.
          <br />
          Please be patient, we generate audio for each word.
        </Typography>
      )}
    </Backdrop>
  );
};
