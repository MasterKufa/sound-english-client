import { CustomAudios } from "shared/vocabulary.types";

export type IdPayload = {
  id: number;
};

export type saveCustomAudiosPayload = {
  wordId: number;
  customAudios: CustomAudios;
};
