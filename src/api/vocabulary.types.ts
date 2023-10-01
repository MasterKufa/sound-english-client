import { WordDefinition } from "../shared/vocabulary.types";

export type IdPayload = {
  id: number;
};

export type FileUploadPayload = {
  file: File;
  name: string;
};

export type BulkWordUploadPayload = {
  words: Array<WordDefinition>;
};
