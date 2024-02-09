import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
  split,
} from "effector";
import { createGate } from "effector-react";
import { PlayerWord } from "../../shared/player.types";
import { vocabularyModel } from "models/vocabulary";
import { generateEnqueueWord } from "./player.queue";
import { settingsModel } from "models/settings";
import { handleAudioControls, playAudio, stopAudio } from "./player.processor";
import { first } from "lodash";
import { fetchPlayerWord } from "./player.vendor";
import { Notification } from "@master_kufa/client-tools";
import { Word } from "../../shared/vocabulary.types";
import { Settings } from "../../shared/settings.types";
import { playlistsModel } from "models/playlists";
import { CurrentPlaylist } from "./player.types";

export const $isPlaying = createStore<boolean>(false);
export const $currentPlaylistId = createStore<CurrentPlaylist>("All");
export const $playerQueue = createStore<Array<PlayerWord>>([]);
export const $lastPlayedReminders = createStore<Array<number>>([]);

export const $isPlayingTriggerEnabled = vocabularyModel.$words.map((words) =>
  Boolean(words.length)
);

export const PlayerGate = createGate();

export const triggerPlay = createEvent();
export const enqueuePlayerWord = createEvent();
export const selectPlaylist = createEvent<CurrentPlaylist>();

const playWordFx = attach({
  effect: createEffect<[Array<PlayerWord>, Array<Word>, Settings], void>(
    playAudio
  ),
  source: [$playerQueue, vocabularyModel.$words, settingsModel.$settings],
});

const stopPlayingWordFx = createEffect(stopAudio);

export const fetchPlayerWordFx = createEffect<
  Parameters<typeof generateEnqueueWord>,
  PlayerWord
>(fetchPlayerWord);

export const leavePlayerNoticeFx = createEffect(() =>
  Notification.add({
    type: "success",
    message: "Playing is able only on player screen",
  })
);

$isPlaying.on(triggerPlay, (prev) => !prev);

split({
  source: $isPlaying,
  match: (isPlaying) => (isPlaying ? "play" : "stop"),
  cases: {
    play: enqueuePlayerWord,
    stop: stopPlayingWordFx,
  },
});

sample({
  clock: enqueuePlayerWord,
  source: [
    settingsModel.$settings,
    vocabularyModel.$words,
    playlistsModel.$playlists,
    $currentPlaylistId,
    $playerQueue,
    $isPlayingTriggerEnabled,
  ] as const,
  filter: ([_, _1, _2, _3, _4, isPlayingTriggerEnabled]) =>
    isPlayingTriggerEnabled,
  fn: ([settings, words, playlists, currentPlaylistId, playerQueue]) =>
    [settings, words, playlists, currentPlaylistId, playerQueue] as const,
  target: fetchPlayerWordFx,
});

//apply enqueue new word and repeatWordCount
sample({
  clock: fetchPlayerWordFx.doneData,
  source: [$playerQueue, settingsModel.$settings, PlayerGate.status] as const,
  filter: ([_, _1, isOpen]) => isOpen,
  fn: ([queue, settings], next) =>
    queue.concat(Array(settings.repeatWordCount).fill(next)),
  target: $playerQueue,
});

sample({
  clock: [$playerQueue, playWordFx.done],
  source: [$isPlaying, $playerQueue, playWordFx.inFlight] as const,
  filter: ([isPlaying, queue, inFlight]) =>
    Boolean(isPlaying && !inFlight && queue.length),
  target: playWordFx,
});

sample({
  clock: $playerQueue,
  source: [$isPlaying, $playerQueue, settingsModel.$settings] as const,
  filter: ([isPlaying, queue, { playerQueueSize }]) =>
    isPlaying && queue.length < playerQueueSize,
  target: enqueuePlayerWord,
});

// add reminders and change queue after play
sample({
  clock: playWordFx,
  source: [
    $lastPlayedReminders,
    settingsModel.$settings,
    $playerQueue,
  ] as const,
  fn: ([reminders, { lastPlayedRemindersSize }, queue]) => {
    const playingId = first(queue)?.id;
    if (!playingId || reminders[0] === playingId) return reminders;

    return [playingId].concat(
      reminders.length === lastPlayedRemindersSize
        ? reminders.slice(0, lastPlayedRemindersSize - 1)
        : reminders
    );
  },
  target: $lastPlayedReminders,
});

sample({
  clock: [playWordFx.done, stopPlayingWordFx.done],
  source: [$playerQueue, PlayerGate.status] as const,
  filter: ([_, isOpen]) => isOpen,
  fn: ([queue]) => queue.slice(1),
  target: $playerQueue,
});

// stop playing on leave and drop queue to avoid side effects of changing settings and words
sample({
  clock: PlayerGate.status,
  source: $isPlaying,
  filter: (isPlaying, isOpened) => isPlaying && !isOpened,
  fn: () => [],
  target: [
    $playerQueue,
    triggerPlay,
    leavePlayerNoticeFx,
    $lastPlayedReminders,
  ],
});

handleAudioControls(triggerPlay);

sample({ clock: selectPlaylist, target: $currentPlaylistId });

$playerQueue.reset(selectPlaylist);
$playerQueue.reset(PlayerGate.close);
