import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { LoadVoicesPayload } from "shared/settings.types";
import { ACTIONS } from "./actions";
import { Settings } from "../shared/settings.types";

export const loadSettingsFx = createEffect<void, Settings>(() =>
  socket.emitWithAnswer<void, Settings>(ACTIONS.LOAD_SETTINGS)
);

export const loadVoicesFx = createEffect<LoadVoicesPayload, Array<string>>(
  (payload) =>
    socket.emitWithAnswer<LoadVoicesPayload, Array<string>>(
      ACTIONS.LOAD_VOICES,
      payload
    )
);

export const changeSettingsFx = createEffect<Settings, Settings>((payload) =>
  socket.emitWithAnswer<Settings, Settings>(ACTIONS.CHANGE_SETTINGS, payload)
);
