import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Achievements from './components/Achievements';
import AIChatBot from './components/AIChatBot';
import LessonPlayer from './components/LessonPlayer';
import Metronome from './components/Metronome';
import NavigationBar from './components/NavigationBar';
import PracticeTimer from './components/PracticeTimer';
import ViolinTuner from './components/ViolinTuner';
import { sampleLessons } from './data/lessons';
import { completeLesson } from './features/lessons/application/completeLesson';
import { useCloudSync } from './hooks/useCloudSync';
import ChordTrainerPage from './pages/ChordTrainerPage';
import CurriculumPage from './pages/CurriculumPage';
import EarTrainingPage from './pages/EarTrainingPage';
import FreePlayPage from './pages/FreePlayPage';
import HandPositioningPage from './pages/HandPositioningPage';
import HomePage from './pages/HomePage';
import IntervalTrainingPage from './pages/IntervalTrainingPage';
import LessonCreatorPage from './pages/LessonCreatorPage';
import LessonLibraryPage from './pages/LessonLibraryPage';
import NoteNamingPage from './pages/NoteNamingPage';
import OnboardingPage from './pages/OnboardingPage';
import PerformanceModePage from './pages/PerformanceModePage';
import RhythmTrainingPage from './pages/RhythmTrainingPage';
import ScalesTrainerPage from './pages/ScalesTrainerPage';
import SettingsPage from './pages/SettingsPage';
import SightReadingPage from './pages/SightReadingPage';
import SongUploadPage from './pages/SongUploadPage';
import StatisticsPage from './pages/StatisticsPage';
import TutorialsPage from './pages/TutorialsPage';
import { audioService } from './services/audioService';
import { useAppStore } from './store/useAppStore';
import { useUserProfileStore } from './store/useUserProfileStore';

function LessonRoute() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const customLessons = useAppStore((state) => state.customLessons);
  const lesson = [...sampleLessons, ...customLessons].find((candidate) => candidate.id === lessonId);

  if (!lesson) {
    return <Navigate to="/lessons" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <LessonPlayer
          lesson={lesson}
          onExit={() => navigate('/lessons')}
          onComplete={() => {
            completeLesson(lesson.id);
            navigate('/lessons', { replace: true });
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
  useCloudSync();

  useEffect(() => {
    audioService.setVolume(audioVolume / 100);
  }, [audioVolume]);

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
        <Route path="/achievements" element={<Achievements />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AIChatBot />
    </div>
  );
}

export default App;
