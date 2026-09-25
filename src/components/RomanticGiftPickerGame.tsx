import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Gift,
  Sparkles,
  Heart,
  CheckCircle,
  Copy,
  Check,
  Crown,
  Lock,
  RotateCcw,
  X,
  AlertCircle,
  Mail,
  Send,
  Loader2,
} from 'lucide-react';
import { audioService } from '../utils/audio.ts';

export const BOYFRIEND_EMAIL = 'nguyentai3021@gmail.com';

export interface RomanticGiftItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  badge: string;
  boyfriendPromise: string;
}

export interface SweetMessageRecord {
  id: string;
  text: string;
  timestamp: string;
  dateStr: string;
  chosenGiftTitle?: string;
}

export const DEFAULT_ROMANTIC_GIFTS: RomanticGiftItem[] = [
  {
    id: 'gift_1',
    title: 'Món Đồ Em Đang Thích Nhất',
    description: 'Bất kỳ món đồ mỹ phẩm, váy áo hay phụ kiện em đã thích từ lâu. Anh xin phép thanh toán 100%!',
    category: 'Vật Phẩm',
    icon: '💄',
    color: 'from-pink-500 to-rose-600',
    badge: 'Cực Hot',
    boyfriendPromise: 'Anh thanh toán ngay không cần đắn đo giá cả ❤️',
  },
  {
    id: 'gift_2',
    title: 'Chuyến Du Lịch / Staycation Đổi Gió',
    description: 'Một chuyến đi chơi 2 người lãng mạn cuối tuần. Lịch trình, khách sạn đẹp và ăn uống anh lo trọn gói từ A-Z!',
    category: 'Trải Nghiệm',
    icon: '✈️',
    color: 'from-amber-500 to-orange-600',
    badge: 'Đặc Biệt',
    boyfriendPromise: 'Chỉ cần em chọn ngày, anh sẽ xách vali cùng em đi bất cứ đâu!',
  },
  {
    id: 'gift_3',
    title: 'Bữa Tối Nến & Hoa Lãng Mạn',
    description: 'Một bữa tối thật chill tại nhà hàng view đẹp lung linh, cùng nâng ly chúc mừng chặng đường 7 năm của chúng mình.',
    category: 'Ẩm Thực',
    icon: '🍷',
    color: 'from-rose-600 to-red-700',
    badge: 'Lãng Mạn',
    boyfriendPromise: 'Bàn tiệc có hoa tươi thơm ngát dành riêng cho công chúa của anh.',
  },
  {
    id: 'gift_4',
    title: '1 Ngày Làm Công Chúa Tuyệt Đối',
    description: 'Trong 24 giờ tới, mọi yêu cầu của em đều là mệnh lệnh. Anh sẽ nấu ăn, rửa chén, bóp vai và cưng chiều em hết nấc!',
    category: 'Đặc Quyền',
    icon: '👑',
    color: 'from-purple-500 to-indigo-600',
    badge: 'VIP',
    boyfriendPromise: 'Dạ, tuân lệnh công chúa của anh vô điều kiện!',
  },
  {
    id: 'gift_5',
    title: 'Shopping Spree - Cứ Thích Là Mua',
    description: 'Một buổi chiều dắt tay em đi dạo trung tâm thương mại. Mọi túi đồ em xách, anh nhận nhiệm vụ mang vác và quẹt thẻ!',
    category: 'Mua Sắm',
    icon: '🛍️',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Siêu Thích',
    boyfriendPromise: 'Em chỉ cần vui vẻ chọn đồ xinh, còn lại để anh lo hết!',
  },
  {
    id: 'gift_6',
    title: 'Tấm Vé "Điều Ước Vô Hạn"',
    description: 'Tấm vé tối thượng có giá trị suốt đời! Bé Châu có quyền ra một điều ước bất kỳ lúc nào và anh phải lập tức thực hiện.',
    category: 'Tối Thượng',
    icon: '🌟',
    color: 'from-amber-400 via-rose-500 to-pink-500',
    badge: 'Huyền Thoại',
    boyfriendPromise: 'Hiệu lực vĩnh viễn, không hết hạn cho đến tận 100 năm sau ❤️',
  },
];

