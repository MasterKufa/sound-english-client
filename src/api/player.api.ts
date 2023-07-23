import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { ACTIONS } from "./actions";
import { LoadAudioPayload } from "./player.types";

export const loadAudioFx = createEffect<LoadAudioPayload, Buffer>((payload) =>
  socket.emitWithAnswer<LoadAudioPayload, Buffer>(ACTIONS.LOAD_AUDIO, payload)
);
