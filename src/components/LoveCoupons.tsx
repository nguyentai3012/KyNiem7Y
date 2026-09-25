import React from 'react';
import { Gift, CheckCircle, Sparkles, RefreshCw, Scissors } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveCoupon } from '../types.ts';
import { audioService } from '../utils/audio.ts';

interface LoveCouponsProps {
  coupons: LoveCoupon[];
  onRedeemCoupon: (id: string) => void;
  onResetCoupons: () => void;
}

export const LoveCoupons: React.FC<LoveCouponsProps> = ({
  coupons,
  onRedeemCoupon,
  onResetCoupons,
}) => {
  const handleRedeem = (id: string) => {
    audioService.playStampSound();
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#fef08a', '#10b981'],
    });
    onRedeemCoupon(id);
  };

  return (
    <section id="coupons" className="py-16 md:py-24 border-b border-stone-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-sans tracking-wide mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Đặc Quyền Dành Cho Em</span>
              <span aria-hidden="true">·</span>
              <span>Phiếu Yêu Thương Không Hạn Sử Dụng</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-100 font-bold tracking-tight">
              Sổ Phiếu Quà Tặng 7 Năm
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-xl font-sans">
              Bất cứ khi nào em muốn, hãy nhấn nút "Sử dụng phiếu" và chụp màn hình gửi cho anh. Anh hứa sẽ thực hiện 100% vô điều kiện!
            </p>
          </div>

          <button
            onClick={onResetCoupons}
            className="self-start md:self-auto px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Khôi phục trạng thái các phiếu"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm Mới Phiếu</span>
          </button>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${
                coupon.isRedeemed
                  ? 'bg-stone-950/80 border-stone-800/80 opacity-90'
                  : 'bg-stone-900/90 hover:bg-stone-900 border-rose-500/20 hover:border-rose-400/40 hover:-translate-y-1'
              }`}
            >
              {/* Ticket Scalloped Edge Cutouts */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0f0e13] border-r border-rose-500/20 pointer-events-none" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0f0e13] border-l border-rose-500/20 pointer-events-none" />

              {/* Upper Section */}
              <div className="p-6 relative z-10">
                {/* Header line with unboxed metadata */}
                <div className="flex items-center justify-between text-xs text-stone-400 font-sans mb-3">
                  <span className="text-rose-400 font-medium">{coupon.badge}</span>
                  <span className="font-mono text-[11px] text-stone-500 tracking-wider">
                    {coupon.code}
                  </span>
                </div>

                {/* Coupon Title */}
                <h3 className="font-serif text-xl font-bold text-stone-100 mb-2">
                  {coupon.title}
                </h3>

                {/* Coupon Description */}
                <p className="text-sm text-stone-300 font-sans leading-relaxed mb-4">
                  {coupon.description}
                </p>

                {/* Terms / Condition */}
                <div className="text-[11px] text-stone-500 font-sans flex items-center gap-1.5 pt-2 border-t border-stone-800">
                  <Scissors className="w-3 h-3 text-stone-600" />
                  <span>{coupon.condition}</span>
                </div>
              </div>

              {/* Lower Action / Stamp Section */}
              <div className="px-6 py-4 bg-stone-950/50 border-t border-dashed border-stone-800 relative z-10 flex items-center justify-between">
                {coupon.isRedeemed ? (
                  <div className="w-full flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Đã đổi ngày {coupon.redeemedAt || 'hôm nay'}</span>
                    </div>

                    {/* Rubber Stamp graphic effect */}
                    <div className="border-2 border-red-500/80 text-red-500 font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded rotate-[-8deg] shadow-sm select-none">
                      ĐÃ SỬ DỤNG
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-sans">
                      Hiệu lực: Trọn đời
                    </span>

                    <button
                      onClick={() => handleRedeem(coupon.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-medium text-xs shadow-md shadow-rose-950 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Sử Dụng Phiếu</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
