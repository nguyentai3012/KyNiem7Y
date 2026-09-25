import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Star, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio.ts';

export const WishCapsule: React.FC = () => {
  const [wish, setWish] = useState('');
  const [savedWish, setSavedWish] = useState<string | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem('anniv_star_wish');
    if (existing) setSavedWish(existing);
  }, []);

  const handleMakeWish = () => {
    if (!wish.trim()) return;

    localStorage.setItem('anniv_star_wish', wish.trim());
    setSavedWish(wish.trim());
    audioService.playFireworksSound();

    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fef08a', '#facc15', '#f43f5e', '#ffffff'],
    });
  };

  return (
    <div className="max-w-xl mx-auto text-center space-y-5">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-sans tracking-widest uppercase font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>Hũ Ước Nguyện 7 Năm Tới</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
          Gửi Một Điều Ước Vào Tương Lai
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 font-sans">
          Viết một điều em mong muốn nhất cho chúng mình trong những năm tháng tiếp theo nhé...
        </p>
      </div>

      {savedWish ? (
        <div className="p-6 sm:p-7 rounded-2xl bg-stone-900/90 border border-amber-400/40 shadow-xl space-y-3 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div className="text-xs text-amber-300 font-sans uppercase tracking-widest font-semibold">
            ✨ Điều Ước Đã Được Khóa Vào Trời Sao ✨
          </div>

          <p className="font-serif text-lg sm:text-xl text-stone-100 italic bg-stone-950/60 p-4 rounded-xl border border-stone-800">
            "{savedWish}"
          </p>

          <p className="text-xs text-stone-400 font-sans">
            Anh hứa sẽ cùng em biến điều ước này thành hiện thực sớm nhất có thể ❤️
          </p>

          <button
            onClick={() => setSavedWish(null)}
            className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors pt-2 block mx-auto underline font-sans"
          >
            Viết thêm điều ước khác
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
          <textarea
            rows={3}
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="Ví dụ: Cùng anh đi ngắm tuyết mùa đông, luôn bình yên và yêu nhau như ngày đầu..."
            className="w-full p-3.5 bg-stone-950 border border-stone-800 focus:border-amber-400/60 rounded-xl text-xs sm:text-sm text-stone-200 focus:outline-none transition-colors"
          />

          <button
            onClick={handleMakeWish}
            disabled={!wish.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-stone-950 font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Thả Điều Ước Vào Trời Sao Kỷ Niệm</span>
          </button>
        </div>
      )}
    </div>
  );
};
