import { CheckCircle2, Clock3, Headphones, Target, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleLessons } from '../data/lessons';
import { buildDailyPlan } from '../features/practicePlan/planEngine';
import { audioService } from '../services/audioService';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import type { DiagnosticDimension, DiagnosticResult } from '../types';

interface DiagnosticQuestion {
  dimension: DiagnosticDimension;
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
  audioNotes?: string[];
}

const questions: DiagnosticQuestion[] = [
  { dimension: 'pitch', prompt: 'Which open string did you hear?', options: ['G', 'D', 'A', 'E'], correct: 'G', explanation: 'G3 is the violin’s lowest open string.', audioNotes: ['G3'] },
  { dimension: 'pitch', prompt: 'Did the second note move higher or lower?', options: ['Higher', 'Lower', 'Same'], correct: 'Higher', explanation: 'D4 to A4 moves upward by a perfect fifth.', audioNotes: ['D4', 'A4'] },
  { dimension: 'rhythm', prompt: 'How many quarter-note beats are in a 4/4 measure?', options: ['2', '3', '4', '8'], correct: '4', explanation: 'The top number tells us there are four beats.' },
  { dimension: 'rhythm', prompt: 'Two eighth notes last as long as…', options: ['One quarter note', 'One half note', 'One whole note'], correct: 'One quarter note', explanation: 'Each eighth note is half of one quarter-note beat.' },
  { dimension: 'reading', prompt: 'What note is first finger on the A string in the usual beginner pattern?', options: ['A', 'B', 'C', 'D'], correct: 'B', explanation: 'First finger sits a whole step above open A.' },
  { dimension: 'reading', prompt: 'Which note is the highest open violin string?', options: ['G3', 'D4', 'A4', 'E5'], correct: 'E5', explanation: 'E5 is the highest of the four open strings.' },
];

export default function DiagnosticPage() {
  const navigate = useNavigate();
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const sessions = useAppStore((state) => state.practiceSessions);
  const saveDiagnosticResult = useAppStore((state) => state.saveDiagnosticResult);
  const saveDailyPracticePlan = useAppStore((state) => state.saveDailyPracticePlan);
  const [targetMinutes, setTargetMinutes] = useState<10 | 15 | 20>(15);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [correctByDimension, setCorrectByDimension] = useState<Record<DiagnosticDimension, number>>({
    pitch: 0,
    rhythm: 0,
    reading: 0,
  });
  const question = questions[index];
  const progress = Math.round(((index + (answer ? 1 : 0)) / questions.length) * 100);
  const lessonTitles = useMemo(
    () => Object.fromEntries(sampleLessons.map((lesson) => [lesson.id, lesson.title])),
    [],
  );

  const playCue = async () => {
    if (!question.audioNotes) return;
    await audioService.initialize();
    for (const note of question.audioNotes) {
      audioService.playNote(note, '8n');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const choose = (option: string) => {
    if (answer) return;
    setAnswer(option);
    if (option === question.correct) {
      setCorrectByDimension((current) => ({
        ...current,
        [question.dimension]: current[question.dimension] + 1,
      }));
    }
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((current) => current + 1);
      setAnswer(null);
      return;
    }
    const result: DiagnosticResult = {
      id: `diagnostic_${profile.id}_${Date.now()}`,
      profileId: profile.id,
      completedAt: new Date().toISOString(),
      targetMinutes,
      scores: {
        pitch: Math.round((correctByDimension.pitch / 2) * 100),
        rhythm: Math.round((correctByDimension.rhythm / 2) * 100),
        reading: Math.round((correctByDimension.reading / 2) * 100),
      },
    };
    saveDiagnosticResult(result);
    saveDailyPracticePlan(buildDailyPlan({ profile, diagnostic: result, sessions, lessonTitles }));
    navigate('/practice-plan', { replace: true });
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-4 py-10 text-slate-950">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] bg-purple-950 p-7 text-white shadow-xl sm:p-10">
            <Target className="text-amber-300" size={42} aria-hidden="true" />
            <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-purple-200">First-session diagnostic</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">Build today’s practice around you</h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-purple-100">
              Six quick listening, rhythm, and note-reading questions create a focused daily plan. This is a starting point, not an exam.
            </p>
          </div>

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">How much time can you really practice today?</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {([10, 15, 20] as const).map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setTargetMinutes(minutes)}
                  aria-pressed={targetMinutes === minutes}
                  className={`min-h-20 rounded-2xl border-2 font-black ${targetMinutes === minutes ? 'border-purple-700 bg-purple-50 text-purple-950' : 'border-stone-200 text-slate-600'}`}
                >
                  <Clock3 className="mx-auto mb-1" size={19} aria-hidden="true" /> {minutes} min
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setStarted(true)} className="btn-primary mt-6 w-full justify-center bg-purple-950 hover:bg-purple-900">
              Start the 3-minute diagnostic
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between text-sm font-bold text-slate-500">
          <span className="capitalize">{question.dimension} check</span>
          <span>{index + 1} of {questions.length}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200" aria-label={`${progress}% complete`}>
          <div className="h-full bg-purple-700 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
          <h1 className="text-3xl font-black">{question.prompt}</h1>
          {question.audioNotes && (
            <button type="button" onClick={() => void playCue()} className="btn-secondary mt-5">
              <Headphones size={18} aria-hidden="true" /> Play listening example
            </button>
          )}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => {
              const selected = answer === option;
              const isCorrect = Boolean(answer) && option === question.correct;
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => choose(option)}
                  disabled={Boolean(answer)}
                  className={`min-h-14 rounded-xl border-2 px-4 py-3 text-left font-bold ${isCorrect ? 'border-emerald-500 bg-emerald-50' : selected ? 'border-amber-500 bg-amber-50' : 'border-stone-200 hover:border-purple-300'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {answer && (
            <div className={`mt-6 rounded-2xl p-4 ${answer === question.correct ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'}`} aria-live="polite">
              <p className="flex items-center gap-2 font-black">
                {answer === question.correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                {answer === question.correct ? 'Correct' : `Answer: ${question.correct}`}
              </p>
              <p className="mt-1 text-sm">{question.explanation}</p>
              <button type="button" onClick={next} className="btn-primary mt-4 bg-purple-950 hover:bg-purple-900">
                {index < questions.length - 1 ? 'Next question' : 'Create my daily plan'}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
