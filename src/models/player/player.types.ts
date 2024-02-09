import { DBSchema } from "idb";

export type CachedWord = {
  generatedSoundHash: string;
  id: number;
  buffer: Buffer;
};

export interface VocabularyDb extends DBSchema {
  vocabulary: {
    key: number;
    value: {
      generatedSoundHash: string;
      audioBuffer: Buffer;
    };
  };
}

export type CurrentPlaylist = number | string | "All";
