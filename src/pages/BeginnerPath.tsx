import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCelebration } from '../components/Celebration';
import Celebration from '../components/Celebration';

const beginnerSteps = [
  {
    id: 1,
    title: "Meet Your Violin",
    description: "Learn the parts of your violin and how to hold it properly",
    duration: "5 min",
    icon: "🎻",
    completed: false,
  },
  {
    id: 2,
    title: "The 4 Strings",
    description: "Learn about G, D, A, and E strings - what they sound like",
    duration: "8 min",
    icon: "🎵",
    completed: false,
  },
  {
    id: 3,
    title: "Your First Sound",
    description: "Make your very first sound by plucking a string",
    duration: "10 min",
    icon: "✨",
    completed: false,
  },
  {
    id: 4,
    title: "Holding the Bow",
    description: "Learn how to hold your bow correctly",
    duration: "12 min",
    icon: "🏹",
    completed: false,
  },
  {
    id: 5,
    title: "Your First Note",
    description: "Play your first note with the bow",
    duration: "15 min",
    icon: "🎯",
    completed: false,
  },
  {
    id: 6,
    title: "Twinkle Twinkle",
    description: "Learn your first song - Twinkle Twinkle Little Star",
    duration: "20 min",
    icon: "⭐",
    completed: false,
  },
];

export default function BeginnerPath() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { celebrate, showCelebration, celebrationMessage, celebrationEmoji } = useCelebration();

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    // Navigate to video tutorials when clicking a step
    navigate('/video-tutorials');
  };

  const handleComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
      celebrate("Step Complete! 🎉", "⭐");
    }
    if (currentStep < beginnerSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStartLesson = () => {
    navigate('/lessons');
  };

  const progress = (completedSteps.length / beginnerSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎻 Your Violin Journey</h1>
          <p className="text-xl text-gray-600">Step-by-step guide for absolute beginners</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Your Progress</span>
            <span className="text-lg font-bold text-purple-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4 mb-8">
          {beginnerSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep;
            const isLocked = index > currentStep && !completedSteps.includes(index - 1);

            return (
              <div
                key={step.id}
                onClick={() => !isLocked && handleStepClick(index)}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all ${
                  isCurrent ? 'ring-4 ring-purple-500 scale-105' : 
                  isCompleted ? 'bg-green-50' : 
                  isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number/Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-purple-500 text-white' :
                    isLocked ? 'bg-gray-300 text-gray-500' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {isCompleted ? '✓' : step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                      {isCurrent && <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">Current</span>}
                      {isCompleted && <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Done</span>}
                    </div>
                    <p className="text-gray-600 mb-1">{step.description}</p>
                    <p className="text-sm text-gray-500">⏱️ {step.duration}</p>
                  </div>

                  {/* Arrow */}
                  {!isLocked && (
                    <div className="text-2xl text-gray-400">
                      {isCurrent ? '→' : '↓'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Step Detail */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce">{beginnerSteps[currentStep].icon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{beginnerSteps[currentStep].title}</h2>
            <p className="text-xl text-gray-600">{beginnerSteps[currentStep].description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
              >
                ← Previous
              </button>
            )}
            <button
              onClick={handleComplete}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105"
            >
              {completedSteps.includes(currentStep) ? 'Completed ✓' : 'Mark Complete →'}
            </button>
          </div>

          {/* Start Lesson Button */}
          {!completedSteps.includes(currentStep) && (
            <button
              onClick={() => navigate('/video-tutorials')}
              className="w-full mt-4 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105"
            >
              🎬 Watch Video Tutorial
            </button>
          )}
        </div>

        {/* Start Learning Button */}
        {completedSteps.length === beginnerSteps.length && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-center text-white">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
            <p className="text-xl mb-6">You've completed the beginner path! Ready to learn some songs?</p>
            <button
              onClick={handleStartLesson}
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors"
            >
              Start Learning Songs →
            </button>
          </div>
        )}

        {/* Celebration Overlay */}
        <Celebration
          show={showCelebration}
          message={celebrationMessage}
          emoji={celebrationEmoji}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
}
