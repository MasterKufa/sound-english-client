import { first, last, random } from "lodash";
import { PlayerWord } from "../../shared/player.types";
import { QueueStrategy } from "../../shared/settings.types";
import { Word } from "shared/vocabulary.types";

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
  strategy: QueueStrategy = QueueStrategy.sequence,
  words: Array<Word>,
  playerQueue: Array<PlayerWord>
) => {
  const next = queueGenerators[strategy](words, playerQueue);

  return next;
};
