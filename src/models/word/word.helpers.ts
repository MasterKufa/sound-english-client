import { NewWord, Word } from "../../shared/vocabulary.types";
import { ChangeTextPayload } from "./word.types";

export const changeWordText = (
  word: Word | NewWord,
  { text, targetKey }: ChangeTextPayload
) => ({ ...word, [targetKey]: { ...word[targetKey], text } });
