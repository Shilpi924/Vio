import { ArrowRight, CheckCircle2, Circle, Clock3, RefreshCw, Sparkles, Target } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sampleLessons } from '../data/lessons';
import { buildDailyPlan, localDateKey } from '../features/practicePlan/planEngine';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function DailyPracticePlanPage() {
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const diagnostic = useAppStore((state) => state.diagnosticResults[profile.id]);
  const plan = useAppStore((state) => state.dailyPracticePlans[profile.id]);
  const sessions = useAppStore((state) => state.practiceSessions);
  const saveDailyPracticePlan = useAppStore((state) => state.saveDailyPracticePlan);
  const lessonTitles = useMemo(
    () => Object.fromEntries(sampleLessons.map((lesson) => [lesson.id, lesson.title])),
    [],
  );

  useEffect(() => {
    if (diagnostic && (!plan || plan.date !== localDateKey())) {
      saveDailyPracticePlan(buildDailyPlan({ profile, diagnostic, sessions, lessonTitles }));
    }
  }, [diagnostic, lessonTitles, plan, profile, saveDailyPracticePlan, sessions]);

  if (!diagnostic) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-purple-950 p-8 text-white shadow-xl sm:p-12">
          <Sparkles className="text-amber-300" size={46} aria-hidden="true" />
          <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-purple-200">Your daily plan</p>
          <h1 className="mt-2 text-4xl font-black">First, find today’s best focus</h1>
          <p className="mt-4 max-w-xl text-lg text-purple-100">A three-minute diagnostic checks pitch listening, rhythm, and note reading, then creates a realistic practice session.</p>
          <Link to="/diagnostic" className="btn-primary mt-7 bg-amber-300 text-purple-950 hover:bg-amber-200">
            Take the diagnostic <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  if (!plan || plan.date !== localDateKey()) {
    return <main className="min-h-screen bg-[#fffdf8] px-4 py-16 text-center text-slate-600" role="status">Building today’s practice plan…</main>;
  }

  const completedMinutes = plan.tasks
    .filter((task) => plan.completedTaskIds.includes(task.id))
    .reduce((total, task) => total + task.durationMinutes, 0);
  const progress = Math.round((plan.completedTaskIds.length / plan.tasks.length) * 100);
  const nextTask = plan.tasks.find((task) => !plan.completedTaskIds.includes(task.id));

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.45fr]">
          <section className="rounded-[2rem] bg-purple-950 p-7 text-white shadow-xl sm:p-9">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-200">Today’s practice</p>
            <h1 className="mt-2 text-4xl font-black">One focused session. {plan.targetMinutes} minutes.</h1>
            <p className="mt-4 text-purple-100">{plan.adaptationSummary}</p>
            {nextTask ? (
              <Link to={`${nextTask.path}?from=plan`} className="btn-primary mt-7 bg-amber-300 text-purple-950 hover:bg-amber-200">
                Continue: {nextTask.title} <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ) : (
              <div className="mt-7 rounded-2xl bg-emerald-400/20 p-4 font-bold text-emerald-100">
                Today’s plan is complete. Come back tomorrow for an adjusted session.
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <Target className="text-purple-700" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold uppercase tracking-wider text-slate-500">Session progress</p>
            <p className="mt-1 text-4xl font-black">{progress}%</p>
            <p className="mt-2 text-sm text-slate-600">{completedMinutes} of {plan.targetMinutes} planned minutes completed</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
              <div className="h-full bg-purple-700" style={{ width: `${progress}%` }} />
            </div>
          </aside>
        </div>

        <section className="mt-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-purple-700">Practice sequence</p>
              <h2 className="mt-1 text-3xl font-black">Know what to do next</h2>
            </div>
            <Link to="/diagnostic" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white">
              <RefreshCw size={16} aria-hidden="true" /> Retake diagnostic
            </Link>
          </div>

          <ol className="mt-5 space-y-3">
            {plan.tasks.map((task, index) => {
              const complete = plan.completedTaskIds.includes(task.id);
              return (
                <li key={task.id} className={`rounded-2xl border p-5 ${complete ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 bg-white'}`}>
                  <div className="flex gap-4">
                    <span className="mt-1" aria-hidden="true">
                      {complete ? <CheckCircle2 className="text-emerald-600" /> : <Circle className="text-purple-500" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span>Step {index + 1}</span>
                        <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {task.durationMinutes} min</span>
                      </div>
                      <h3 className="mt-1 text-xl font-black">{task.title}</h3>
                      <p className="mt-1 text-slate-600">{task.description}</p>
                      <p className="mt-2 text-sm text-purple-800"><strong>Why today:</strong> {task.reason}</p>
                      <Link to={`${task.path}?from=plan`} className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 font-bold ${complete ? 'border border-emerald-300 bg-white text-emerald-800' : 'bg-purple-950 text-white hover:bg-purple-900'}`}>
                        {complete ? 'Practice again' : 'Start'} <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </main>
  );
}
