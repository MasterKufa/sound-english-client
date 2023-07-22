import { first } from "lodash";
import { PlayerWord } from "shared/player.types";

const audioTrack = new Audio();

export const stopAudio = () => {
  audioTrack.pause();
  audioTrack.currentTime = 0;
  URL.revokeObjectURL(audioTrack.src);
  audioTrack.src = "";
};

export const playAudio = (queue: Array<PlayerWord>) => {
  const buffer = first(queue)?.audioBuffer;

  if (!buffer) return;

  const blob = new Blob([buffer], { type: "audio/wav" });
  audioTrack.src = window.URL.createObjectURL(blob);

  audioTrack.play();
};
