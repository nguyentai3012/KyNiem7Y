import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio.ts';
import { Heart, Sparkles, Gift, ArrowRight } from 'lucide-react';

interface OpeningEnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
  onReopen: () => void;
  recipientName?: string;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({
  onOpen,
  isOpen,
  onReopen,
  recipientName = 'Bé Châu iu của anh',
}) => {
  const [openingStage, setOpeningStage] = useState<
    'idle' | 'breaking_seal' | 'opening_flap' | 'rising_letter' | 'revealed'
  >('idle');
  const [isHovered, setIsHovered] = useState(false);

  const isStarted = openingStage !== 'idle';

  const handleStartOpening = () => {
    if (openingStage !== 'idle') return;

    // Stage 1: Breaking seal & play chime
    setOpeningStage('breaking_seal');
    audioService.playChime();
    audioService.startMusic();

    // Stage 1: Golden sparkle burst around the wax seal
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.52 },
      colors: ['#ffd700', '#f59e0b', '#fbbf24', '#f43f5e', '#ffffff'],
      shapes: ['circle'],
      scalar: 1,
    });

    // Stage 2: Flap rotates backwards in 3D
    setTimeout(() => {
      setOpeningStage('opening_flap');
      audioService.playChime();
    }, 450);

    // Stage 3: Letter rises out of envelope with romantic heart shower
    setTimeout(() => {
      setOpeningStage('rising_letter');

      // Heart & rose petal confetti shower
      confetti({
        particleCount: 95,
        spread: 100,
        origin: { y: 0.46 },
        colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fef08a', '#ffd700'],
      });
    }, 1100);

    // Stage 4: Reveal the full anniversary page
    setTimeout(() => {
      setOpeningStage('revealed');
      setTimeout(() => {
        onOpen();
        setOpeningStage('idle');
      }, 600);
    }, 2600);
  };

  const handleSkipDirectly = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.startMusic();
    onOpen();
  };

  // Re-open button when already on the showcase page
  if (isOpen) {
    return (
      <div className="flex justify-center py-3 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-rose-950/40 border-y border-rose-500/10">
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-20 overflow-hidden select-none bg-[#0a060e]">
      {/* Dreamy Candlelight & Rose Ambient Lighting */}
      <div className="absolute w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[150px] pointer-events-none -top-24 -left-24 animate-pulse-slow" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none -bottom-24 -right-24" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#0a060e]/80 to-[#040206] pointer-events-none" />

      {/* Floating Sparkles & Gentle Hearts in the air */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, y: 120, x: `${10 + i * 11}%` }}
            animate={{
              opacity: [0.1, 0.45, 0.1],
              y: [-20, -260],
              x: [`${10 + i * 11}%`, `${12 + i * 11 + (i % 2 === 0 ? 3 : -3)}%`],
            }}
            transition={{
              duration: 5.5 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            className="absolute bottom-6 text-rose-400/40 text-base"
          >
            {i % 3 === 0 ? '✨' : '💖'}
          </motion.div>
        ))}
      </div>

      {/* Top Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 sm:mb-8 max-w-lg mx-auto relative z-10"
      >
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-rose-200/90 mb-3 px-4 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/30 backdrop-blur-md shadow-lg shadow-rose-950/60">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>Món quà đặc biệt dành riêng cho {recipientName}</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-100 font-bold tracking-tight mb-2.5 drop-shadow-[0_4px_25px_rgba(244,63,94,0.35)]">
          Kỷ Niệm 7 Năm Yêu Nhau
        </h1>

        <p className="text-sm md:text-base text-rose-200/80 font-sans max-w-md mx-auto leading-relaxed">
          25/09/2019 — 25/09/2026 · 2.557 ngày yêu trọn vẹn
        </p>
      </motion.div>

      {/* THE AESTHETIC LOVE ENVELOPE (Ivory Cream, Rose-Gold & Ruby Wax Seal) */}
      <div
        className="relative perspective-[1200px] cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleStartOpening}
      >
        {/* Warm Golden Candlelight Halo */}
        <div
          className={`absolute -inset-6 rounded-3xl bg-gradient-to-r from-rose-500/25 via-amber-400/20 to-rose-500/25 blur-2xl transition-all duration-500 pointer-events-none ${
            isHovered || isStarted ? 'opacity-100 scale-105' : 'opacity-40'
          }`}
        />

        {/* Envelope Container */}
        <div className="relative w-[330px] sm:w-[430px] h-[225px] sm:h-[275px] transition-transform duration-300 group-hover:-translate-y-1">

          {/* 1. Envelope Back Interior (Warm Cream Parchment with Rose Satin Lining) */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#f7ede2] via-[#faebd7] to-[#eddcc8] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),0_0_35px_rgba(244,63,94,0.2)] border border-[#dfceb6] overflow-hidden">
            {/* Satin Interior Accent Border */}
            <div className="absolute inset-2 rounded-xl border border-rose-300/30 bg-gradient-to-b from-[#fcf7ee] to-[#f4e6d4]" />
            <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
          </div>

          {/* 2. THE LOVE LETTER INSIDE (Slides up smoothly and unfolds in warm light) */}
          <motion.div
            initial={{ y: 15, scale: 0.94 }}
            animate={
              openingStage === 'rising_letter' || openingStage === 'revealed'
                ? {
                    y: -140,
                    scale: 1.05,
                    transition: {
                      y: { type: 'spring', stiffness: 120, damping: 14, mass: 1 },
                      scale: { duration: 0.6, ease: 'easeOut' },
                    },
                  }
                : openingStage === 'opening_flap'
                ? { y: -10, scale: 0.96 }
                : { y: 15, scale: 0.94 }
            }
            className="absolute left-4 right-4 top-3.5 h-[205px] sm:h-[250px] bg-[#fffefc] rounded-xl shadow-2xl border-2 border-[#e8ddcb] p-5 flex flex-col justify-between overflow-hidden z-20 pointer-events-none"
            style={{
              boxShadow:
                openingStage === 'rising_letter'
                  ? '0 25px 50px -10px rgba(0,0,0,0.5), 0 0 35px rgba(251,191,36,0.4)'
                  : '0 4px 15px rgba(0,0,0,0.15)',
            }}
          >
            {/* Gold foil header line */}
            <div className="border-b border-[#eadecc] pb-2 flex items-center justify-between text-[#8f2d33] font-serif">
              <span className="text-xs sm:text-sm font-bold tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#8f2d33] text-[#8f2d33]" />
                Bức Thư Tình 7 Năm
              </span>
              <span className="text-[10px] font-mono text-stone-500 bg-[#f7f0e4] px-2 py-0.5 rounded">
                25.09.2026
              </span>
            </div>

            {/* Letter Body Preview Snippet */}
            <div className="py-2 text-[#3d2b1f] font-serif italic text-xs sm:text-sm leading-relaxed space-y-1">
              <p className="font-semibold text-rose-900 not-italic text-sm">
                Gửi {recipientName} yêu dấu,
              </p>
              <p className="line-clamp-3 opacity-90 text-[11px] sm:text-xs">
                "Thế là chúng mình đã cùng nhau đi qua tròn 7 năm (2.557 ngày). Từng nụ cười, từng chuyến đi và từng cái ôm ấm áp của em là điều quý giá nhất đời anh..."
              </p>
            </div>

            {/* Letter Footer */}
            <div className="pt-2 border-t border-[#eadecc] flex items-center justify-between text-[11px]">
              <span className="text-rose-800 font-sans font-medium flex items-center gap-1">
                <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                Mãi mãi yêu em
              </span>
              <span className="font-handwriting text-base text-[#8f2d33] font-bold">
                Người yêu em nhiều nhất
              </span>
            </div>

            {/* Golden warmth sunbeam overlay on rising letter */}
            <AnimatePresence>
              {(openingStage === 'rising_letter' || openingStage === 'revealed') && (
                <motion.div
                  initial={{ opacity: 0.85, x: -120 }}
                  animate={{ opacity: 0, x: 300 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/35 to-rose-400/20 pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* 3. Envelope Front Pocket (Clean Ivory Cream with Warm Gold Border & Ribbon) */}
          <div className="absolute inset-0 z-30 pointer-events-none rounded-2xl overflow-hidden">
            {/* Front Pocket Shape */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 430 275"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Front Pocket Cream Gradient */}
                <linearGradient id="creamPocketGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ede0cf" />
                  <stop offset="60%" stopColor="#f7eee2" />
                  <stop offset="100%" stopColor="#fffdf9" />
                </linearGradient>

                {/* Left/Right Cream Shading */}
                <linearGradient id="creamSideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5e9d9" />
                  <stop offset="100%" stopColor="#e5d4bf" />
                </linearGradient>

                {/* Rose-Gold Metallic Gradient */}
                <linearGradient id="goldEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2b86b" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                {/* Soft pocket drop shadow */}
                <filter id="creamShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="-3" stdDeviation="5" floodColor="#8c7355" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Left Triangular Fold */}
              <polygon points="0,0 215,148 0,275" fill="url(#creamSideGrad)" />

              {/* Right Triangular Fold */}
              <polygon points="430,0 215,148 430,275" fill="url(#creamSideGrad)" />

              {/* Bottom V Pocket Cover */}
              <polygon
                points="0,275 215,138 430,275"
                fill="url(#creamPocketGrad)"
                filter="url(#creamShadow)"
              />

              {/* Fine Gold Foil Stitched Line along the V pocket */}
              <polyline
                points="0,275 215,138 430,275"
                fill="none"
                stroke="url(#goldEdgeGrad)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Delicate Blush Pink Satin Ribbon (Horizontal band across pocket) */}
            <div className="absolute top-[52%] left-0 right-0 h-6 -translate-y-1/2 bg-gradient-to-r from-rose-200/40 via-rose-300/60 to-rose-200/40 border-y border-rose-400/30 shadow-xs flex items-center justify-between px-3" />

            {/* Vintage Postmark Stamp (Top Right) */}
            <div className="absolute top-3.5 right-3.5 w-14 h-16 bg-[#fffbf5] border-2 border-dashed border-rose-300/80 rounded-md p-1 shadow-sm flex flex-col items-center justify-between text-center rotate-3">
              <span className="text-[7.5px] font-mono tracking-widest text-rose-800 font-bold uppercase">
                7 NĂM YÊU
              </span>
              <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-300/60 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              </div>
              <span className="text-[7.5px] font-mono text-rose-700 font-bold">
                25.09.2019
              </span>
            </div>

            {/* Elegant Calligraphy Addressing on Front */}
            <div className="absolute bottom-3.5 left-4 right-4 text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/90 border border-amber-300/60 shadow-sm">
                <div className="font-handwriting text-rose-950 text-base sm:text-lg flex items-center justify-center gap-1.5 font-bold">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Gửi {recipientName}</span>
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                </div>
              </div>
              <div className="text-[9.5px] text-stone-600 font-mono tracking-wider mt-1 font-medium">
                25/09/2019 — 25/09/2026 · 2.557 ngày yêu trọn vẹn
              </div>
            </div>
          </div>

          {/* 4. 3D TOP FOLDING FLAP (Flips backwards 180 degrees) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={
              openingStage === 'idle' || openingStage === 'breaking_seal'
                ? { rotateX: 0, zIndex: 40 }
                : {
                    rotateX: -180,
                    zIndex: 10,
                    transition: {
                      duration: 0.9,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }
            }
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
            }}
            className="absolute top-0 left-0 right-0 h-[145px] sm:h-[180px] pointer-events-none"
          >
            {/* Front of Flap with Gold Border */}
            <svg
              className="w-full h-full"
              viewBox="0 0 430 180"
              preserveAspectRatio="none"
              style={{ filter: 'drop-shadow(0 6px 14px rgba(90,65,40,0.25))' }}
            >
              <defs>
                <linearGradient id="creamFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fffdfa" />
                  <stop offset="60%" stopColor="#f6ecde" />
                  <stop offset="100%" stopColor="#ebdcce" />
                </linearGradient>
              </defs>

              {/* Triangle pointing down */}
              <polygon points="0,0 430,0 215,180" fill="url(#creamFlapGrad)" />

              {/* Gold foil edge border on flap tip */}
              <polyline
                points="0,0 215,180 430,0"
                fill="none"
                stroke="url(#goldEdgeGrad)"
                strokeWidth="1.8"
              />
            </svg>

            {/* Back of Flap (Visible when flipped open 180 deg) */}
            <div
              className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#f2e6d6] to-[#e4d3bf] border-b border-amber-300/40"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                transform: 'rotateY(180deg) rotateZ(180deg)',
                backfaceVisibility: 'hidden',
              }}
            />
          </motion.div>

          {/* 5. GORGEOUS GLOSSY RUBY WAX SEAL */}
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={
              openingStage === 'breaking_seal'
                ? {
                    scale: [1, 1.3, 0.85],
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.45 },
                  }
                : openingStage !== 'idle'
                ? {
                    scale: 0,
                    opacity: 0,
                    y: -25,
                    transition: { duration: 0.35, ease: 'easeIn' },
                  }
                : {
                    scale: isHovered ? 1.08 : 1,
                    transition: { duration: 0.3 },
                  }
            }
            className="absolute left-1/2 top-[138px] sm:top-[165px] -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto"
          >
            {/* Glowing Golden Ring Aura */}
            <div
              className={`absolute -inset-4 rounded-full bg-rose-500/30 blur-md transition-opacity duration-300 ${
                isHovered ? 'opacity-100 animate-pulse' : 'opacity-40'
              }`}
            />

            {/* Realistic Ruby Red Wax Seal Stamp */}
            <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-[#f43f5e] via-[#e11d48] to-[#9f1239] shadow-[0_12px_28px_rgba(225,29,72,0.45),inset_0_2px_4px_rgba(255,255,255,0.5)] border-2 border-amber-200 flex flex-col items-center justify-center text-amber-100 drop-shadow-md group-hover:border-white">
              {/* Inner Embossed Ring */}
              <div className="absolute inset-1.5 rounded-full border border-amber-300/60 pointer-events-none" />

              {/* Specular gloss highlight */}
              <div className="absolute top-1.5 left-3 w-5 h-2.5 rounded-full bg-white/40 blur-xs rotate-[-25deg] pointer-events-none" />

              {/* Center Heart Emblem */}
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-200 text-amber-200 drop-shadow mb-0.5 animate-pulse" />

              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-white font-sans leading-none drop-shadow">
                7 NĂM
              </span>
              <span className="text-[8px] sm:text-[9px] text-amber-200 font-mono tracking-wider mt-0.5 drop-shadow">
                25.09
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call-to-Action Below Envelope */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-10 sm:mt-12 flex flex-col items-center gap-3.5 relative z-10 text-center"
      >
        <button
          onClick={handleStartOpening}
          disabled={isStarted}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-medium text-sm sm:text-base shadow-[0_10px_30px_rgba(225,29,72,0.45)] border border-amber-300/50 transition-all duration-300 active:scale-95 flex items-center gap-2.5 group"
        >
          <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span>
            {isStarted ? 'Đang mở bức thư tình...' : 'Chạm Vào Phong Thư Để Mở Quà'}
          </span>
          <Heart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex items-center gap-4 text-xs text-stone-400">
          <span className="flex items-center gap-1.5 text-rose-300/90">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Bật âm thanh để nghe bài hát Ngày Đầu Tiên nha em
          </span>
          <span className="text-stone-600">•</span>
          <button
            onClick={handleSkipDirectly}
            className="hover:text-stone-200 transition-colors inline-flex items-center gap-1 text-stone-500 hover:underline"
          >
            <span>Vào xem ngay</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
