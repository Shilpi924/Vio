import { AlertTriangle, ArrowRight, CheckCircle2, Mic, Music2, TimerReset, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buildCalibrationSummary, type AudioFrameSnapshot, type LatencyObservation } from '../features/audio/audioCalibration';
import { audioAnalysisService } from '../services/audioAnalysisService';
import { audioService } from '../services/audioService';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

type CalibrationPhase = 'ready' | 'room' | 'signal' | 'latency' | 'complete' | 'error';

const ROOM_SAMPLE_MS = 4200;
const SIGNAL_SAMPLE_MS = 5200;
const LATENCY_TAPS = 4;
const LATENCY_BEAT_MS = 600;

export default function AudioCheckPage() {
  const navigate = useNavigate();
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const calibration = useAppStore((state) => state.audioCalibrationByProfile[activeProfileId]);
  const saveCalibration = useAppStore((state) => state.saveAudioCalibrationResult);

  const [phase, setPhase] = useState<CalibrationPhase>('ready');
  const [statusMessage, setStatusMessage] = useState('Allow the microphone, then read the room and play the open A string.');
  const [liveRms, setLiveRms] = useState(0);
  const [livePeak, setLivePeak] = useState(0);
  const [roomFrames, setRoomFrames] = useState<AudioFrameSnapshot[]>([]);
  const [signalFrames, setSignalFrames] = useState<AudioFrameSnapshot[]>([]);
  const [latencyObservations, setLatencyObservations] = useState<LatencyObservation[]>([]);
  const [latencyBeat, setLatencyBeat] = useState(0);
  const [resultMessage, setResultMessage] = useState('');

  const phaseRef = useRef<CalibrationPhase>('ready');
  const stageStartRef = useRef(0);
  const lastOnsetRef = useRef(0);
  const roomNoiseFloorRef = useRef(0.012);
  const signalPeakRef = useRef(0);
  const latencyStartRef = useRef(0);
  const latencyTimerRef = useRef<number | null>(null);
  const beatTimerRef = useRef<number | null>(null);

  const cleanupTimers = () => {
    if (latencyTimerRef.current !== null) {
      window.clearTimeout(latencyTimerRef.current);
      latencyTimerRef.current = null;
    }
    if (beatTimerRef.current !== null) {
      window.clearInterval(beatTimerRef.current);
      beatTimerRef.current = null;
    }
  };

  useEffect(() => () => {
    cleanupTimers();
    audioAnalysisService.stop();
  }, []);

  const restart = () => {
    cleanupTimers();
    audioAnalysisService.stop();
    phaseRef.current = 'ready';
    setPhase('ready');
    setStatusMessage('Allow the microphone, then read the room and play the open A string.');
    setLiveRms(0);
    setLivePeak(0);
    setRoomFrames([]);
    setSignalFrames([]);
    setLatencyObservations([]);
    setLatencyBeat(0);
    setResultMessage('');
    roomNoiseFloorRef.current = 0.012;
    signalPeakRef.current = 0;
    lastOnsetRef.current = 0;
  };

  const startLatencyPulse = async () => {
    cleanupTimers();
    phaseRef.current = 'latency';
    setPhase('latency');
    setStatusMessage('Tap or pluck on each click. We will apply your timing offset automatically.');
    setLatencyBeat(0);
    setLatencyObservations([]);
    latencyStartRef.current = performance.now();

    await audioService.initialize();
    beatTimerRef.current = window.setInterval(() => {
      void audioService.playNote('C7', '32n');
    }, LATENCY_BEAT_MS);

    latencyTimerRef.current = window.setTimeout(() => {
      if (beatTimerRef.current !== null) window.clearInterval(beatTimerRef.current);
      beatTimerRef.current = null;
    }, LATENCY_TAPS * LATENCY_BEAT_MS + 1200);
  };

  const finishCalibration = () => {
    cleanupTimers();
    audioAnalysisService.stop();
    const summary = buildCalibrationSummary({
      noiseFrames: roomFrames,
      signalFrames,
      latencyObservations,
    });
    const completedAt = new Date().toISOString();
    const id = `audio_${activeProfileId}_${Date.now()}`;
    const browserInfo = navigator as Navigator & { userAgentData?: { platform?: string } };
    saveCalibration({
      id,
      schemaVersion: 1,
      profileId: activeProfileId,
      completedAt,
      browserLabel: browserInfo.userAgentData?.platform ?? navigator.platform ?? 'Browser',
      sampleRate: audioAnalysisService.getSampleRate(),
      noiseRms: summary.noiseRms,
      signalRms: summary.signalRms,
      signalToNoiseDb: summary.signalToNoiseDb,
      clippingRate: summary.clippingRate,
      latencyOffsetMs: summary.latencyOffsetMs,
      recommendedTempo: summary.recommendedTempo,
      confidence: summary.confidence,
      status: summary.status,
      notes: summary.notes,
    });
    setPhase('complete');
    setResultMessage(`Saved a ${summary.confidence}% calibration. Rhythm scoring will subtract ${summary.latencyOffsetMs} ms.`);
    setStatusMessage(summary.status === 'ready'
      ? 'Your microphone is ready for rhythm work.'
      : 'Your microphone is usable, but a stronger signal will improve timing accuracy.');
  };

  const handleFrame = (frame: AudioFrameSnapshot) => {
    setLiveRms(frame.rms);
    setLivePeak(frame.peak);

    const now = frame.timestampMs;
    const phaseStart = stageStartRef.current;
    const elapsed = now - phaseStart;
    const onsetThreshold = Math.max(roomNoiseFloorRef.current * 3, 0.03);
    const rise = frame.rms - liveRms;

    if (phaseRef.current === 'room') {
      setRoomFrames((value) => [...value, frame]);
      roomNoiseFloorRef.current = roomNoiseFloorRef.current * 0.95 + frame.rms * 0.05;
      if (elapsed >= ROOM_SAMPLE_MS) {
        phaseRef.current = 'signal';
        setPhase('signal');
        stageStartRef.current = performance.now();
        setStatusMessage('Play one clear open A string and let it ring. We are listening for real signal strength.');
      }
      return;
    }

    if (phaseRef.current === 'signal') {
      setSignalFrames((value) => [...value, frame]);
      signalPeakRef.current = Math.max(signalPeakRef.current, frame.rms);
      if (elapsed >= SIGNAL_SAMPLE_MS) {
        void startLatencyPulse();
      }
      return;
    }

    if (phaseRef.current !== 'latency') return;

    if (frame.rms > onsetThreshold && rise > 0.012 && now - lastOnsetRef.current > 220) {
      lastOnsetRef.current = now;
      setLatencyObservations((current) => {
        if (current.length >= LATENCY_TAPS) return current;
        const observed = now - latencyStartRef.current;
        const next = [...current, {
          expectedMs: (current.length + 1) * LATENCY_BEAT_MS,
          detectedMs: observed,
        }];
        if (next.length >= LATENCY_TAPS) {
          window.setTimeout(finishCalibration, 350);
        }
        return next;
      });
      setLatencyBeat((value) => Math.min(LATENCY_TAPS, value + 1));
    }
  };

  const startCalibration = async () => {
    try {
      cleanupTimers();
      setRoomFrames([]);
      setSignalFrames([]);
      setLatencyObservations([]);
      setLatencyBeat(0);
      setResultMessage('');
      roomNoiseFloorRef.current = 0.012;
      signalPeakRef.current = 0;
      lastOnsetRef.current = 0;
      stageStartRef.current = performance.now();
      phaseRef.current = 'room';
      setPhase('room');
      setStatusMessage('Stay silent for the room scan. We are learning your background noise first.');
      await audioService.initialize();
      await audioAnalysisService.start(handleFrame);
    } catch {
      cleanupTimers();
      audioAnalysisService.stop();
      phaseRef.current = 'error';
      setPhase('error');
      setStatusMessage('Microphone access is unavailable here. You can still use the text-only practice flow.');
    }
  };

  const calibrationStatus = useMemo(() => {
    if (!calibration) return 'Not calibrated yet';
    return `${calibration.confidence}% confidence · ${calibration.status.replace('-', ' ')}`;
  }, [calibration]);

  const signalPreview = Math.round(liveRms * 1000);
  const peakPreview = Math.round(livePeak * 1000);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#fffdf8_40%,#eef2ff_100%)] px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-700">Phase 0.1</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Mic calibration and timing offset</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              First we measure the room, then we listen to the violin, and finally we learn the timing offset so rhythm scoring feels fair.
            </p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Current status</p>
            <p className="mt-2 text-2xl font-black">{calibrationStatus}</p>
          </div>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-700">Calibration lane</p>
                <h2 className="mt-2 text-2xl font-black">Three quick checks, one reliable result</h2>
              </div>
              <button type="button" onClick={() => navigate('/rhythm-pulse')} className="btn-secondary border-stone-200 bg-stone-100 text-slate-800 hover:bg-stone-200">
                Open rhythm pulse <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  { id: 'room', title: '1. Room noise', body: 'Stay silent and let the mic learn the background.' },
                  { id: 'signal', title: '2. Signal strength', body: 'Play a clear open A string and watch the bar fill.' },
                  { id: 'latency', title: '3. Timing offset', body: 'Tap or pluck on each click to measure beat delay.' },
                ].map((step) => {
                  const active = phase === step.id;
                  const complete = step.id === 'room'
                    ? phase === 'signal' || phase === 'latency' || phase === 'complete'
                    : step.id === 'signal'
                      ? phase === 'latency' || phase === 'complete'
                      : phase === 'complete';
                  return (
                    <div
                      key={step.id}
                      className={`rounded-3xl border p-4 transition ${active ? 'border-purple-300 bg-purple-50' : complete ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 bg-stone-50'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-black">{step.title}</p>
                      {complete ? <CheckCircle2 size={18} className="text-emerald-600" aria-hidden="true" /> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Live meter</p>
                  <p className="mt-1 text-xl font-black">
                    {phase === 'room' ? 'Room scan running' : phase === 'signal' ? 'Listening for violin signal' : phase === 'latency' ? 'Listening for timing taps' : 'Ready when you are'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">RMS / peak</p>
                  <p className="text-2xl font-black">{signalPreview} / {peakPreview}</p>
                </div>
              </div>
              <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 transition-all" style={{ width: `${Math.min(100, Math.round(liveRms * 1100))}%` }} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/15 px-3 py-1">Noise floor {Math.round(roomNoiseFloorRef.current * 1000)}</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Latency taps {latencyObservations.length}/{LATENCY_TAPS}</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Beat echo {latencyBeat}/{LATENCY_TAPS}</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Calibration result {calibration ? `${calibration.confidence}%` : 'pending'}</span>
              </div>
            </div>

            {phase === 'ready' || phase === 'error' ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => void startCalibration()} className="btn-primary bg-purple-950 hover:bg-purple-900">
                  Start calibration <Mic size={18} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => navigate('/practice-plan')} className="btn-secondary border-stone-200 bg-stone-100 text-slate-800 hover:bg-stone-200">
                  Text-only practice plan
                </button>
              </div>
            ) : null}

            {phase !== 'ready' && phase !== 'error' ? (
              <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">What to do now</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{statusMessage}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {phase === 'room' && 'Keep quiet for a few seconds so we can learn the room noise floor.'}
                  {phase === 'signal' && 'Play the open A string with a confident start and a clean sustain.'}
                  {phase === 'latency' && 'Match the clicks with short note starts or body taps so we can measure the offset.'}
                </p>
              </div>
            ) : null}

            {phase === 'complete' ? (
              <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Saved</p>
                <p className="mt-2 text-lg font-semibold text-emerald-950">{resultMessage}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" onClick={() => navigate('/rhythm-pulse')} className="btn-primary bg-emerald-600 hover:bg-emerald-500">
                    Use this calibration <ArrowRight size={18} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={restart} className="btn-secondary border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-100">
                    Calibrate again
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-700">Why this matters</p>
                  <h2 className="mt-2 text-2xl font-black">Rhythm scores become much fairer</h2>
                </div>
                <TimerReset className="text-purple-700" aria-hidden="true" />
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li className="flex gap-3"><Volume2 className="mt-0.5 shrink-0 text-amber-600" size={18} aria-hidden="true" />We separate a quiet room from a weak input signal.</li>
                <li className="flex gap-3"><Music2 className="mt-0.5 shrink-0 text-emerald-600" size={18} aria-hidden="true" />We record the timing offset so early and late notes are judged against your setup, not a generic guess.</li>
                <li className="flex gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-rose-600" size={18} aria-hidden="true" />If the signal is too weak, the app can still keep you moving with a text-only plan.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 to-purple-950 p-6 text-white shadow-xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Current profile</p>
              <h2 className="mt-2 text-2xl font-black">{profile.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The calibration is saved to this profile, then reused by rhythm work so every practice session gets better the more you play.
              </p>
              <Link to="/statistics" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 font-black text-slate-950 hover:bg-amber-200">
                Review progress <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
