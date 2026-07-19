import { useState } from 'react';
import { PersonalizationData } from '../types/userProfile';

interface OnboardingPageProps {
  onComplete: (data: PersonalizationData) => void;
}

const onboardingSteps = [
  {
    title: "Welcome to Violin Mentor! 🎻",
    content: "We'll help you learn violin step by step, even if you've never played before.",
    emoji: "🎻",
  },
  {
    title: "Have you played violin before?",
    content: "This helps us customize your learning experience.",
    emoji: "🤔",
    hasChoice: true,
  },
  {
    title: "Here's how it works",
    content: "Learn → Practice → Play. We'll guide you through each step with easy lessons.",
    emoji: "📚",
  },
  {
    title: "Your first lesson",
    content: "We'll start with the basics: how to hold your violin and make your first sound.",
    emoji: "🎯",
  },
  {
    title: "You're ready to start!",
    content: "Let's begin your violin journey. Your first lesson is waiting!",
    emoji: "🚀",
  },
];

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChoice = (choice: 'beginner' | 'intermediate' | 'advanced') => {
    setSkillLevel(choice);
    handleNext();
  };

  const completeOnboarding = () => {
    const data: PersonalizationData = {
      ageGroup: '9-12',
      skillLevel: skillLevel || 'beginner',
      learningGoal: 'fun',
      practiceFrequency: 'few-times-week',
      favoriteGenres: [],
    };
    onComplete(data);
  };

  const step = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? 'w-8 bg-purple-600' : 
                index < currentStep ? 'w-2 bg-purple-400' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Emoji */}
          <div className="text-8xl mb-6 animate-bounce">{step.emoji}</div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h1>
          
          {/* Content */}
          <p className="text-xl text-gray-700 mb-8">{step.content}</p>

          {/* Choice buttons for step 2 */}
          {step.hasChoice && skillLevel === null && (
            <div className="space-y-4 mb-8">
              <button
                onClick={() => handleChoice('beginner')}
                className="w-full py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>🐣</span> Beginner (Brand New)
              </button>
              <button
                onClick={() => handleChoice('intermediate')}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>🎻</span> Intermediate (Some Experience)
              </button>
              <button
                onClick={() => handleChoice('advanced')}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>🔥</span> Advanced / Expert
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          {!step.hasChoice && (
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Start Learning' : 'Next'}
              </button>
            </div>
          )}
        </div>

        {/* Skip button */}
        {currentStep < onboardingSteps.length - 1 && (
          <button
            onClick={completeOnboarding}
            className="mt-6 text-gray-500 hover:text-gray-700 text-lg"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
