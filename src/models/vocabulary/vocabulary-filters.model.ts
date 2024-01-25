import { combine, createEvent, createStore, sample } from "effector";
import { VocabularyFilter } from "../../shared/vocabulary.types";
import { Lang } from "../../shared/settings.types";
import { vocabularyModel } from ".";
import { PAGE_SIZE } from "shared/constants";
import { settingsApi } from "api";
import { settingsModel } from "models/settings";
import { findUnitByLang } from "models/word/word.selectors";

export const $filterText = createStore<string>("");
export const $pageNumber = createStore<number>(1);
export const $filter = createStore<VocabularyFilter>(
  VocabularyFilter.creationDate
);
export const $order = createStore<"asc" | "desc">("asc");
export const $alphabetLang = createStore<Lang | null>(null);

export const filterTextChanged = createEvent<string>();
export const changePageNumber = createEvent<number>();
export const applyFilter = createEvent<VocabularyFilter>();
export const toggleOrder = createEvent<void>();
export const toggleAlphabetLang = createEvent<void>();

export const $filteredWords = combine(
  vocabularyModel.$words,
  $filterText,
  $filter,
  $order,
  $alphabetLang,
  settingsModel.$settings,
  $pageNumber,
  (words, filterText, filter, order, alphabetLang, settings, pageNumber) =>
    words
      .filter(
        (word) =>
          findUnitByLang(word.units, settings.sourceLang)
            ?.text.toLowerCase()
            .includes(filterText.toLowerCase()) ||
          findUnitByLang(word.units, settings.targetLang)
            ?.text.toLowerCase()
            .includes(filterText.toLowerCase())
      )
      .sort((a, b) => {
        let res = 0;

        if (filter === VocabularyFilter.alphabet && alphabetLang)
          res = (
            findUnitByLang(a.units, alphabetLang)?.text || ""
          ).localeCompare(findUnitByLang(b.units, alphabetLang)?.text || "");

        if (filter === VocabularyFilter.creationDate)
          res = a.createdAt < b.createdAt ? 1 : -1;

        if (filter === VocabularyFilter.updateDate)
          res = a.updatedAt < b.updatedAt ? 1 : -1;

        return res * (order === "asc" ? 1 : -1);
      })
      .slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE - 1)
);

export const $totalPages = $filteredWords.map((words) =>
  Math.ceil(words.length / PAGE_SIZE)
);

$pageNumber.reset($filteredWords);

sample({
  clock: filterTextChanged,
  target: $filterText,
});

sample({
  clock: changePageNumber,
  target: $pageNumber,
});

sample({
  clock: applyFilter,
  target: $filter,
});

sample({
  clock: toggleOrder,
  source: $order,
  fn: (order) => (order === "asc" ? "desc" : "asc"),
  target: $order,
});

sample({
  clock: toggleAlphabetLang,
  source: [$alphabetLang, settingsModel.$settings] as const,
  fn: ([order, { sourceLang, targetLang }]) =>
    order === sourceLang ? targetLang : sourceLang,
  target: $alphabetLang,
});

sample({
  clock: settingsApi.loadSettingsFx.doneData,
  fn: (payload) => payload.sourceLang,
  target: $alphabetLang,
});
