import { createCalibrationFrame, type AudioFrameSnapshot } from '../features/audio/audioCalibration';

type FrameCallback = (frame: AudioFrameSnapshot) => void;

class AudioAnalysisService {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private callback: FrameCallback | null = null;
  private buffer = new Float32Array(2048);
  private running = false;
  private sampleRate = 44100;

  getSampleRate(): number {
    return this.sampleRate;
  }

  isRunning(): boolean {
    return this.running;
  }

  async start(callback: FrameCallback): Promise<void> {
    if (this.running) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone access is not supported in this browser.');
    }

    this.callback = callback;
    this.audioContext = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
    this.sampleRate = this.audioContext.sampleRate;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
      },
    });

    this.mediaStream = stream;
    this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = this.buffer.length;
    this.mediaStreamSource.connect(this.analyzer);
    this.running = true;
    this.tick();
  }

  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.callback = null;
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.analyzer) {
      this.analyzer.disconnect();
      this.analyzer = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      void this.audioContext.close();
    }
    this.audioContext = null;
    this.sampleRate = 44100;
  }

  private tick = (): void => {
    if (!this.running || !this.analyzer) return;

    this.analyzer.getFloatTimeDomainData(this.buffer);
    this.callback?.(createCalibrationFrame(this.buffer, performance.now()));
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}

export const audioAnalysisService = new AudioAnalysisService();
