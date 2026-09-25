import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Upload,
  Disc,
  FileText,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { audioService } from '../utils/audio.ts';
import { getCustomAudio, saveCustomAudio, clearCustomAudio } from '../utils/audioStorage.ts';

interface NgayDauTienPlayerProps {
  compact?: boolean;
  allowUpload?: boolean;
}

export const NgayDauTienPlayer: React.FC<NgayDauTienPlayerProps> = ({
  compact = false,
  allowUpload = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasCustomFile, setHasCustomFile] = useState(false);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [audioSource, setAudioSource] = useState<'custom' | 'synth'>('synth');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check IndexedDB for existing uploaded song
    getCustomAudio().then((res) => {
      if (res) {
        audioService.setCustomAudioUrl(res.url);
        setHasCustomFile(true);
        setCustomFileName(res.name);
        setAudioSource('custom');
      }
    });

    const unsubscribe = audioService.subscribe(() => {
      setIsPlaying(audioService.getIsPlaying());
      setIsMuted(audioService.getIsMuted());
      setAudioSource(audioService.getActiveSource());
    });

    // Time update listener for HTML5 audio
    const audioEl = audioService.getAudioElement();
    const handleTimeUpdate = () => {
      if (audioEl) {
        setCurrentTime(audioEl.currentTime);
        setDuration(audioEl.duration || 0);
      }
    };
    if (audioEl) {
      audioEl.addEventListener('timeupdate', handleTimeUpdate);
      audioEl.addEventListener('loadedmetadata', handleTimeUpdate);
    }

    return () => {
      unsubscribe();
      if (audioEl) {
        audioEl.removeEventListener('timeupdate', handleTimeUpdate);
        audioEl.removeEventListener('loadedmetadata', handleTimeUpdate);
      }
    };
  }, []);

  const handleTogglePlay = () => {
    const active = audioService.toggleMusic();
    setIsPlaying(active);
  };

  const handleToggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await saveCustomAudio(file, file.name);
      const url = URL.createObjectURL(file);
      audioService.setCustomAudioUrl(url);
      setHasCustomFile(true);
      setCustomFileName(file.name);
      setAudioSource('custom');
      audioService.startMusic();
      audioService.playChime();
    } catch (err) {
      console.error('Error saving audio file', err);
    }
  };

  const handleRemoveCustomAudio = async () => {
    await clearCustomAudio();
    audioService.stopMusic();
    setHasCustomFile(false);
    setCustomFileName('');
    setAudioSource('synth');
    // Reset to synth
    const audioEl = audioService.getAudioElement();
    if (audioEl) {
      audioEl.src = '';
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    const audioEl = audioService.getAudioElement();
    if (audioEl && duration > 0) {
      audioEl.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-1.5 pl-3 bg-stone-900/90 backdrop-blur-md border border-rose-500/30 rounded-full shadow-2xl">
        <div
          className={`w-6 h-6 rounded-full bg-stone-800 border border-rose-500/40 flex items-center justify-center overflow-hidden shrink-0 ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '4s' }}
        >
          <Disc className="w-3.5 h-3.5 text-rose-400" />
        </div>

        <div className="flex flex-col text-left pr-1 min-w-0">
          <span className="text-[11px] font-semibold text-rose-200 truncate max-w-[120px] sm:max-w-[160px] leading-tight">
            Ngày Đầu Tiên
          </span>
          <span className="text-[9px] text-stone-400 truncate max-w-[120px] sm:max-w-[160px] leading-tight">
            {hasCustomFile ? 'Bản MP3 gốc' : 'Hộp nhạc Đức Phúc'}
          </span>
        </div>

        <button
          onClick={handleTogglePlay}
          className={`p-1.5 rounded-full text-white transition-all active:scale-95 ${
            isPlaying ? 'bg-rose-600 hover:bg-rose-500' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
          }`}
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát Ngày Đầu Tiên'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-full text-stone-400 hover:text-white bg-stone-800/80 transition-colors"
          title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-500" /> : <Volume2 className="w-3.5 h-3.5 text-rose-300" />}
        </button>
      </div>
    );
  }

  return (
    <section
      aria-label="Khung phát nhạc Ngày Đầu Tiên"
      className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-950/90 to-stone-900/90 border border-rose-500/30 shadow-2xl relative overflow-hidden backdrop-blur-md"
    >
      {/* Background soft glow when playing */}
      <div
        className={`absolute -right-20 -top-20 w-64 h-64 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-30'
        }`}
      />

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative z-10">
        {/* Spinning Vinyl Record Visual */}
        <div className="relative group shrink-0">
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-stone-950 border-4 border-stone-800 shadow-2xl flex items-center justify-center relative transition-transform duration-500 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            {/* Grooves */}
            <div className="absolute inset-2 rounded-full border border-stone-800/80" />
            <div className="absolute inset-4 rounded-full border border-stone-800/60" />
            <div className="absolute inset-7 rounded-full border border-stone-800/40" />

            {/* Center Label */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-700 to-pink-500 flex flex-col items-center justify-center text-white shadow-inner">
              <Heart className="w-4 h-4 fill-white" />
              <span className="text-[7px] font-mono tracking-tighter uppercase font-bold mt-0.5">25.09</span>
            </div>
          </div>

          {/* Quick Play/Pause Overlay */}
          <button
            onClick={handleTogglePlay}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-transform active:scale-90 opacity-0 group-hover:opacity-100 backdrop-blur-xs"
            title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
          >
            {isPlaying ? <Pause className="w-5 h-5 text-rose-300" /> : <Play className="w-5 h-5 text-rose-300 ml-0.5" />}
          </button>
        </div>

        {/* Song Info & Controls */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0 w-full">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[10px] uppercase tracking-wider font-semibold">
              <Music className="w-3 h-3 text-rose-400" />
              <span>Giai điệu tình yêu 7 năm</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 flex items-center justify-center sm:justify-start gap-2">
              <span>Ngày Đầu Tiên</span>
              {isPlaying && (
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-pulse" />
                  <span className="w-1 h-5 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-2 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-stone-400 font-sans">
              Trình bày: <span className="text-rose-300 font-medium">Đức Phúc</span> · Sáng tác: Khắc Hưng
            </p>
          </div>

          {/* Romantic Lyric Quote */}
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-stone-300 text-xs sm:text-sm font-serif italic text-center sm:text-left leading-relaxed">
            "Điều anh muốn là luôn thấy em cười, chẳng cần phải lo lắng vì anh ở đây rồi... Cuộc đời anh là để cho em, riêng em mãi thôi."
          </div>

          {/* Progress Slider (Active when custom audio is played) */}
          {hasCustomFile && duration > 0 && (
            <div className="space-y-1 pt-1 font-mono text-[10px] text-stone-400">
              <div className="flex justify-between items-center px-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          )}

          {/* Player Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            {/* Main Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`px-5 py-2.5 rounded-full text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Tạm Dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Phát "Ngày Đầu Tiên"</span>
                </>
              )}
            </button>

            {/* Mute/Volume Button */}
            <button
              onClick={handleToggleMute}
              className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-rose-300" />}
            </button>

            {/* View Full Lyrics */}
            <button
              onClick={() => setShowLyricsModal(true)}
              className="px-3 py-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>Lời bài hát</span>
            </button>
          </div>
        </div>
      </div>

      {/* File Upload / Storage Status Ribbon (Only shown if allowUpload is enabled, e.g. in Settings) */}
      {allowUpload && (
        <div className="mt-5 pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            {hasCustomFile ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đang phát file: <strong className="font-mono text-white">{customFileName}</strong></span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-stone-400">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Đang phát: Hộp nhạc chuông thánh thót điệp khúc "Ngày Đầu Tiên"</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/mp3,audio/mpeg,audio/*,.mp3,.m4a"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-full bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-rose-400" />
              <span>{hasCustomFile ? 'Đổi file MP3 khác' : 'Nạp file Ngày Đầu Tiên.mp3'}</span>
            </button>

            {hasCustomFile && (
              <button
                onClick={handleRemoveCustomAudio}
                className="p-1.5 rounded-full text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                title="Xóa bài hát đã nạp và trở về hộp nhạc"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL: FULL LYRICS */}
      {showLyricsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-stone-900 border border-rose-500/40 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-xl font-bold text-stone-100">Ngày Đầu Tiên</h4>
                <p className="text-xs text-rose-400 font-sans">Đức Phúc · Lời ca kỷ niệm 7 năm</p>
              </div>
              <button
                onClick={() => setShowLyricsModal(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-serif text-sm sm:text-base leading-relaxed text-stone-300 whitespace-pre-line text-center">
              {`Nhiều khi kiếm đâu một người như em trên đời
Gặp em khiến anh ngỡ là giấc mơ tuyệt vời
Mỉm cười mỗi khi chạm vào bờ môi ấm nồng
Chỉ mong tháng năm cùng người trọn vẹn yêu thương.

Và ngày hôm ấy đã đến, anh được nhìn thấy em cười
Trong chiếc váy cưới thật xinh, lung linh rạng ngời
Cầm tay bước đi đến cuối con đường...

[Điệp khúc]
Điều anh muốn là luôn thấy em cười
Chẳng cần phải lo lắng vì anh ở đây rồi
Để chở che cho em, để sẻ chia buồn vui
Cuộc đời anh là để cho em, riêng em mãi thôi!

Từ ngày đầu tiên ta chung một lối
Hạnh phúc này xin khắc sâu vào tim
Dù ngàn giông bão cũng chẳng đổi dời
Bởi vì tình yêu anh trao em là mãi mãi... ❤️`}
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-950/60 text-center">
              <button
                onClick={() => setShowLyricsModal(false)}
                className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
