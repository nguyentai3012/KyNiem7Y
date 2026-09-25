import React, { useState } from 'react';
import { X, Heart, Edit3, Check, Copy, Sparkles, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveLetterData } from '../types.ts';
import { audioService } from '../utils/audio.ts';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterData: LoveLetterData;
  onUpdateLetter: (updated: LoveLetterData) => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  isOpen,
  onClose,
  letterData,
  onUpdateLetter,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<LoveLetterData>(letterData);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateLetter(formData);
    setIsEditing(false);
    audioService.playChime();
  };

  const handleCelebrate = () => {
    audioService.playChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fb7185', '#fef08a', '#f43f5e'],
    });
  };

  const handleCopy = () => {
    const fullText = `${letterData.title}\n\n${letterData.salutation}\n\n${letterData.paragraphs.join('\n\n')}\n\n${letterData.quote}\n\n${letterData.closing}\n${letterData.sender}\n(${letterData.signatureDate})`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#faf6ee] text-[#2c2420] rounded-2xl shadow-2xl overflow-hidden border border-[#d6c7b2]">
        {/* Top vintage decorative bar */}
        <div className="bg-[#302127] text-rose-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-sans tracking-wide">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            <span className="font-semibold text-rose-100">Bức Thư Tình Kỷ Niệm 7 Năm (25/09/2019 - 25/09/2026)</span>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-900/60 transition-colors text-xs flex items-center gap-1"
                title="Tùy chỉnh nội dung thư"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chỉnh sửa</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white transition-colors text-xs font-medium flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Lưu thư</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-900/60 transition-colors text-xs flex items-center gap-1"
              title="Sao chép nội dung gửi qua tin nhắn"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copied ? 'Đã chép!' : 'Sao chép'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-900/60 transition-colors text-xs flex items-center gap-1"
              title="In hoặc lưu PDF kỷ niệm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In thư</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-rose-900/60 transition-colors"
              title="Đóng thư"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Letter Body - Parchment Feel */}
        <div className="p-6 sm:p-10 md:p-12 font-serif text-[#2a2118] relative select-text max-h-[80vh] overflow-y-auto">
          {/* Subtle vintage stamp top-right */}
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-[#b39e82] flex flex-col items-center justify-center rotate-12 pointer-events-none opacity-85">
            <Heart className="w-4 h-4 fill-[#b34045] text-[#b34045]" />
            <span className="text-[9px] uppercase font-sans tracking-wider font-semibold text-[#6e5844]">
              25.09.2019
            </span>
            <span className="text-[8px] font-sans text-[#8a725b]">7 NĂM YÊU</span>
          </div>

          {/* Letter Title */}
          {isEditing ? (
            <div className="mb-6 space-y-3 font-sans">
              <label className="block text-xs font-semibold text-stone-600">Tiêu đề thư:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-[#c5b59e] rounded bg-white text-stone-800 text-sm font-serif"
              />
              <label className="block text-xs font-semibold text-stone-600">Lời mở đầu:</label>
              <input
                type="text"
                value={formData.salutation}
                onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                className="w-full px-3 py-2 border border-[#c5b59e] rounded bg-white text-stone-800 text-sm"
              />
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e1510] mb-2 font-serif">
                {letterData.title}
              </h2>
              <div className="text-lg italic text-[#6e4e3b] font-serif">
                {letterData.salutation}
              </div>
            </div>
          )}

          {/* Letter Paragraphs */}
          {isEditing ? (
            <div className="space-y-4 font-sans mb-6">
              <label className="block text-xs font-semibold text-stone-600">
                Nội dung các đoạn văn (ngăn cách bằng 2 lần xuống dòng):
              </label>
              <textarea
                rows={10}
                value={formData.paragraphs.join('\n\n')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paragraphs: e.target.value.split('\n\n').filter((p) => p.trim().length > 0),
                  })
                }
                className="w-full p-3 border border-[#c5b59e] rounded bg-white text-stone-800 text-sm leading-relaxed"
              />

              <label className="block text-xs font-semibold text-stone-600">Trích dẫn tình yêu:</label>
              <input
                type="text"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full px-3 py-2 border border-[#c5b59e] rounded bg-white text-stone-800 text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600">Lời chào kết:</label>
                  <input
                    type="text"
                    value={formData.closing}
                    onChange={(e) => setFormData({ ...formData, closing: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c5b59e] rounded bg-white text-stone-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600">Ký tên người gửi:</label>
                  <input
                    type="text"
                    value={formData.sender}
                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                    className="w-full px-3 py-2 border border-[#c5b59e] rounded bg-white text-stone-800 text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-base sm:text-lg leading-relaxed text-[#3a2d24]">
              {letterData.paragraphs.map((para, index) => (
                <p key={index} className="text-justify indent-6">
                  {para}
                </p>
              ))}

              {/* Romantic Quote Box */}
              <div className="my-8 p-5 rounded-xl border-l-4 border-[#b34045] bg-[#f0e8db] text-[#553628] italic text-base sm:text-lg">
                {letterData.quote}
              </div>

              {/* Signature Block */}
              <div className="mt-10 flex flex-col items-end text-right">
                <div className="italic text-[#705445] text-base">{letterData.closing}</div>
                <div className="font-handwriting text-3xl sm:text-4xl text-[#9c2938] font-bold mt-2">
                  {letterData.sender}
                </div>
                <div className="text-xs text-[#8a725b] mt-1 font-mono">{letterData.signatureDate}</div>
              </div>
            </div>
          )}

          {/* Letter footer with celebration button */}
          <div className="mt-8 pt-6 border-t border-[#dccfbd] flex flex-wrap items-center justify-between gap-3 font-sans">
            <div className="text-xs text-[#7d6957] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#b34045] text-[#b34045]" />
              <span>Gửi trọn tình yêu ngày 25/09/2019 - 25/09/2026</span>
            </div>

            <button
              onClick={handleCelebrate}
              className="px-4 py-2 rounded-lg bg-[#b34045] hover:bg-[#9c2938] text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Thả Tim Kỷ Niệm 7 Năm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
