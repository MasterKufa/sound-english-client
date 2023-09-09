import { NewWord } from "shared/vocabulary.types";
import { Lang } from "../../shared/settings.types";

export const DEFAULT_WORD: NewWord = {
  sourceWord: {
    lang: Lang.en,
    text: "",
  },
  targetWord: {
    lang: Lang.ru,
    text: "",
  },
  customAudios: {},
};
