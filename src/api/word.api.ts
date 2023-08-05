import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { NewWord, Word } from "shared/vocabulary.types";
import { ACTIONS } from "./actions";

export const saveWordFx = createEffect<Word | NewWord, Word>((payload) =>
  socket.emitWithAnswer<Word | NewWord, Word>(ACTIONS.SAVE_WORD, payload)
);
