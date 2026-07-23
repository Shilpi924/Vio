import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserProfileStore } from '../store/useUserProfileStore';

const beginnerSteps = [
  { id: 'open-strings', title: 'Meet the four strings', description: 'Hear and identify G, D, A, and E.', duration: '8 min', path: '/lessons/open-strings' },
  { id: 'hand-positioning', title: 'Set up comfortably', description: 'Review safe, relaxed violin and left-hand setup.', duration: '7 min', path: '/hand-positioning', activity: true },
  { id: 'scales-g-major', title: 'Place your first fingers', description: 'Build a first-position G major pattern slowly.', duration: '10 min', path: '/lessons/scales-g-major' },
  { id: 'twinkle-twinkle', title: 'Play your first melody', description: 'Use guided feedback on a short, familiar tune.', duration: '12 min', path: '/lessons/twinkle-twinkle' },
  { id: 'mary-had-little-lamb', title: 'Strengthen note changes', description: 'Practice a second melody with steady rhythm.', duration: '12 min', path: '/lessons/mary-had-little-lamb' },
];

export default function BeginnerPath() {
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const completedLessons = profile?.completedLessons ?? [];
  const completedCount = beginnerSteps.filter((step) => completedLessons.includes(step.id)).length;
  const progress = Math.round((completedCount / beginnerSteps.length) * 100);

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">Beginner route</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">Your first five sessions</h1>
        <p className="mt-3 text-lg text-slate-600">A short, practical sequence. Lesson steps update only when you finish the guided activity.</p>

        <section className="mt-7 rounded-3xl bg-purple-950 p-6 text-white">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-purple-200">Completed lessons</p>
              <p className="mt-1 text-2xl font-bold">{completedCount} of {beginnerSteps.length}</p>
            </div>
            <p className="text-3xl font-bold">{progress}%</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-amber-300" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <ol className="mt-8 space-y-4">
          {beginnerSteps.map((step, index) => {
            const complete = completedLessons.includes(step.id);
            return (
              <li key={step.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex gap-4">
                  <div className="mt-1" aria-hidden="true">
                    {complete ? <CheckCircle2 className="text-emerald-600" /> : <Circle className="text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Session {index + 1} · {step.duration}</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">{step.title}</h2>
                    <p className="mt-1 text-slate-600">{step.description}</p>
                    <Link to={step.path} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-purple-700 px-4 py-2 font-bold text-white hover:bg-purple-800">
                      {complete ? 'Practice again' : 'Start session'} <ExternalLink className="h-4 w-4" />
                    </Link>
                    {step.activity && (
                      <p className="mt-2 text-xs text-slate-500">Technique review is instructional and does not count as a completed repertoire lesson.</p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <aside className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          Stop if you feel pain or numbness. A qualified teacher can assess instrument size and posture in person.
        </aside>
      </div>
    </main>
  );
}
