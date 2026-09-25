import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio.ts';
import { Heart, Sparkles, Gift } from 'lucide-react';

interface OpeningEnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
  onReopen: () => void;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({
  onOpen,
  isOpen,
  onReopen,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpening(true);
    audioService.playChime();
    audioService.startMusic();

    // Trigger sweet confetti shower
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef08a', '#e11d48'],
    });

    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 700);
  };

  if (isOpen) {
    return (
      <div className="flex justify-center py-4 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-rose-950/40 border-y border-rose-500/10">
        <button
          onClick={onReopen}
          className="group inline-flex items-center gap-2 text-xs md:text-sm font-medium text-rose-300 hover:text-rose-100 transition-colors py-1.5 px-4 rounded-full bg-rose-950/60 border border-rose-500/20 hover:border-rose-400/40 shadow-sm"
        >
          <Gift className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform" />
          <span>Gấp lại phong thư kỷ niệm 25/09/2019</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-20">
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none -top-10 -left-10 animate-pulse-slow" />
      <div className="absolute w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      {/* Top greeting note */}
      <div className="text-center mb-8 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-rose-300/80 mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>Món quà đặc biệt dành riêng cho em</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-100 font-bold tracking-tight mb-3">
          Kỷ Niệm 7 Năm Yêu Nhau
        </h1>
        <p className="text-sm md:text-base text-stone-300 font-sans max-w-md mx-auto leading-relaxed">
          Ngày mai 25/09 là ngày đặc biệt của chúng mình. Anh đã gói ghém tất cả yêu thương và kỷ niệm vào đây...
        </p>
      </div>

      {/* Interactive Envelope Graphic */}
      <div
        className="relative cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleOpenEnvelope}
      >
        {/* Envelope Container */}
        <div className="w-[320px] sm:w-[420px] h-[220px] sm:h-[270px] bg-[#1a1622] rounded-xl shadow-2xl border border-rose-500/20 relative overflow-hidden flex flex-col justify-between p-6">
          {/* Subtle envelope paper gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-950/40 via-[#1c1827] to-[#120f1a] opacity-90" />

          {/* Envelope geometric diagonal flaps lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <polygon points="0,0 50,48 100,0" fill="#2d2238" stroke="#f43f5e" strokeWidth="0.5" />
            <polygon points="0,100 50,52 100,100" fill="#20182b" stroke="#f43f5e" strokeWidth="0.5" />
            <polygon points="0,0 48,50 0,100" fill="#271d33" />
            <polygon points="100,0 52,50 100,100" fill="#271d33" />
          </svg>

          {/* Golden Ribbon accent */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-amber-400/20 via-amber-300/30 to-amber-500/20 border-x border-amber-400/30 pointer-events-none" />

          {/* Envelope Top Edge Stamp */}
          <div className="relative z-10 flex justify-between items-start text-xs text-rose-300/60 font-mono">
            <span>25 · 09 · 2019</span>
            <span>25 · 09 · 2026</span>
          </div>

          {/* Center Wax Seal Button */}
          <div className="relative z-10 my-auto flex flex-col items-center">
            <div
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-rose-900 shadow-xl border-2 border-amber-300/60 flex flex-col items-center justify-center text-amber-100 transition-all duration-300 ${
                isHovered ? 'scale-110 shadow-rose-600/50' : ''
              } ${isOpening ? 'scale-90 opacity-70' : ''}`}
            >
              <Heart className="w-6 h-6 fill-amber-200 text-amber-200 mb-0.5" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-100 font-sans">
                7 NĂM
              </span>
              <span className="text-[9px] text-amber-200/80 font-mono">25.09</span>
            </div>
            <div className="mt-2 text-[11px] font-medium tracking-wide text-rose-300/90 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Chạm để mở phong thư</span>
            </div>
          </div>

          {/* Envelope Bottom Inscription */}
          <div className="relative z-10 text-center text-xs text-stone-400 font-handwriting text-lg sm:text-xl">
            "Gửi người con gái anh yêu nhất..."
          </div>
        </div>
      </div>

      {/* Action CTA below envelope */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          onClick={handleOpenEnvelope}
          disabled={isOpening}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-medium text-sm sm:text-base shadow-lg shadow-rose-900/40 transition-all duration-200 active:scale-95 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Mở Món Quà Kỷ Niệm Của Chúng Mình</span>
        </button>
        <span className="text-xs text-stone-400">
          (Bật loa để nghe giai điệu ngọt ngào nha em)
        </span>
      </div>
    </div>
  );
};
