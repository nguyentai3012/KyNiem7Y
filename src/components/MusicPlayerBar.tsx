import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Disc, Sparkles, Mail } from 'lucide-react';
import { audioService } from '../utils/audio.ts';

interface MusicPlayerBarProps {
  petalsEnabled: boolean;
  onTogglePetals: () => void;
  onReopenEnvelope?: () => void;
}

export const MusicPlayerBar: React.FC<MusicPlayerBarProps> = ({
  petalsEnabled,
  onTogglePetals,
  onReopenEnvelope,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsPlaying(audioService.getIsPlaying());
    setIsMuted(audioService.getIsMuted());

    const unsubscribe = audioService.subscribe(() => {
      setIsPlaying(audioService.getIsPlaying());
      setIsMuted(audioService.getIsMuted());
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePlay = () => {
    const active = audioService.toggleMusic();
    setIsPlaying(active);
  };

  const handleToggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  return (
    <aside aria-label="Điều khiển âm nhạc và hiệu ứng" className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40">
      <div className="flex items-center gap-2 p-1.5 pl-3 bg-stone-900/90 backdrop-blur-md border border-rose-500/30 rounded-full shadow-2xl">
        {/* Animated small spinning disc */}
        <div
          className={`w-6 h-6 rounded-full bg-stone-800 border border-rose-500/40 flex items-center justify-center shrink-0 ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '4s' }}
        >
          <Disc className="w-3.5 h-3.5 text-rose-400" />
        </div>

        <div className="flex flex-col text-left pr-1 min-w-0">
          <span className="text-[11px] font-semibold text-rose-200 truncate max-w-[110px] sm:max-w-[150px] leading-tight">
            Ngày Đầu Tiên
          </span>
          <span className="text-[9px] text-stone-400 truncate max-w-[110px] sm:max-w-[150px] leading-tight">
            Đức Phúc
          </span>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`p-2 rounded-full text-white transition-transform active:scale-90 ${
            isPlaying ? 'bg-rose-600 hover:bg-rose-500' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
          }`}
          title={isPlaying ? 'Tạm dừng bài hát' : 'Phát Ngày Đầu Tiên'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        {/* Mute/Unmute */}
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-full text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700 transition-colors"
          title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-500" /> : <Volume2 className="w-3.5 h-3.5 text-rose-300" />}
        </button>

        {/* Petals & Hearts toggle button */}
        <button
          onClick={onTogglePetals}
          className={`p-2 rounded-full transition-colors ${
            petalsEnabled ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-stone-800 text-stone-500'
          }`}
          title={petalsEnabled ? 'Tắt hiệu ứng trái tim & cánh hoa bay' : 'Bật hiệu ứng trái tim & cánh hoa bay'}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        {/* Reopen Envelope Button */}
        {onReopenEnvelope && (
          <button
            onClick={onReopenEnvelope}
            className="p-2 rounded-full text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 transition-colors"
            title="Gấp lại phong thư kỷ niệm 25/09"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
};
