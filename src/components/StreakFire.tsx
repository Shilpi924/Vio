import { useEffect, useState } from 'react';

interface StreakFireProps {
  streak: number;
  show: boolean;
  onComplete?: () => void;
}

export default function StreakFire({ streak, show, onComplete }: StreakFireProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (show && streak > 0) {
      const newParticles = [];
      const colors = ['#FF6B6B', '#FF8E53', '#FFA726', '#FFD54F', '#FF7043'];
      
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 500,
        });
      }
      
      setParticles(newParticles);
      
      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, streak, onComplete]);

  if (!show || streak === 0) return null;

  const getStreakMessage = () => {
    if (streak >= 30) return '🔥 Amazing! 30+ Day Streak!';
    if (streak >= 14) return '🔥 Two Week Streak!';
    if (streak >= 7) return '🔥 One Week Streak!';
    if (streak >= 3) return '🔥 3 Day Streak!';
    return `🔥 ${streak} Day Streak!`;
  };

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🌟';
    if (streak >= 3) return '✨';
    return '🔥';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="relative">
        {/* Fire particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}ms`,
              opacity: 0.8,
              filter: 'blur(2px)',
            }}
          />
        ))}
        
        {/* Main streak display */}
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-4 animate-bounce">{getStreakEmoji()}</div>
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {streak} Days
          </div>
          <div className="text-2xl text-white drop-shadow-lg">
            {getStreakMessage()}
          </div>
        </div>
      </div>
    </div>
  );
}
