import { useState, useEffect } from 'react';

export default function Metronome() {
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const beatDuration = (60 / bpm) * 1000;
      interval = setInterval(() => {
        setCurrentBeat((prev) => (prev + 1) % beatsPerMeasure);
        // In a real implementation, this would play a click sound
        playClick();
      }, beatDuration);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm, beatsPerMeasure]);

  const playClick = () => {
    // Simulate click sound - in real implementation, use audio API
    console.log('Click');
  };

  const toggleMetronome = () => {
    setIsPlaying(!isPlaying);
  };

  const adjustBpm = (delta: number) => {
    setBpm((prev) => Math.max(40, Math.min(240, prev + delta)));
  };

  const getBeatColor = (beat: number) => {
    if (beat === 0) return 'bg-red-500'; // Downbeat
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎵 Metronome</h2>

      {/* BPM Display */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-8 mb-6 text-white text-center">
        <div className="text-8xl font-bold mb-4 font-mono">{bpm}</div>
        <div className="text-xl">BPM</div>
      </div>

      {/* Beat Indicators */}
      <div className="flex justify-center gap-3 mb-6">
        {Array.from({ length: beatsPerMeasure }).map((_, index) => (
          <div
            key={index}
            className={`w-12 h-12 rounded-full transition-all ${
              currentBeat === index
                ? getBeatColor(index) + ' scale-110 shadow-lg'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* BPM Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => adjustBpm(-5)}
          className="w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl font-bold transition-all"
        >
          -
        </button>
        <button
          onClick={() => adjustBpm(-1)}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold transition-all"
        >
          -
        </button>
        <button
          onClick={() => adjustBpm(1)}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold transition-all"
        >
          +
        </button>
        <button
          onClick={() => adjustBpm(5)}
          className="w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl font-bold transition-all"
        >
          +
        </button>
      </div>

      {/* Time Signature */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Beats per Measure: {beatsPerMeasure}/4
        </label>
        <div className="flex gap-2">
          {[2, 3, 4, 6].map((beats) => (
            <button
              key={beats}
              onClick={() => setBeatsPerMeasure(beats)}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                beatsPerMeasure === beats
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {beats}/4
            </button>
          ))}
        </div>
      </div>

      {/* Play/Stop Button */}
      <button
        onClick={toggleMetronome}
        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all mb-6 ${
          isPlaying
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isPlaying ? '⏹️ Stop' : '▶️ Start'}
      </button>

      {/* Preset Tempos */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Common Tempos:</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Largo', bpm: 60 },
            { name: 'Andante', bpm: 76 },
            { name: 'Moderato', bpm: 108 },
            { name: 'Allegro', bpm: 120 },
          ].map((tempo) => (
            <button
              key={tempo.name}
              onClick={() => setBpm(tempo.bpm)}
              className="py-2 px-3 rounded-lg bg-white hover:bg-gray-200 text-sm font-medium transition-all"
            >
              {tempo.name} ({tempo.bpm})
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Practice Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Start slow (60-80 BPM) and gradually increase</li>
          <li>• Practice difficult passages at half speed</li>
          <li>• Use the metronome for scales and exercises</li>
          <li>• Keep steady rhythm even when playing slowly</li>
        </ul>
      </div>
    </div>
  );
}
