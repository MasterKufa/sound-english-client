import { first } from "lodash";
import { PlayerWord } from "shared/player.types";
import { Word } from "../../shared/vocabulary.types";
import { vocabularySelectors } from "../vocabulary";

const STOP_EVENT_TYPE = "STOP_EVENT_TYPE";

const audioTrack = new Audio();

export const stopAudio = () => {
  audioTrack.pause();
  audioTrack.currentTime = 0;
  audioTrack.title = "Playing is stopped";
  audioTrack.onended?.(new Event(STOP_EVENT_TYPE));
};

export const playAudio = ([queue, words]: [Array<PlayerWord>, Array<Word>]) =>
  new Promise<void>(async (resolve, reject) => {
    const playerWord = first(queue);

    if (!playerWord) {
      reject();

      return;
    }
    const { audioBuffer, id } = playerWord;
    const blob = new Blob([audioBuffer], { type: "audio/wav" });
    URL.revokeObjectURL(audioTrack.src);
    audioTrack.src = window.URL.createObjectURL(blob);

    try {
      await audioTrack.play();
      const word = vocabularySelectors.findWordById(id)(words);
      audioTrack.title = `${word?.sourceWord.text} - ${word?.targetWord.text}`;
    } catch {
      reject();

      return;
    }

    const onEnded = (e: Event) => {
      audioTrack.onended = null;

      if (e.type === STOP_EVENT_TYPE) reject();
      else resolve();
    };

    audioTrack.onended = onEnded;
  });

export const handleAudioControls = (triggerPlay: () => void) => {
  navigator.mediaSession.setActionHandler("play", triggerPlay);
  navigator.mediaSession.setActionHandler("pause", triggerPlay);
};

const unblockSafari = () => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (!isSafari) return;

  const unBlocker = () => {
    audioTrack.load();
    window.removeEventListener("click", unBlocker);
  };

  window.addEventListener("click", unBlocker);
};

unblockSafari();
