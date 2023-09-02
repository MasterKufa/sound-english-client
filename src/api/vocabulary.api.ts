import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { CustomAudios, Word } from "shared/vocabulary.types";
import { ACTIONS } from "./actions";
import { IdPayload, saveCustomAudiosPayload } from "./vocabulary.types";

export const loadWordsFx = createEffect<void, Array<Word>>(() =>
  socket.emitWithAnswer<void, Array<Word>>(ACTIONS.LOAD_WORDS)
);

export const deleteWordFx = createEffect<number, void>((payload) =>
  socket.emitWithAnswer<IdPayload, void>(ACTIONS.DELETE_WORD, {
    id: payload,
  })
);

export const loadCustomAudioFx = createEffect<number, CustomAudios>((id) =>
  socket.emitWithAnswer<IdPayload, CustomAudios>(ACTIONS.LOAD_CUSTOM_AUDIOS, {
    id,
  })
);

export const saveCustomAudiosFx = createEffect<saveCustomAudiosPayload, void>(
  (payload) =>
    socket.emitWithAnswer<saveCustomAudiosPayload, void>(
      ACTIONS.SAVE_CUSTOM_AUDIOS,
      payload
    )
);
