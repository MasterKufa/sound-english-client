import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useUnit } from "effector-react";
import { LangsContainer, WordSpellingContainer } from "./word-spelling.styles";
import { wordModel } from "models";
import { LANG_LABELS } from "../../../shared/constants";
import { Lang } from "../../../shared/settings.types";
import { values } from "lodash";

export const WordSpelling = () => {
  const word = useUnit(wordModel.$word);
  const selectedLanguages = useUnit(wordModel.$selectedLanguages);
  const actions = useUnit({
    wordTextChanged: wordModel.wordTextChanged,
    setSelectedLanguages: wordModel.setSelectedLanguages,
  });

  return (
    <Box sx={WordSpellingContainer}>
      <FormControl sx={LangsContainer} fullWidth>
        <InputLabel id="select-languages">Languages</InputLabel>
        <Select
          multiple
          labelId="select-languages"
          label="Languages"
          value={selectedLanguages}
          onChange={(e) =>
            actions.setSelectedLanguages(e.target.value as Array<Lang>)
          }
          renderValue={(selected) =>
            selected.map((lang) => LANG_LABELS[lang]).join(", ")
          }
        >
          {values(Lang).map((lang) => (
            <MenuItem key={lang} value={lang}>
              <Checkbox checked={selectedLanguages.includes(lang)} />
              <ListItemText primary={LANG_LABELS[lang]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {word.units.map((unit) => (
        <TextField
          key={unit.lang}
          label={LANG_LABELS[unit.lang]}
          value={unit.text}
          onChange={({ target }) =>
            actions.wordTextChanged({
              text: target.value,
              lang: unit.lang,
            })
          }
        />
      ))}
    </Box>
  );
};
