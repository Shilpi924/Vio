import { ArrowRight, Award, Fingerprint, Orbit, Sparkles, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FIRST_POSITION_ORBIT } from '../features/intonation/intonationEngine';
import { buildIntonationInsights, type IntonationMetric } from '../features/intonation/intonationAnalytics';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

const metricTone = (score: number): string => {
  if (score >= 85) return 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200';
  if (score >= 65) return 'border-cyan-300/40 bg-cyan-300/15 text-cyan-100';
  return 'border-amber-300/40 bg-amber-300/15 text-amber-100';
};

const correction = (metric: IntonationMetric): string => {
  if (Math.abs(metric.averageCents) <= 2) return 'Centered';
  return metric.averageCents > 0 ? `${metric.averageCents}¢ sharp` : `${Math.abs(metric.averageCents)}¢ flat`;
};

export default function IntonationInsightsPage() {
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const sessions = useAppStore((state) => state.practiceSessions);
  const insights = useMemo(
    () => buildIntonationInsights(sessions.filter((session) => session.profileId === activeProfileId)),
    [activeProfileId, sessions],
  );

  if (!insights.hasData) {
    return (
      <main className="min-h-screen bg-[#090617] px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-purple-950 to-slate-950 p-8 shadow-2xl sm:p-12">
          <Fingerprint className="text-cyan-300" size={48} aria-hidden="true" />
          <p className="mt-6 text-sm font-black uppercase tracking-[0.24em] text-purple-300">Intonation Insights</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Create your pitch fingerprint</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
            Complete one Pitch Orbit flight to reveal accuracy by note, string, and finger. Every later flight makes the pattern more useful.
          </p>
          <Link to="/intonation-coach" className="btn-primary mt-7 bg-cyan-300 text-slate-950 hover:bg-cyan-200">
            Start Pitch Orbit <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  const rescueMetric = insights.noteMetrics.find((metric) => metric.label === insights.rescueNote);
  const biasAdvice = insights.averageCents > 2
    ? 'Your hand tends to land slightly high. Approach the note from the scroll side, then settle.'
    : insights.averageCents < -2
      ? 'Your hand tends to land slightly low. Reach toward the bridge with a relaxed finger.'
      : 'Your overall hand frame is centered. Preserve that shape as you change strings.';

  return (
    <main className="min-h-screen overflow-hidden bg-[#090617] px-4 py-9 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-60" aria-hidden="true" style={{
        backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(168,85,247,.22), transparent 30%), radial-gradient(circle at 86% 45%, rgba(34,211,238,.17), transparent 28%)',
      }} />
      <div className="relative mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">Intonation Insights</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">Your pitch fingerprint</h1>
            <p className="mt-3 max-w-2xl text-slate-300">A living map of where your fingers land, how steadily they settle, and what should return in tomorrow’s practice.</p>
          </div>
          <Link to="/intonation-coach" className="btn-primary bg-cyan-300 text-slate-950 hover:bg-cyan-200">
            Fly Pitch Orbit <Orbit size={18} />
          </Link>
        </header>

        <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Center score', value: `${insights.centerScore}`, detail: 'out of 100', icon: Target },
            { label: 'Hand tendency', value: insights.biasLabel, detail: `${insights.averageCents > 0 ? '+' : ''}${insights.averageCents}¢ average`, icon: Fingerprint },
            { label: 'Strongest landing', value: insights.strongestNote ?? '—', detail: 'most consistently centered', icon: Award },
            { label: 'Flights tracked', value: String(insights.sessionCount), detail: 'Pitch Orbit sessions', icon: Orbit },
          ].map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <Icon className="text-purple-300" size={21} aria-hidden="true" />
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
              <p className="mt-1 text-3xl font-black">{value}</p>
              <p className="mt-1 text-sm text-slate-400">{detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">First-position map</p>
                <h2 className="mt-1 text-3xl font-black">Every finger has a signal</h2>
              </div>
              <p className="text-sm text-slate-400">Score combines centering and successful holds</p>
            </div>

            <div className="mt-7 space-y-4">
              {(['D', 'A'] as const).map((stringName) => (
                <div key={stringName} className="grid grid-cols-[3rem_repeat(3,1fr)] gap-3">
                  <div className="grid place-items-center rounded-2xl bg-white/10 text-2xl font-black">{stringName}</div>
                  {FIRST_POSITION_ORBIT.filter((target) => target.string === stringName).map((target) => {
                    const metric = insights.noteMetrics.find((candidate) => candidate.key === target.note);
                    return (
                      <div key={target.note} className={`rounded-2xl border p-4 ${metric ? metricTone(metric.centerScore) : 'border-white/10 bg-white/5 text-slate-400'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-2xl font-black">{target.note}</span>
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-black/20 text-sm font-black">{target.finger}</span>
                        </div>
                        <p className="mt-4 text-3xl font-black">{metric?.centerScore ?? '—'}</p>
                        <p className="mt-1 text-xs font-bold">{metric ? correction(metric) : 'Not played yet'}</p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Finger 1</span><span>Finger 2</span><span>Finger 3</span>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-b from-amber-300/15 to-purple-400/10 p-6 sm:p-8">
            <Sparkles className="text-amber-300" size={28} aria-hidden="true" />
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-amber-200">Coach’s next move</p>
            <h2 className="mt-2 text-3xl font-black">Rescue {insights.rescueNote}</h2>
            <p className="mt-3 leading-7 text-slate-200">
              {rescueMetric
                ? `${insights.rescueNote} has a ${rescueMetric.centerScore}/100 center score and needed about ${rescueMetric.averageStruggle} correction moments per attempt.`
                : 'Play another flight to identify the note that needs the most attention.'}
            </p>
            <div className="mt-5 rounded-2xl bg-black/20 p-4 text-sm leading-6 text-slate-200">{biasAdvice}</div>
            <Link to="/intonation-coach" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 font-black text-slate-950 hover:bg-amber-200">
              Practice the rescue <ArrowRight size={17} />
            </Link>
          </aside>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Flight history</p>
                <h2 className="mt-1 text-2xl font-black">Centering over time</h2>
              </div>
              {insights.improvement !== null ? (
                <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-black ${insights.improvement >= 0 ? 'bg-emerald-300/15 text-emerald-200' : 'bg-amber-300/15 text-amber-200'}`}>
                  {insights.improvement >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {insights.improvement > 0 ? '+' : ''}{insights.improvement}
                </div>
              ) : null}
            </div>
            <div className="mt-7 flex h-48 items-end gap-3" role="img" aria-label="Center score by Pitch Orbit session">
              {insights.trend.map((point) => (
                <div key={point.id} className="flex h-full flex-1 flex-col justify-end text-center">
                  <span className="mb-2 text-sm font-black">{point.score}</span>
                  <div className="min-h-2 rounded-t-xl bg-gradient-to-t from-purple-600 to-cyan-300" style={{ height: `${Math.max(8, point.score)}%` }} />
                  <span className="mt-2 text-[11px] text-slate-500">{point.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">Technique layers</p>
            <h2 className="mt-1 text-2xl font-black">Compare strings and fingers</h2>
            <div className="mt-6 space-y-5">
              {[...insights.stringMetrics, ...insights.fingerMetrics].map((metric) => (
                <div key={`${metric.label}-${metric.key}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold">{metric.label}</span>
                    <span className="text-sm text-slate-400">{metric.centerScore}/100 · {metric.passRate}% held</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-300" style={{ width: `${metric.centerScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
