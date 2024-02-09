import {
  BulkUploadFailedRecord,
  WordDefinition,
} from "../shared/vocabulary.types";

export type FileUploadPayload = {
  file: File;
  name: string;
};

export type BulkWordUploadPayload = {
  words: Array<WordDefinition>;
};

export type BulkWordsProcessResponse = {
  records: Array<WordDefinition>;
  failedRecords: Array<BulkUploadFailedRecord>;
};
