import { Box, TextField } from "@mui/material";
import { useUnit } from "effector-react";
import { WordSpellingContainer } from "./word-spelling.styles";
import { settingsModel, wordModel } from "models";
import { LANG_LABELS } from "../../../shared/constants";
import { wordSelectors } from "models/word";

export const WordSpelling = () => {
  const word = useUnit(wordModel.$word);
  const { targetLang, sourceLang } = useUnit(settingsModel.$settings);
  const actions = useUnit({
    wordTextChanged: wordModel.wordTextChanged,
  });

  const sourceUnit = wordSelectors.findUnitByLang(word.units, sourceLang);
  const targetUnit = wordSelectors.findUnitByLang(word.units, targetLang);

  return (
    <Box sx={WordSpellingContainer}>
      <TextField
        size="small"
        name="source"
        label={LANG_LABELS[sourceLang]}
        value={sourceUnit?.text || ""}
        onChange={({ target }) =>
          actions.wordTextChanged({
            text: target.value,
            lang: sourceLang,
          })
        }
      />
      <TextField
        name="target"
        size="small"
        label={LANG_LABELS[targetLang]}
        value={targetUnit?.text || ""}
        onChange={({ target }) =>
          actions.wordTextChanged({
            text: target.value,
            lang: targetLang,
          })
        }
      />
    </Box>
  );
};
