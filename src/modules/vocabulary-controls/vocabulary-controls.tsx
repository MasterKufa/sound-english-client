import { Box, Button } from "@mui/material";
import { Paths } from "app/app.types";
import { useUnit } from "effector-react";
import { vocabularyModel } from "models";
import { FILE_UPLOAD_LABEL } from "pages";
import { navigation } from "shared/navigate";
import { Container } from "./vocabulary-controls.styles";

export const VocabularyControls = () => {
  const selectedIds = useUnit(vocabularyModel.$selectedIds);
  const actions = useUnit({
    deleteWordClicked: vocabularyModel.deleteWordsBulk,
  });

  return (
    <Box sx={Container}>
      <Button
        variant="contained"
        onClick={() => navigation.navigate(Paths.vocabulary + `/new`)}
      >
        Add word
      </Button>
      <Button
        variant="contained"
        onClick={() => navigation.navigate(Paths.fileUpload)}
      >
        {FILE_UPLOAD_LABEL}
      </Button>
      <Button
        variant="contained"
        onClick={actions.deleteWordClicked}
        disabled={!selectedIds.length}
      >
        Delete selected{" "}
        {Boolean(selectedIds.length) && `(${selectedIds.length})`}
      </Button>
    </Box>
  );
};