export const getStoredGiftsList = (): RomanticGiftItem[] => {
  try {
    const saved = localStorage.getItem('anniv_romantic_gift_list');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_ROMANTIC_GIFTS;
};

export const saveStoredGiftsList = (items: RomanticGiftItem[]) => {
  try {
    localStorage.setItem('anniv_romantic_gift_list', JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
};

export interface FinalChosenGiftData {
  gift: RomanticGiftItem;
  boxIndex: number;
  chosenDate: string;
}

interface RomanticGiftPickerGameProps {
  herName?: string;
}

export const RomanticGiftPickerGame: React.FC<RomanticGiftPickerGameProps> = ({
  herName = 'Bé Châu',
}) => {
  const [giftsList] = useState<RomanticGiftItem[]>(getStoredGiftsList);

  // Single Final Chosen Gift
  const [finalChosenGift, setFinalChosenGift] = useState<FinalChosenGiftData | null>(() => {
    try {
      const saved = localStorage.getItem('anniv_final_chosen_gift');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Confirm modal before opening
  const [pendingBox, setPendingBox] = useState<{ index: number; gift: RomanticGiftItem } | null>(null);
  const [shakingBoxIndex, setShakingBoxIndex] = useState<number | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Sweet message email modal state
  const [showSweetMessageModal, setShowSweetMessageModal] = useState(false);
  const [targetUnlockBoxIndex, setTargetUnlockBoxIndex] = useState<number | null>(null);
  const [sweetMessageText, setSweetMessageText] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(null);

  // Quick suggestion prompts
  const sweetPrompts = [
    'Anh là điều tuyệt vời nhất của em trong 7 năm qua 💕',
    'Em yêu anh nhiều lắm, cho em mở thêm 1 hộp quà nữa nha 🥰',
    'Cảm ơn anh vì luôn yêu thương và chiều chuộng em vô điều kiện 🌹',
    '7 năm bên anh là những ngày tháng hạnh phúc nhất đời em ✨',
  ];

  // Handle Box Click
  const handleBoxClick = (idx: number, gift: RomanticGiftItem) => {
    // If already chosen a gift, clicking a locked box prompts to send sweet message to unlock!
    if (finalChosenGift) {
      if (finalChosenGift.boxIndex === idx) {
        setShowCelebrationModal(true);
      } else {
        setTargetUnlockBoxIndex(idx);
        setShowSweetMessageModal(true);
      }
      return;
    }

    if (shakingBoxIndex !== null) return;

    // Show confirmation modal to build suspense & confirm the 1-only rule
    audioService.playTick();
    setPendingBox({ index: idx, gift });
  };

  // Confirm Open the 1 Box
  const handleConfirmOpenBox = () => {
    if (!pendingBox) return;

    const { index, gift } = pendingBox;
    setPendingBox(null);
    setShakingBoxIndex(index);
    audioService.playTick();

    // Dramatic suspense shake
    setTimeout(() => {
      setShakingBoxIndex(null);

      // Trigger grand celebratory confetti
      audioService.playChime();
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#f43f5e', '#fb7185', '#ffd700', '#c084fc', '#34d399', '#f472b6'],
      });

      const today = new Date();
      const chosenDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${today.getFullYear()}`;

      const finalData: FinalChosenGiftData = {
        gift,
        boxIndex: index,
        chosenDate,
      };

      setFinalChosenGift(finalData);
      localStorage.setItem('anniv_final_chosen_gift', JSON.stringify(finalData));
      setShowCelebrationModal(true);
    }, 850);
  };

  // Copy Claim Message to Send Boyfriend
  const handleCopyClaimMessage = (gift: RomanticGiftItem) => {
    const text = `Anh iu ơi! Em vừa chọn món quà kỷ niệm 7 năm của chúng mình: "${gift.title}" (${gift.description}). Anh đã hứa là: "${gift.boyfriendPromise}" nên chuẩn bị thực hiện cho em nha! ❤️`;
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  // Send Sweet Message & Email to nguyentai3021@gmail.com
  const handleSendSweetWords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sweetMessageText.trim()) return;

    setIsSendingEmail(true);
    setEmailStatusMessage('Đang gửi lời ngọt ngào tới hòm thư của anh...');

    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${today.getFullYear()} ${today.getHours().toString().padStart(2, '0')}:${today
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newRecord: SweetMessageRecord = {
      id: `msg_${Date.now()}`,
      text: sweetMessageText.trim(),
      timestamp: today.toISOString(),
      dateStr,
      chosenGiftTitle: finalChosenGift ? finalChosenGift.gift.title : 'Chưa chọn',
    };

    // 1. Save to localStorage history
    try {
      const savedMsgs = localStorage.getItem('anniv_sweet_messages_to_boyfriend');
      const list: SweetMessageRecord[] = savedMsgs ? JSON.parse(savedMsgs) : [];
      list.unshift(newRecord);
      localStorage.setItem('anniv_sweet_messages_to_boyfriend', JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }

    // 2. Dispatch real email to nguyentai3021@gmail.com via FormSubmit AJAX
    try {
      await fetch(`https://formsubmit.co/ajax/${BOYFRIEND_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `💌 [Kỷ Niệm 7 Năm] Lời nhắn ngọt ngào từ ${herName} để mở ${
            targetUnlockBoxIndex !== null ? `Hộp Bí Mật #${targetUnlockBoxIndex + 1}` : 'thêm hộp quà'
          }`,
          nguoi_gui: herName,
          email_nguoi_nhan: BOYFRIEND_EMAIL,
          hop_muon_mo: targetUnlockBoxIndex !== null ? `Hộp Bí Mật #${targetUnlockBoxIndex + 1}` : 'Hộp khác',
          loi_nhan_ngot_ngao: sweetMessageText.trim(),
          mon_qua_da_chon_truoc_do: finalChosenGift ? finalChosenGift.gift.title : 'Chưa có',
          thoi_gian_gui: dateStr,
          _template: 'box',
          _captcha: 'false',
        }),
      });
    } catch (netErr) {
      console.warn('Network notice (saved locally as fallback):', netErr);
    }

    // 3. Unlock boxes: Clear current finalChosenGift so she can pick another!
    localStorage.removeItem('anniv_final_chosen_gift');
    setFinalChosenGift(null);

    // Audio chime & Confetti
    audioService.playChime();
    confetti({
      particleCount: 100,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#ffd700', '#a855f7'],
    });

    setIsSendingEmail(false);
    setEmailStatusMessage('Đã gửi thành công!');

    setTimeout(() => {
      setShowSweetMessageModal(false);
      setSweetMessageText('');
      setEmailStatusMessage(null);
    }, 1200);
  };

  return (
    <section
      id="gift-game"
      aria-label="Game Chọn Quà Kỷ Niệm"
      className="p-6 sm:p-9 rounded-3xl bg-gradient-to-b from-stone-900/90 via-[#18111e]/90 to-stone-950/95 border border-rose-500/30 shadow-2xl relative overflow-hidden space-y-6"
    >
      {/* Dreamy Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section (Centered & Spacious) */}
      <div className="border-b border-stone-800/80 pb-5 space-y-3 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-rose-300 font-sans tracking-wider uppercase font-semibold px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/25">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Mini Game Kỷ Niệm 7 Năm · Dành Cho {herName}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 flex items-center justify-center gap-2">
          <span>Chiếc Hộp Quà Bí Mật 7 Năm</span>
          <span className="text-2xl">🎁</span>
        </h2>

        {/* 1-Gift Only Notice */}
        <div className="max-w-xl mx-auto">
          {finalChosenGift ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Em đã chọn xong món quà chính thức của ngày kỷ niệm 7 năm!</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
              ⚠️ <strong className="text-amber-300">Lưu ý ngọt ngào:</strong> Em chỉ được chọn{' '}
              <strong className="text-rose-400 font-bold underline">DUY NHẤT 1 CHIẾC HỘP</strong>{' '}
              thôi nha! Hãy lắng nghe con tim và mở chiếc hộp em thích nhất nhé ❤️
            </p>
          )}
        </div>
      </div>

      {/* STATE 1: ALREADY CHOSEN GIFT SPOTLIGHT */}
      {finalChosenGift ? (
        <div className="space-y-6">
          {/* Gorgeous Chosen Gift Showcase Card */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2f1325] via-[#1d0e1c] to-[#120815] border-2 border-amber-400/60 shadow-[0_20px_50px_rgba(244,63,94,0.3)] overflow-hidden">
            {/* Top Crown Ribbon */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>Món Quà Kỷ Niệm 7 Năm Em Đã Chọn (Hộp #{finalChosenGift.boxIndex + 1})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Gift Big Icon */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-pink-600 flex items-center justify-center text-5xl shrink-0 shadow-2xl ring-4 ring-amber-300/40">
                {finalChosenGift.gift.icon}
              </div>

              {/* Gift Details */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-mono">
                    {finalChosenGift.gift.badge}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    Đã chọn ngày {finalChosenGift.chosenDate}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                  {finalChosenGift.gift.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                  {finalChosenGift.gift.description}
                </p>

                {/* Boyfriend Promise */}
                <div className="p-3 rounded-xl bg-stone-950/80 border border-amber-400/30 space-y-0.5 mt-3 text-left">
                  <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cam kết của bạn trai:</span>
                  </div>
                  <p className="text-xs text-stone-200 font-serif italic">
                    "{finalChosenGift.gift.boyfriendPromise}"
                  </p>
                </div>
              </div>
            </div>

            {/* Actions for Chosen Gift */}
            <div className="mt-6 pt-5 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleCopyClaimMessage(finalChosenGift.gift)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-medium text-xs sm:text-sm shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                {copiedNotice ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedNotice ? 'Đã sao chép tin nhắn!' : 'Sao Chép Tin Nhắn Đòi Anh Thực Hiện'}</span>
              </button>
            </div>
          </div>

          {/* Sweet Unlock Notice & Action Button: "Muốn mở hộp khác thì gửi lời ngọt ngào tới anh" */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#26102a] to-rose-950/60 border border-purple-500/30 text-center space-y-3 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Muốn Mở Thêm Chiếc Hộp Khác?</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>

            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
              Anh chỉ cho em chọn 1 hộp thôi, nhưng nếu em muốn mở thêm hộp khác thì phải gửi một lời nhắn thật ngọt ngào tới anh nha! Lời nhắn sẽ được tự động gửi qua email <strong className="text-amber-300 font-mono underline">{BOYFRIEND_EMAIL}</strong> ❤️
            </p>

            <div>
              <button
                onClick={() => setShowSweetMessageModal(true)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-rose-500 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-medium text-xs sm:text-sm shadow-lg shadow-purple-950/60 inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                <span>Gửi Lời Ngọt Ngào Tới Anh Để Mở Thêm Quà 💌</span>
              </button>
            </div>
          </div>

          {/* Locked status notice for other boxes */}
          <div className="text-center text-xs text-stone-400 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-stone-400">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Các hộp quà còn lại đang bị niêm phong. Chạm vào bất kỳ hộp nào để gửi lời nhắn ngọt ngào mở khóa!</span>
            </div>
          </div>

          {/* Grid of 6 Boxes: 1 Chosen Spotlight + 5 Sealed Mystery Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {giftsList.map((gift, idx) => {
              const isTheChosenOne = finalChosenGift.boxIndex === idx;

              return (
                <div
                  key={gift.id}
                  onClick={() => handleBoxClick(idx, gift)}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between select-none relative overflow-hidden cursor-pointer transition-all hover:scale-102 ${
                    isTheChosenOne
                      ? 'bg-rose-950/70 border-amber-400 shadow-lg ring-2 ring-amber-300/40'
                      : 'bg-stone-950/70 border-stone-800/80 hover:border-purple-400/60 hover:bg-stone-900/60 opacity-80 hover:opacity-100'
                  }`}
                  style={{ minHeight: '145px' }}
                >
                  {isTheChosenOne ? (
                    <>
                      <div className="text-3xl mb-1">{finalChosenGift.gift.icon}</div>
                      <div className="font-serif font-bold text-xs text-amber-200 line-clamp-1">
                        {finalChosenGift.gift.title}
                      </div>
                      <div className="mt-1 text-[10px] font-mono text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                        ★ ĐÃ CHỌN HỘP #{idx + 1} ★
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Fully Hidden Sealed Mystery Box - No Leaks */}
                      <div className="relative my-auto flex items-center justify-center">
                        <span className="text-3xl opacity-80">🎁</span>
                        <span className="absolute -bottom-1 -right-1.5 p-1 rounded-full bg-stone-950 border border-purple-500/50 text-[10px]">
                          🔒
                        </span>
                      </div>
                      <div className="font-serif font-bold text-xs text-stone-300 mt-1">
                        Hộp Bí Mật #{idx + 1}
                      </div>
                      <div className="mt-1 text-[10px] font-mono text-purple-300/80 flex items-center gap-1 justify-center">
                        <Lock className="w-3 h-3 text-purple-400" />
                        <span>Chạm để mở khóa</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STATE 2: 6 MYSTERY BOXES (UNOPENED - ONLY 1 CAN BE PICKED) */
        <div className="space-y-4">
          <div className="text-center text-xs text-rose-300/90 font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chạm vào bất kỳ hộp quà nào bên dưới để mở duy nhất 1 món quà của em</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {giftsList.map((gift, idx) => {
              const isShaking = shakingBoxIndex === idx;

              return (
                <motion.div
                  key={gift.id}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  animate={
                    isShaking
                      ? {
                          rotate: [0, -9, 9, -9, 9, -5, 5, 0],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                  onClick={() => handleBoxClick(idx, gift)}
                  className="relative p-5 sm:p-6 rounded-2xl border cursor-pointer select-none overflow-hidden flex flex-col items-center justify-between text-center transition-all bg-[#1e1526]/85 hover:bg-[#281b33] border-rose-500/25 hover:border-amber-400/60 shadow-xl group"
                  style={{ minHeight: '190px' }}
                >
                  {/* Subtle Number Tag */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-stone-900/90 text-[10px] font-mono text-amber-300 border border-stone-700/80">
                    Hộp #{idx + 1}
                  </div>

                  {/* 3D Visual Box Graphic with Ribbon & Bow */}
                  <div className="my-auto flex flex-col items-center justify-center">
                    <div className="relative group/box">
                      {/* Box Body */}
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${gift.color} p-0.5 shadow-xl flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105`}
                      >
                        {/* Satin Ribbon Cross */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3.5 bg-amber-200/50 border-x border-amber-300/70" />
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3.5 bg-amber-200/50 border-y border-amber-300/70" />

                        {/* 3D Bow Knot on Top */}
                        <div className="w-8 h-8 rounded-full bg-amber-300 shadow-md border border-amber-400 flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform">
                          <Sparkles className="w-4 h-4 text-rose-800 animate-spin" style={{ animationDuration: '6s' }} />
                        </div>
                      </div>

                      <div className="mt-2.5 text-xs font-serif font-bold text-stone-200">
                        Chiếc Hộp #{idx + 1}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Hint */}
                  <div className="text-[11px] font-sans text-stone-400 mt-2">
                    <span className="group-hover:text-amber-300 transition-colors flex items-center gap-1 justify-center">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Chạm để chọn</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: "EM CÓ CHẮC MUỐN CHỌN HỘP NÀY?" */}
      <AnimatePresence>
        {pendingBox && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setPendingBox(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full rounded-3xl bg-gradient-to-b from-[#2a1223] via-[#1c0f1b] to-[#120815] border-2 border-amber-400/60 p-6 sm:p-7 text-center space-y-4 shadow-[0_25px_60px_-15px_rgba(244,63,94,0.5)] relative overflow-hidden"
            >
              <button
                onClick={() => setPendingBox(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center text-3xl mx-auto shadow-lg ring-4 ring-amber-300/30">
                🎁
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                  Mở Hộp Quà #{pendingBox.index + 1}?
                </h3>
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-200/90 leading-relaxed text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>
                    <strong>Lưu ý:</strong> Em chỉ được chọn <strong>DUY NHẤT 1 CHIẾC HỘP</strong> trong suốt dịp kỷ niệm này. Khi mở ra, món quà này sẽ được khóa lại và anh sẽ thực hiện nó cho em!
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleConfirmOpenBox}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-medium text-sm shadow-lg shadow-rose-900/50 flex items-center justify-center gap-2 hover:opacity-95 transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Em Chọn Chiếc Hộp Này! Mở Ngay ❤️</span>
                </button>

                <button
                  onClick={() => setPendingBox(null)}
                  className="w-full py-2.5 rounded-full text-stone-400 hover:text-stone-200 text-xs font-sans transition-colors"
                >
                  Để em suy nghĩ thêm đã 💕
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SWEET MESSAGE MODAL: GỬI LỜI NGỌT NGÀO TỚI ANH ĐỂ MỞ THÊM HỘP KHÁC */}
      <AnimatePresence>
        {showSweetMessageModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => !isSendingEmail && setShowSweetMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#2e1327] via-[#1f0f20] to-[#120815] border-2 border-purple-400/60 p-6 sm:p-7 space-y-4 shadow-[0_25px_60px_-15px_rgba(168,85,247,0.4)] relative overflow-hidden"
            >
              <button
                onClick={() => !isSendingEmail && setShowSweetMessageModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-rose-500 to-pink-500 flex items-center justify-center text-3xl mx-auto shadow-xl ring-4 ring-purple-300/30">
                  💌
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                  {targetUnlockBoxIndex !== null
                    ? `Mở Khóa Hộp Bí Mật #${targetUnlockBoxIndex + 1} 🎁`
                    : 'Gửi Lời Ngọt Ngào Tới Anh 💌'}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed max-w-sm mx-auto">
                  {targetUnlockBoxIndex !== null ? (
                    <>
                      <strong className="text-amber-300 font-semibold">Hộp Bí Mật #{targetUnlockBoxIndex + 1}</strong> đang được niêm phong giữ kín. Hãy gửi cho anh một lời nhắn ngọt ngào, hệ thống sẽ tự động gửi email tới <strong className="text-amber-300 font-mono">{BOYFRIEND_EMAIL}</strong> để mở khóa nhé!
                    </>
                  ) : (
                    <>
                      Anh chỉ cho chọn 1 hộp thôi nè! Nhưng nếu em muốn mở hộp khác, hãy gửi cho anh một lời nhắn ngọt ngào nhé. Hệ thống sẽ tự động gửi email tới <strong className="text-amber-300 font-mono">{BOYFRIEND_EMAIL}</strong> ngay lập tức!
                    </>
                  )}
                </p>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Gợi ý câu ngọt ngào (chạm để chọn nhanh):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sweetPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSweetMessageText(prompt)}
                      className="px-2.5 py-1 rounded-full bg-stone-900/90 hover:bg-purple-950/80 border border-purple-500/30 hover:border-purple-400 text-[11px] text-stone-300 hover:text-purple-200 transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSendSweetWords} className="space-y-3 pt-1">
                <div>
                  <textarea
                    rows={4}
                    value={sweetMessageText}
                    onChange={(e) => setSweetMessageText(e.target.value)}
                    placeholder="Nhập những lời ngọt ngào hoặc điều em muốn gửi gắm tới anh..."
                    required
                    className="w-full p-3.5 rounded-2xl bg-stone-950/90 border border-purple-500/40 text-stone-100 placeholder:text-stone-500 text-xs sm:text-sm focus:border-pink-400 focus:outline-hidden leading-relaxed shadow-inner resize-none"
                  />
                </div>

                {emailStatusMessage && (
                  <div className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-xs text-amber-200 text-center flex items-center justify-center gap-2">
                    {isSendingEmail ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{emailStatusMessage}</span>
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSendingEmail || !sweetMessageText.trim()}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 via-rose-500 to-pink-500 hover:from-purple-500 hover:to-pink-400 disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isSendingEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang gửi mail tới {BOYFRIEND_EMAIL}...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gửi Cho Anh & Mở Khóa Thêm Quà ❤️</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSweetMessageModal(false)}
                    className="w-full py-2 text-stone-400 hover:text-stone-200 text-xs font-sans transition-colors"
                  >
                    Thôi, em giữ món quà này được rồi 💕
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REVELATION CELEBRATION MODAL AFTER OPENING */}
      <AnimatePresence>
        {showCelebrationModal && finalChosenGift && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setShowCelebrationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full rounded-3xl bg-gradient-to-b from-[#2e1327] via-[#1d0e1c] to-[#120815] border-2 border-amber-400/80 p-6 sm:p-8 text-center space-y-5 shadow-[0_25px_60px_-15px_rgba(244,63,94,0.6)] relative overflow-hidden"
            >
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-pink-600 flex items-center justify-center text-4xl mx-auto shadow-2xl ring-4 ring-amber-300/40 animate-bounce">
                  {finalChosenGift.gift.icon}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-amber-300 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chúc mừng {herName}!</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-stone-100">
                  {finalChosenGift.gift.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                  {finalChosenGift.gift.description}
                </p>
              </div>

              {/* Boyfriend Commitment */}
              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-amber-400/30 text-left space-y-1">
                <div className="text-[11px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cam kết của bạn trai:</span>
                </div>
                <p className="text-xs text-stone-200 font-serif italic">
                  "{finalChosenGift.gift.boyfriendPromise}"
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleCopyClaimMessage(finalChosenGift.gift)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-medium text-sm shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                >
                  {copiedNotice ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNotice ? 'Đã sao chép tin nhắn!' : 'Sao Chép Tin Nhắn Đòi Quà Ngay'}</span>
                </button>

                <button
                  onClick={() => setShowCelebrationModal(false)}
                  className="w-full py-2.5 rounded-full text-stone-400 hover:text-stone-200 text-xs font-sans transition-colors"
                >
                  Đóng và ngắm món quà đã chọn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
