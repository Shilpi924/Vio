import { useState, useEffect } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface Note {
  name: string;
  frequency: number;
  color: string;
}

const notes: Note[] = [
  { name: 'G3', frequency: 196.00, color: 'from-red-500 to-red-600' },
  { name: 'A3', frequency: 220.00, color: 'from-orange-500 to-orange-600' },
  { name: 'B3', frequency: 246.94, color: 'from-yellow-500 to-yellow-600' },
  { name: 'C4', frequency: 261.63, color: 'from-green-500 to-green-600' },
  { name: 'D4', frequency: 293.66, color: 'from-blue-500 to-blue-600' },
  { name: 'E4', frequency: 329.63, color: 'from-indigo-500 to-indigo-600' },
  { name: 'F#4', frequency: 369.99, color: 'from-purple-500 to-purple-600' },
  { name: 'G4', frequency: 392.00, color: 'from-pink-500 to-pink-600' },
  { name: 'A4', frequency: 440.00, color: 'from-rose-500 to-rose-600' },
  { name: 'B4', frequency: 493.88, color: 'from-amber-500 to-amber-600' },
  { name: 'C5', frequency: 523.25, color: 'from-teal-500 to-teal-600' },
  { name: 'D5', frequency: 587.33, color: 'from-cyan-500 to-cyan-600' },
];

export default function NoteMatchingGame() {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const { playSuccessSound, playClickSound } = useSoundEffects();

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    
    // Set time based on difficulty
    if (difficulty === 'easy') setTimeLeft(60);
    else if (difficulty === 'medium') setTimeLeft(45);
    else setTimeLeft(30);
    
    pickRandomNote();
    playClickSound();
  };

  const endGame = () => {
    setIsPlaying(false);
    setCurrentNote(null);
  };

  const pickRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * notes.length);
    setCurrentNote(notes[randomIndex]);
  };

  const handleNoteClick = (note: Note) => {
    if (!currentNote || !isPlaying) return;

    if (note.name === currentNote.name) {
      playSuccessSound();
      setScore(score + 10 + streak * 2);
      setStreak(streak + 1);
      setShowFeedback({ correct: true, message: `Correct! +${10 + streak * 2} points` });
      setTimeout(() => {
        setShowFeedback(null);
        pickRandomNote();
      }, 1000);
    } else {
      setStreak(0);
      setShowFeedback({ correct: false, message: `Try again! That was ${note.name}` });
      setTimeout(() => setShowFeedback(null), 1000);
    }
  };

  const getStreakEmoji = () => {
    if (streak >= 10) return '🔥🔥🔥';
    if (streak >= 5) return '🔥🔥';
    if (streak >= 3) return '🔥';
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🎵 Note Matching Game</h2>

      {!isPlaying ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎻</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Test Your Note Knowledge!</h3>
          <p className="text-gray-600 mb-6">Match the displayed note with the correct button. Build streaks for bonus points!</p>
          
          {/* Difficulty Selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Select Difficulty:</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  difficulty === 'easy' 
                    ? 'bg-green-500 text-white scale-105' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Easy (60s)
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  difficulty === 'medium' 
                    ? 'bg-yellow-500 text-white scale-105' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Medium (45s)
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  difficulty === 'hard' 
                    ? 'bg-red-500 text-white scale-105' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Hard (30s)
              </button>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Start Game
          </button>
          {score > 0 && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-lg font-semibold text-purple-900">Last Score: {score}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Game Header */}
          <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{score}</div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{timeLeft}s</div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {streak} {getStreakEmoji()}
              </div>
              <div className="text-xs text-gray-600">Streak</div>
            </div>
          </div>

          {/* Current Note Display */}
          {currentNote && (
            <div className="text-center mb-8 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
              <p className="text-lg text-gray-600 mb-2">Find this note:</p>
              <div className="text-8xl font-bold text-gray-900 mb-2 animate-bounce">
                {currentNote.name}
              </div>
              <p className="text-sm text-gray-500">Click the matching note below</p>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className={`text-center p-4 rounded-lg mb-6 ${
              showFeedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-semibold">{showFeedback.message}</p>
            </div>
          )}

          {/* Note Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {notes.map((note) => (
              <button
                key={note.name}
                onClick={() => handleNoteClick(note)}
                disabled={!isPlaying}
                className={`py-6 rounded-xl font-bold text-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br ${note.color} text-white shadow-lg`}
              >
                {note.name}
              </button>
            ))}
          </div>

          {/* End Game Button */}
          <button
            onClick={endGame}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            End Game
          </button>
        </div>
      )}

      {/* Game Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">💡 Game Tips:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Build streaks for bonus points (streak × 2)</li>
          <li>• Learn notes across multiple octaves (G3-D5)</li>
          <li>• Practice makes perfect - play often!</li>
          <li>• Try to beat your high score</li>
          <li>• Challenge yourself with harder difficulties</li>
        </ul>
      </div>
    </div>
  );
}
