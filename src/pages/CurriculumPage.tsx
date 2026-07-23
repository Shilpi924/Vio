import { Link } from 'react-router-dom';
import { Lock, CheckCircle2, PlayCircle } from 'lucide-react';
import { calculateLevelProgress, curriculum, isLevelComplete, isLevelUnlocked } from '../data/curriculum';
import { sampleLessons } from '../data/lessons';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function CurriculumPage() {
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const completedLessons = profile?.completedLessons ?? [];
  const completedLevels = curriculum
    .filter((level) => isLevelComplete(level, completedLessons))
    .map((level) => level.id);
  const currentLevel = curriculum.find((level) => !completedLevels.includes(level.id)) ?? curriculum[curriculum.length - 1];

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-purple-700">Structured path</p>
        <h1 className="text-4xl font-bold text-slate-950">A curriculum that matches the real lessons</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Complete each level to unlock the next. Progress comes from completed guided lessons, not self-reported taps.
        </p>

        <section className="mt-8 rounded-3xl bg-purple-950 p-6 text-white">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-purple-200">Current focus</p>
              <h2 className="mt-1 text-2xl font-bold">{currentLevel.name}</h2>
            </div>
            <p className="text-3xl font-bold">{Math.round(calculateLevelProgress(currentLevel.id, completedLessons))}%</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20" aria-hidden="true">
            <div className="h-full rounded-full bg-amber-300" style={{ width: `${calculateLevelProgress(currentLevel.id, completedLessons)}%` }} />
          </div>
        </section>

        <div className="mt-8 space-y-5">
          {curriculum.map((level, index) => {
            const unlocked = isLevelUnlocked(level.id, completedLevels);
            const complete = isLevelComplete(level, completedLessons);
            const progress = calculateLevelProgress(level.id, completedLessons);
            return (
              <section key={level.id} className={`rounded-3xl border bg-white p-6 shadow-sm ${unlocked ? 'border-purple-200' : 'border-slate-200 opacity-70'}`}>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-2xl" aria-hidden="true">
                    {complete ? <CheckCircle2 className="text-emerald-600" /> : unlocked ? level.badge : <Lock className="text-slate-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Level {index + 1}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-600">{level.difficulty}</span>
                      {complete && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">Complete</span>}
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">{level.name}</h2>
                    <p className="mt-2 text-slate-600">{level.description}</p>
                    {unlocked && (
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${Math.round(progress)} percent complete`}>
                        <div className="h-full bg-purple-600" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      {level.lessons.map((lessonId) => {
                        const lesson = sampleLessons.find((item) => item.id === lessonId);
                        const done = completedLessons.includes(lessonId);
                        return unlocked ? (
                          <Link key={lessonId} to={`/lessons/${lessonId}`} className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-purple-400 hover:bg-purple-50">
                            {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <PlayCircle className="h-4 w-4 text-purple-600" />}
                            {lesson?.title ?? lessonId}
                          </Link>
                        ) : (
                          <div key={lessonId} className="flex min-h-12 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
                            <Lock className="h-4 w-4" /> {lesson?.title ?? lessonId}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
