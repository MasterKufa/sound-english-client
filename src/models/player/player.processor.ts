import { first } from "lodash";
import { PlayerWord } from "shared/player.types";
import { Word } from "../../shared/vocabulary.types";
import { vocabularySelectors } from "../vocabulary";
import { Settings } from "../../shared/settings.types";
import { wordSelectors } from "../word";

const STOP_EVENT_TYPE = "STOP_EVENT_TYPE";

const audioTrack = new Audio();

const setMediaSession = (state: "paused" | "playing") => {
  if (navigator?.mediaSession?.playbackState) {
    navigator.mediaSession.playbackState = state;
  }
};

export const stopAudio = () => {
  audioTrack.title = "Playing is stopped";
  setMediaSession("paused");
  audioTrack.pause();
  audioTrack.currentTime = 0;
  audioTrack.onended?.(new Event(STOP_EVENT_TYPE));
};

export const playAudio = ([
  queue,
  words,
  { delayPlayerWordToWord, sourceLang, targetLang },
]: [Array<PlayerWord>, Array<Word>, Settings]) =>
  new Promise<void>(async (resolve, reject) => {
    const playerWord = first(queue);

    if (!playerWord) {
      reject();

      return;
    }
    const { audioBuffer, id } = playerWord;
    const blob = new Blob([audioBuffer], { type: "audio/mp3" });
    URL.revokeObjectURL(audioTrack.src);
    audioTrack.src = window.URL.createObjectURL(blob);

    try {
      await audioTrack.play();
      const word = vocabularySelectors.findWordById(id)(words);
      if (word) {
        audioTrack.title = `${
          wordSelectors.findUnitByLang(word.units, sourceLang)?.text
        } - ${wordSelectors.findUnitByLang(word.units, targetLang)?.text}`;
      }
      setMediaSession("playing");
    } catch {
      reject();

      return;
    }

    let delayTimer: NodeJS.Timer;
    const onEnded = (e: Event) => {
      clearTimeout(delayTimer);

      if (e.type === STOP_EVENT_TYPE) {
        reject();
        return;
      }

      delayTimer = setTimeout(() => {
        audioTrack.onended = null;
        resolve();
      }, delayPlayerWordToWord);
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
