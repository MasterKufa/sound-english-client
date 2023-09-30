import { generateEnqueueWord } from "./player.queue";
import { Word } from "../../shared/vocabulary.types";
import { QueueStrategy } from "../../shared/settings.types";
import { PlayerWord } from "../../shared/player.types";
import { playerApi } from "../../api";
import { IDBPDatabase, openDB } from "idb";
import { VocabularyDb } from "./player.types";

const STORE_NAME = "vocabulary";

let wordsDb: IDBPDatabase<VocabularyDb> | null = null;

const initDB = async () => {
  wordsDb = await openDB<VocabularyDb>("kaluger-projects", 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
};

initDB();

export const fetchPlayerWord = ([strategy, words, playerQueue]: [
  QueueStrategy | undefined,
  Array<Word>,
  Array<PlayerWord>
]): Promise<PlayerWord> =>
  new Promise(async (resolve, reject) => {
    const { id, generatedSoundHash } = generateEnqueueWord(
      strategy,
      words,
      playerQueue
    );

    if (!id) {
      reject(new Error());

      return;
    }

    const cachedWord = wordsDb && (await wordsDb.get(STORE_NAME, id));
    if (cachedWord && generatedSoundHash === cachedWord.generatedSoundHash) {
      resolve({ id, audioBuffer: cachedWord.audioBuffer });

      return;
    }

    const audioBuffer = await playerApi.loadAudioFx({ id });

    wordsDb?.put(STORE_NAME, { generatedSoundHash, audioBuffer }, id);

    resolve({ id, audioBuffer });
  });

export const invalidateWordsCache = async () => wordsDb?.clear(STORE_NAME);
