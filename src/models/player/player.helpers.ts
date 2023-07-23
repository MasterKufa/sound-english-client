import { generateEnqueueWordId } from "./player.queue";
import { Word } from "../../shared/vocabulary.types";
import { QueueStrategy } from "../../shared/settings.types";
import { PlayerWord } from "../../shared/player.types";
import { playerApi } from "../../api";

export const fetchPlayerWord = ([strategy, words, playerQueue]: [
  QueueStrategy | undefined,
  Array<Word>,
  Array<PlayerWord>
]): Promise<PlayerWord> =>
  new Promise(async (resolve, reject) => {
    const id = generateEnqueueWordId(strategy, words, playerQueue);

    if (!id) {
      reject(new Error());

      return;
    }

    const audioBuffer = await playerApi.loadAudioFx({ id });

    resolve({ id, audioBuffer });
  });
