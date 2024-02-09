import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useUnit } from "effector-react";
import { translatorModel } from "models";
import {
  TranslationResult,
  WordTranslateContainer,
  WordTranslateFields,
} from "./word-translate.styles";
import { LANG_LABELS } from "../../../shared/constants";
import { values } from "lodash";
import { Lang } from "../../../shared/settings.types";

export const WordTranslate = () => {
  const isTranslateShown = useUnit(translatorModel.$isTranslateShown);
  const translateSourceLang = useUnit(translatorModel.$translateSourceLang);
  const translateTargetLang = useUnit(translatorModel.$translateTargetLang);
  const translateText = useUnit(translatorModel.$translateText);
  const translateResult = useUnit(translatorModel.$translateResult);
  const actions = useUnit({
    translateClicked: translatorModel.translateClicked,
    translateTextChanged: translatorModel.translateTextChanged,
    translateShow: translatorModel.translateShow,
    translateSourceChanged: translatorModel.translateSourceChanged,
    translateTargetChanged: translatorModel.translateTargetChanged,
  });

  return (
    <Box sx={WordTranslateContainer}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={isTranslateShown}
            onClick={() => actions.translateShow(!isTranslateShown)}
          />
        }
        label="Show translator"
      />

      {isTranslateShown && (
        <>
          <Box sx={WordTranslateFields}>
            <FormControl fullWidth>
              <InputLabel size="small" id="translate-source-lang">
                Source
              </InputLabel>
              <Select
                size="small"
                labelId="translate-source-lang"
                label="Source"
                value={translateSourceLang}
                onChange={({ target }) =>
                  actions.translateSourceChanged(target.value as Lang)
                }
              >
                {values(Lang).map((option) => (
                  <MenuItem key={option} value={option}>
                    {LANG_LABELS[option]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel size="small" id="translate-target-lang">
                Target
              </InputLabel>
              <Select
                size="small"
                labelId="translate-target-lang"
                label="Target"
                value={translateTargetLang}
                onChange={({ target }) =>
                  actions.translateTargetChanged(target.value as Lang)
                }
              >
                {values(Lang).map((option) => (
                  <MenuItem key={option} value={option}>
                    {LANG_LABELS[option]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={WordTranslateFields}>
            <TextField
              size="small"
              name="translate"
              fullWidth
              label={LANG_LABELS[translateSourceLang]}
              value={translateText}
              onChange={({ target }) =>
                actions.translateTextChanged(target.value)
              }
            />
            <Chip sx={TranslationResult} label={translateResult || "-"} />
          </Box>
          <Button
            size="small"
            disabled={!translateText}
            variant="outlined"
            onClick={actions.translateClicked}
          >
            Translate
          </Button>
        </>
      )}
    </Box>
  );
};
