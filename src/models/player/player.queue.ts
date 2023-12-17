import { first, last, random } from "lodash";
import { PlayerWord } from "../../shared/player.types";
import { QueueStrategy, Settings } from "../../shared/settings.types";
import { Word } from "shared/vocabulary.types";
import * as wordSelectors from "../word/word.selectors";

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
  playerQueue: Array<PlayerWord>
) => {
  const strategy = settings.queueStrategy || QueueStrategy.sequence;
  const reviewedWords = words.filter(
    (word) =>
      wordSelectors.findUnitByLang(word.units, settings.sourceLang)?.text &&
      wordSelectors.findUnitByLang(word.units, settings.targetLang)?.text
  );

  const next = queueGenerators[strategy](reviewedWords, playerQueue);

  return next;
};
