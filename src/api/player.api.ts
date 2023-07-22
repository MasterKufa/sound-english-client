import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { ACTIONS } from "./actions";

export const loadAudioFx = createEffect<number, Buffer>((payload) =>
  socket.emitWithAnswer<number, Buffer>(ACTIONS.LOAD_AUDIO, payload)
);
