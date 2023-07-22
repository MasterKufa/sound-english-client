import { Word } from "../../shared/vocabulary.types";
import { ChangeTextPayload } from "./vocabulary.types";

export const updateWord = (words: Array<Word>, updatedWord: Word) => {
  const wordInx = words.findIndex((word) => word.id === updatedWord.id);

  if (wordInx !== -1) {
    const newWords = [...words];
    newWords[wordInx] = updatedWord;
    return newWords;
  }

  return [updatedWord, ...words];
};

export const changeWordText = (
  words: Array<Word>,
  { wordId, text, targetKey }: ChangeTextPayload
) =>
  words.map((word) =>
    wordId === word.id
      ? { ...word, [targetKey]: { ...word[targetKey], text } }
      : word
  );
