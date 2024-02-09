import { playlistsApi } from "api";
import { createStore, createEvent, sample, combine } from "effector";
import { spread } from "patronum";
import { fromPairs, uniq, xor } from "lodash";
import { appModel } from "models/app";
import { Playlist } from "shared/playlists";
import { vocabularyModel } from "models/vocabulary";
import { nanoid } from "nanoid";

export const $playlists = createStore<Array<Playlist>>([]);
export const $isPlaylistsManagementVisible = createStore<boolean>(false);
export const $playlistSelectedWordIds = createStore<
  Record<number | string, Array<number>>
>({});

export const createNewPlaylist = createEvent();
export const playlistNameChanged = createEvent<{
  playlistId: number | string;
  name: string;
}>();
export const toggleIsPlaylistsManagementVisible = createEvent();
export const togglePlaylistSelectedWord = createEvent<{
  playlistId: number | string;
  wordId: number;
}>();
export const addWordAssignment = createEvent<number | string>();
export const removeWordAssignment = createEvent<number | string>();

export const $savePlaylistPending = playlistsApi.savePlaylistsFx.pending;

export const $playlistsWords = combine(
  $playlists,
  vocabularyModel.$words,
  (playlists, words) =>
    fromPairs(
      playlists.map(({ wordIds, id }) => [
        id,
        words.filter(({ id }) => wordIds.includes(id)),
      ])
    )
);

sample({
  clock: togglePlaylistSelectedWord,
  source: $playlistSelectedWordIds,
  fn: (playlistSelectedWordIds, { playlistId, wordId }) => ({
    ...playlistSelectedWordIds,
    [playlistId]: xor(playlistSelectedWordIds[playlistId], [wordId]),
  }),
  target: $playlistSelectedWordIds,
});

sample({
  clock: removeWordAssignment,
  source: [$playlists, $playlistSelectedWordIds] as const,
  fn: ([playlists, playlistSelectedWordIds], playlistId) =>
    playlists.map((list) =>
      list.id === playlistId
        ? {
            ...list,
            wordIds: list.wordIds.filter(
              (id) => !playlistSelectedWordIds[playlistId].includes(id)
            ),
          }
        : list
    ),
  target: $playlists,
});

sample({
  clock: removeWordAssignment,
  source: $playlistSelectedWordIds,
  fn: (playlistSelectedWordIds, playlistId) => ({
    ...playlistSelectedWordIds,
    [playlistId]: [],
  }),
  target: $playlistSelectedWordIds,
});

sample({
  clock: appModel.AppGate.open,
  target: playlistsApi.loadPlaylistsFx,
});

sample({
  clock: playlistsApi.loadPlaylistsFx.doneData,
  target: $playlists,
});

sample({
  clock: createNewPlaylist,
  source: $playlists,
  fn: (playlists) => [
    {
      name: "New Playlist",
      wordIds: [] as Array<number>,
      id: nanoid(),
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    ...playlists,
  ],
  target: $playlists,
});

sample({
  clock: playlistNameChanged,
  source: $playlists,
  fn: (playlists, { playlistId, name }) =>
    playlists.map((playlist) =>
      playlist.id === playlistId ? { ...playlist, name } : playlist
    ),
  target: $playlists,
});

sample({
  clock: toggleIsPlaylistsManagementVisible,
  source: $isPlaylistsManagementVisible,
  fn: (isPlaylistsManagementVisible) => !isPlaylistsManagementVisible,
  target: $isPlaylistsManagementVisible,
});

sample({
  clock: addWordAssignment,
  source: [$playlists, vocabularyModel.$selectedIds] as const,
  fn: ([playlists, selectedIds], playlistId) => ({
    selectedIds: [],
    playlists: playlists.map((playlist) =>
      playlist.id === playlistId
        ? {
            ...playlist,
            wordIds: uniq([...selectedIds, ...playlist.wordIds]),
          }
        : playlist
    ),
  }),
  target: spread({
    targets: {
      playlists: $playlists,
      selectedIds: vocabularyModel.$selectedIds,
    },
  }),
});

sample({
  clock: playlistsApi.savePlaylistsFx.doneData,
  target: $playlists,
});

window.addEventListener("beforeunload", vocabularyModel.VocabularyGate.close);

sample({
  clock: vocabularyModel.VocabularyGate.close,
  source: $playlists,
  target: playlistsApi.savePlaylistsFx,
});
