import { Lang } from "../../shared/settings.types";
import { NewWordUnit, WordUnit } from "../../shared/vocabulary.types";

export const findUnitByLang = (
  units: Array<WordUnit | NewWordUnit>,
  searchLang: Lang
) => units.find(({ lang }) => lang === searchLang);
