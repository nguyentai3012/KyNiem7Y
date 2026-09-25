import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio.ts';

export const HeartbeatSync: React.FC = () => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const timerRef = useRef<any>(null);
  const heartbeatIntervalRef = useRef<any>(null);

  const startHolding = () => {
    if (isUnlocked) return;
    setIsPressing(true);

    // Play immediate first beat
    audioService.playHeartbeat();

    // Pulse heartbeat every 800ms (75 bpm)
    heartbeatIntervalRef.current = setInterval(() => {
      audioService.playHeartbeat();
    }, 800);

    // Progress counter
    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds to unlock

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProg = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProg);

      if (elapsed >= duration) {
        clearInterval(timerRef.current);
        clearInterval(heartbeatIntervalRef.current);
        setIsUnlocked(true);
        setIsPressing(false);
        audioService.playFireworksSound();

        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#e11d48', '#fda4af', '#f43f5e', '#ffd700'],
        });
      }
    }, 50);
  };

  const stopHolding = () => {
    if (isUnlocked) return;
    setIsPressing(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-5 max-w-lg mx-auto text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-sans tracking-widest uppercase font-semibold">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Hòa Nhịp Trái Tim 2,557 Ngày</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
          Chạm Vào Trái Tim Anh
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 font-sans">
          {isUnlocked
            ? 'Hai trái tim đã đồng điệu trọn vẹn!'
            : 'Chạm và giữ tay lên trái tim trong 3 giây để cảm nhận nhịp đập anh dành cho em...'}
        </p>
      </div>

      {/* Heart Hold Area */}
      <div className="py-4 flex flex-col items-center justify-center">
        <div className="relative">
          {/* Pulsing ripple wave when holding */}
          {isPressing && (
            <>
              <div className="absolute inset-0 rounded-full bg-rose-600/30 animate-ping pointer-events-none" />
              <div className="absolute -inset-4 rounded-full bg-rose-500/20 blur-md animate-pulse pointer-events-none" />
            </>
          )}

          {/* Central Heart Button */}
          <button
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 transition-all duration-300 flex flex-col items-center justify-center select-none shadow-2xl relative z-10 active:scale-95 ${
              isUnlocked
                ? 'bg-gradient-to-br from-rose-600 to-red-700 border-amber-300 text-amber-100 shadow-rose-900/60'
                : isPressing
                ? 'bg-rose-900 border-rose-400 text-rose-200 scale-105 shadow-rose-950'
                : 'bg-stone-900 hover:bg-stone-850 border-rose-500/30 text-rose-400 hover:border-rose-400/60'
            }`}
          >
            <Heart
              className={`w-12 h-12 transition-transform ${
                isUnlocked
                  ? 'fill-amber-200 text-amber-200 scale-110 animate-pulse'
                  : isPressing
                  ? 'fill-rose-500 text-rose-500 scale-125 animate-bounce'
                  : 'fill-rose-500/50 text-rose-500'
              }`}
            />
            <span className="text-[11px] font-sans font-semibold mt-1 tracking-wider uppercase">
              {isUnlocked ? 'ĐÃ ĐỒNG ĐIỆU' : isPressing ? `${progress}%` : 'GIỮ TAY VÀO ĐÂY'}
            </span>
          </button>
        </div>

        {/* Progress indicator bar */}
        {!isUnlocked && isPressing && (
          <div className="w-48 bg-stone-900 h-1.5 rounded-full overflow-hidden mt-4 border border-stone-800">
            <div
              className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Secret Message Revealed */}
      {isUnlocked && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950/90 border border-rose-400/50 shadow-2xl text-stone-200 text-sm font-serif italic space-y-2 animate-in fade-in zoom-in-95 duration-400">
          <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-sans not-italic font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thông Điệp Bí Mật Được Mở Khóa</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-stone-100">
            "Dù 7 năm hay 70 năm nữa, mỗi khi ở cạnh em, trái tim anh vẫn luôn rung động bồi hồi như ngày 25/09/2019 đầu tiên. Cảm ơn em đã là nhịp đập dịu dàng nhất trong cuộc đời anh."
          </p>
          <div className="text-xs text-rose-400 font-sans not-italic font-medium pt-1">
            ❤️ 2,557 ngày cùng một nhịp tim
          </div>
        </div>
      )}
    </div>
  );
};
