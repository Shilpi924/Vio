import { useState, useEffect } from 'react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: 'home',
    title: 'Welcome to Violin Mentor! 🎻',
    content: 'This is your home dashboard. Let me show you around so you can start learning violin today!',
    position: 'bottom',
  },
  {
    target: 'learn',
    title: 'Start Here - Learn',
    content: 'Click here to begin your step-by-step learning journey. We start with the basics like holding your violin.',
    position: 'bottom',
  },
  {
    target: 'practice',
    title: 'Practice Freely',
    content: 'Use this to practice what you\'ve learned. You can play around with notes and sounds.',
    position: 'bottom',
  },
  {
    target: 'play',
    title: 'Learn Songs',
    content: 'Once you\'re comfortable, try learning real songs like Twinkle Twinkle!',
    position: 'bottom',
  },
  {
    target: 'tools',
    title: 'Quick Tools',
    content: 'These are helpful tools like the tuner to keep your violin sounding perfect.',
    position: 'top',
  },
  {
    target: 'progress',
    title: 'Track Your Progress',
    content: 'See how much you\'ve practiced and your streak. Keep it going!',
    position: 'top',
  },
];

interface GuidedTourProps {
  show: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function GuidedTour({ show, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    if (show) {
      // Find the target element
      const targetId = tourSteps[currentStep].target;
      const targetElement = document.getElementById(`tour-${targetId}`);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  }, [show, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!show) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Highlight overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 pointer-events-none" />
      
      {/* Highlight box */}
      <div
        className="fixed border-4 border-yellow-400 rounded-lg z-40 pointer-events-none transition-all duration-300"
        style={{
          top: highlightPosition.top - 4,
          left: highlightPosition.left - 4,
          width: highlightPosition.width + 8,
          height: highlightPosition.height + 8,
        }}
      />

      {/* Tour tooltip */}
      <div
        className="fixed z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 transition-all duration-300"
        style={{
          top: step.position === 'top' ? highlightPosition.top - 200 : highlightPosition.top + highlightPosition.height + 20,
          left: highlightPosition.left,
        }}
      >
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? 'w-4 bg-purple-600' : 
                index < currentStep ? 'w-2 bg-purple-400' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
          <p className="text-gray-600">{step.content}</p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105"
          >
            {currentStep === tourSteps.length - 1 ? 'Got it! ✓' : 'Next →'}
          </button>
        </div>

        {/* Skip button */}
        {currentStep < tourSteps.length - 1 && (
          <button
            onClick={onSkip}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip tour
          </button>
        )}
      </div>
    </>
  );
}

// Hook for managing guided tour state
export function useGuidedTour() {
  const [showTour, setShowTour] = useState(false);

  const startTour = () => setShowTour(true);
  const endTour = () => setShowTour(false);

  return {
    showTour,
    startTour,
    endTour,
  };
}
