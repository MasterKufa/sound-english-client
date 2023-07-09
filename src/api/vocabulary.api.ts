import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { DeleteWordPayload, NewWord, Word } from "shared/types";
import { ACTIONS } from "./actions";

export const loadWordsFx = createEffect<void, Array<Word>>(() =>
  socket.emitWithAnswer<void, Array<Word>>(ACTIONS.LOAD_WORDS)
);

export const saveWordFx = createEffect<Word | NewWord, Word>((payload) =>
  socket.emitWithAnswer<Word | NewWord, Word>(ACTIONS.SAVE_WORD, payload)
);

export const deleteWordFx = createEffect<DeleteWordPayload, void>((payload) =>
  socket.emitWithAnswer<DeleteWordPayload, void>(ACTIONS.DELETE_WORD, payload)
);

export const loadAudioFx = createEffect<number, ArrayBuffer>((payload) =>
  socket.emitWithAnswer<number, ArrayBuffer>(ACTIONS.LOAD_AUDIO, payload)
);
