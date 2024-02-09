import { first, last, random } from "lodash";
import { PlayerWord } from "../../shared/player.types";
import { QueueStrategy, Settings } from "../../shared/settings.types";
import { Word } from "shared/vocabulary.types";
import * as wordSelectors from "../word/word.selectors";
import { Playlist } from "shared/playlists";
import { CurrentPlaylist } from "./player.types";

const sequenceEnqueue = (words: Array<Word>, playerQueue: Array<PlayerWord>) =>
  words[words.findIndex(({ id }) => id === last(playerQueue)?.id) + 1] ||
  first(words);

const randomEnqueue = (words: Array<Word>) => words[random(0, words.length)];

const queueGenerators: Record<
  QueueStrategy,
  (words: Array<Word>, playerQueue: Array<PlayerWord>) => Word
> = {
  [QueueStrategy.sequence]: sequenceEnqueue,
  [QueueStrategy.random]: randomEnqueue,
};

export const generateEnqueueWord = (
  settings: Settings,
  words: Array<Word>,
  playlists: Array<Playlist>,
  currentPlaylistId: CurrentPlaylist,
  playerQueue: Array<PlayerWord>
) => {
  const strategy = settings.queueStrategy || QueueStrategy.sequence;
  const playlistWordIds = playlists.find(
    (list) => list.id === currentPlaylistId
  )?.wordIds;

  const reviewedWords = words.filter(
    (word) =>
      (currentPlaylistId !== "All"
        ? playlistWordIds?.includes(word.id)
        : true) &&
      wordSelectors.findUnitByLang(word.units, settings.sourceLang)?.text &&
      wordSelectors.findUnitByLang(word.units, settings.targetLang)?.text
  );

  const next = queueGenerators[strategy](reviewedWords, playerQueue) || {};

  return next;
};
