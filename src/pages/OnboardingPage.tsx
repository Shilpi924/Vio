import { PersonalizationData } from '../types/userProfile';

interface OnboardingPageProps {
  onComplete: (data: PersonalizationData) => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const handleComplete = () => {
    const data: PersonalizationData = {
      ageGroup: '9-12',
      skillLevel: 'beginner',
      learningGoal: 'fun',
      practiceFrequency: 'few-times-week',
      favoriteGenres: [],
    };
    onComplete(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Violin Mentor! 🎻</h1>
        <p className="text-lg text-gray-700 mb-4">Let's set up your profile.</p>
        <button 
          onClick={handleComplete}
          className="btn-primary"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
