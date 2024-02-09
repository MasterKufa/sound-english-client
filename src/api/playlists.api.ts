import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { ACTIONS } from "./actions";

import { IdPayload } from "shared/types";
import { Playlist } from "shared/playlists";

export const loadPlaylistsFx = createEffect<void, Array<Playlist>>(() =>
  socket.emitWithAnswer<void, Array<Playlist>>(ACTIONS.LOAD_PLAYLISTS)
);

export const deletePlaylistFx = createEffect<number, void, string>((payload) =>
  socket.emitWithAnswer<IdPayload, void>(ACTIONS.DELETE_PLAYLIST, {
    id: payload,
  })
);

export const savePlaylistsFx = createEffect<
  Array<Playlist>,
  Array<Playlist>,
  string
>((payload) =>
  socket.emitWithAnswer<{ data: Array<Playlist> }, Array<Playlist>>(
    ACTIONS.SAVE_PLAYLISTS,
    { data: payload }
  )
);
