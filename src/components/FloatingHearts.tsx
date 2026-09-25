import React, { useEffect, useState, useCallback, useRef } from 'react';

interface FloatingHeartItem {
  id: string;
  left: number; // percentage (0-100) or px
  bottom?: number;
  startX?: number;
  size: number;
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  color: string;
  drift: number; // horizontal drift in px (-50 to +50)
  rotation: number; // degrees
  scale: number;
}

interface FloatingHeartsProps {
  enabled?: boolean;
}

const HEART_COLORS = [
  '#f43f5e', // rose-500
  '#fb7185', // rose-400
  '#fda4af', // rose-300
  '#ec4899', // pink-500
  '#f472b6', // pink-400
  '#f9a8d4', // pink-300
  '#fbbf24', // amber gold sparkle
  '#e11d48', // rose-600
];

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ enabled = true }) => {
  const [hearts, setHearts] = useState<FloatingHeartItem[]>([]);
  const lastScrollY = useRef(0);
  const scrollThrottle = useRef<number | null>(null);
  const heartCounter = useRef(0);

  // Helper to spawn a new floating heart
  const spawnHeart = useCallback(
    (customProps: Partial<FloatingHeartItem> = {}) => {
      if (!enabled) return;

      const id = `heart-${Date.now()}-${heartCounter.current++}`;
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      const size = Math.floor(Math.random() * 14) + 12; // 12px to 26px
      const duration = Math.random() * 4 + 7; // 7s to 11s for a gentle, dreamy float
      const drift = (Math.random() - 0.5) * 80; // -40px to +40px gentle swaying
      const opacity = Math.random() * 0.45 + 0.35; // 0.35 to 0.8
      const rotation = (Math.random() - 0.5) * 45;

      const newHeart: FloatingHeartItem = {
        id,
        left: customProps.left ?? Math.random() * 94 + 3, // 3% to 97% of screen width
        size: customProps.size ?? size,
        duration: customProps.duration ?? duration,
        delay: customProps.delay ?? 0,
        opacity: customProps.opacity ?? opacity,
        color: customProps.color ?? color,
        drift,
        rotation,
        scale: Math.random() * 0.4 + 0.8,
        ...customProps,
      };

      setHearts((prev) => {
        // Keep maximum 32 hearts active simultaneously to maintain silky smooth 60fps
        const sliced = prev.length > 30 ? prev.slice(prev.length - 28) : prev;
        return [...sliced, newHeart];
      });

      // Cleanup heart after animation finishes
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, (newHeart.duration + (newHeart.delay || 0) + 1) * 1000);
    },
    [enabled]
  );

  // 1. Initial batch of gentle ambient hearts so page immediately feels alive
  useEffect(() => {
    if (!enabled) {
      setHearts([]);
      return;
    }

    // Seed 7 ambient hearts staggered across the screen
    for (let i = 0; i < 7; i++) {
      spawnHeart({
        delay: i * 0.8,
        left: Math.random() * 90 + 5,
      });
    }

    // 2. Periodic automatic gentle appearance
    const autoInterval = setInterval(() => {
      // 1 to 2 random hearts floating up naturally
      const count = Math.random() > 0.4 ? 1 : 2;
      for (let i = 0; i < count; i++) {
        spawnHeart();
      }
    }, 1800);

    return () => clearInterval(autoInterval);
  }, [enabled, spawnHeart]);

  // 3. Scroll-triggered hearts rising from bottom as user scrolls
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY.current);

      if (delta > 35) {
        lastScrollY.current = currentScrollY;

        if (scrollThrottle.current === null) {
          scrollThrottle.current = window.setTimeout(() => {
            // Spawn 1 or 2 small hearts on scroll
            const count = Math.random() > 0.5 ? 2 : 1;
            for (let i = 0; i < count; i++) {
              spawnHeart({
                // Bias slightly towards edges or center for visual balance
                left: Math.random() * 92 + 4,
                duration: Math.random() * 3 + 6, // slightly faster on scroll
              });
            }
            scrollThrottle.current = null;
          }, 120);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollThrottle.current !== null) {
        clearTimeout(scrollThrottle.current);
      }
    };
  }, [enabled, spawnHeart]);

  // 4. Subtle interactive click/tap romantic effect: hearts blossom near pointer
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // Don't trigger if user is clicking an input, textarea or button
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('input') ||
        target?.closest('textarea') ||
        target?.closest('a')
      ) {
        return;
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const leftPercent = (clientX / window.innerWidth) * 100;

      // Spawn a cute tiny heart floating up from bottom or near click
      spawnHeart({
        left: Math.max(4, Math.min(96, leftPercent + (Math.random() - 0.5) * 8)),
        size: Math.floor(Math.random() * 8) + 14,
        duration: Math.random() * 2 + 5,
        opacity: 0.9,
      });
    };

    window.addEventListener('click', handlePointerDown);
    return () => window.removeEventListener('click', handlePointerDown);
  }, [enabled, spawnHeart]);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute will-change-transform"
          style={{
            left: `${h.left}%`,
            bottom: '-35px',
            animation: `floatHeartUp ${h.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
            ['--drift' as string]: `${h.drift}px`,
            ['--rot' as string]: `${h.rotation}deg`,
            ['--scale' as string]: h.scale,
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              filter: `drop-shadow(0 2px 6px ${h.color}66)`,
              transform: `scale(${h.scale}) rotate(${h.rotation}deg)`,
            }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={h.color}
            />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes floatHeartUp {
          0% {
            transform: translate3d(0, 0, 0) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--tw-opacity, 0.85);
            transform: translate3d(calc(var(--drift) * 0.2), -15vh, 0) scale(1) rotate(calc(var(--rot) * 0.5));
          }
          50% {
            transform: translate3d(var(--drift), -55vh, 0) scale(1.05) rotate(var(--rot));
          }
          85% {
            opacity: 0.6;
            transform: translate3d(calc(var(--drift) * 0.7), -90vh, 0) scale(0.95) rotate(calc(var(--rot) * 1.2));
          }
          100% {
            transform: translate3d(var(--drift), -115vh, 0) scale(0.7) rotate(calc(var(--rot) * 1.5));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
