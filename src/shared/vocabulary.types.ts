export type Word = {
  createdAt: string;
  sourceWord: WordUnit;
  targetWord: WordUnit;
  id: number;
};

export type NewWord = {
  sourceWord: NewWordUnit;
  targetWord: NewWordUnit;
};

export type WordUnit = {
  lang: Lang;
  text: string;
  id: number;
};

export type NewWordUnit = Omit<WordUnit, "id">;

export type DeleteWordPayload = {
  id: number;
};

export enum Lang {
  en = "en",
  ru = "ru",
}
