import { useEffect, useState } from 'react';

interface CelebrationProps {
  show: boolean;
  onComplete?: () => void;
  message?: string;
  emoji?: string;
}

export default function Celebration({ show, onComplete, message = "Great job!", emoji = "🎉" }: CelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      // Create confetti particles
      const emojis = ['🎉', '⭐', '🌟', '✨', '🎊', '💫', '🏆', '🎵'];
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-4xl animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${1 + Math.random()}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Main celebration message */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center transform animate-pulse max-w-md mx-4">
        <div className="text-8xl mb-6 animate-bounce">{emoji}</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{message}</h2>
        <div className="flex justify-center gap-2 text-6xl">
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</span>
        </div>
      </div>
    </div>
  );
}

// Hook for triggering celebrations
export function useCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("Great job!");
  const [celebrationEmoji, setCelebrationEmoji] = useState("🎉");

  const celebrate = (message?: string, emoji?: string) => {
    setCelebrationMessage(message || "Great job!");
    setCelebrationEmoji(emoji || "🎉");
    setShowCelebration(true);
  };

  const hideCelebration = () => {
    setShowCelebration(false);
  };

  return {
    showCelebration,
    celebrate,
    hideCelebration,
    celebrationMessage,
    celebrationEmoji,
  };
}
