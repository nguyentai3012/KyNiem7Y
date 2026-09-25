import React, { useState, useEffect } from 'react';
import { Send, Heart, Copy, CheckCircle2, MessageCircleHeart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio.ts';

export const SweetReply: React.FC = () => {
  const [replyText, setReplyText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🥰 Yêu anh nhiều');
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('anniversary_sweet_reply');
    if (saved) {
      setSentMessage(saved);
    }
  }, []);

  const emojis = [
    '🥰 Yêu anh nhiều',
    '🥺 Cảm động quá',
    '💖 Yêu nhất trần đời',
    '🤗 Muốn ôm anh ngay',
    '✨ Mãi mãi bên nhau',
  ];

  const handleSend = () => {
    if (!replyText.trim()) return;

    const fullMessage = `${selectedEmoji}\n\n"${replyText}"\n\n(Lời nhắn kỷ niệm 7 năm 25/09/2019 - 25/09/2026 gửi anh yêu ❤️)`;
    localStorage.setItem('anniversary_sweet_reply', fullMessage);
    setSentMessage(fullMessage);
    audioService.playChime();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fef08a'],
    });
  };

  const handleCopy = () => {
    if (sentMessage) {
      navigator.clipboard.writeText(sentMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="reply" className="py-16 md:py-24 border-b border-stone-800/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-900/90 border border-rose-500/20 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 text-xs text-rose-400 font-sans tracking-wide mb-2">
              <MessageCircleHeart className="w-4 h-4" />
              <span>Góc Nhỏ Của Em</span>
              <span aria-hidden="true">·</span>
              <span>Phản Hồi Cho Anh</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              Em Muốn Nói Điều Gì Với Anh Nhất?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 font-sans">
              Viết vài dòng gửi cho anh nhé, hoặc sao chép để gửi ngay qua Zalo/Messenger cho anh!
            </p>
          </div>

          {sentMessage ? (
            <div className="p-6 bg-stone-950/70 border border-rose-500/30 rounded-2xl text-center space-y-4 relative z-10 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 border border-rose-800/80 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              </div>
              <div className="font-serif text-xl text-stone-100 font-bold">
                Cảm ơn em vì lời nhắn ngọt ngào!
              </div>
              <p className="text-stone-300 font-serif italic text-base whitespace-pre-line bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                {sentMessage}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã Sao Chép Tin Nhắn!' : 'Sao Chép Gửi Qua Zalo/Messenger'}</span>
                </button>
                <button
                  onClick={() => setSentMessage(null)}
                  className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition-colors"
                >
                  Viết Lại Lời Nhắn
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {/* Emotion Selector */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-2">
                  Cảm xúc của em lúc này:
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors ${
                        selectedEmoji === emoji
                          ? 'bg-rose-600 text-white'
                          : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Box */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Lời nhắn em muốn gửi anh:
                </label>
                <textarea
                  rows={4}
                  placeholder="Gửi anh người yêu của em, chúc mừng 7 năm chúng mình..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl text-xs sm:text-sm text-stone-200 focus:outline-none transition-colors leading-relaxed"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!replyText.trim()}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-lg shadow-rose-950 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Lời Nhắn Này Cho Anh</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
