import { first } from "lodash";
import { PlayerWord } from "shared/player.types";

const STOP_EVENT_TYPE = "STOP_EVENT_TYPE";

const audioTrack = new Audio();

export const stopAudio = () => {
  audioTrack.pause();
  audioTrack.currentTime = 0;
  URL.revokeObjectURL(audioTrack.src);
  audioTrack.src = "";
  audioTrack.onended?.(new Event(STOP_EVENT_TYPE));
};

export const playAudio = (queue: Array<PlayerWord>) =>
  new Promise<void>((resolve, reject) => {
    const buffer = first(queue)?.audioBuffer;

    if (!buffer) return;

    const blob = new Blob([buffer], { type: "audio/wav" });
    audioTrack.src = window.URL.createObjectURL(blob);

    audioTrack.play();

    const onEnded = (e: Event) => {
      audioTrack.onended = null;

      if (e.type === STOP_EVENT_TYPE) reject();
      else resolve();
    };

    audioTrack.onended = onEnded;
  });

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
