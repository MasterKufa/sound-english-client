import { Lang } from "../../shared/settings.types";
import { NewWord, Word } from "../../shared/vocabulary.types";
import { ChangeTextPayload } from "./word.types";

export const changeWordText = (
  word: Word | NewWord,
  { text, lang }: ChangeTextPayload
): Word | NewWord => ({
  ...word,
  units: word.units.map((unit) =>
    unit.lang === lang ? { ...unit, text } : unit
  ),
});

export const generateDefaultWord = (langs: Array<Lang>): NewWord => ({
  units: langs.map((lang) => ({ lang, text: "" })),
  customAudios: {},
});
