import { Lang } from "./settings.types";

export type Word = {
  createdAt: string;
  sourceWord: WordUnit;
  targetWord: WordUnit;
  id: number;
  customAudios: CustomAudios;
};

export type NewWord = {
  sourceWord: NewWordUnit;
  targetWord: NewWordUnit;
  customAudios: CustomAudios;
};

export type WordUnit = {
  lang: Lang;
  text: string;
  id: number;
};

export type NewWordUnit = Omit<WordUnit, "id">;

export type CustomAudio = {
  buffer: Blob;
  mimeType: string;
  isModified?: boolean;
};
export type CustomAudios = Partial<Record<Lang, CustomAudio>>;
