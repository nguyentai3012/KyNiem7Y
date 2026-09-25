import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Sparkles, Clock, Compass } from 'lucide-react';
import { CoupleSettings } from '../types.ts';

interface HeroLoveCounterProps {
  settings: CoupleSettings;
  onOpenLetter: () => void;
  onScrollToSection: (sectionId: string) => void;
}

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export const HeroLoveCounter: React.FC<HeroLoveCounterProps> = ({
  settings,
  onOpenLetter,
  onScrollToSection,
}) => {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 7,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 2557,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(settings.startDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // Estimate years & days
      const startDateObj = new Date(settings.startDate);
      const nowDateObj = new Date();

      let years = nowDateObj.getFullYear() - startDateObj.getFullYear();
      let mDiff = nowDateObj.getMonth() - startDateObj.getMonth();
      let dDiff = nowDateObj.getDate() - startDateObj.getDate();

      if (dDiff < 0) {
        mDiff--;
        dDiff += 30;
      }
      if (mDiff < 0) {
        years--;
        mDiff += 12;
      }

      setTimeElapsed({
        years: Math.max(0, years),
        months: Math.max(0, mDiff),
        days: Math.max(0, dDiff),
        hours,
        minutes,
        seconds,
        totalDays,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.startDate]);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-stone-800/80">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Subtle unboxed metadata kicker */}
        <div className="inline-flex items-center gap-2 text-xs md:text-sm text-rose-300/80 mb-4 tracking-wide font-sans">
          <span>Kỷ niệm tình yêu</span>
          <span aria-hidden="true">·</span>
          <span>25 Tháng 09, 2019</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-300 font-medium">Tròn 7 Năm Gắn Bó</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-100 font-bold tracking-tight mb-4 text-balance max-w-3xl mx-auto leading-tight">
          Hành Trình 7 Năm Yêu Em & Vô Vàn Ngày Nắng Đẹp
        </h1>

        {/* Subtitle / romantic note */}
        <p className="text-stone-300 text-sm sm:text-base md:text-lg font-sans max-w-2xl mx-auto mb-10 leading-relaxed">
          {settings.anniversaryMessage}
        </p>

        {/* Live Counter Display - Elegant Monospace / Tabular Display */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md max-w-4xl mx-auto mb-12 shadow-xl shadow-black/40">
          <div className="flex items-center justify-center gap-2 text-xs text-rose-400 uppercase tracking-widest font-semibold mb-6">
            <Clock className="w-3.5 h-3.5" />
            <span>Thời Gian Đã Cùng Nhau Đi Qua</span>
          </div>

          {/* Primary Big Counter Units */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 flex flex-col items-center">
              <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-rose-400 tabular-nums">
                {timeElapsed.totalDays.toLocaleString()}
              </span>
              <span className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-sans">
                Ngày Yêu Thương
              </span>
            </div>

            <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 flex flex-col items-center">
              <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-amber-300 tabular-nums">
                {String(timeElapsed.hours).padStart(2, '0')}
              </span>
              <span className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-sans">
                Giờ
              </span>
            </div>

            <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 flex flex-col items-center">
              <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 tabular-nums">
                {String(timeElapsed.minutes).padStart(2, '0')}
              </span>
              <span className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-sans">
                Phút
              </span>
            </div>

            <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 flex flex-col items-center">
              <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-rose-500 tabular-nums animate-pulse">
                {String(timeElapsed.seconds).padStart(2, '0')}
              </span>
              <span className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-sans">
                Giây Từng Nhịp Đập
              </span>
            </div>
          </div>

          {/* Quantitative Emotional Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-stone-800/80 text-left">
            <div className="px-3 py-2">
              <div className="text-xs text-stone-400 font-sans">Cột mốc kỷ niệm</div>
              <div className="text-base font-semibold text-stone-200 mt-0.5 font-serif">
                7 Năm Tròn (25.09.2019 - 25.09.2026)
              </div>
              <div className="text-xs text-stone-500 mt-0.5">2,557 ngày trọn vẹn yêu thương</div>
            </div>

            <div className="px-3 py-2 border-t sm:border-t-0 sm:border-l border-stone-800/80">
              <div className="text-xs text-stone-400 font-sans">Thời gian đồng hành</div>
              <div className="text-base font-semibold text-stone-200 mt-0.5 font-mono tabular-nums">
                ~61,368+ Giờ
              </div>
              <div className="text-xs text-stone-500 mt-0.5">Hàng triệu khoảnh khắc đáng nhớ</div>
            </div>

            <div className="px-3 py-2 border-t sm:border-t-0 sm:border-l border-stone-800/80">
              <div className="text-xs text-stone-400 font-sans">Trạng thái trái tim</div>
              <div className="text-base font-semibold text-rose-300 mt-0.5 flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>Mãi mãi chỉ có em</span>
              </div>
              <div className="text-xs text-stone-500 mt-0.5">Vẫn rung động như ngày đầu tiên</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenLetter}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-rose-900/30 flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Mở Bức Thư Tình 7 Năm</span>
          </button>

          <button
            onClick={() => onScrollToSection('milestones')}
            className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-medium text-sm transition-all duration-200 flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 text-rose-400" />
            <span>Xem Hành Trình Của Chúng Mình</span>
          </button>

          <button
            onClick={() => onScrollToSection('coupons')}
            className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/80 font-medium text-sm transition-all duration-200 flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Phiếu Quà Tặng Dành Riêng Em</span>
          </button>
        </div>
      </div>
    </section>
  );
};
