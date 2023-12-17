import { Lang } from "./settings.types";

export type Word = {
  generatedSoundHash: string;
  createdAt: string;
  units: Array<WordUnit>;
  id: number;
  customAudios: CustomAudios;
};

export type NewWord = {
  units: Array<NewWordUnit>;
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
  isDeleted?: boolean;
};
export type CustomAudios = Partial<Record<Lang, CustomAudio>>;

export type WordDefinition = Partial<Record<Lang, string>>;

export type WordDefinitionView = WordDefinition & {
  id: string;
  isSelected: boolean;
};

export type BulkUploadProgress = {
  total: number;
  handled: number;
};

export enum BulkUploadError {
  langCheck = "langCheck",
  duplicate = "duplicate",
}

export type BulkUploadFailedRecord = {
  word: WordDefinition;
  error: BulkUploadError;
};
