import { BulkUploadError } from "../../shared/vocabulary.types";

export const errorMapping = {
  [BulkUploadError.duplicate]: "Duplicate",
  [BulkUploadError.langCheck]: "Check lang",
};
