import { DeleteWordPayload, NewWord, Word } from "shared/vocabulary.types";
import { createEvent, createStore, sample } from "effector";
import { vocabularyApi } from "api";
import { AppGate } from "models/app.model";
import { ChangeTextPayload } from "./vocabulary.types";
import { DEFAULT_WORD } from "./vocabulary.constants";

export const $words = createStore<Array<Word>>([]);

export const addWord = createEvent();
export const wordTextChanged = createEvent<ChangeTextPayload>();
export const saveWord = createEvent<Word | NewWord>();
export const deleteWordClicked = createEvent<DeleteWordPayload>();

sample({
  clock: AppGate.open,
  target: vocabularyApi.loadWordsFx,
});

sample({
  clock: vocabularyApi.loadWordsFx.doneData,
  target: $words,
});

sample({
  clock: saveWord,
  target: vocabularyApi.saveWordFx,
});

sample({
  clock: addWord,
  fn: () => DEFAULT_WORD,
  target: saveWord,
});

$words.on(vocabularyApi.saveWordFx.doneData, (words, updatedWord) => {
  const wordInx = words.findIndex((word) => word.id === updatedWord.id);

  if (wordInx !== -1) {
    const newWords = [...words];
    newWords[wordInx] = updatedWord;
    return newWords;
  }

  return [updatedWord, ...words];
});

$words.on(wordTextChanged, (words, { wordId, text, targetKey }) =>
  words.map((word) =>
    wordId === word.id
      ? { ...word, [targetKey]: { ...word[targetKey], text } }
      : word
  )
);

sample({
  clock: deleteWordClicked,
  target: vocabularyApi.deleteWordFx,
});

$words.on(vocabularyApi.deleteWordFx.done, (words, { params }) =>
  words.filter((word) => word.id !== params.id)
);
