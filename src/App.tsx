import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CalendarDays,
  ChevronDown,
  Heart,
  Music2,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import { anniversaryConfig } from './data/siteConfig';
import { audioService } from './utils/audio';

function getElapsed() {
  const start = new Date(anniversaryConfig.startDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  return { days, hours };
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
  const elapsed = useMemo(() => getElapsed(), []);

  useEffect(() => {
    audioService.setCustomAudioUrl(anniversaryConfig.songUrl);
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
            {anniversaryConfig.memories.map((memory, index) => (
                <article className="memory-card" key={memory.year}>
                  <div className="memory-photo">
                    <MemoryImage
                      src={memory.image}
                      fallback={memory.fallbackImage}
                      alt={memory.title}
                    />
                    <span className="memory-number">{String(index + 1).padStart(2, '0')}</span>
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
              ))}
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
