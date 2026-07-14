import * as Tone from 'tone';

// ---------------------------------------------------------------------------
// Violin samples - using a synth-based approach for violin-like sound
// In production, you'd use real violin samples
// ---------------------------------------------------------------------------

class AudioService {
  private synth: Tone.PolySynth | null = null;
  private reverb: Tone.Reverb | null = null;
  private vibrato: Tone.Vibrato | null = null;
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;
  private volume = 0.7;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this.initializeInstrument();
    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async initializeInstrument(): Promise<void> {

    // MUST call Tone.start() inside a user-gesture handler
    await Tone.start();

    this.reverb = new Tone.Reverb({ decay: 2.0, wet: 0.3 }).toDestination();
    
    // Create a violin-like synth using sawtooth with filter
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { 
        type: 'sawtooth',
      },
      envelope: { 
        attack: 0.1, 
        decay: 0.2, 
        sustain: 0.4, 
        release: 0.8 
      },
    }).chain(
      new Tone.Filter({
        type: 'lowpass',
        frequency: 4000,
        Q: 1
      }),
      this.vibrato = new Tone.Vibrato({
        frequency: 5,
        depth: 0.1,
      }),
      this.reverb
    );

    this.initialized = true;
    this._setVolumeOnInstrument(this.synth);
    console.log('🎻 Violin audio initialized!');
  }

  private _setVolumeOnInstrument(inst: Tone.PolySynth) {
    inst.volume.value = Tone.gainToDb(this.volume);
  }

  playNote(note: string, duration: string | number = '8n'): void {
    if (!this.initialized) return;
    try {
      this.synth?.triggerAttackRelease(note, duration);
    } catch {
      // note may be invalid - silent
    }
  }

  startNote(note: string): void {
    if (!this.initialized) return;
    try {
      this.synth?.triggerAttack(note);
    } catch {}
  }

  stopNote(note: string): void {
    if (!this.initialized) return;
    try {
      this.synth?.triggerRelease(note);
    } catch {}
  }

  playNotes(notes: string[], duration: string = '8n'): void {
    if (!this.initialized) return;
    try {
      this.synth?.triggerAttackRelease(notes, duration);
    } catch { /* silent */ }
  }

  stopAllNotes(): void {
    if (!this.initialized) return;
    this.synth?.releaseAll();
  }

  setVolume(value: number): void {
    this.volume = value;
    if (this.synth) this._setVolumeOnInstrument(this.synth);
  }

  getVolume(): number { return this.volume; }
  isInitialized(): boolean { return this.initialized; }

  dispose(): void {
    this.synth?.dispose();
    this.reverb?.dispose();
    this.vibrato?.dispose();
    this.synth = null;
    this.reverb = null;
    this.vibrato = null;
    this.initialized = false;
    this.initializationPromise = null;
  }
}

export const audioService = new AudioService();
