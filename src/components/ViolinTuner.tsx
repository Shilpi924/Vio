import { useState, useEffect, useRef } from 'react';
import { pitchDetectionService } from '../services/pitchDetectionService';

const STRINGS = [
  { name: 'G', frequency: 196.00, color: 'from-red-500 to-red-600', emoji: '🔴' },
  { name: 'D', frequency: 293.66, color: 'from-orange-500 to-orange-600', emoji: '🟠' },
  { name: 'A', frequency: 440.00, color: 'from-green-500 to-green-600', emoji: '🟢' },
  { name: 'E', frequency: 659.25, color: 'from-blue-500 to-blue-600', emoji: '🔵' },
];

export default function ViolinTuner() {
  const [currentString, setCurrentString] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [centsOff, setCentsOff] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTransitioningRef = useRef(false);

  const handleStringSelect = (index: number) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    
    setCurrentString(index);
    if (isListening) {
      setIsListening(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    setCentsOff(0);
    
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 200);
  };

  const startListening = async () => {
    if (isTransitioningRef.current || intervalRef.current) return;
    
    setIsListening(true);
    
    try {
      await pitchDetectionService.start((_noteName: string, frequency: number) => {
        const targetFreq = STRINGS[currentString].frequency;
        const freqDiff = frequency - targetFreq;
        setCentsOff(Math.round(freqDiff * 100 / targetFreq * 12)); // Convert Hz to cents
      });
    } catch (error) {
      console.error('Failed to start pitch detection:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    pitchDetectionService.stop();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsListening(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pitchDetectionService.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getTuningStatus = () => {
    if (!isListening) return 'idle';
    if (Math.abs(centsOff) < 5) return 'perfect';
    if (Math.abs(centsOff) < 15) return 'close';
    return 'off';
  };

  const getStatusEmoji = () => {
    const status = getTuningStatus();
    if (status === 'perfect') return '🎉';
    if (status === 'close') return '👍';
    if (status === 'off') return '🎯';
    return '🎤';
  };

  const getStatusMessage = () => {
    const status = getTuningStatus();
    if (status === 'perfect') return 'Perfect! 🎵';
    if (status === 'close') return centsOff > 0 ? 'Turn LEFT ⬅️' : 'Turn RIGHT ➡️';
    if (status === 'off') return centsOff > 0 ? 'Turn LEFT more ⬅️⬅️' : 'Turn RIGHT more ➡️➡️';
    return 'Tap to start!';
  };

  const getIndicatorColor = () => {
    const status = getTuningStatus();
    if (status === 'perfect') return 'from-green-400 to-green-600';
    if (status === 'close') return 'from-yellow-400 to-yellow-600';
    if (status === 'off') return 'from-red-400 to-red-600';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🎻 Violin Tuner</h2>
      
      {/* String Selection - Big Colorful Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {STRINGS.map((string, index) => (
          <button
            key={string.name}
            onClick={() => handleStringSelect(index)}
            className={`py-6 rounded-2xl font-bold text-white text-3xl transition-all transform hover:scale-105 active:scale-95 ${
              currentString === index
                ? `bg-gradient-to-br ${string.color} shadow-2xl scale-110 ring-4 ring-yellow-400`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="text-4xl mb-1">{string.emoji}</div>
            <div>{string.name}</div>
          </button>
        ))}
      </div>

      {/* Main Tuning Display */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6 border-4 border-purple-200">
        {/* Current String Display */}
        <div className="text-center mb-6">
          <div className="text-8xl font-bold text-gray-900 mb-2 animate-bounce">
            {STRINGS[currentString].emoji} {STRINGS[currentString].name}
          </div>
          <div className="text-xl text-gray-600 font-semibold">
            Tune this string!
          </div>
        </div>

        {/* Big Visual Indicator */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-inner">
          <div className="text-center mb-4">
            <div className="text-6xl mb-2">{getStatusEmoji()}</div>
            <div className="text-3xl font-bold text-gray-900">
              {getStatusMessage()}
            </div>
          </div>

          {/* Simple Left/Right Arrow Indicator */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all ${
              centsOff < -5 ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-400'
            }`}>
              ⬅️
            </div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl transition-all ${
              Math.abs(centsOff) < 5 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white scale-125 shadow-2xl animate-pulse' : 'bg-gray-200 text-gray-400'
            }`}>
              ✓
            </div>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all ${
              centsOff > 5 ? 'bg-gradient-to-br from-red-400 to-red-600 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-400'
            }`}>
              ➡️
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 bottom-0 left-1/2 w-4 bg-gradient-to-r ${getIndicatorColor()} transition-all duration-300 rounded-full`}
              style={{
                transform: `translateX(${Math.max(-45, Math.min(45, centsOff))}%)`,
              }}
            ></div>
            <div className="absolute top-0 bottom-0 w-2 bg-green-600 left-1/2 transform -translate-x-1/2 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Big Start/Stop Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`w-full py-6 rounded-2xl font-bold text-white text-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        }`}
      >
        {isListening ? '⏹️ Stop' : '🎤 Start Tuning'}
      </button>

      {/* Kid-Friendly Instructions */}
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-3">🎯 How to Tune:</h3>
        <ul className="text-base text-blue-800 space-y-2">
          <li>👆 Tap a string button (G, D, A, or E)</li>
          <li>🎤 Tap "Start Tuning" and pluck the string</li>
          <li>⬅️➡️ Turn your peg LEFT or RIGHT as shown</li>
          <li>✅ When you see the green checkmark, it's perfect!</li>
          <li>🎉 Do this for all 4 strings</li>
        </ul>
      </div>

      {/* Fun Tip */}
      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
        <p className="text-center text-lg font-semibold text-orange-800">
          💡 Tip: Tune the thickest string (G) first, then D, A, and finally the thinnest string (E)!
        </p>
      </div>
    </div>
  );
}
