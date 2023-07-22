import { Word } from "../../shared/vocabulary.types";

export const findWordById = (searchId?: number) => (words: Array<Word>) =>
  words.find(({ id }) => searchId === id);
