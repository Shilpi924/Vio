import { CheckCircle2, Headphones, RotateCcw, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { audioService } from '../services/audioService';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export interface TrainerItem {
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
  audioNotes?: string[];
}

interface SkillTrainerProps {
  title: string;
  description: string;
  skill: string;
  items: TrainerItem[];
}

export default function SkillTrainer({ title, description, skill, items }: SkillTrainerProps) {
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const recordPracticeSession = useAppStore((state) => state.recordPracticeSession);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());
  const item = items[index];

  const playCue = async () => {
    if (!item.audioNotes?.length) return;
    await audioService.initialize();
    for (const note of item.audioNotes) {
      audioService.playNote(note, '8n');
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
  };

  const choose = (option: string) => {
    if (answer) return;
    setAnswer(option);
    setAttempts((value) => value + 1);
    if (option === item.correct) setCorrect((value) => value + 1);
  };

  const next = () => {
    if (index + 1 < items.length) {
      setIndex((value) => value + 1);
      setAnswer(null);
      return;
    }

      const finalCorrect = correct;
    const durationSeconds = Math.max(30, Math.round((Date.now() - startedAt.current) / 1000));
    recordPracticeSession({
      profileId: activeProfileId,
      startedAt: new Date(startedAt.current).toISOString(),
      durationSeconds,
      activity: 'trainer',
      title,
      notesPlayed: Math.max(attempts, items.length),
      correctNotes: finalCorrect,
      accuracy: Math.round((finalCorrect / items.length) * 100),
      hardestNotes: [],
      completed: true,
    });
    setFinished(true);
  };

  const restart = () => {
    setIndex(0);
    setAnswer(null);
    setCorrect(0);
    setAttempts(0);
    setFinished(false);
    startedAt.current = Date.now();
  };

  if (finished) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-3xl bg-slate-950 p-8 text-center text-white shadow-xl">
          <CheckCircle2 className="mx-auto text-emerald-400" size={56} aria-hidden="true" />
          <p className="mt-5 text-sm font-bold uppercase tracking-widest text-purple-300">{skill} complete</p>
          <h1 className="mt-2 text-4xl font-black">{correct} of {items.length} correct</h1>
          <p className="mt-3 text-slate-300">This result has been added to your real practice history.</p>
          <button type="button" onClick={restart} className="btn-primary mt-7 bg-purple-600 hover:bg-purple-500">
            <RotateCcw size={18} aria-hidden="true" /> Practice again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-700">{skill}</p>
        <h1 className="mt-2 text-4xl font-black">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">{description}</p>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-stone-200" aria-label={`Question ${index + 1} of ${items.length}`}>
          <div className="h-full bg-purple-700 transition-all" style={{ width: `${((index + 1) / items.length) * 100}%` }} />
        </div>

        <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-500">Question {index + 1} of {items.length}</p>
              <h2 className="mt-2 text-2xl font-black">{item.prompt}</h2>
            </div>
            {item.audioNotes?.length ? (
              <button type="button" onClick={() => void playCue()} className="btn-secondary shrink-0" aria-label="Play listening example">
                <Headphones size={18} aria-hidden="true" /> Listen
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {item.options.map((option) => {
              const selected = answer === option;
              const correctOption = answer && option === item.correct;
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => choose(option)}
                  disabled={Boolean(answer)}
                  className={`min-h-14 rounded-xl border-2 px-4 py-3 text-left font-bold transition ${
                    correctOption ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : selected ? 'border-red-400 bg-red-50 text-red-900'
                      : 'border-stone-200 bg-stone-50 hover:border-purple-300'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {answer && (
            <div className={`mt-6 rounded-xl p-4 ${answer === item.correct ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'}`} aria-live="polite">
              <div className="flex items-center gap-2 font-black">
                {answer === item.correct ? <CheckCircle2 size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
                {answer === item.correct ? 'Correct' : `The answer is ${item.correct}`}
              </div>
              <p className="mt-1 text-sm leading-6">{item.explanation}</p>
              <button type="button" onClick={next} className="btn-primary mt-4 bg-purple-950 hover:bg-purple-900">
                {index + 1 < items.length ? 'Next question' : 'Finish practice'}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
