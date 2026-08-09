import { ArrowRight, BookOpen, ClipboardCheck, Headphones, Mic, Music2, Target, TimerReset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function HomePage() {
  const navigate = useNavigate();
  const statistics = useAppStore((state) => state.statistics);
  const sessions = useAppStore((state) => state.practiceSessions);
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const calibration = useAppStore((state) => state.audioCalibrationByProfile[profile.id]);
  const diagnostic = useAppStore((state) => state.diagnosticResults[profile.id]);
  const plan = useAppStore((state) => state.dailyPracticePlans[profile.id]);
  const nextPath = diagnostic ? '/practice-plan' : '/diagnostic';
  const completedPlanTasks = plan?.completedTaskIds.length ?? 0;
  const totalPlanTasks = plan?.tasks.length ?? 4;
  const calibrationLabel = calibration
    ? `Calibrated ${new Date(calibration.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
    : 'Microphone not calibrated yet';

  const isModern = profile?.ageGroup === '13-17' || profile?.ageGroup === '18+';

  const formatTime = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
  };

  return (
    <main className={`min-h-[calc(100vh-4rem)] transition-colors duration-300 ${
      isModern ? 'bg-slate-950 text-white' : 'bg-[#fffdf8] text-slate-950'
    }`}>
      {/* Hero Section */}
      <section className={`border-b px-5 py-12 sm:py-16 ${
        isModern ? 'border-slate-800 bg-[radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.15),_transparent_35%)]' : 'border-stone-200'
      }`}>
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className={`text-sm font-black uppercase tracking-[0.22em] ${
              isModern ? 'text-purple-400' : 'text-purple-700'
            }`}>Hear it. Fix it. Play it.</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl leading-none">
              {isModern ? (
                <>
                  A clearer path to <span className="modern-text-gradient">confident performance.</span>
                </>
              ) : (
                'A clearer path from first sound to confident performance.'
              )}
            </h1>
            <p className={`mt-5 max-w-2xl text-lg leading-8 ${
              isModern ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Violin Mentor combines guided lessons, microphone feedback and focused repetition so every practice session has a purpose.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button 
                type="button" 
                onClick={() => navigate(nextPath)} 
                className={`btn-primary ${
                  isModern 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-500/20' 
                    : 'bg-purple-950 hover:bg-purple-900'
                }`}
              >
                {diagnostic ? 'Continue today’s plan' : 'Build my daily plan'}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/tuner')} 
                className={isModern ? 'btn-secondary bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800' : 'btn-secondary'}
              >
                Tune my violin
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/audio-check')} 
                className={isModern ? 'btn-secondary bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800' : 'btn-secondary'}
              >
                Calibrate mic
              </button>
            </div>
          </div>

          <aside className={`rounded-[2rem] p-6 shadow-2xl sm:p-8 ${
            isModern ? 'bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-white' : 'bg-slate-950 text-white'
          }`}>
            <p className={`text-sm font-bold uppercase tracking-widest ${
              isModern ? 'text-purple-400' : 'text-purple-300'
            }`}>
              {diagnostic ? 'Today’s practice signal' : 'Your practice signal'}
            </p>
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              isModern ? 'border-purple-500/10 bg-purple-500/5 text-slate-300' : 'border-white/10 bg-white/5 text-slate-300'
            }`}>
              <span className="flex items-center gap-2 font-bold text-white">
                <Mic size={16} aria-hidden="true" /> {calibration ? 'Mic calibrated' : 'Microphone setup'}
              </span>
              <p className="mt-1">{calibrationLabel}</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ['Practice', formatTime(statistics.totalPracticeTime)],
                ['Accuracy', `${statistics.accuracy}%`],
                ['Today', diagnostic ? `${completedPlanTasks}/${totalPlanTasks}` : 'Not set'],
                ['Sessions', String(sessions.length)],
              ].map(([label, value]) => (
                <div key={label} className={`rounded-2xl p-4 ${
                  isModern ? 'bg-slate-950/80 border border-slate-800' : 'bg-white/10'
                }`}>
                  <p className={`text-sm ${isModern ? 'text-slate-400' : 'text-slate-300'}`}>{label}</p>
                  <p className="mt-1 text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>
            <p className={`mt-5 text-sm leading-6 ${isModern ? 'text-slate-400' : 'text-slate-300'}`}>
              {diagnostic
                ? `Your ${plan?.targetMinutes ?? diagnostic.targetMinutes}-minute plan updates as real practice is completed.`
                : 'Take a three-minute diagnostic to get a plan matched to your pitch, rhythm, and reading skills.'}
            </p>
          </aside>
        </div>
      </section>

      {/* Grid Menu Section */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className={`text-sm font-black uppercase tracking-widest ${
                isModern ? 'text-purple-400' : 'text-purple-700'
              }`}>Practice studio</p>
              <h2 className="mt-2 text-3xl font-black">Choose what you need today</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['/practice-plan', 'Follow today’s plan', 'Get the next best exercise based on your real results.', ClipboardCheck],
              ['/beginner-path', 'Learn step by step', 'Build safe fundamentals in a clear order.', BookOpen],
              ['/lessons', 'Practice a song', 'Listen, play and receive note-by-note feedback.', Music2],
              ['/tuner', 'Tune accurately', 'Use the microphone to tune each open string.', Target],
              ['/intonation-coach', 'Center every note', 'Get live sharp/flat guidance and a personal rescue loop.', Headphones],
              ['/rhythm-pulse', 'Strengthen rhythm', 'Tap patterns and build steady timing.', TimerReset],
              ['/audio-check', 'Calibrate mic', 'Measure room noise, signal strength and timing offset.', Mic],
            ].map(([path, title, description, Icon]) => (
              <button
                type="button"
                key={String(path)}
                onClick={() => navigate(String(path))}
                className={`group rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-700 ${
                  isModern 
                    ? 'bg-slate-900/40 border border-slate-800/80 text-white hover:border-purple-500/30 hover:bg-slate-900/60 hover:shadow-glow' 
                    : 'bg-white border border-stone-200 text-slate-950 hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  isModern ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-900'
                }`}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span className="mt-6 block text-xl font-bold">{String(title)}</span>
                <span className={`mt-2 block leading-6 text-sm ${
                  isModern ? 'text-slate-400' : 'text-slate-600'
                }`}>{String(description)}</span>
                <span className={`mt-6 flex items-center gap-2 text-sm font-bold ${
                  isModern ? 'text-purple-400' : 'text-purple-800'
                }`}>
                  Open <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
