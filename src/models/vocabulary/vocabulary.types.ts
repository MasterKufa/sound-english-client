import { Word } from "shared/vocabulary.types";

export type ChangeTextPayload<
  T extends keyof Word = "sourceWord" | "targetWord"
> = {
  wordId: number;
  text: string;
  targetKey: T;
};
