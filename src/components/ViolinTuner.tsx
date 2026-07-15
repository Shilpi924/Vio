import { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

const STRINGS = [
  { name: 'G', frequency: 196.00, color: 'from-red-500 to-red-600' },
  { name: 'D', frequency: 293.66, color: 'from-orange-500 to-orange-600' },
  { name: 'A', frequency: 440.00, color: 'from-green-500 to-green-600' },
  { name: 'E', frequency: 659.25, color: 'from-blue-500 to-blue-600' },
];

export default function ViolinTuner() {
  const [currentString, setCurrentString] = useState(0);
  const [detectedFrequency, setDetectedFrequency] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [centsOff, setCentsOff] = useState(0);

  const handleStringSelect = (index: number) => {
    setCurrentString(index);
  };

  const startListening = () => {
    setIsListening(true);
    // In a real implementation, this would use the pitch detection service
    // For now, we'll simulate it
    const interval = setInterval(() => {
      const targetFreq = STRINGS[currentString].frequency;
      const randomOffset = (Math.random() - 0.5) * 10;
      setDetectedFrequency(targetFreq + randomOffset);
      setCentsOff(Math.round(randomOffset * 10));
    }, 100);
    
    return () => clearInterval(interval);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const getTuningStatus = () => {
    if (!isListening) return 'idle';
    if (Math.abs(centsOff) < 5) return 'perfect';
    if (Math.abs(centsOff) < 15) return 'close';
    return 'off';
  };

  const getStatusColor = () => {
    const status = getTuningStatus();
    if (status === 'perfect') return 'bg-green-500';
    if (status === 'close') return 'bg-yellow-500';
    if (status === 'off') return 'bg-red-500';
    return 'bg-gray-300';
  };

  const getStatusText = () => {
    const status = getTuningStatus();
    if (status === 'perfect') return '🎯 Perfect!';
    if (status === 'close') return centsOff > 0 ? '⬆️ Too high' : '⬇️ Too low';
    if (status === 'off') return centsOff > 0 ? '⬆️ Way too high' : '⬇️ Way too low';
    return 'Tap to start';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎻 Violin Tuner</h2>
      
      {/* String Selection */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STRINGS.map((string, index) => (
          <button
            key={string.name}
            onClick={() => handleStringSelect(index)}
            className={`py-4 rounded-xl font-bold text-white text-xl transition-all ${
              currentString === index
                ? `bg-gradient-to-br ${string.color} shadow-lg scale-105`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {string.name}
          </button>
        ))}
      </div>

      {/* Tuning Display */}
      <div className="bg-gray-100 rounded-xl p-6 mb-6">
        <div className="text-center mb-4">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {STRINGS[currentString].name}
          </div>
          <div className="text-lg text-gray-600">
            Target: {STRINGS[currentString].frequency.toFixed(2)} Hz
          </div>
        </div>

        {/* Frequency Display */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {isListening ? detectedFrequency.toFixed(2) : '---.--'}
            </div>
            <div className="text-sm text-gray-500">Hz</div>
          </div>
        </div>

        {/* Cents Indicator */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Flat</span>
            <span>In Tune</span>
            <span>Sharp</span>
          </div>
          <div className="relative h-4 bg-gray-300 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 bottom-0 w-2 ${getStatusColor()} transition-all`}
              style={{
                left: `${50 + (isListening ? Math.max(-50, Math.min(50, centsOff)) : 0)}%`,
                transform: 'translateX(-50%)',
              }}
            ></div>
            <div className="absolute top-0 bottom-0 w-1 bg-green-600 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="text-center mt-2 text-lg font-semibold text-gray-900">
            {getStatusText()}
          </div>
        </div>
      </div>

      {/* Control Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isListening ? '⏹️ Stop Tuning' : '🎤 Start Tuning'}
      </button>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How to Tune:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Select the string you want to tune</li>
          <li>2. Pluck the string and tap "Start Tuning"</li>
          <li>3. Adjust the peg until the indicator shows green</li>
          <li>4. Repeat for all strings (G-D-A-E)</li>
        </ul>
      </div>
    </div>
  );
}
