import { lazy, Suspense, useEffect } from 'react';
import i18n from './i18n';
import { Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AIChatBot from './components/AIChatBot';
import NavigationBar from './components/NavigationBar';
import { sampleLessons } from './data/lessons';
import { completeLesson } from './features/lessons/application/completeLesson';
import { useCloudSync } from './hooks/useCloudSync';
import HomePage from './pages/HomePage';
import { useAppStore } from './store/useAppStore';
import { useUserProfileStore } from './store/useUserProfileStore';

const Achievements = lazy(() => import('./components/Achievements'));
const AudioComparison = lazy(() => import('./components/AudioComparison'));
const InteractiveFingerboard = lazy(() => import('./components/InteractiveFingerboard'));
const LessonPlayer = lazy(() => import('./components/LessonPlayer'));
const Metronome = lazy(() => import('./components/Metronome'));
const NoteMatchingGame = lazy(() => import('./components/NoteMatchingGame'));
const ParentDashboard = lazy(() => import('./components/ParentDashboard'));
const PracticeReminders = lazy(() => import('./components/PracticeReminders'));
const PracticeTimer = lazy(() => import('./components/PracticeTimer'));
const SlowPlayback = lazy(() => import('./components/SlowPlayback'));
const VideoTutorial = lazy(() => import('./components/VideoTutorial'));
const ViolinTuner = lazy(() => import('./components/ViolinTuner'));
const WeeklyChallenges = lazy(() => import('./components/WeeklyChallenges'));
const BeginnerPath = lazy(() => import('./pages/BeginnerPath'));
const ChordTrainerPage = lazy(() => import('./pages/ChordTrainerPage'));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage'));
const DailyPracticePlanPage = lazy(() => import('./pages/DailyPracticePlanPage'));
const DiagnosticPage = lazy(() => import('./pages/DiagnosticPage'));
const EarTrainingPage = lazy(() => import('./pages/EarTrainingPage'));
const FreePlayPage = lazy(() => import('./pages/FreePlayPage'));
const HandPositioningPage = lazy(() => import('./pages/HandPositioningPage'));
const IntervalTrainingPage = lazy(() => import('./pages/IntervalTrainingPage'));
const LessonCreatorPage = lazy(() => import('./pages/LessonCreatorPage'));
const LessonLibraryPage = lazy(() => import('./pages/LessonLibraryPage'));
const NoteNamingPage = lazy(() => import('./pages/NoteNamingPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const PerformanceModePage = lazy(() => import('./pages/PerformanceModePage'));
const RhythmTrainingPage = lazy(() => import('./pages/RhythmTrainingPage'));
const ScalesTrainerPage = lazy(() => import('./pages/ScalesTrainerPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SightReadingPage = lazy(() => import('./pages/SightReadingPage'));
const SongUploadPage = lazy(() => import('./pages/SongUploadPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const TutorialsPage = lazy(() => import('./pages/TutorialsPage'));

function LessonRoute() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customLessons = useAppStore((state) => state.customLessons);
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const lesson = [...sampleLessons, ...customLessons].find((candidate) => candidate.id === lessonId);

  if (!lesson) {
    return <Navigate to="/lessons" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <LessonPlayer
          lesson={lesson}
          onExit={() => navigate(-1)}
          onComplete={(result) => {
            completeLesson(lesson.id, {
              ...result,
              profileId: activeProfileId,
              title: lesson.title,
            });
            navigate(searchParams.get('from') === 'plan' ? '/practice-plan' : '/lessons', { replace: true });
          }}
        />
      </div>
    </div>
  );
}

function OnboardingRoute() {
  const navigate = useNavigate();
  const completeOnboarding = useUserProfileStore((state) => state.completeOnboarding);

  return (
    <OnboardingPage
      onComplete={(data) => {
        completeOnboarding(data);
        navigate('/', { replace: true });
      }}
    />
  );
}

function App() {
  const audioVolume = useAppStore((state) => state.settings.audioVolume);
  const darkMode = useAppStore((state) => state.settings.darkMode);
  const language = useAppStore((state) => state.settings.language ?? 'en');
  useCloudSync();

  useEffect(() => {
    void import('./services/audioService').then(({ audioService }) => {
      audioService.setVolume(audioVolume / 100);
    });
  }, [audioVolume]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-600" role="status">Loading practice space…</div>}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
        <Route path="/practice-plan" element={<DailyPracticePlanPage />} />
        <Route path="/beginner-path" element={<BeginnerPath />} />
        <Route path="/fingerboard" element={<InteractiveFingerboard />} />
        <Route path="/audio-compare" element={<AudioComparison targetNote="A4" />} />
        <Route path="/video-tutorials" element={<VideoTutorial />} />
        <Route path="/lessons" element={<LessonLibraryPage />} />
        <Route path="/lessons/:lessonId" element={<LessonRoute />} />
        <Route path="/free-play" element={<FreePlayPage />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="/scales" element={<ScalesTrainerPage />} />
        <Route path="/ear-training" element={<EarTrainingPage />} />
        <Route path="/note-naming" element={<NoteNamingPage />} />
        <Route path="/sight-reading" element={<SightReadingPage />} />
        <Route path="/hand-positioning" element={<HandPositioningPage />} />
        <Route path="/performance" element={<PerformanceModePage />} />
        <Route path="/interval-training" element={<IntervalTrainingPage />} />
        <Route path="/chord-training" element={<ChordTrainerPage />} />
        <Route path="/song-upload" element={<SongUploadPage />} />
        <Route path="/lesson-creator" element={<LessonCreatorPage />} />
        <Route path="/rhythm-training" element={<RhythmTrainingPage />} />
        <Route path="/tuner" element={<ViolinTuner />} />
        <Route path="/timer" element={<PracticeTimer />} />
        <Route path="/metronome" element={<Metronome />} />
        <Route path="/slow-playback" element={<SlowPlayback />} />
        <Route path="/note-game" element={<NoteMatchingGame />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/challenges" element={<WeeklyChallenges />} />
        <Route path="/reminders" element={<PracticeReminders />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <AIChatBot />
    </div>
  );
}

export default App;
