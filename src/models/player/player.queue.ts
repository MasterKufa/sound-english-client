import { first, last, random } from "lodash";
import { PlayerWord } from "../../shared/player.types";
import { QueueStrategy } from "../../shared/settings.types";
import { Word } from "shared/vocabulary.types";
import { vocabularySelectors } from "../vocabulary";

const sequenceEnqueue = (words: Array<Word>, playerQueue: Array<PlayerWord>) =>
  vocabularySelectors.findWordById(last(playerQueue)?.id)(words) ||
  first(words);

const randomEnqueue = (words: Array<Word>) => words[random(0, words.length)];

const queueGenerators: Record<
  QueueStrategy,
  (
    words: Array<Word>,
    playerQueue: Array<PlayerWord>
  ) => Word | PlayerWord | void
> = {
  [QueueStrategy.sequence]: sequenceEnqueue,
  [QueueStrategy.random]: randomEnqueue,
};

export const generateEnqueueWordId = (
  strategy: QueueStrategy = QueueStrategy.sequence,
  words: Array<Word>,
  playerQueue: Array<PlayerWord>
) => {
  const next = queueGenerators[strategy](words, playerQueue);

  return next?.id;
};
