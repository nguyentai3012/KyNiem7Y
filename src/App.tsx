import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Music, VolumeX, Sparkles, Mail, Settings } from 'lucide-react';
import { audioService } from './utils/audio.ts';
import { FloatingPetals } from './components/FloatingPetals.tsx';
import { FloatingHearts } from './components/FloatingHearts.tsx';
import { OpeningEnvelope } from './components/OpeningEnvelope.tsx';
import { SevenYearGallery } from './components/SevenYearGallery.tsx';
import { NgayDauTienPlayer } from './components/NgayDauTienPlayer.tsx';
import { MusicPlayerBar } from './components/MusicPlayerBar.tsx';
import { SettingsPage } from './components/SettingsPage.tsx';
import { RomanticGiftPickerGame } from './components/RomanticGiftPickerGame.tsx';
import { subscribeCloudSettings, syncSettingsToCloud } from './services/cloudSyncService.ts';

// Check if current URL matches settings / admin route
const isSettingsUrl = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path.startsWith('/settings') ||
    path.startsWith('/admin') ||
    search.includes('settings') ||
    search.includes('admin') ||
    hash.startsWith('#settings') ||
    hash.startsWith('#admin')
  );
};

export default function App() {
  const [isSettingsMode, setIsSettingsMode] = useState(isSettingsUrl);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [petalsEnabled, setPetalsEnabled] = useState(true);
  const [hugSent, setHugSent] = useState(false);
  const [isFireworksActive, setIsFireworksActive] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  // Her name
  const [herName, setHerName] = useState(() => {
    return localStorage.getItem('anniv_her_name') || 'Bé iu của anh';
  });

  // Handwritten letter
  const [letterContent, setLetterContent] = useState(() => {
    const saved = localStorage.getItem('anniv_letter_simple');
    return (
      saved ||
      `Gửi người con gái anh yêu thương nhất,\n\nNgày mai 25/09 là tròn 7 năm kể từ ngày em gật đầu đồng ý cùng anh bước vào một câu chuyện tình yêu đẹp nhất trần đời.\n\n7 năm qua, có những ngày ngập tràn tiếng cười rực rỡ, cũng có những ngày giông bão mưa rơi. Nhưng điều kỳ diệu nhất là dù ở đâu, chỉ cần nhìn về phía em, anh luôn tìm thấy bến đỗ bình yên và động lực để vững bước mỗi ngày.\n\nCảm ơn em vì đã luôn dịu dàng, bao dung cho những vụng về của anh, và cùng anh đi qua những năm tháng thanh xuân quý giá nhất.\n\n7 năm mới chỉ là chặng đường đầu tiên. Mong rằng 10 năm, 20 năm hay cả cuộc đời sau này, người nắm tay anh đón mùa thu vẫn mãi mãi là em.\n\nYêu em nhiều hơn tất cả mọi điều trên thế gian!`
    );
  });

  const [letterDateStr, setLetterDateStr] = useState(() => {
    return localStorage.getItem('anniv_letter_date') || 'Ngày 25 tháng 09 năm 2026';
  });

  // Real-time counter from 25/09/2019
  const [daysCount, setDaysCount] = useState(2557);

  // Real-time Cloud Settings listener
  useEffect(() => {
    const unsubscribe = subscribeCloudSettings((cloudSettings) => {
      if (cloudSettings.herName) {
        setHerName(cloudSettings.herName);
        localStorage.setItem('anniv_her_name', cloudSettings.herName);
      }
      if (cloudSettings.letterContent) {
        setLetterContent(cloudSettings.letterContent);
        localStorage.setItem('anniv_letter_simple', cloudSettings.letterContent);
      }
      if (cloudSettings.letterDateStr) {
        setLetterDateStr(cloudSettings.letterDateStr);
        localStorage.setItem('anniv_letter_date', cloudSettings.letterDateStr);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Navigation listener for URL routing (/settings vs /)
  useEffect(() => {
    const handleUrlChange = () => {
      setIsSettingsMode(isSettingsUrl());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (mode: 'showcase' | 'settings') => {
    if (mode === 'settings') {
      window.history.pushState(null, '', '/settings');
      setIsSettingsMode(true);
    } else {
      window.history.pushState(null, '', '/');
      setIsSettingsMode(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const calculateDays = () => {
      const startDate = new Date('2019-09-25T00:00:00').getTime();
      const now = new Date().getTime();
      const diffDays = Math.floor(Math.max(0, now - startDate) / (1000 * 60 * 60 * 24));
      setDaysCount(diffDays);
    };
    calculateDays();

    // Sync audio state
    setIsPlayingMusic(audioService.getIsPlaying());
    setIsMuted(audioService.getIsMuted());

    const unsubscribe = audioService.subscribe(() => {
      setIsPlayingMusic(audioService.getIsPlaying());
      setIsMuted(audioService.getIsMuted());
    });

    return () => unsubscribe();
  }, []);

  const handleToggleMusic = () => {
    const active = audioService.toggleMusic();
    setIsPlayingMusic(active);
  };

  const handleToggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  // Fireworks when clicking "Gửi cái ôm ấm áp cho anh"
  const handleSendHug = () => {
    setHugSent(true);
    setIsFireworksActive(true);
    audioService.playFireworksSound();

    // Stage 1: Big explosion in the center
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.7, x: 0.5 },
      colors: ['#ff1744', '#ff4081', '#ffd700', '#ff80bf', '#ffffff', '#fb7185'],
      startVelocity: 45,
      scalar: 1.2,
    });

    // Stage 2: Dual cannons from sides
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 75,
        origin: { x: 0.05, y: 0.8 },
        colors: ['#f43f5e', '#fb7185', '#fef08a', '#c084fc', '#ffd700'],
        startVelocity: 50,
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 75,
        origin: { x: 0.95, y: 0.8 },
        colors: ['#f43f5e', '#fb7185', '#fef08a', '#c084fc', '#ffd700'],
        startVelocity: 50,
      });
    }, 200);

    // Stage 3: Continuous sky firework bursts for 3.5 seconds
    const duration = 3500;
    const animationEnd = Date.now() + duration;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimeout(() => setIsFireworksActive(false), 600);
        return;
      }

      const particleCount = Math.floor(45 * (timeLeft / duration));
      confetti({
        particleCount,
        startVelocity: 35,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random() * 0.8 + 0.1,
          y: Math.random() * 0.45 + 0.1,
        },
        colors: ['#ff1744', '#ff4081', '#ffd700', '#ffea00', '#f50057', '#ffffff', '#e040fb'],
        scalar: 1.1,
      });
    }, 240);
  };

  // ROUTE 1: SETTINGS / ADMIN PAGE
  if (isSettingsMode) {
    return (
      <SettingsPage
        onBackToShowcase={() => navigateTo('showcase')}
        herName={herName}
        onUpdateHerName={(val) => {
          setHerName(val);
          localStorage.setItem('anniv_her_name', val);
          syncSettingsToCloud({ herName: val });
        }}
        letterContent={letterContent}
        onUpdateLetterContent={(val) => {
          setLetterContent(val);
          localStorage.setItem('anniv_letter_simple', val);
          syncSettingsToCloud({ letterContent: val });
        }}
        letterDateStr={letterDateStr}
        onUpdateLetterDateStr={(val) => {
          setLetterDateStr(val);
          localStorage.setItem('anniv_letter_date', val);
          syncSettingsToCloud({ letterDateStr: val });
        }}
        petalsEnabled={petalsEnabled}
        onTogglePetals={() => setPetalsEnabled(!petalsEnabled)}
      />
    );
  }

  // ROUTE 2: MAIN SHOWCASE URL (PURE SHOWCASE - NO EDIT BUTTONS)
  return (
    <div className="min-h-screen bg-[#0e0c13] text-stone-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200 relative overflow-x-hidden">
      {/* Gentle Floating Rose Petals & Floating Hearts From Bottom */}
      <FloatingPetals enabled={petalsEnabled} />
      <FloatingHearts enabled={petalsEnabled} />

      {/* Atmospheric Warm Glowing Lights */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-rose-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[130px]" />
      </div>

      {/* Top Floating Music & Envelope Controls */}
      <aside aria-label="Điều khiển âm thanh" className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {isEnvelopeOpen && (
          <button
            onClick={() => setIsEnvelopeOpen(false)}
            className="px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all active:scale-95"
            title="Gấp lại phong thư kỷ niệm"
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline text-[11px] font-medium">Gấp phong thư</span>
          </button>
        )}

        <button
          onClick={handleToggleMusic}
          className={`px-3 py-1.5 rounded-full transition-all text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
            isPlayingMusic
              ? 'bg-rose-600/90 text-white shadow-rose-900/50 ring-2 ring-rose-400/30'
              : 'bg-stone-900/80 text-stone-300 border border-stone-700/60 hover:text-white'
          }`}
          title="Bật/Tắt nhạc nền"
        >
          <Music className={`w-3.5 h-3.5 ${isPlayingMusic ? 'animate-spin' : ''}`} />
          <span className="text-[11px] font-medium">{isPlayingMusic ? 'Đang phát' : 'Phát nhạc'}</span>
        </button>

        <button
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-700/60 shadow-lg backdrop-blur-md transition-all"
          title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Music className="w-3.5 h-3.5 text-rose-300" />}
        </button>
      </aside>

      {/* INTERACTIVE OPENING ENVELOPE / MAIN ANNIVERSARY CONTENT */}
      {!isEnvelopeOpen ? (
        <OpeningEnvelope
          isOpen={false}
          onOpen={() => setIsEnvelopeOpen(true)}
          onReopen={() => setIsEnvelopeOpen(false)}
          recipientName={herName}
        />
      ) : (
        <>
          <OpeningEnvelope
            isOpen={true}
            onOpen={() => setIsEnvelopeOpen(true)}
            onReopen={() => setIsEnvelopeOpen(false)}
            recipientName={herName}
          />

          {/* MAIN SHOWCASE CONTENT (CLEAN, ROMANTIC, PURE PRESENTATION) */}
          <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-14 relative z-20">
            {/* HEADER: Announce the 7-year anniversary */}
            <header className="text-center space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-sans tracking-widest uppercase shadow-sm">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>25.09.2019 — 25.09.2026</span>
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 tracking-tight leading-tight">
                Kỷ Niệm 7 Năm Yêu Nhau
              </h1>

              {/* Recipient's Name - Pure display */}
              <div className="pt-1">
                <span className="font-serif text-lg sm:text-xl text-rose-300 italic">
                  Dành riêng cho {herName}
                </span>
              </div>
            </header>

            {/* SECTION 1: THE MAGIC NUMBER - 2,557 DAYS */}
            <section aria-label="Đếm ngày yêu" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-stone-900/80 to-stone-950/80 border border-rose-500/25 text-center shadow-xl backdrop-blur-md space-y-2">
              <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold font-sans">
                Chúng mình đã cùng nhau đi qua
              </div>

              <div className="flex items-baseline justify-center gap-2 sm:gap-3 py-1">
                <span className="font-mono text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 tabular-nums">
                  {daysCount.toLocaleString()}
                </span>
                <span className="font-serif text-xl sm:text-2xl text-stone-300 italic">
                  ngày ngọt ngào
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-md mx-auto pt-1 leading-relaxed">
                Hơn 61,368 giờ chở che, sẻ chia và lắng nghe nhau. Mỗi ngày thức dậy có em trong đời là một ngày tuyệt vời của anh.
              </p>
            </section>

            {/* SECTION 2: 7-YEAR ANNIVERSARY PHOTO ALBUM (Pure showcase, allowEdit = false) */}
            <SevenYearGallery allowEdit={false} />

            {/* SECTION 3: DEDICATED ROMANTIC MUSIC PLAYER - "NGÀY ĐẦU TIÊN" (Pure showcase, allowUpload = false) */}
            <NgayDauTienPlayer compact={false} allowUpload={false} />

            {/* SECTION 4: THE INTIMATE HANDWRITTEN LOVE LETTER (Pure presentation, no edit buttons) */}
            <section aria-label="Bức thư tình" className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 uppercase tracking-wider font-semibold font-sans">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bức Thư Tay Gửi Em</span>
                </div>

                <button
                  onClick={() => setIsEnvelopeOpen(false)}
                  className="text-xs text-rose-300 hover:text-rose-100 transition-colors flex items-center gap-1 font-sans bg-rose-950/50 hover:bg-rose-900/60 px-2.5 py-1 rounded-full border border-rose-500/30"
                  title="Gấp lại phong thư kỷ niệm 25/09"
                >
                  <Mail className="w-3 h-3 text-rose-400" />
                  <span>Xem lại phong thư</span>
                </button>
              </div>

              {/* Vintage Letter Parchment */}
              <div className="bg-[#faf6ee] text-[#2c2420] rounded-2xl p-7 sm:p-9 shadow-2xl border border-[#d6c7b2] relative select-text">
                {/* Vintage Postmark Stamp */}
                <div className="absolute top-6 right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#b39e82] flex flex-col items-center justify-center rotate-6 pointer-events-none opacity-80">
                  <Heart className="w-3.5 h-3.5 fill-[#b34045] text-[#b34045]" />
                  <span className="text-[8px] font-sans font-bold text-[#6e5844] mt-0.5">25.09</span>
                  <span className="text-[7px] font-sans text-[#8a725b]">7 NĂM</span>
                </div>

                <div className="font-serif space-y-4 text-xs sm:text-sm sm:leading-relaxed text-[#2c2420] whitespace-pre-line italic">
                  {letterContent}
                </div>

                <div className="mt-8 pt-4 border-t border-[#d6c7b2] flex items-center justify-between text-xs text-[#735d49]">
                  <span className="font-sans">{letterDateStr}</span>
                  <span className="font-handwriting text-lg sm:text-xl text-[#8f2d33] font-bold">
                    Người yêu em nhiều nhất
                  </span>
                </div>
              </div>
            </section>

            {/* SECTION 5: SPECIAL ANNIVERSARY GIFT PICKER GAME */}
            <RomanticGiftPickerGame herName={herName} />

            {/* SECTION 6: SEND A HUG & FIREWORKS */}
            <section aria-label="Gửi cái ôm ấm áp" className="p-8 rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950/90 border border-rose-500/30 text-center space-y-4 shadow-2xl relative overflow-hidden">
              {isFireworksActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-rose-600/15 via-amber-500/10 to-transparent pointer-events-none animate-pulse" />
              )}

              <div className="w-14 h-14 rounded-full bg-rose-950 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto shadow-inner relative z-10">
                <Heart
                  className={`w-7 h-7 fill-rose-500 text-rose-500 transition-transform ${
                    isFireworksActive ? 'scale-125 animate-bounce' : 'animate-pulse'
                  }`}
                />
              </div>

              <div className="space-y-1 relative z-10">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 flex items-center justify-center gap-2">
                  <span>Gửi Một Cái Ôm Cho Anh</span>
                  {isFireworksActive && <span className="animate-bounce">🎆</span>}
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-sm mx-auto">
                  Chạm vào nút bên dưới để thắp sáng pháo hoa và gửi trao anh một cái ôm thật chặt nhé!
                </p>
              </div>

              <div className="relative z-10">
                <button
                  onClick={handleSendHug}
                  className={`px-8 py-3.5 rounded-full text-white font-medium text-sm sm:text-base shadow-xl transition-all duration-300 active:scale-95 inline-flex items-center gap-2 ${
                    isFireworksActive
                      ? 'bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 shadow-rose-600/50 scale-105 ring-4 ring-rose-500/30'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-950'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 text-amber-200 ${isFireworksActive ? 'animate-spin' : ''}`} />
                  <span>
                    {isFireworksActive
                      ? '🎆 Pháo Hoa Đang Rực Sáng!'
                      : hugSent
                      ? 'Bắn Thêm Pháo Hoa & Ôm Anh Thêm Cái Nữa ❤️'
                      : 'Gửi Cái Ôm Ấm Áp Cho Anh'}
                  </span>
                  <Heart className="w-4 h-4 fill-white" />
                </button>
              </div>

              {hugSent && (
                <div className="mt-4 p-5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-100 text-sm sm:text-base font-serif italic shadow-lg relative z-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-sans not-italic font-semibold uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pháo Hoa Tình Yêu 7 Năm Đang Rực Sáng!</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  ❤️ "Anh đã nhận trọn vẹn cái ôm của em rồi! Cảm ơn em vì 7 năm ngọt ngào nhất thế gian. Ngày mai chúng mình cùng đi ăn mừng kỷ niệm nhé bé iu!"
                </div>
              )}
            </section>

            {/* FOOTER: Pure romantic showcase */}
            <footer className="text-center pt-6 pb-12 border-t border-stone-800/60 text-xs text-stone-500 font-sans space-y-1">
              <p>Kỷ niệm tình yêu 7 năm · 25/09/2019 — 25/09/2026</p>
              <p className="text-stone-600 font-serif italic">Mãi mãi trọn một tình yêu</p>
            </footer>
          </main>
        </>
      )}

      {/* Floating Bottom Mini Controller */}
      <MusicPlayerBar
        petalsEnabled={petalsEnabled}
        onTogglePetals={() => setPetalsEnabled(!petalsEnabled)}
        onReopenEnvelope={isEnvelopeOpen ? () => setIsEnvelopeOpen(false) : undefined}
      />
    </div>
  );
}
