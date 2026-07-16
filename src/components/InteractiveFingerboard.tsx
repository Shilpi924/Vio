import { useState } from 'react';

const STRINGS = [
  { name: 'G', color: 'from-red-500 to-red-600', frequency: 196.00 },
  { name: 'D', color: 'from-orange-500 to-orange-600', frequency: 293.66 },
  { name: 'A', color: 'from-green-500 to-green-600', frequency: 440.00 },
  { name: 'E', color: 'from-blue-500 to-blue-600', frequency: 659.25 },
];

const FINGER_POSITIONS = {
  'G': [
    { note: 'G', finger: 0, position: 'Open string', description: 'No finger - play the string as is' },
    { note: 'A', finger: 1, position: 'First finger', description: 'Place finger close to the nut' },
    { note: 'B', finger: 2, position: 'Second finger', description: 'Place finger a bit further down' },
    { note: 'C', finger: 3, position: 'Third finger', description: 'Place finger further down' },
    { note: 'D', finger: 4, position: 'Fourth finger', description: 'Place finger near the end of fingerboard' },
  ],
  'D': [
    { note: 'D', finger: 0, position: 'Open string', description: 'No finger - play the string as is' },
    { note: 'E', finger: 1, position: 'First finger', description: 'Place finger close to the nut' },
    { note: 'F#', finger: 2, position: 'Second finger', description: 'Place finger a bit further down' },
    { note: 'G', finger: 3, position: 'Third finger', description: 'Place finger further down' },
    { note: 'A', finger: 4, position: 'Fourth finger', description: 'Place finger near the end of fingerboard' },
  ],
  'A': [
    { note: 'A', finger: 0, position: 'Open string', description: 'No finger - play the string as is' },
    { note: 'B', finger: 1, position: 'First finger', description: 'Place finger close to the nut' },
    { note: 'C#', finger: 2, position: 'Second finger', description: 'Place finger a bit further down' },
    { note: 'D', finger: 3, position: 'Third finger', description: 'Place finger further down' },
    { note: 'E', finger: 4, position: 'Fourth finger', description: 'Place finger near the end of fingerboard' },
  ],
  'E': [
    { note: 'E', finger: 0, position: 'Open string', description: 'No finger - play the string as is' },
    { note: 'F#', finger: 1, position: 'First finger', description: 'Place finger close to the nut' },
    { note: 'G#', finger: 2, position: 'Second finger', description: 'Place finger a bit further down' },
    { note: 'A', finger: 3, position: 'Third finger', description: 'Place finger further down' },
    { note: 'B', finger: 4, position: 'Fourth finger', description: 'Place finger near the end of fingerboard' },
  ],
};

export default function InteractiveFingerboard() {
  const [selectedString, setSelectedString] = useState(0);
  const [selectedFinger, setSelectedFinger] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  const currentString = STRINGS[selectedString];
  const positions = FINGER_POSITIONS[currentString.name as keyof typeof FINGER_POSITIONS];

  const handleStringClick = (index: number) => {
    setSelectedString(index);
    setSelectedFinger(null);
  };

  const handleFingerClick = (finger: number) => {
    setSelectedFinger(finger);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🎻 Interactive Fingerboard</h2>
      
      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">🎯 How to Use:</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Tap a string to see where to place your fingers</li>
          <li>• Tap a finger position to see the note name</li>
          <li>• Practice finding each note on your violin</li>
        </ul>
      </div>

      {/* String Selection */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STRINGS.map((string, index) => (
          <button
            key={string.name}
            onClick={() => handleStringClick(index)}
            className={`py-4 rounded-xl font-bold text-white text-xl transition-all transform hover:scale-105 ${
              selectedString === index
                ? `bg-gradient-to-br ${string.color} shadow-lg scale-110 ring-4 ring-yellow-400`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {string.name}
          </button>
        ))}
      </div>

      {/* Fingerboard Visualization */}
      <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-6 mb-6 border-4 border-amber-300">
        <div className="relative">
          {/* Fingerboard representation */}
          <div className="space-y-3">
            {positions.map((pos, index) => (
              <div
                key={pos.note}
                onClick={() => handleFingerClick(index)}
                className={`relative h-16 rounded-lg cursor-pointer transition-all ${
                  selectedFinger === index
                    ? `bg-gradient-to-r ${currentString.color} shadow-lg scale-105 ring-4 ring-yellow-400`
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {/* Finger indicator */}
                {pos.finger > 0 && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      selectedFinger === index
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-gray-400'
                    }`}>
                      {pos.finger}
                    </div>
                  </div>
                )}

                {/* Note name */}
                {showLabels && (
                  <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
                    <span className={`text-2xl font-bold ${
                      selectedFinger === index ? 'text-white' : 'text-gray-800'
                    }`}>
                      {pos.note}
                    </span>
                  </div>
                )}

                {/* Position label */}
                {showLabels && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className={`text-sm font-medium ${
                      selectedFinger === index ? 'text-white' : 'text-gray-600'
                    }`}>
                      {pos.position}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Nut indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-800 rounded-l"></div>
        </div>
      </div>

      {/* Selected note details */}
      {selectedFinger !== null && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 animate-pulse">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-900 mb-2">
              {positions[selectedFinger].note} on {currentString.name} String
            </h3>
            <p className="text-lg text-purple-800 mb-2">
              {positions[selectedFinger].position}
            </p>
            <p className="text-purple-700">
              {positions[selectedFinger].description}
            </p>
          </div>
        </div>
      )}

      {/* Toggle labels */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
        <h3 className="font-bold text-orange-900 mb-2">💡 Pro Tips:</h3>
        <ul className="text-orange-800 space-y-1 text-sm">
          <li>• Keep your fingers curved and relaxed</li>
          <li>• Press firmly but don't squeeze</li>
          <li>• Use the fingertip, not the pad</li>
          <li>• Keep your thumb behind the neck</li>
        </ul>
      </div>
    </div>
  );
}
