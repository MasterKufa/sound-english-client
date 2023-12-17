import { NewWord, Word } from "shared/vocabulary.types";
import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { vocabularyApi, wordApi } from "api";
import { ChangeTextPayload } from "./word.types";
import { createGate } from "effector-react";
import { changeWordText, generateDefaultWord } from "./word.helpers";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { navigation } from "../../shared/navigate";
import { Paths } from "../../app/app.types";
import {
  CONFIRM_DELETE_TEXT,
  CONFIRM_DELETE_TITLE,
} from "../vocabulary/vocabulary.constants";
import { entries, fromPairs, isNumber, set, uniq } from "lodash";
import { appModel } from "models/app";
import { findUnitByLang } from "./word.selectors";
import { Lang } from "../../shared/settings.types";
import * as wordSelectors from "./word.selectors";
import { settingsModel } from "../settings";

export const $word = createStore<NewWord | Word>(generateDefaultWord([]));
export const $selectedLanguages = createStore<Array<Lang>>([]);

export const $isSaveDisabled = combine(
  $selectedLanguages,
  $word,
  (selectedLanguages, word) =>
    selectedLanguages.length < 2 ||
    !selectedLanguages.every((lang) =>
      word.units.some((unit) => unit.lang === lang && unit.text)
    )
);

export const $isTranslatePending = wordApi.translateWordFx.pending;

export const setSelectedLanguages = createEvent<Array<Lang>>();
export const saveClicked = createEvent();
export const wordTextChanged = createEvent<ChangeTextPayload>();
export const deleteWordClicked = createEvent<number>();
export const translateClicked = createEvent();

export const deleteWordFx = attach({ effect: vocabularyApi.deleteWordFx });
export const backToVocabularyFx = createEffect(() =>
  navigation.navigate(Paths.vocabulary)
);

export const WordGate = createGate<number>();

// AppGate open trigger after WordGate so need to handle it on first open link with word
sample({
  clock: [appModel.AppGate.open, WordGate.open],
  source: WordGate.state,
  filter: (wordId) => isNumber(wordId) && Boolean(wordId),
  target: vocabularyApi.loadWordFx,
});

sample({
  clock: vocabularyApi.loadWordFx.doneData,
  target: $word,
});

sample({
  clock: vocabularyApi.loadWordFx.doneData,
  source: [$word, settingsModel.$settings] as const,
  fn: ([word, settings]) =>
    uniq([
      settings.sourceLang,
      settings.targetLang,
      ...word.units.map((unit) => unit.lang),
    ]),
  target: $selectedLanguages,
});

$selectedLanguages.on(setSelectedLanguages, (_, langs) => langs);

sample({
  clock: $selectedLanguages,
  source: $word,
  fn: (word, selectedLanguages) => ({
    ...word,
    units: selectedLanguages.map(
      (lang) =>
        wordSelectors.findUnitByLang(word.units, lang) || { lang, text: "" }
    ),
  }),
  target: $word,
});

sample({
  clock: WordGate.status,
  source: $selectedLanguages,
  filter: (_, isOpen) => !isOpen,
  fn: (selectedLanguages) => generateDefaultWord(selectedLanguages),
  target: $word,
});

$word.on(wordTextChanged, changeWordText);

sample({
  clock: saveClicked,
  source: [$word, $selectedLanguages] as const,
  fn: ([word, selectedLanguages]) => ({
    ...word,
    units: word.units
      .filter((unit) => selectedLanguages.includes(unit.lang))
      .map((unit) => ({ ...unit, text: unit.text.trim() })),
    customAudios: fromPairs(
      entries(word.customAudios).filter(
        ([lang, audio]) =>
          selectedLanguages.includes(lang as Lang) && audio.isModified
      )
    ),
  }),
  target: wordApi.saveWordFx,
});

sample({
  clock: wordApi.saveWordFx.done,
  target: backToVocabularyFx,
});

sample({
  clock: wordApi.saveWordFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Word successfully saved",
  }),
  target: Notification.add,
});

sample({
  clock: deleteWordClicked,
  target: createEffect<number, void>((payload) => {
    Confirm.show({
      title: CONFIRM_DELETE_TITLE,
      text: CONFIRM_DELETE_TEXT,
      onSubmit: () => deleteWordFx(payload),
    });
  }),
});

sample({
  clock: deleteWordFx.done,
  target: backToVocabularyFx,
});

// translate text
sample({
  clock: translateClicked,
  source: [$word, settingsModel.$settings] as const,
  fn: ([word, settings]) => findUnitByLang(word.units, settings.sourceLang)!,
  target: wordApi.translateWordFx,
});

sample({
  clock: wordApi.translateWordFx.doneData,
  source: $word,
  fn: (word, res) => set(word, "targetWord.text", res.text),
  target: $word,
});
