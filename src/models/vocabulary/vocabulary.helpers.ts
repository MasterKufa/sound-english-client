import { Word } from "../../shared/vocabulary.types";

export const updateWord = (words: Array<Word>, updatedWord: Word) => {
  const wordInx = words.findIndex((word) => word.id === updatedWord.id);

  if (wordInx !== -1) {
    const newWords = [...words];
    newWords[wordInx] = updatedWord;
    return newWords;
  }

  return [updatedWord, ...words];
};
