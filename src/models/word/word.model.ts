import { NewWord, Word } from "shared/vocabulary.types";
import {
  attach,
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
import { entries, fromPairs, isNumber } from "lodash";
import { appModel } from "models/app";
import { Lang } from "../../shared/settings.types";
import { settingsModel } from "../settings";

export const $word = createStore<NewWord | Word>(generateDefaultWord([]));

export const saveClicked = createEvent();
export const wordTextChanged = createEvent<ChangeTextPayload>();
export const deleteWordClicked = createEvent<number>();

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
  clock: WordGate.status,
  source: settingsModel.$settings,
  filter: (_, isOpen) => !isOpen,
  fn: (settings) =>
    generateDefaultWord([settings.sourceLang, settings.targetLang]),
  target: $word,
});

$word.on(wordTextChanged, changeWordText);

sample({
  clock: saveClicked,
  source: [$word, settingsModel.$settings] as const,
  fn: ([word, settings]) => ({
    ...word,
    units: word.units
      .filter((unit) =>
        [settings.sourceLang, settings.targetLang].includes(unit.lang)
      )
      .map((unit) => ({ ...unit, text: unit.text.trim() })),
    customAudios: fromPairs(
      entries(word.customAudios).filter(
        ([lang, audio]) =>
          [settings.sourceLang, settings.targetLang].includes(lang as Lang) &&
          (audio.isModified || audio.isDeleted)
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
