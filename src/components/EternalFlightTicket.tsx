import React, { useState } from 'react';
import { Plane, Heart, Check, Copy, Sparkles, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio.ts';

interface EternalFlightTicketProps {
  herName: string;
}

export const EternalFlightTicket: React.FC<EternalFlightTicketProps> = ({ herName }) => {
  const [copied, setCopied] = useState(false);
  const [isStamped, setIsStamped] = useState(false);

  const handleStamp = () => {
    if (!isStamped) {
      audioService.playStampSound();
      setIsStamped(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#fbbf24', '#f43f5e', '#ffffff'],
      });
    }
  };

  const handleCopy = () => {
    const text = `✈️ VÉ LÊN CHUYẾN BAY HẠNH PHÚC (LOVE-2509)\n` +
      `👤 Hành khách: ${herName}\n` +
      `🛫 Khởi hành: 25/09/2019\n` +
      `🛬 Điểm đến: Mãi mãi về sau (Trọn đời)\n` +
      `💺 Ghế: 01A - Vị trí duy nhất trong tim anh\n` +
      `✨ Kỷ niệm 7 năm yêu nhau tròn đầy ❤️`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    audioService.playChime();
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-sans tracking-widest uppercase font-semibold">
          <Plane className="w-3.5 h-3.5" />
          <span>Tấm Vé Kỷ Niệm 7 Năm Đặc Biệt</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
          Chuyến Bay Đến Mãi Mãi
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-md mx-auto">
          Chiếc vé một chiều đã kích hoạt từ ngày 25/09/2019 và không có ngày hết hạn.
        </p>
      </div>

      {/* Boarding Pass Ticket Container */}
      <div className="max-w-2xl mx-auto rounded-3xl bg-[#faf6ee] text-[#1c1917] shadow-2xl border border-[#d6c7b2] overflow-hidden relative select-text transition-all duration-300 hover:shadow-rose-950/40">
        {/* Ticket Header Banner */}
        <div className="bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#991b1b] text-amber-100 px-6 py-3.5 flex items-center justify-between border-b border-amber-400/30">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-amber-300" />
            <span className="font-serif text-sm sm:text-base font-bold tracking-wider uppercase text-amber-200">
              Forever Airlines · Chuyến Bay Hạnh Phúc
            </span>
          </div>
          <span className="font-mono text-xs text-amber-300/90 font-bold tracking-widest">
            LOVE-2509-7YRS
          </span>
        </div>

        {/* Main Ticket Body */}
        <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Main Info (2 cols) */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center justify-between border-b border-[#e5d8c5] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#78716c] block">
                  HÀNH KHÁCH / PASSENGER
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold text-[#1c1917]">
                  {herName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#78716c] block">
                  HẠNG GHẾ / CLASS
                </span>
                <span className="font-serif text-sm font-bold text-[#991b1b]">
                  FIRST CLASS (DUY NHẤT)
                </span>
              </div>
            </div>

            {/* Flight Route */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs font-mono font-bold text-[#991b1b]">25.09.2019</span>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#1c1917]">
                  KHỞI ĐẦU
                </div>
                <span className="text-[11px] text-[#78716c] font-sans">Ngày em gật đầu</span>
              </div>

              <div className="flex flex-col items-center px-3">
                <div className="text-[10px] font-mono text-[#78716c] mb-1">7 NĂM ĐỒNG HÀNH</div>
                <div className="w-24 sm:w-32 border-t-2 border-dashed border-[#b91c1c] relative flex items-center justify-center">
                  <Plane className="w-4 h-4 text-[#991b1b] -mt-2 bg-[#faf6ee] px-0.5 rotate-90" />
                </div>
                <div className="text-[10px] text-[#b91c1c] font-semibold mt-1">2,557 NGÀY</div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#991b1b]">MÃI MÃI</span>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#1c1917]">
                  TRỌN ĐỜI
                </div>
                <span className="text-[11px] text-[#78716c] font-sans">Bên anh mãi mãi</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#e5d8c5] text-[11px]">
              <div>
                <span className="text-[9px] font-mono uppercase text-[#78716c] block">CỔNG / GATE</span>
                <span className="font-mono font-bold text-[#1c1917]">HEART-01</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-[#78716c] block">GHẾ / SEAT</span>
                <span className="font-mono font-bold text-[#991b1b]">01A (TRONG TIM ANH)</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-[#78716c] block">HIỆU LỰC / VALID</span>
                <span className="font-mono font-bold text-emerald-700">VĨNH VIỄN</span>
              </div>
            </div>
          </div>

          {/* Right Tear-off Stub */}
          <div className="border-t md:border-t-0 md:border-l border-dashed border-[#d6c7b2] pt-4 md:pt-0 md:pl-6 flex flex-col justify-between items-center text-center">
            <div className="w-full">
              <span className="text-[9px] font-mono uppercase text-[#78716c] block">
                BOARDING PASS STUB
              </span>
              <div className="font-serif text-base font-bold text-[#1c1917] mt-0.5">
                Kỷ Niệm 7 Năm
              </div>
              <div className="text-[11px] font-mono text-[#991b1b] font-semibold">
                25/09/2019 - 2026
              </div>

              {/* Barcode visual */}
              <div className="mt-4 flex justify-center items-center py-2 bg-white rounded border border-[#e5d8c5]">
                <div className="font-mono text-xs tracking-widest text-stone-800 scale-y-125 font-bold">
                  ||||| ||| |||| || |||||| | |||
                </div>
              </div>
            </div>

            {/* Interactive Stamp button */}
            <div className="mt-4 w-full">
              {isStamped ? (
                <div className="border-2 border-red-600 text-red-600 font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded rotate-[-6deg] shadow-sm select-none">
                  ★ ĐÃ XÁC NHẬN YÊU ANH ★
                </div>
              ) : (
                <button
                  onClick={handleStamp}
                  className="w-full py-1.5 px-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-amber-100 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <Heart className="w-3 h-3 fill-amber-200" />
                  <span>Đóng Mộc Vé Này</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-[#f0e7d8] px-6 py-3 border-t border-[#e2d5c0] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#78716c] font-sans text-[11px]">
            Vé kỷ niệm điện tử lưu hành độc quyền giữa hai chúng mình
          </span>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-[#991b1b] hover:bg-[#7f1d1d] text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 shadow-sm ml-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã Sao Chép Vé!' : 'Sao Chép Thông Tin Vé'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
