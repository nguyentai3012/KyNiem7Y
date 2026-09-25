import React, { useState } from 'react';
import { HelpCircle, Sparkles, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveQuizItems } from '../data/anniversaryData.ts';
import { audioService } from '../utils/audio.ts';

export const LoveQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));
    audioService.playChime();

    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#fef08a', '#fda4af'],
    });
  };

  return (
    <section id="quiz" className="py-16 md:py-24 border-b border-stone-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-rose-400 font-sans tracking-wide mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Thấu Hiểu Hai Đứa</span>
            <span aria-hidden="true">·</span>
            <span>Trắc Nghiệm Ngọt Ngào</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-100 font-bold tracking-tight">
            Em Có Hiểu Trái Tim Anh?
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-lg mx-auto font-sans">
            Thử trả lời vài câu hỏi nhỏ để xem 7 năm qua chúng mình đã thấu hiểu nhau đến nhường nào nhé!
          </p>
        </div>

        {/* Quiz Items */}
        <div className="space-y-6">
          {loveQuizItems.map((item, qIdx) => {
            const isAnswered = revealed[item.id];
            const currentSelected = selectedAnswers[item.id];

            return (
              <div
                key={item.id}
                className="p-6 sm:p-7 rounded-2xl bg-stone-900/80 border border-stone-800 transition-all hover:border-stone-700 shadow-md"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-rose-950 text-rose-400 border border-rose-800/60 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
                    {item.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pl-9">
                  {item.options.map((option, optIdx) => {
                    const isPicked = currentSelected === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(item.id, optIdx)}
                        className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-sans transition-all flex items-center justify-between ${
                          isPicked
                            ? 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-sm'
                            : 'bg-stone-950/60 hover:bg-stone-800/60 border-stone-800 text-stone-300'
                        }`}
                      >
                        <span>{option}</span>
                        {isPicked && <Check className="w-4 h-4 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation reveal */}
                {isAnswered && (
                  <div className="ml-9 p-4 rounded-xl bg-gradient-to-r from-rose-950/40 to-stone-900 border border-rose-500/20 text-stone-300 text-xs sm:text-sm leading-relaxed animate-in fade-in duration-300">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-300 mb-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>Lời thổ lộ từ anh:</span>
                    </div>
                    <p className="font-serif text-stone-200 text-sm sm:text-base italic">
                      "{item.reaction}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
