import { Lang } from "../shared/settings.types";

export type WordTranslateRequest = {
  text: string;
  sourceLang: Lang;
  targetLang: Lang;
};

export type WordTranslateResponse = {
  text: string;
};
