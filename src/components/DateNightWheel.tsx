import React, { useState } from 'react';
import { Compass, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio.ts';

const dateOptions = [
  { id: 1, title: 'Bữa tối lãng mạn ánh nến', desc: 'Nhà hàng ấm cúng, nâng ly chúc mừng 7 năm', color: '#e11d48' },
  { id: 2, title: 'Trà sữa & Lượn phố đêm', desc: 'Đèo em đi qua những con đường kỷ niệm', color: '#d97706' },
  { id: 3, title: 'Xem phim rạp ôm nhau', desc: 'Ghế đôi Sweetbox, bỏng ngô và tay nắm tay', color: '#7c3aed' },
  { id: 4, title: 'Nấu ăn tại nhà ấm cúng', desc: 'Cùng vào bếp nấu món em thích nhất', color: '#059669' },
  { id: 5, title: 'Cà phê Rooftop ngắm phố', desc: 'Ngắm thành phố lung linh ánh đèn về đêm', color: '#db2777' },
  { id: 6, title: 'Ăn kem & Hóng gió hồ Tây', desc: 'Nhìn mặt hồ phẳng lặng, tâm sự chuyện tương lai', color: '#2563eb' },
];

export const DateNightWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<typeof dateOptions[0] | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedPlan(null);

    // Random choice (0 to 5)
    const randomIndex = Math.floor(Math.random() * dateOptions.length);
    // Each segment is 60 degrees (360 / 6)
    const segmentAngle = 360 / dateOptions.length;
    // Extra full spins (5 to 8 turns)
    const extraTurns = (5 + Math.floor(Math.random() * 3)) * 360;
    // Calculate final rotation so the arrow points to the chosen item
    // Top pointer is at 270 or 90 depending on orientation. Let's aim at the top (270 deg)
    const targetAngle = extraTurns + (dateOptions.length - randomIndex) * segmentAngle - segmentAngle / 2;

    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    // Play ticking sounds during spin
    let ticks = 0;
    const tickInterval = setInterval(() => {
      audioService.playTick();
      ticks++;
      if (ticks > 18) clearInterval(tickInterval);
    }, 180);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = dateOptions[randomIndex];
      setSelectedPlan(chosen);
      audioService.playFireworksSound();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#c084fc'],
      });
    }, 3800);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-sans tracking-widest uppercase font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Vòng Quay Định Mệnh Ngày Mai 25/09</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
          Tối Mai Chúng Mình Sẽ Làm Gì?
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 font-sans">
          Chạm vào vòng quay để chọn kế hoạch hẹn hò bí mật cho buổi tối kỷ niệm 7 năm nhé!
        </p>
      </div>

      {/* Wheel Area */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto">
        {/* Top Pointer Needle */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-md" />

        {/* Outer Ring */}
        <div className="w-full h-full rounded-full p-2 bg-stone-900 border-4 border-amber-400/80 shadow-2xl shadow-rose-950/50">
          <div
            className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[3800ms] ease-out shadow-inner"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* SVG Wheel Segments */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {dateOptions.map((opt, i) => {
                const angle = 360 / dateOptions.length;
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;

                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <path
                    key={opt.id}
                    d={pathData}
                    fill={opt.color}
                    opacity="0.85"
                    stroke="#1c1917"
                    strokeWidth="0.8"
                  />
                );
              })}
            </svg>

            {/* Labels inside wheel */}
            {dateOptions.map((opt, i) => {
              const angle = (360 / dateOptions.length) * i + 30;
              return (
                <div
                  key={opt.id}
                  className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  <span className="text-[10px] font-bold text-white tracking-tight drop-shadow max-w-[85px] truncate">
                    {opt.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Spin Button Hub */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-stone-900 font-bold text-xs font-serif uppercase tracking-wider shadow-lg flex flex-col items-center justify-center border-2 border-white active:scale-95 disabled:opacity-80 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-stone-900 mb-0.5" />
          <span>{isSpinning ? '...' : 'QUAY'}</span>
        </button>
      </div>

      {/* Result Display */}
      {selectedPlan && (
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-amber-400/40 text-stone-100 shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Kế Hoạch Cho Ngày Mai Đã Chọn!</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-200">
            {selectedPlan.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 font-sans italic">
            "{selectedPlan.desc}"
          </p>

          <p className="text-xs text-rose-300 pt-2 font-medium font-sans">
            ❤️ Chốt kèo! Tối mai 19:00 anh qua đón em nhé công chúa!
          </p>
        </div>
      )}
    </div>
  );
};
