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
import { generateEnqueueWordId } from "./player.queue";
import { settingsModel } from "models/settings";
import { handleAudioControls, playAudio, stopAudio } from "./player.processor";
import { first } from "lodash";
import { fetchPlayerWord } from "./player.helpers";
import { Notification } from "@master_kufa/client-tools";
import { Word } from "../../shared/vocabulary.types";

export const $isPlaying = createStore<boolean>(false);
export const $playerQueue = createStore<Array<PlayerWord>>([]);
export const $lastPlayedReminders = createStore<Array<number>>([]);

export const $isPlayingTriggerEnabled = vocabularyModel.$words.map((words) =>
  Boolean(words.length)
);

export const PlayerGate = createGate();

export const triggerPlay = createEvent();
export const enqueuePlayerWord = createEvent();

const playWordFx = attach({
  effect: createEffect<[Array<PlayerWord>, Array<Word>], void>(playAudio),
  source: [$playerQueue, vocabularyModel.$words],
});

const stopPlayingWordFx = createEffect(stopAudio);

export const fetchPlayerWordFx = createEffect<
  Parameters<typeof generateEnqueueWordId>,
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
    settingsModel.$queueStrategy,
    vocabularyModel.$words,
    $playerQueue,
    $isPlayingTriggerEnabled,
  ] as const,
  filter: ([_, _1, _2, isPlayingTriggerEnabled]) => isPlayingTriggerEnabled,
  fn: ([queueStrategy, words, playerQueue]) =>
    [queueStrategy, words, playerQueue] as const,
  target: fetchPlayerWordFx,
});

$playerQueue.on(fetchPlayerWordFx.doneData, (queue, next) =>
  queue.concat([next])
);

sample({
  clock: [$playerQueue, playWordFx.done],
  source: [
    $isPlaying,
    $playerQueue,
    settingsModel.$playerQueueSize,
    playWordFx.inFlight,
  ] as const,
  filter: ([isPlaying, queue, _, inFlight]) =>
    Boolean(isPlaying && !inFlight && queue.length),
  target: playWordFx,
});

sample({
  clock: $playerQueue,
  source: [$isPlaying, $playerQueue, settingsModel.$playerQueueSize] as const,
  filter: ([isPlaying, queue, queueSize]) =>
    isPlaying && queue.length < queueSize,
  target: enqueuePlayerWord,
});

// add reminders and change queue after play
sample({
  clock: [playWordFx, stopPlayingWordFx],
  source: [
    $lastPlayedReminders,
    settingsModel.$lastPlayedRemindersSize,
    $playerQueue,
  ] as const,
  fn: ([reminders, remindersSize, queue]) => {
    const playingId = first(queue)?.id;
    if (!playingId) return reminders;

    return reminders.length === remindersSize
      ? reminders.slice(1).concat([playingId])
      : reminders.concat([playingId]);
  },
  target: $lastPlayedReminders,
});

$playerQueue.on([playWordFx.done, stopPlayingWordFx.done], (queue) =>
  queue.slice(1)
);

// stop playing on leave to avoid side effects of changing settings and words
sample({
  clock: PlayerGate.status,
  source: $isPlaying,
  filter: (isPlaying, isOpened) => isPlaying && !isOpened,
  target: [triggerPlay, leavePlayerNoticeFx],
});

handleAudioControls(triggerPlay);
