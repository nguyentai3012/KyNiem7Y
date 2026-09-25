import React from 'react';
import { Mail, Settings } from 'lucide-react';

interface TopNavProps {
  onOpenLetter: () => void;
  onOpenSettings: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenLetter,
  onOpenSettings,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#0f0e13]/90 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-100 hover:text-rose-300 transition-colors whitespace-nowrap"
        >
          Kỷ Niệm 25.09
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300 font-sans">
          <button
            onClick={() => onScrollToSection('milestones')}
            className="hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            Hành Trình
          </button>
          <button
            onClick={onOpenLetter}
            className="hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            Bức Thư
          </button>
          <button
            onClick={() => onScrollToSection('memories')}
            className="hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            Kỷ Niệm
          </button>
          <button
            onClick={() => onScrollToSection('coupons')}
            className="hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            Phiếu Quà
          </button>
          <button
            onClick={() => onScrollToSection('quiz')}
            className="hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            Trắc Nghiệm
          </button>
          <button
            onClick={() => onScrollToSection('reply')}
            className="hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            Phản Hồi
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenLetter}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-500 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Đọc Thư Tình</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
            title="Cài đặt thông tin"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
