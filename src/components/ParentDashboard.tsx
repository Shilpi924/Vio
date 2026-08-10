import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import {
  Sparkles,
  Plus,
  Settings,
  User,
  Trash2,
  Calendar,
  Shield,
  Activity,
  Award,
  BookOpen,
  Clock,
  Heart,
  Volume2,
  Bell,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';

export default function ParentDashboard() {
  const { profiles, activeProfileId, switchProfile, createProfile, deleteProfile, updateProfile } = useUserProfileStore();
  const profile = profiles[activeProfileId];
  
  const sessions = useAppStore((state) =>
    state.practiceSessions.filter((session) => session.profileId === activeProfileId)
  );

  // States
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileAgeGroup, setNewProfileAgeGroup] = useState<'5-8' | '9-12' | '13-17' | '18+'>('9-12');
  const [newProfileSkillLevel, setNewProfileSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  // Stats calculation
  const totalSeconds = sessions.reduce((sum, session) => sum + session.durationSeconds, 0);
  const notesPlayed = sessions.reduce((sum, session) => sum + session.notesPlayed, 0);
  const correctNotes = sessions.reduce((sum, session) => sum + session.correctNotes, 0);
  const averageAccuracy = notesPlayed ? Math.round((correctNotes / notesPlayed) * 100) : 0;
  const recentSessions = sessions.slice(0, 10);
  const hardestNotes = Array.from(new Set(sessions.flatMap((session) => session.hardestNotes || []))).slice(0, 5);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Generate last 12 weeks of practice consistency data (84 days)
  const getConsistencyData = () => {
    const days = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // Map dates to practice durations
    const durationByDate: Record<string, number> = {};
    sessions.forEach((s) => {
      const dateKey = new Date(s.startedAt).toDateString();
      durationByDate[dateKey] = (durationByDate[dateKey] || 0) + s.durationSeconds;
    });

    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toDateString();
      const seconds = durationByDate[dateString] || 0;
      days.push({
        date: d,
        seconds,
        minutes: Math.round(seconds / 60),
      });
    }
    return days;
  };

  const consistencyDays = getConsistencyData();

  // Create plain language weekly summary
  const generateWeeklySummary = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekSessions = sessions.filter(s => new Date(s.startedAt) >= oneWeekAgo);
    
    if (thisWeekSessions.length === 0) {
      return `No sessions recorded in the last 7 days. Encourage ${profile?.name || 'your learner'} to complete their next 10-minute daily practice plan to start a streak!`;
    }

    const weekMinutes = Math.round(thisWeekSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);
    const avgAccuracy = Math.round(thisWeekSessions.reduce((sum, s) => sum + s.accuracy, 0) / thisWeekSessions.length);
    
    let advice = `${profile?.name || 'Your learner'} has practiced ${weekMinutes} minutes over ${thisWeekSessions.length} session(s) this week, with a solid ${avgAccuracy}% accuracy. `;
    
    if (hardestNotes.length > 0) {
      advice += `We noticed they struggled slightly with ${hardestNotes.slice(0, 2).join(' & ')}. A great next step is to suggest 2-3 minutes of Slow Playback or Tuner practice specifically targeting these notes.`;
    } else {
      advice += `They showed exceptional intonation stability this week! Encourage them to take on a slightly faster tempo on their current lesson piece.`;
    }
    
    return advice;
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    createProfile(newProfileName.trim(), {
      ageGroup: newProfileAgeGroup,
      skillLevel: newProfileSkillLevel,
      learningGoal: 'fun',
      practiceFrequency: 'few-times-week',
      favoriteGenres: [],
    });

    setNewProfileName('');
    setShowAddProfileModal(false);
  };

  const currentLevel = profile?.level || 1;

  const togglePreference = (key: 'soundEffects' | 'showAnimations' | 'darkMode') => {
    if (!profile) return;
    updateProfile({
      preferences: {
        ...profile.preferences,
        [key]: !profile.preferences[key]
      }
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 antialiased">
      <div className="mx-auto max-w-6xl">
        
        {/* Navigation & Header */}
        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
              <Shield className="h-3.5 w-3.5" /> Parent & Family Console
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
              Progress for <span className="modern-text-gradient">{profile?.name ?? 'your learner'}</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Review real performance metrics, switch learner profiles, and configure safety features.
            </p>
          </div>

          {/* Navigation Controls (Unlocked progressively at Level 3) */}
          {currentLevel >= 3 && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Parent Settings
              </button>
            </div>
          )}
        </header>

        {activeTab === 'overview' ? (
          <div className="grid gap-6 lg:grid-cols-[2.5fr_1fr]">
            
            {/* Left side: Stats, Consistency Calendar, Practice Log */}
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Practice metrics">
                {[
                  { label: 'Practice Time', value: formatTime(totalSeconds), icon: Clock, color: 'text-purple-400' },
                  { label: 'Avg Accuracy', value: `${averageAccuracy}%`, icon: Award, color: 'text-teal-400' },
                  { label: 'Recorded Sessions', value: String(sessions.length), icon: Activity, color: 'text-pink-400' },
                  { label: 'Completed Lessons', value: String(profile?.completedLessons?.length ?? 0), icon: BookOpen, color: 'text-blue-400' },
                ].map((item) => (
                  <article key={item.label} className="modern-glow-card relative overflow-hidden flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</span>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <p className="mt-4 text-3xl font-black tracking-tight text-white">{item.value}</p>
                  </article>
                ))}
              </section>

              {/* Practice Consistency Tracker */}
              <section className="modern-glow-card">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                    <Calendar className="h-5 w-5 text-teal-400" /> Practice Consistency
                  </h2>
                  <span className="text-xs text-slate-400">Last 12 weeks</span>
                </div>
                
                {/* Contribution-style Heatmap Grid */}
                <div className="flex flex-col items-center justify-center gap-2 overflow-x-auto py-2 hide-scrollbar">
                  <div className="grid grid-flow-col grid-rows-7 gap-1">
                    {consistencyDays.map((day, idx) => {
                      let bgColor = 'bg-slate-800/40 border-slate-700/20';
                      if (day.minutes > 0 && day.minutes <= 5) bgColor = 'bg-purple-950/70 border-purple-900/30';
                      else if (day.minutes > 5 && day.minutes <= 15) bgColor = 'bg-purple-700/80 border-purple-600/40';
                      else if (day.minutes > 15) bgColor = 'bg-purple-500 border-purple-400';

                      return (
                        <div
                          key={idx}
                          title={`${day.date.toDateString()}: ${day.minutes} mins practiced`}
                          className={`h-3 w-3 rounded-[3px] border transition-all hover:scale-125 ${bgColor}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex w-full justify-between px-2 text-[10px] text-slate-400">
                    <span>84 days ago</span>
                    <div className="flex items-center gap-1">
                      <span>Less</span>
                      <div className="h-2 w-2 rounded-[2px] bg-slate-800" />
                      <div className="h-2 w-2 rounded-[2px] bg-purple-950" />
                      <div className="h-2 w-2 rounded-[2px] bg-purple-700" />
                      <div className="h-2 w-2 rounded-[2px] bg-purple-500" />
                      <span>More</span>
                    </div>
                    <span>Today</span>
                  </div>
                </div>
              </section>

              {/* Plain-Language Weekly Summary */}
              <section className="modern-glow-card relative border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-950/20 to-slate-900/50">
                <h3 className="flex items-center gap-2 font-bold text-white">
                  <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" /> AI practice coach summary
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {generateWeeklySummary()}
                </p>
              </section>

              {/* Practice Log */}
              <section className="modern-glow-card">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pink-400" /> Recent Practice Log
                </h2>
                {recentSessions.length ? (
                  <div className="space-y-2">
                    {recentSessions.map((session) => (
                      <article key={session.id} className="group flex items-center justify-between rounded-xl bg-slate-900/40 p-3.5 border border-slate-850 hover:bg-slate-900/80 transition-colors">
                        <div>
                          <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">{session.title}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(session.startedAt).toLocaleDateString()} · {session.activity.replace('-', ' ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-slate-400">{Math.max(1, Math.round(session.durationSeconds / 60))} min</span>
                          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/20">
                            {session.accuracy}% acc
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-900/20 border border-dashed border-slate-800 p-8 text-center text-slate-500">
                    No sessions recorded. Complete any guided lesson, scales path, or play in Free Play mode to start.
                  </div>
                )}
              </section>
            </div>

            {/* Right side: Profile Manager & Next Steps */}
            <div className="space-y-6">
              
              {/* Profile Manager Card */}
              <section className="modern-glow-card">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                    <User className="h-5 w-5 text-purple-400" /> Child Profiles
                  </h2>
                  <button
                    onClick={() => setShowAddProfileModal(true)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {Object.values(profiles).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => switchProfile(p.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl p-3 border transition-all ${
                        p.id === activeProfileId
                          ? 'bg-purple-950/40 border-purple-500'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs uppercase ${
                          p.id === activeProfileId ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{p.name}</p>
                          <p className="text-xs text-slate-400">Level {p.level || 1} · {p.ageGroup}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {Object.keys(profiles).length > 1 && p.id !== activeProfileId && (
                          <button
                            onClick={() => deleteProfile(p.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900/80 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {p.id === activeProfileId && (
                          <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Hardest Notes / Next Steps advice */}
              <section className="modern-glow-card bg-slate-950 border border-slate-800/80">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-400" /> Supportive Action
                </h3>
                {hardestNotes.length ? (
                  <>
                    <p className="mt-3 text-xs leading-relaxed text-slate-400">
                      We noticed {profile?.name || 'your learner'} has some difficulties maintaining clean intonation on:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {hardestNotes.map((note) => (
                        <span key={note} className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                          {note}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-slate-400">
                      We recommend they use the <strong>Pitch Orbit Tuner</strong> tool before starting their next lesson piece.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    No specific challenging notes detected yet. Complete a guided lesson to populate targeted feedback.
                  </p>
                )}
                
                <div className="mt-6 border-t border-slate-900 pt-4 text-[11px] text-slate-500 leading-relaxed">
                  For physical pain, continuous posture issues, or wrist fatigue, we recommend getting in-person guidance from a certified violin instructor.
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* Parent settings and controls */
          <div className="modern-glow-card max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="h-5 w-5 text-purple-400" /> Parent Preferences & Controls
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-850">
                <div>
                  <h3 className="text-sm font-semibold text-white">Weekly Performance Summary</h3>
                  <p className="text-xs text-slate-400">Enable automated coach feedback digest on dashboard.</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile?.preferences?.showAnimations ?? true}
                  onChange={() => togglePreference('showAnimations')}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-850">
                <div>
                  <h3 className="text-sm font-semibold text-white">App Sound Effects</h3>
                  <p className="text-xs text-slate-400">Enable sound confirmation when completing tasks.</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile?.preferences?.soundEffects ?? true}
                  onChange={() => togglePreference('soundEffects')}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-850">
                <div>
                  <h3 className="text-sm font-semibold text-white">Privacy Safe Mode</h3>
                  <p className="text-xs text-slate-400">Restricts profile name sharing with teachers/peers.</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile?.preferences?.darkMode ?? false}
                  onChange={() => togglePreference('darkMode')}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="bg-slate-900/20 border border-slate-850 rounded-xl p-4 flex gap-3 text-xs text-slate-400">
              <Shield className="h-5 w-5 text-teal-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-300">Privacy & safety first:</span> We do not collect or store raw audio recordings of your child. All intonation and rhythm analysis happens locally in the browser.
              </div>
            </div>
          </div>
        )}

        {/* Add Profile Modal */}
        {showAddProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="modern-glow-card w-full max-w-md border border-slate-800 bg-slate-950 p-6 shadow-2xl relative">
              <button
                onClick={() => setShowAddProfileModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-4">Add Learner Profile</h2>
              
              <form onSubmit={handleAddProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Learner Name
                  </label>
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="e.g. Emily"
                    className="w-full rounded-xl bg-slate-900 border border-slate-850 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Age Group
                  </label>
                  <select
                    value={newProfileAgeGroup}
                    onChange={(e) => setNewProfileAgeGroup(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-850 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="5-8">5-8 years</option>
                    <option value="9-12">9-12 years</option>
                    <option value="13-17">13-17 years</option>
                    <option value="18+">18+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Skill Level
                  </label>
                  <select
                    value={newProfileSkillLevel}
                    onChange={(e) => setNewProfileSkillLevel(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-850 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProfileModal(false)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
