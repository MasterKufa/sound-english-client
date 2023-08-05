import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { Word } from "shared/vocabulary.types";
import { ACTIONS } from "./actions";
import { DeleteWordPayload } from "./vocabulary.types";

export const loadWordsFx = createEffect<void, Array<Word>>(() =>
  socket.emitWithAnswer<void, Array<Word>>(ACTIONS.LOAD_WORDS)
);

export const deleteWordFx = createEffect<number, void>((payload) =>
  socket.emitWithAnswer<DeleteWordPayload, void>(ACTIONS.DELETE_WORD, {
    id: payload,
  })
);
