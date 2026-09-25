import React from 'react';

interface FloatingPetalsProps {
  enabled: boolean;
}

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({ enabled }) => {
  if (!enabled) return null;

  // Generate 16 gentle floating elements with varying positions and delays
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 5.8) % 96}%`,
    duration: 12 + (i % 7) * 2.5,
    delay: (i % 6) * 1.8,
    size: 14 + (i % 4) * 6,
    opacity: 0.35 + (i % 3) * 0.2,
    rotate: (i * 45) % 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute -top-10 transition-transform"
          style={{
            left: petal.left,
            animation: `fallGentle ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
            opacity: petal.opacity,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            fill="none"
            className="text-rose-400/60 drop-shadow-sm"
            style={{ transform: `rotate(${petal.rotate}deg)` }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes fallGentle {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(30px) rotate(180deg);
          }
          100% {
            transform: translateY(105vh) translateX(-20px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
