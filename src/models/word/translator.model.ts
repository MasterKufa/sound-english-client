import { createEvent, createStore, sample } from "effector";
import { wordApi } from "api";
import { Lang } from "../../shared/settings.types";

export const $translateText = createStore<string>("");
export const $translateResult = createStore<string>("");
export const $translateSourceLang = createStore<Lang>(Lang.en);
export const $translateTargetLang = createStore<Lang>(Lang.ru);
export const $isTranslateShown = createStore<boolean>(false);
export const $isTranslatePending = wordApi.translateWordFx.pending;

export const translateTextChanged = createEvent<string>();
export const translateSourceChanged = createEvent<Lang>();
export const translateTargetChanged = createEvent<Lang>();
export const translateClicked = createEvent();
export const translateShow = createEvent<boolean>();

$translateResult.reset(translateTextChanged);

sample({
  clock: translateShow,
  target: $isTranslateShown,
});

sample({
  clock: translateSourceChanged,
  target: $translateSourceLang,
});

sample({
  clock: translateTargetChanged,
  target: $translateTargetLang,
});

sample({
  clock: translateTextChanged,
  target: $translateText,
});

sample({
  clock: translateClicked,
  source: {
    sourceLang: $translateSourceLang,
    targetLang: $translateTargetLang,
    text: $translateText,
  },

  target: wordApi.translateWordFx,
});

sample({
  clock: wordApi.translateWordFx.doneData,
  fn: (res) => res.text,
  target: $translateResult,
});
