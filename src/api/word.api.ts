import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { NewWord, Word, NewWordUnit } from "shared/vocabulary.types";
import { ACTIONS } from "./actions";
import { WordTranslateResponse } from "./word.types";

export const saveWordFx = createEffect<Word | NewWord, Word>((payload) =>
  socket.emitWithAnswer<Word | NewWord, Word>(ACTIONS.SAVE_WORD, payload)
);

export const translateWordFx = createEffect<NewWordUnit, WordTranslateResponse>(
  (payload) =>
    socket.emitWithAnswer<NewWordUnit, WordTranslateResponse>(
      ACTIONS.TRANSLATE_WORD,
      payload
    )
);
