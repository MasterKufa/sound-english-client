class Recorder {
  private recorder: MediaRecorder;
  private audioChunks: Array<Blob> = [];
  isRecording = false;
  isInitiated = false;
  async init() {
    if (window.navigator.mediaDevices) {
      const stream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      this.recorder = new MediaRecorder(stream);
    }
    this.recorder.addEventListener("dataavailable", ({ data }) =>
      this.audioChunks.push(data)
    );

    this.isInitiated = true;
  }
  async stop() {
    return new Promise<Blob>((resolve) => {
      const stopListener = () => {
        this.recorder.removeEventListener("stop", stopListener);
        const buffer = new Blob(this.audioChunks, {
          type: this.recorder.mimeType,
        });

        this.audioChunks = [];

        resolve(buffer);
      };

      this.recorder.addEventListener("stop", stopListener);

      this.isRecording = false;

      this.recorder.stop();
    });
  }
  start() {
    this.isRecording = true;
    this.recorder.start();
  }
}

export const recorder = new Recorder();
