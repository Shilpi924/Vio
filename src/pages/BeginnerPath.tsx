import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const beginnerSteps = [
  {
    id: 1,
    title: "Meet Your Violin",
    description: "Learn the parts of your violin and how to hold it",
    duration: "5 min",
    icon: "🎻",
    completed: false,
  },
  {
    id: 2,
    title: "The 4 Strings",
    description: "Learn about G, D, A, and E strings",
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

  const handleComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < beginnerSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = (completedSteps.length / beginnerSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎻 Your Violin Journey</h1>
          <p className="text-lg text-gray-600">Step by step, from zero to hero!</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">{beginnerSteps[currentStep].icon}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{beginnerSteps[currentStep].title}</h2>
            <p className="text-lg text-gray-600">{beginnerSteps[currentStep].description}</p>
            <p className="text-sm text-gray-400 mt-2">⏱️ {beginnerSteps[currentStep].duration}</p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleComplete}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 ${
              completedSteps.includes(currentStep)
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            }`}
          >
            {completedSteps.includes(currentStep) ? '✓ Done! Next →' : 'I did it! →'}
          </button>

          {/* Back Button */}
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="w-full mt-3 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              ← Go back
            </button>
          )}
        </div>

        {/* Steps Overview */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">All Steps</h3>
          <div className="space-y-3">
            {beginnerSteps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isCurrent = index === currentStep;

              return (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                    isCurrent ? 'bg-blue-100 ring-2 ring-blue-500' :
                    isCompleted ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? '✓' : step.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.duration}</p>
                  </div>
                  {isCurrent && <span className="text-blue-500">→</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Celebration */}
        {completedSteps.length === beginnerSteps.length && (
          <div className="mt-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl shadow-lg p-8 text-center text-white">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Amazing!</h2>
            <p className="text-xl mb-4">You finished all the beginner steps!</p>
            <button
              onClick={() => navigate('/lessons')}
              className="px-8 py-4 bg-white text-green-600 rounded-2xl font-bold text-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Learn Songs →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
