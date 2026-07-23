import { ArrowRight, BarChart3, Check, Headphones, Mic, RotateCcw, SkipForward, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  centsFromTarget,
  coachPitch,
  FIRST_POSITION_ORBIT,
  selectRescueNotes,
  type IntonationAttempt,
  type IntonationTarget,
} from '../features/intonation/intonationEngine';
import { audioService } from '../services/audioService';
import { pitchDetectionService } from '../services/pitchDetectionService';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

type CoachPhase = 'ready' | 'listening' | 'rescue' | 'complete' | 'error';

export default function IntonationCoachPage() {
  const [searchParams] = useSearchParams();
  const fromPlan = searchParams.get('from') === 'plan';
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const recordPracticeSession = useAppStore((state) => state.recordPracticeSession);
  const [phase, setPhase] = useState<CoachPhase>('ready');
  const [targets, setTargets] = useState<IntonationTarget[]>(FIRST_POSITION_ORBIT);
  const [index, setIndex] = useState(0);
  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const [cents, setCents] = useState(0);
  const [attempts, setAttempts] = useState<IntonationAttempt[]>([]);
  const [holdProgress, setHoldProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const startedAtRef = useRef(Date.now());
  const stableSinceRef = useRef<number | null>(null);
  const struggleFramesRef = useRef(0);
  const bestCentsRef = useRef(50);
  const advancingRef = useRef(false);
  const attemptsRef = useRef<IntonationAttempt[]>([]);
  const target = targets[index];
  const phaseRef = useRef<CoachPhase>(phase);
  const targetsRef = useRef<IntonationTarget[]>(targets);
  const indexRef = useRef(index);
  const targetRef = useRef<IntonationTarget>(target);
  phaseRef.current = phase;
  targetsRef.current = targets;
  indexRef.current = index;
  targetRef.current = target;

  const completedNotes = phase === 'rescue'
    ? FIRST_POSITION_ORBIT.length + index
    : Math.min(index, FIRST_POSITION_ORBIT.length);
  const totalNotes = phase === 'rescue' ? FIRST_POSITION_ORBIT.length + targets.length : FIRST_POSITION_ORBIT.length;

  const accuracy = useMemo(() => {
    if (!attempts.length) return 0;
    return Math.round((attempts.filter((attempt) => attempt.passed).length / attempts.length) * 100);
  }, [attempts]);

  const resetTargetTracking = () => {
    stableSinceRef.current = null;
    struggleFramesRef.current = 0;
    bestCentsRef.current = 50;
    advancingRef.current = false;
    setDetectedNote(null);
    setCents(0);
    setHoldProgress(0);
  };

  const finishSession = (finalAttempts: IntonationAttempt[]) => {
    pitchDetectionService.stop();
    const passed = finalAttempts.filter((attempt) => attempt.passed).length;
    const hardestNotes = [...finalAttempts]
      .sort((left, right) => right.struggleFrames - left.struggleFrames)
      .slice(0, 3)
      .map((attempt) => attempt.note);
    recordPracticeSession({
      profileId: activeProfileId,
      startedAt: new Date(startedAtRef.current).toISOString(),
      durationSeconds: Math.max(60, Math.round((Date.now() - startedAtRef.current) / 1000)),
      activity: 'trainer',
      title: 'Intonation Coach: First-position orbit',
      notesPlayed: finalAttempts.length,
      correctNotes: passed,
      accuracy: Math.round((passed / Math.max(1, finalAttempts.length)) * 100),
      hardestNotes,
      completed: true,
      intonationDetails: finalAttempts.map((attempt, attemptIndex) => {
        const noteTarget = FIRST_POSITION_ORBIT.find((candidate) => candidate.note === attempt.note)
          ?? FIRST_POSITION_ORBIT[0];
        return {
          note: attempt.note,
          string: noteTarget.string,
          finger: noteTarget.finger,
          cents: attempt.cents,
          struggleFrames: attempt.struggleFrames,
          passed: attempt.passed,
          phase: attemptIndex < FIRST_POSITION_ORBIT.length ? 'flight' : 'rescue',
        };
      }),
    });
    phaseRef.current = 'complete';
    setPhase('complete');
  };

  const advance = (passed: boolean, finalCents: number) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    const activeTarget = targetRef.current;
    const nextAttempt: IntonationAttempt = {
      note: activeTarget.note,
      cents: finalCents,
      struggleFrames: struggleFramesRef.current,
      passed,
    };
    const nextAttempts = [...attemptsRef.current, nextAttempt];
    attemptsRef.current = nextAttempts;
    setAttempts(nextAttempts);

    window.setTimeout(() => {
      if (indexRef.current + 1 < targetsRef.current.length) {
        const nextIndex = indexRef.current + 1;
        indexRef.current = nextIndex;
        targetRef.current = targetsRef.current[nextIndex];
        setIndex(nextIndex);
        resetTargetTracking();
        return;
      }

      if (phaseRef.current === 'listening') {
        const rescueTargets = selectRescueNotes(nextAttempts);
        targetsRef.current = rescueTargets;
        targetRef.current = rescueTargets[0];
        indexRef.current = 0;
        phaseRef.current = 'rescue';
        setTargets(rescueTargets);
        setIndex(0);
        setPhase('rescue');
        resetTargetTracking();
        return;
      }

      finishSession(nextAttempts);
    }, passed ? 500 : 150);
  };

  const start = async () => {
    startedAtRef.current = Date.now();
    phaseRef.current = 'listening';
    setPhase('listening');
    try {
      await pitchDetectionService.start((noteName, frequency) => {
        if (advancingRef.current) return;
        const activeTarget = targetRef.current;
        const nextCents = centsFromTarget(frequency, activeTarget.frequency);
        const samePitch = noteName === activeTarget.note;
        setDetectedNote(noteName);
        setCents(Math.max(-50, Math.min(50, nextCents)));

        if (!samePitch || Math.abs(nextCents) > 12) {
          stableSinceRef.current = null;
          struggleFramesRef.current += 1;
          setHoldProgress(0);
          return;
        }

        bestCentsRef.current = Math.min(bestCentsRef.current, Math.abs(nextCents));
        const now = performance.now();
        stableSinceRef.current ??= now;
        const progress = Math.min(100, Math.round(((now - stableSinceRef.current) / 700) * 100));
        setHoldProgress(progress);
        if (progress >= 100) advance(true, nextCents);
      });
    } catch {
      setErrorMessage('Microphone access is needed for live pitch coaching. Allow access, then try again.');
      phaseRef.current = 'error';
      setPhase('error');
    }
  };

  const restart = () => {
    pitchDetectionService.stop();
    attemptsRef.current = [];
    setAttempts([]);
    setTargets(FIRST_POSITION_ORBIT);
    setIndex(0);
    targetsRef.current = FIRST_POSITION_ORBIT;
    targetRef.current = FIRST_POSITION_ORBIT[0];
    indexRef.current = 0;
    phaseRef.current = 'ready';
    setPhase('ready');
    resetTargetTracking();
  };

  const playTarget = async () => {
    await audioService.initialize();
    audioService.playNote(target.note, '2n');
  };

  useEffect(() => () => pitchDetectionService.stop(), []);

  if (phase === 'complete') {
    const hardest = [...attempts].sort((a, b) => b.struggleFrames - a.struggleFrames)[0];
    return (
      <main className="min-h-screen bg-[#090617] px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-purple-400/30 bg-gradient-to-br from-purple-950 to-slate-950 p-8 text-center shadow-2xl sm:p-12">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-400 text-slate-950 shadow-[0_0_50px_rgba(52,211,153,0.45)]">
            <Check size={42} aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-purple-300">Orbit complete</p>
          <h1 className="mt-2 text-5xl font-black">{accuracy}% centered</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            {hardest ? `${hardest.note} needed the most adjustment, so it has been saved as a focus note.` : 'Your first-position notes stayed centered.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {fromPlan ? (
              <Link to="/practice-plan" className="btn-primary bg-amber-300 text-purple-950 hover:bg-amber-200">
                Continue daily plan <ArrowRight size={18} />
              </Link>
            ) : null}
            <Link to="/intonation-insights" className="btn-primary bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              View pitch fingerprint <BarChart3 size={18} />
            </Link>
            <button type="button" onClick={restart} className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">
              <RotateCcw size={18} /> Fly again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#090617] px-4 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true" style={{
        backgroundImage: 'radial-gradient(circle at 20% 15%, rgba(168,85,247,.22), transparent 28%), radial-gradient(circle at 80% 60%, rgba(34,211,238,.16), transparent 25%)',
      }} />
      <div className="relative mx-auto max-w-5xl">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">Pitch Orbit</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">Land every note in tune</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Play the target note, steer it into the center, and hold it steady. Your most difficult notes return in a personal rescue loop.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{phase === 'rescue' ? 'Rescue loop' : 'Flight path'}</p>
            <p className="mt-1 text-2xl font-black">{completedNotes}/{totalNotes}</p>
          </div>
        </header>

        <div className="mt-7 flex gap-2" aria-label={`${completedNotes} of ${totalNotes} notes complete`}>
          {Array.from({ length: totalNotes }, (_, noteIndex) => (
            <span key={noteIndex} className={`h-2 flex-1 rounded-full ${noteIndex < completedNotes ? 'bg-emerald-400' : noteIndex === completedNotes ? 'bg-cyan-300' : 'bg-white/10'}`} />
          ))}
        </div>

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">Finger mission</p>
            <div className="mt-5 flex items-center gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl text-4xl font-black text-slate-950" style={{ backgroundColor: target.color }}>
                {target.finger}
              </div>
              <div>
                <p className="text-5xl font-black">{target.note}</p>
                <p className="mt-1 text-slate-300">Finger {target.finger} on the {target.string} string</p>
              </div>
            </div>
            <button type="button" onClick={() => void playTarget()} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 font-bold hover:bg-white/15">
              <Headphones size={18} /> Hear target
            </button>
            <div className="mt-6 rounded-2xl bg-black/20 p-4">
              <p className="text-sm font-bold text-slate-300">Fingerboard compass</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Scroll</span><span>Bridge</span></div>
              <div className="relative mt-2 h-3 rounded-full bg-gradient-to-r from-purple-500 via-cyan-300 to-amber-300">
                <span className="absolute left-1/2 top-1/2 h-7 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow-[0_0_12px_white]" />
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] p-6 sm:p-8">
            <div className="relative mx-auto grid aspect-square max-w-[360px] place-items-center rounded-full border border-cyan-300/20 bg-black/20 shadow-[inset_0_0_80px_rgba(34,211,238,0.08)]">
              {[82, 62, 42].map((size) => (
                <span key={size} className="absolute rounded-full border border-white/10" style={{ width: `${size}%`, height: `${size}%` }} aria-hidden="true" />
              ))}
              <div
                className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 transition-transform duration-150 shadow-[0_0_40px_rgba(103,232,249,0.8)]"
                style={{ transform: `translate(calc(-50% + ${cents * 2.2}px), -50%) scale(${phase === 'listening' || phase === 'rescue' ? 1 : .75})` }}
                aria-hidden="true"
              />
              <div className="relative z-10 text-center">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Detected</p>
                <p className="mt-1 text-6xl font-black">{detectedNote ?? '—'}</p>
                <p className={`mt-2 text-xl font-black ${Math.abs(cents) <= 8 && detectedNote === target.note ? 'text-emerald-300' : 'text-cyan-200'}`}>
                  {detectedNote ? `${cents > 0 ? '+' : ''}${cents} cents` : 'Play when ready'}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-black/25 p-4 text-center" aria-live="polite">
              <p className="font-bold">
                {detectedNote && detectedNote !== target.note
                  ? `Find ${target.note}—you are playing ${detectedNote}.`
                  : detectedNote ? coachPitch(cents, target) : 'The coach will guide your finger after it hears you.'}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-emerald-400 transition-all" style={{ width: `${holdProgress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-400">Hold the center for 0.7 seconds</p>
            </div>

            {phase === 'ready' || phase === 'error' ? (
              <button type="button" onClick={() => void start()} className="btn-primary mt-5 w-full justify-center bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <Mic size={19} /> Start listening
              </button>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={restart} className="btn-secondary justify-center border-white/15 bg-white/10 text-white hover:bg-white/15">
                  <RotateCcw size={17} /> Restart
                </button>
                <button type="button" onClick={() => advance(false, cents)} className="btn-secondary justify-center border-white/15 bg-white/10 text-white hover:bg-white/15">
                  <SkipForward size={17} /> Skip note
                </button>
              </div>
            )}
            {errorMessage ? <p className="mt-4 rounded-xl bg-red-400/15 p-3 text-sm text-red-100">{errorMessage}</p> : null}
          </div>
        </section>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4 text-sm text-purple-100">
          <Sparkles className="shrink-0 text-amber-300" size={20} />
          <p><strong>Creative coaching:</strong> each wobble teaches the rescue loop what to repeat, while centered notes graduate automatically.</p>
        </div>
      </div>
    </main>
  );
}
