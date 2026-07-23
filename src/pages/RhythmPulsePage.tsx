import { ArrowRight, CheckCircle2, Clock3, Mic, RefreshCcw, TimerReset } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buildExpectedBeats, matchDetectedOnsets, RHYTHM_PULSE_PATTERNS, summarizePulse, type RhythmPulsePattern } from '../features/rhythm/rhythmPulse';
import { audioAnalysisService } from '../services/audioAnalysisService';
import { audioService } from '../services/audioService';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

type RhythmPhase = 'ready' | 'count-in' | 'listening' | 'summary' | 'error';

const COUNT_IN_BEATS = 2;
const PATTERN_BEATS = 8;

export default function RhythmPulsePage() {
  const navigate = useNavigate();
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const calibration = useAppStore((state) => state.audioCalibrationByProfile[activeProfileId]);
  const recordPracticeSession = useAppStore((state) => state.recordPracticeSession);

  const [phase, setPhase] = useState<RhythmPhase>('ready');
  const [bpm, setBpm] = useState(calibration?.recommendedTempo ?? 72);
  const [pattern, setPattern] = useState<RhythmPulsePattern>(RHYTHM_PULSE_PATTERNS[0]);
  const [beatIndex, setBeatIndex] = useState(0);
  const [detectedOnsets, setDetectedOnsets] = useState<number[]>([]);
  const [summaryText, setSummaryText] = useState('');
  const [beatFeedback, setBeatFeedback] = useState<string[]>([]);

  const phaseRef = useRef<RhythmPhase>('ready');
  const patternRef = useRef(pattern);
  const bpmRef = useRef(bpm);
  const beatTimerRef = useRef<number | null>(null);
  const countInTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const detectedRef = useRef<number[]>([]);
  const lastOnsetRef = useRef(0);
  const resultMatchesRef = useRef<ReturnType<typeof summarizePulse> | null>(null);
  const patternStartRef = useRef(0);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const stopTimers = () => {
    if (beatTimerRef.current !== null) {
      window.clearInterval(beatTimerRef.current);
      beatTimerRef.current = null;
    }
    if (countInTimerRef.current !== null) {
      window.clearTimeout(countInTimerRef.current);
      countInTimerRef.current = null;
    }
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  };

  useEffect(() => () => {
    stopTimers();
    audioAnalysisService.stop();
  }, []);

  const reset = () => {
    stopTimers();
    audioAnalysisService.stop();
    phaseRef.current = 'ready';
    setPhase('ready');
    setBeatIndex(0);
    setDetectedOnsets([]);
    setSummaryText('');
    setBeatFeedback([]);
    detectedRef.current = [];
    lastOnsetRef.current = 0;
    resultMatchesRef.current = null;
  };

  const finish = () => {
    stopTimers();
    audioAnalysisService.stop();
    const expected = buildExpectedBeats(
      patternRef.current,
      bpmRef.current,
      patternStartRef.current,
      calibration?.latencyOffsetMs ?? 0,
    );
    const summary = summarizePulse(matchDetectedOnsets(expected, detectedRef.current));
    resultMatchesRef.current = summary;
    const confidence = Math.max(0, Math.min(100, summary.score));
    const sessionTitle = `Rhythm Pulse: ${patternRef.current.name}`;

    recordPracticeSession({
      profileId: activeProfileId,
      startedAt: new Date(patternStartRef.current).toISOString(),
      durationSeconds: Math.max(60, Math.round((performance.now() - patternStartRef.current) / 1000)),
      activity: 'trainer',
      title: sessionTitle,
      notesPlayed: summary.totalTaps,
      correctNotes: summary.centeredTaps,
      accuracy: confidence,
      hardestNotes: summary.rescueBeatIndexes.map((index) => `Beat ${index + 1}`),
      completed: true,
      calibrationId: calibration?.id,
      rhythmDetails: {
        patternId: patternRef.current.id,
        patternName: patternRef.current.name,
        bpm: bpmRef.current,
        beatDurationMs: Math.round(60000 / bpmRef.current),
        latencyOffsetMs: calibration?.latencyOffsetMs ?? 0,
        matchToleranceMs: 140,
        beatResults: summary.beatMatches,
      },
    });

    setBeatFeedback(summary.beatMatches.map((match) => (
      match.quality === 'missed'
        ? `Beat ${match.beatIndex + 1}: missed`
        : `Beat ${match.beatIndex + 1}: ${match.quality} by ${Math.abs(match.deltaMs ?? 0)} ms`
    )));
    setSummaryText(`You centered ${summary.centeredTaps} of ${summary.totalTaps} taps. The rescue loop found beats ${summary.rescueBeatIndexes.map((beat) => beat + 1).join(', ') || 'none'}.`);
    setPhase('summary');
    phaseRef.current = 'summary';
  };

  const startPulse = async () => {
    try {
      stopTimers();
      detectedRef.current = [];
      setDetectedOnsets([]);
      setBeatFeedback([]);
      setBeatIndex(0);
      setSummaryText('');
      lastOnsetRef.current = 0;

      const beatDuration = 60000 / bpmRef.current;
      patternStartRef.current = performance.now() + (COUNT_IN_BEATS * beatDuration);
      phaseRef.current = 'count-in';
      setPhase('count-in');

      await audioService.initialize();
      await audioAnalysisService.start((frame) => {
        if (phaseRef.current !== 'listening') return;
        const noiseFloor = calibration?.noiseRms ?? 0.012;
        const threshold = Math.max(noiseFloor * 3, 0.03);
        const rise = frame.rms - (detectedRef.current.length ? 0.01 : noiseFloor);
        if (frame.rms > threshold && rise > 0.008 && frame.timestampMs - lastOnsetRef.current > 200) {
          lastOnsetRef.current = frame.timestampMs;
          detectedRef.current = [...detectedRef.current, frame.timestampMs];
          setDetectedOnsets(detectedRef.current);
        }
      });

      beatTimerRef.current = window.setInterval(() => {
        void audioService.playNote('C7', '32n');
        setBeatIndex((current) => current + 1);
      }, beatDuration);

      countInTimerRef.current = window.setTimeout(() => {
        phaseRef.current = 'listening';
        setPhase('listening');
        setBeatIndex(0);
      }, COUNT_IN_BEATS * beatDuration);

      finishTimerRef.current = window.setTimeout(() => {
        finish();
      }, (COUNT_IN_BEATS + PATTERN_BEATS) * beatDuration + 700);
    } catch {
      stopTimers();
      audioAnalysisService.stop();
      phaseRef.current = 'error';
      setPhase('error');
    }
  };

  const currentCalibration = useMemo(() => {
    if (!calibration) return 'No calibration yet';
    return `${calibration.confidence}% confidence, offset ${calibration.latencyOffsetMs} ms`;
  }, [calibration]);

  const beatDuration = Math.round(60000 / bpm);

  const runRescueLoop = () => {
    if (!resultMatchesRef.current?.rescueBeatIndexes.length) {
      void startPulse();
      return;
    }

    const nextPattern: RhythmPulsePattern = {
      ...pattern,
      id: `${pattern.id}-rescue`,
      name: `${pattern.name} Rescue`,
      description: 'A targeted loop that isolates the hardest beats.',
      slots: pattern.slots.map((slot, index) => (resultMatchesRef.current?.rescueBeatIndexes.includes(index) ? slot : 'rest')),
      recommendedTempo: Math.max(48, bpm - 12),
    };

    patternRef.current = nextPattern;
    bpmRef.current = nextPattern.recommendedTempo;
    setPattern(nextPattern);
    setBpm(nextPattern.recommendedTempo);
    void startPulse();
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc_0%,#fffdf8_45%,#eef2ff_100%)] px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-700">Phase 1 preview</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Rhythm Pulse</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Tap the pattern in time, let the mic measure the attack, and use your calibration so timing bias does not get in the way.
            </p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Calibration</p>
            <p className="mt-2 text-2xl font-black">{currentCalibration}</p>
          </div>
        </div>

        {!calibration ? (
          <div className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <div className="flex items-start gap-3">
              <Mic size={20} className="mt-1 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-lg font-black">Calibrate first for the cleanest score</p>
                <p className="mt-1 text-sm leading-6">
                  We can still practice without it, but the timing offset is what turns this into a fair rhythm lab. If you have not done the mic check yet, start there.
                </p>
                <Link to="/audio-check" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 font-black text-slate-950 hover:bg-amber-200">
                  Open mic calibration <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-700">Choose a pattern</p>
                <h2 className="mt-2 text-2xl font-black">Build timing confidence one grid at a time</h2>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-bold text-slate-600">
                {phase === 'count-in' ? 'Count-in' : phase === 'listening' ? 'Listening' : phase === 'summary' ? 'Summary' : 'Ready'}
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {RHYTHM_PULSE_PATTERNS.map((item) => {
                const active = item.id === pattern.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (phase === 'ready' || phase === 'summary' || phase === 'error') setPattern(item);
                    }}
                    className={`rounded-3xl border p-4 text-left transition ${
                      active ? 'border-purple-300 bg-purple-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-black">{item.name}</p>
                      <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-black text-white">{item.recommendedTempo} bpm</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Beat rail</p>
                  <p className="mt-1 text-xl font-black">{phase === 'summary' ? 'Your last run' : `${pattern.name} at ${bpm} bpm`}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">Beat duration</p>
                  <p className="text-2xl font-black">{beatDuration} ms</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-8 gap-2">
                {Array.from({ length: PATTERN_BEATS }, (_, index) => {
                  const slot = pattern.slots[index];
                  const hit = phase === 'summary'
                    ? resultMatchesRef.current?.beatMatches.find((match) => match.beatIndex === index)
                    : undefined;
                  const activeBeat = phase === 'listening' && index === beatIndex;
                  const className = slot === 'rest'
                    ? 'border-dashed border-white/15 bg-white/5 text-white/45'
                    : activeBeat
                      ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                      : hit?.quality === 'centered'
                        ? 'border-emerald-300 bg-emerald-400 text-slate-950'
                        : hit?.quality === 'missed'
                          ? 'border-rose-300 bg-rose-500 text-white'
                          : 'border-white/20 bg-white/10 text-white';

                  return (
                    <div key={index} className={`grid h-16 place-items-center rounded-2xl border text-sm font-black ${className}`}>
                      {slot === 'rest' ? 'Rest' : index + 1}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/15 px-3 py-1">Detected onsets {detectedOnsets.length}</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Latency offset {calibration?.latencyOffsetMs ?? 0} ms</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Phase {phase}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {phase === 'ready' || phase === 'error' || phase === 'summary' ? (
                <button type="button" onClick={() => void startPulse()} className="btn-primary bg-purple-950 hover:bg-purple-900">
                  Start rhythm pulse <TimerReset size={18} aria-hidden="true" />
                </button>
              ) : null}
              {phase === 'summary' ? (
                <button type="button" onClick={runRescueLoop} className="btn-secondary border-stone-200 bg-stone-100 text-slate-800 hover:bg-stone-200">
                  Run rescue loop <RefreshCcw size={16} aria-hidden="true" />
                </button>
              ) : null}
              <button type="button" onClick={() => navigate('/practice-plan')} className="btn-secondary border-stone-200 bg-stone-100 text-slate-800 hover:bg-stone-200">
                Back to plan
              </button>
              {phase === 'summary' ? (
                <button type="button" onClick={reset} className="btn-secondary border-stone-200 bg-stone-100 text-slate-800 hover:bg-stone-200">
                  Reset
                </button>
              ) : null}
            </div>

            {phase === 'count-in' ? (
              <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Count-in</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  Get ready. Two clicks, then the pattern starts. Keep the bow or finger action short and clean.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  {Array.from({ length: COUNT_IN_BEATS }, (_, index) => (
                    <span
                      key={index}
                      className={`grid h-12 w-12 place-items-center rounded-full border text-sm font-black ${
                        index < beatIndex ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : 'border-stone-200 bg-white text-slate-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {phase === 'summary' ? (
              <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Pulse result</p>
                <p className="mt-2 text-lg font-semibold text-emerald-950">{summaryText}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm">
                    <p className="text-slate-500">Timing score</p>
                    <p className="text-2xl font-black text-emerald-700">{resultMatchesRef.current?.score ?? 0}%</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm">
                    <p className="text-slate-500">Average delta</p>
                    <p className="text-2xl font-black text-slate-900">{resultMatchesRef.current?.averageDeltaMs ?? 0} ms</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm">
                    <p className="text-slate-500">Spread</p>
                    <p className="text-2xl font-black text-slate-900">{resultMatchesRef.current?.timingSpreadMs ?? 0} ms</p>
                  </div>
                </div>
                {beatFeedback.length ? (
                  <div className="mt-4 grid gap-2 text-sm text-emerald-950">
                    {beatFeedback.map((line) => <p key={line} className="rounded-xl bg-white px-3 py-2">{line}</p>)}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-700">Pattern tips</p>
                  <h2 className="mt-2 text-2xl font-black">Play short, then release</h2>
                </div>
                <Clock3 className="text-purple-700" aria-hidden="true" />
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} aria-hidden="true" />Attack the note cleanly on each illuminated beat.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} aria-hidden="true" />If a beat is missed, the rescue loop will isolate it for the next run.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} aria-hidden="true" />Your calibration offset is subtracted before we score the timing.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 to-purple-950 p-6 text-white shadow-xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Tempo control</p>
              <h2 className="mt-2 text-2xl font-black">{bpm} bpm</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {profile.name} can start with {calibration?.recommendedTempo ?? pattern.recommendedTempo} bpm, then speed up as the taps stay centered.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[60, 72, 84, 96].map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => phase === 'ready' && setBpm(choice)}
                    className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                      bpm === choice ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {phase === 'ready' ? (
                <button
                  type="button"
                  onClick={() => {
                    setBpm(calibration?.recommendedTempo ?? pattern.recommendedTempo);
                    bpmRef.current = calibration?.recommendedTempo ?? pattern.recommendedTempo;
                  }}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-4 py-2 font-black text-white hover:bg-white/15"
                >
                  Use recommended tempo
                </button>
              ) : null}
              <button type="button" onClick={() => navigate('/audio-check')} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 font-black text-slate-950 hover:bg-amber-200">
                Recheck mic <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
