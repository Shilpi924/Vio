import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function ParentDashboard() {
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const sessions = useAppStore((state) =>
    state.practiceSessions.filter((session) => session.profileId === activeProfileId)
  );

  const totalSeconds = sessions.reduce((sum, session) => sum + session.durationSeconds, 0);
  const notesPlayed = sessions.reduce((sum, session) => sum + session.notesPlayed, 0);
  const correctNotes = sessions.reduce((sum, session) => sum + session.correctNotes, 0);
  const averageAccuracy = notesPlayed ? Math.round((correctNotes / notesPlayed) * 100) : 0;
  const recentSessions = sessions.slice(0, 14);
  const hardestNotes = Array.from(new Set(sessions.flatMap((session) => session.hardestNotes))).slice(0, 5);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">Family view</p>
          <h1 className="mt-2 text-4xl font-black">Progress for {profile?.name ?? 'your learner'}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            This dashboard contains recorded practice only. No sample sessions or estimated skill scores are shown.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Practice overview">
          {[
            ['Practice time', formatTime(totalSeconds)],
            ['Average accuracy', `${averageAccuracy}%`],
            ['Recorded sessions', String(sessions.length)],
            ['Lessons completed', String(profile?.completedLessons.length ?? 0)],
          ].map(([label, value]) => (
            <article key={label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-purple-800">{value}</p>
            </article>
          ))}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Recent practice</h2>
            {recentSessions.length ? (
              <div className="mt-5 space-y-3">
                {recentSessions.map((session) => (
                  <article key={session.id} className="grid gap-3 rounded-xl bg-stone-50 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                    <div>
                      <p className="font-bold">{session.title}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(session.startedAt).toLocaleDateString()} · {session.activity.replace('-', ' ')}
                      </p>
                    </div>
                    <p className="font-semibold">{Math.max(1, Math.round(session.durationSeconds / 60))} min</p>
                    <p className="font-semibold text-purple-800">{session.accuracy}%</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-stone-50 p-5 text-slate-600">
                No practice has been recorded yet. Complete a guided lesson to create the first report.
              </p>
            )}
          </section>

          <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
            <h2 className="text-2xl font-bold">Next best step</h2>
            {hardestNotes.length ? (
              <>
                <p className="mt-3 text-slate-300">Review these notes slowly before the next song:</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hardestNotes.map((note) => (
                    <span key={note} className="rounded-full bg-purple-400/20 px-3 py-1 font-bold text-purple-100">
                      {note}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-slate-300">
                Begin with one short guided lesson. Recommendations will appear after real playing data is available.
              </p>
            )}
            <p className="mt-6 text-sm text-slate-400">
              For pain, persistent tension, or posture concerns, consult a qualified violin teacher in person.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
