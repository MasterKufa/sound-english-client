import {
  attach,
  combine,
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
import { playAudio, stopAudio } from "./player.processor";
import { first } from "lodash";
import { fetchPlayerWord } from "./player.helpers";

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
  effect: createEffect<Array<PlayerWord>, void>(playAudio),
  source: $playerQueue,
});

const stopPlayingWordFx = createEffect(stopAudio);

export const fetchPlayerWordFx = createEffect<
  Parameters<typeof generateEnqueueWordId>,
  PlayerWord
>(fetchPlayerWord);

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

split({
  clock: $playerQueue,
  source: combine(
    $playerQueue,
    settingsModel.$playerQueueSize,
    (queue, queueSize) => [queue, queueSize] as const
  ),
  match: ([queue, queueSize]) =>
    queue.length === queueSize ? "play" : "fetch",
  cases: {
    play: playWordFx,
    fetch: enqueuePlayerWord,
  },
});

sample({
  clock: playWordFx.done,
  source: [
    $lastPlayedReminders,
    settingsModel.$lastPlayedRemindersSize,
    $playerQueue,
  ] as const,
  fn: ([reminders, remindersSize, queue]) => {
    const playedId = first(queue)?.id;
    if (!playedId) return reminders;

    return reminders.length === remindersSize
      ? reminders.slice(1).concat([playedId])
      : reminders.concat([playedId]);
  },
  target: $lastPlayedReminders,
});

$playerQueue.on(playWordFx.done, (queue) => queue.slice(1));
