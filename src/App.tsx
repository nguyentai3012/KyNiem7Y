import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CalendarDays,
  ChevronDown,
  Heart,
  Music2,
  Pause,
  Play,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import { anniversaryConfig } from './data/siteConfig';
import { audioService } from './utils/audio';
import { getAllPhotos, savePhoto } from './utils/photoStorage';

const LEGACY_PHOTO_KEYS: Record<string, string> = {
  '2019': 'photo_1',
  '2021': 'photo_2',
  '2022': 'photo_4',
  '2025': 'photo_5',
};

function getElapsed() {
  const start = new Date(anniversaryConfig.startDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  return { days, hours };
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const source = event.target?.result;
      if (typeof source !== 'string') {
        reject(new Error('Unable to read image'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height >= width && height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(source);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };

      img.onerror = () => reject(new Error('Unable to decode image'));
      img.src = source;
    };

    reader.onerror = () => reject(reader.error ?? new Error('Unable to read image'));
    reader.readAsDataURL(file);
  });
}

function MemoryImage({
  src,
  fallback,
  alt,
}: {
  src: string;
  fallback: string;
  alt: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [photoData, setPhotoData] = useState<Record<string, string>>({});
  const [uploadingYear, setUploadingYear] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetYearRef = useRef<string | null>(null);
  const elapsed = useMemo(() => getElapsed(), []);

  useEffect(() => {
    let mounted = true;

    getAllPhotos()
      .then((photos) => {
        if (mounted) setPhotoData(photos);
      })
      .catch((error) => {
        console.error('Failed to load saved anniversary photos', error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const toggleMusic = async () => {
    const next = audioService.toggleMusic();
    setPlaying(next);
  };

  const openGift = async () => {
    setOpened(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 40);

    try {
      const next = await audioService.startMusic();
      setPlaying(next);
    } catch {
      setPlaying(false);
    }

    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.72 },
      colors: ['#f4b6c2', '#f7d9df', '#f6e7c1', '#ffffff'],
    });
  };

  const triggerMemoryUpload = (year: string) => {
    uploadTargetYearRef.current = year;
    uploadInputRef.current?.click();
  };

  const handleMemoryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const year = uploadTargetYearRef.current;

    if (!file || !year) return;

    setUploadingYear(year);

    try {
      const compressed = await compressImage(file);
      const storageKey = `memory_${year}`;

      await savePhoto(storageKey, compressed);
      setPhotoData((previous) => ({
        ...previous,
        [storageKey]: compressed,
      }));

      confetti({
        particleCount: 28,
        spread: 55,
        origin: { y: 0.55 },
        colors: ['#f4b6c2', '#f7d9df', '#f6e7c1', '#ffffff'],
      });
    } catch (error) {
      console.error(`Failed to save anniversary photo for ${year}`, error);
    } finally {
      setUploadingYear(null);
      uploadTargetYearRef.current = null;
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  const getMemoryImage = (year: string, configuredImage: string) => {
    const currentKey = `memory_${year}`;
    const legacyKey = LEGACY_PHOTO_KEYS[year];

    return photoData[currentKey] || (legacyKey ? photoData[legacyKey] : undefined) || configuredImage;
  };

  const answerYes = () => {
    setAnswered(true);
    const end = Date.now() + 2200;

    const timer = window.setInterval(() => {
      const left = end - Date.now();
      if (left <= 0) {
        window.clearInterval(timer);
        return;
      }

      confetti({
        particleCount: 36,
        spread: 360,
        startVelocity: 28,
        ticks: 60,
        origin: {
          x: 0.15 + Math.random() * 0.7,
          y: 0.2 + Math.random() * 0.45,
        },
        colors: ['#fb7185', '#fda4af', '#fde68a', '#ffffff', '#f9a8d4'],
      });
    }, 190);
  };

  if (!opened) {
    return (
      <main className="opening-screen">
        <div className="opening-glow opening-glow-one" />
        <div className="opening-glow opening-glow-two" />

        <section className="opening-copy">
          <div className="eyebrow">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>Một món quà chỉ dành riêng cho em</span>
          </div>

          <p className="opening-date">25 · 09 · 2019 — 25 · 09 · 2026</p>
          <h1>7 năm của chúng mình</h1>
          <p>
            Anh gom một ít kỷ niệm, một ít lời chưa nói và rất nhiều thương nhớ
            vào chiếc phong thư này.
          </p>
        </section>

        <button className="envelope" onClick={openGift} aria-label="Mở món quà kỷ niệm">
          <div className="envelope-paper">
            <span className="envelope-line envelope-line-left" />
            <span className="envelope-line envelope-line-right" />
            <div className="wax-seal">
              <Heart className="h-7 w-7 fill-current" />
              <strong>7 NĂM</strong>
              <small>25.09</small>
            </div>
            <span className="envelope-caption">Gửi người con gái anh yêu nhất</span>
          </div>
        </button>

        <button className="open-button" onClick={openGift}>
          <Sparkles className="h-4 w-4" />
          Mở món quà của chúng mình
        </button>

        <p className="sound-hint">Bật loa một chút nha em ♡</p>
      </main>
    );
  }

  return (
    <div className="site-shell">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleMemoryUpload}
      />

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <button
        className="music-fab"
        onClick={toggleMusic}
        aria-label={playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        <span>{playing ? 'Đang phát' : 'Bật nhạc'}</span>
      </button>

      <main className="content">
        <section className="hero-section">
          <div className="hero-pill">
            <CalendarDays className="h-4 w-4" />
            {anniversaryConfig.anniversaryDate}
          </div>

          <p className="hero-for">Dành riêng cho {anniversaryConfig.herName}</p>
          <h1>{anniversaryConfig.headline}</h1>
          <p className="hero-intro">{anniversaryConfig.intro}</p>

          <div className="counter-card">
            <div>
              <strong>{elapsed.days.toLocaleString('vi-VN')}</strong>
              <span>ngày bên nhau</span>
            </div>
            <span className="counter-divider" />
            <div>
              <strong>{elapsed.hours.toLocaleString('vi-VN')}</strong>
              <span>giờ có nhau trong đời</span>
            </div>
          </div>

          <a className="scroll-cue" href="#story">
            <span>Xem lại câu chuyện của mình</span>
            <ChevronDown className="h-4 w-4" />
          </a>
        </section>

        <section id="story" className="story-section">
          <div className="section-heading">
            <span>Our story</span>
            <h2>Từng năm một, mình đã lớn lên cùng nhau</h2>
            <p>
              Không cần mọi khoảnh khắc đều hoàn hảo. Chỉ cần khi nhìn lại,
              chúng mình vẫn thấy đáng để giữ.
            </p>
          </div>

          <div className="timeline">
            {anniversaryConfig.memories.map((memory, index) => {
              const imageSrc = getMemoryImage(memory.year, memory.image);
              const isUploading = uploadingYear === memory.year;

              return (
                <article className="memory-card" key={memory.year}>
                  <div className="memory-photo">
                    <MemoryImage
                      src={imageSrc}
                      fallback={memory.fallbackImage}
                      alt={memory.title}
                    />
                    <span className="memory-number">{String(index + 1).padStart(2, '0')}</span>

                    <button
                      type="button"
                      onClick={() => triggerMemoryUpload(memory.year)}
                      disabled={isUploading}
                      className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-black/65 disabled:cursor-wait disabled:opacity-70"
                      aria-label={`Đổi ảnh kỷ niệm năm ${memory.year}`}
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>{isUploading ? 'Đang lưu...' : 'Đổi ảnh'}</span>
                    </button>
                  </div>

                  <div className="memory-copy">
                    <div className="memory-meta">
                      <strong>{memory.year}</strong>
                      <span>{memory.date}</span>
                    </div>
                    <h3>{memory.title}</h3>
                    <p>{memory.note}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="music-section">
          <div className="record-wrap">
            <div className={`record ${playing ? 'record-playing' : ''}`}>
              <div className="record-label">
                <Heart className="h-5 w-5 fill-current" />
                <span>25.09</span>
              </div>
            </div>
          </div>

          <div className="music-copy">
            <span className="section-kicker">Bài hát của hôm nay</span>
            <h2>Ngày Đầu Tiên</h2>
            <p>
              Có những bài hát chỉ cần vang lên là đủ để nhớ một người.
              Với anh, hôm nay bài này dành cho em.
            </p>
            <button onClick={toggleMusic} className="music-button">
              {playing ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
              {playing ? 'Tạm dừng một chút' : 'Nghe cùng anh'}
            </button>
          </div>
        </section>

        <section className="letter-section">
          <div className="letter-label">
            <Sparkles className="h-4 w-4" />
            <span>Một lá thư cho em</span>
          </div>

          <article className="letter-paper">
            <div className="postmark">
              <Heart className="h-4 w-4 fill-current" />
              <span>7 YEARS</span>
              <small>25.09.2026</small>
            </div>

            <p className="letter-greeting">Gửi {anniversaryConfig.herName},</p>

            <div className="letter-body">
              {anniversaryConfig.letter.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="letter-signature">
              <span>Người vẫn muốn đi cùng em thật lâu,</span>
              <strong>{anniversaryConfig.fromName}</strong>
              <small>25.09.2026</small>
            </div>
          </article>
        </section>

        <section className="final-section">
          <div className="final-heart">
            <Heart className="h-8 w-8 fill-current" />
          </div>

          {!answered ? (
            <>
              <span className="section-kicker">Một câu hỏi cuối thôi</span>
              <h2>Những năm tiếp theo, em vẫn đi cùng anh nhé?</h2>
              <p>
                Không hứa ngày nào cũng hoàn hảo. Chỉ hứa vẫn sẽ cố gắng chọn
                nhau, như cách chúng mình đã làm suốt 7 năm qua.
              </p>
              <div className="answer-buttons">
                <button onClick={answerYes}>Đồng ý ❤️</button>
                <button onClick={answerYes}>Tất nhiên rồi 😌</button>
              </div>
            </>
          ) : (
            <div className="answer-result">
              <span className="section-kicker">Vậy là chốt nha ♡</span>
              <h2>Happy 7th Anniversary, tình yêu của anh.</h2>
              <p>
                Cảm ơn em vì 7 năm. Mình tiếp tục viết những chương sau nhé.
              </p>
            </div>
          )}
        </section>

        <footer>
          <Heart className="h-3.5 w-3.5 fill-current" />
          <span>25.09.2019 — 25.09.2026</span>
          <Heart className="h-3.5 w-3.5 fill-current" />
        </footer>
      </main>
    </div>
  );
}
