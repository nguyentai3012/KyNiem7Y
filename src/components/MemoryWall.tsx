import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Plus,
  X,
  Heart,
  MapPin,
  Calendar,
  ZoomIn,
  Upload,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { MemoryPhoto } from '../types.ts';
import { audioService } from '../utils/audio.ts';
import confetti from 'canvas-confetti';

// Default starter memories for 7-year anniversary
const defaultMemories: MemoryPhoto[] = [
  {
    id: 'm1',
    title: 'Buổi Hẹn Đầu Tiên',
    date: '25/09/2019',
    location: 'Quán cà phê góc phố quen',
    note: 'Ngày em khẽ gật đầu đồng ý, anh ngỡ như cả thế giới bỗng bừng sáng. Nụ cười bẽn lẽn ấy theo anh suốt 7 năm qua.',
    svgPreset: 'cafe',
    rotation: -2,
  },
  {
    id: 'm2',
    title: 'Đón Bình Minh Cùng Em',
    date: '14/02/2021',
    location: 'Đỉnh núi mây giăng lối',
    note: 'Trời sớm lạnh buốt nhưng bàn tay em ấm áp lạ kỳ. Khoảnh khắc mặt trời ló rạng cũng là lúc anh thầm hứa sẽ yêu em trọn đời.',
    svgPreset: 'mountain',
    rotation: 3,
  },
  {
    id: 'm3',
    title: 'Cơn Mưa Mùa Thu Kỷ Niệm',
    date: '20/10/2022',
    location: 'Dưới mái hiên trú mưa',
    note: 'Hai đứa ướt mưa nhưng cười tít mắt. Em nép vào ngực anh, cảm giác như không có giông bão nào chia cắt được chúng mình.',
    svgPreset: 'rain',
    rotation: -1,
  },
  {
    id: 'm4',
    title: 'Chuyến Đi Xa Đáng Nhớ',
    date: '30/04/2023',
    location: 'Bờ biển sóng vỗ rì rào',
    note: 'Cùng em ngắm hoàng hôn đỏ rực buông xuống mặt biển, ước chi kim đồng hồ ngừng quay để khoảnh khắc ấy thành vĩnh hằng.',
    svgPreset: 'sunset',
    rotation: 2,
  },
  {
    id: 'm5',
    title: 'Căn Bếp Nhỏ Bình Yên',
    date: '24/12/2024',
    location: 'Tổ ấm ấm cúng của hai đứa',
    note: 'Em nấu ăn còn anh đứng bên lăng xăng phụ giúp. Hạnh phúc lớn lao hóa ra chỉ giản đơn là được cùng em ăn những bữa cơm nhà.',
    svgPreset: 'kitchen',
    rotation: -3,
  },
  {
    id: 'm6',
    title: 'Tròn 7 Năm Ngọt Ngào',
    date: '25/09/2026',
    location: 'Vòng tay của anh',
    note: '2,557 ngày yêu thương và sẻ chia. Cảm ơn em vì đã đến, ở lại và trở thành một phần linh hồn không thể thiếu của anh.',
    svgPreset: 'stars',
    rotation: 1,
  },
];

// Helper to compress images client-side to ensure fast loading and save localStorage space
async function compressImage(fileOrDataUrl: File | string, maxWidth = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(img.src);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      // If external image fails crossOrigin or load, fallback
      if (typeof fileOrDataUrl === 'string') {
        resolve(fileOrDataUrl);
      } else {
        reject(new Error('Không thể tải ảnh'));
      }
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

export const MemoryWall: React.FC = () => {
  const [photos, setPhotos] = useState<MemoryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('anniv_memory_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return defaultMemories;
  });

  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showGooglePhotosHelp, setShowGooglePhotosHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('25/09/2026');
  const [newLocation, setNewLocation] = useState('Nơi bình yên của hai đứa');
  const [newNote, setNewNote] = useState('');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('anniv_memory_photos', JSON.stringify(photos));
    } catch (e) {
      console.warn('LocalStorage quota reached', e);
    }
  }, [photos]);

  // Support Ctrl + V paste image from clipboard anywhere on the page
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setIsCompressing(true);
            try {
              const compressed = await compressImage(file);
              setUploadedBase64(compressed);
              if (!newTitle) setNewTitle('Khoảnh khắc ngọt ngào');
              setIsAdding(true);
              audioService.playChime();
            } catch (err) {
              console.error(err);
            } finally {
              setIsCompressing(false);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [newTitle]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setUploadedBase64(compressed);
        if (!newTitle) {
          setNewTitle('Khoảnh khắc chúng mình');
        }
        audioService.playChime();
      } catch (err) {
        console.error('Lỗi đọc ảnh', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setUploadedBase64(compressed);
        if (!newTitle) setNewTitle('Kỷ niệm tuyệt đẹp');
        setIsAdding(true);
        audioService.playChime();
      } catch (err) {
        console.error(err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleAddFromUrl = async () => {
    if (!urlInput.trim()) return;
    setIsCompressing(true);
    try {
      // try to compress/validate
      const compressed = await compressImage(urlInput.trim());
      setUploadedBase64(compressed);
      setUrlInput('');
    } catch {
      setUploadedBase64(urlInput.trim());
      setUrlInput('');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSavePhoto = () => {
    if (!newTitle.trim()) return;
    const newP: MemoryPhoto = {
      id: `p_${Date.now()}`,
      title: newTitle,
      date: newDate,
      location: newLocation,
      note: newNote || 'Một khoảnh khắc tuyệt đẹp trong 7 năm yêu nhau của hai đứa mình.',
      imageUrl: uploadedBase64 || undefined,
      svgPreset: uploadedBase64 ? undefined : 'cafe',
      rotation: Math.floor(Math.random() * 6) - 3,
    };

    setPhotos((prev) => [newP, ...prev]);
    setIsAdding(false);
    setNewTitle('');
    setNewNote('');
    setUploadedBase64(null);
    audioService.playChime();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff4081', '#fb7185', '#ffd700'],
    });
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null);
    }
  };

  const renderSvgPreset = (preset?: string) => {
    switch (preset) {
      case 'sunset':
        return (
          <div className="w-full h-full bg-gradient-to-b from-amber-700 via-rose-800 to-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-amber-300 shadow-xl blur-xs mb-2" />
            <div className="absolute bottom-0 w-full h-10 bg-indigo-950/80 backdrop-blur-xs flex items-center justify-center">
              <span className="text-[10px] text-amber-200/90 font-serif tracking-widest uppercase">
                Bờ Biển Hoàng Hôn
              </span>
            </div>
          </div>
        );
      case 'rain':
        return (
          <div className="w-full h-full bg-gradient-to-b from-slate-800 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-3xl mb-1">☔</div>
            <div className="text-xs text-blue-200 font-serif">Mưa Rào Mùa Thu</div>
          </div>
        );
      case 'kitchen':
        return (
          <div className="w-full h-full bg-gradient-to-b from-amber-900/80 via-orange-950 to-stone-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-3xl mb-1">🍳</div>
            <div className="text-xs text-amber-200 font-serif">Căn Bếp Nhỏ Ấm Cúng</div>
          </div>
        );
      case 'mountain':
        return (
          <div className="w-full h-full bg-gradient-to-b from-teal-900 via-emerald-950 to-stone-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-3xl mb-1">🏔️</div>
            <div className="text-xs text-emerald-200 font-serif">Đón Bình Minh Trên Núi</div>
          </div>
        );
      case 'stars':
        return (
          <div className="w-full h-full bg-gradient-to-b from-indigo-950 via-purple-950 to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-3xl mb-1">✨</div>
            <div className="text-xs text-purple-200 font-serif">Dưới Bầu Trời Đầy Sao</div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gradient-to-b from-rose-950 via-[#261821] to-stone-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-3xl mb-1">☕</div>
            <div className="text-xs text-rose-200 font-serif">Góc Quán Quen Ngày Đầu</div>
          </div>
        );
    }
  };

  return (
    <section id="memories" className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-sans tracking-wide mb-1 font-semibold uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Album Ảnh Kỷ Niệm Polaroid</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 font-bold tracking-tight">
            Kho Báu Hình Ảnh Của Hai Đứa
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl font-sans">
            Lưu giữ những tấm hình thật của 7 năm bên nhau. Bạn có thể chọn ảnh trực tiếp từ Google Photos, máy tính hoặc điện thoại bất cứ lúc nào.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowGooglePhotosHelp(true)}
            className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Xem cách lấy ảnh từ Google Photos cực dễ"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Cách Lấy Ảnh Từ Google Photos</span>
          </button>

          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-md shadow-rose-950/50 active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Thêm Ảnh Kỷ Niệm</span>
          </button>
        </div>
      </div>

      {/* Guide Banner for Google Photos */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-rose-950/40 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="text-stone-300">
            <span className="font-semibold text-amber-300 mr-1.5">Mẹo nhanh từ Google Photos:</span>
            <span>
              Mở <a href="https://photos.google.com" target="_blank" rel="noreferrer" className="underline text-amber-200 hover:text-white inline-flex items-center gap-0.5">photos.google.com <ExternalLink className="w-2.5 h-2.5" /></a>, chuột phải chọn <b>Sao chép hình ảnh</b> rồi bấm <b>Ctrl + V</b> ngay tại trang này để thêm ảnh!
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowGooglePhotosHelp(true)}
          className="text-amber-300 hover:underline text-[11px] whitespace-nowrap self-end sm:self-auto"
        >
          Xem chi tiết 3 cách →
        </button>
      </div>

      {/* Modal: Google Photos Instructions */}
      {showGooglePhotosHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-stone-200 relative">
            <button
              onClick={() => setShowGooglePhotosHelp(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-800">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-200">
                  Cách Lấy Ảnh Từ Google Photos Vào Web
                </h3>
                <p className="text-[11px] text-stone-400">
                  3 cách siêu đơn giản để tải ảnh kỷ niệm của hai bạn
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              {/* Method 1: On phone */}
              <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1.5">
                <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600/30 text-rose-300 flex items-center justify-center text-[10px]">1</span>
                  <span>Nếu Bạn Đang Dùng Điện Thoại (Tiện nhất):</span>
                </div>
                <p className="text-stone-300 pl-6.5">
                  Bấm nút <b>"Thêm Ảnh Kỷ Niệm"</b> → Chạm vào khung tải ảnh. Điện thoại sẽ tự động mở tùy chọn <b>Google Photos</b> hoặc <b>Thư viện ảnh</b> để bạn chọn ảnh ngay trong 1 nốt nhạc!
                </p>
              </div>

              {/* Method 2: On computer Ctrl+V or Drag */}
              <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1.5">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center text-[10px]">2</span>
                  <span>Nếu Bạn Dùng Máy Tính (Copy & Paste cực nhanh):</span>
                </div>
                <ul className="text-stone-300 pl-6.5 space-y-1 list-disc list-inside">
                  <li>Mở tab <a href="https://photos.google.com" target="_blank" rel="noreferrer" className="text-amber-200 underline">Google Photos</a> của bạn.</li>
                  <li>Bấm vào ảnh ưng ý → Chuột phải chọn <b>"Sao chép hình ảnh" (Copy image)</b>.</li>
                  <li>Quay lại trang này và nhấn tổ hợp phím <b>Ctrl + V</b> (hoặc Command + V trên Mac). Ảnh sẽ tự động tải lên ngay lập tức!</li>
                  <li><i>Hoặc:</i> Bấm phím <b>Shift + D</b> trên Google Photos để tải ảnh về máy rồi kéo thả vào đây.</li>
                </ul>
              </div>

              {/* Method 3: Link */}
              <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1.5">
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                  <span>Dán Đường Link Ảnh Trực Tiếp:</span>
                </div>
                <p className="text-stone-300 pl-6.5">
                  Bạn cũng có thể copy link hình ảnh bất kỳ rồi dán vào ô <b>"Dán link ảnh"</b> trong khung thêm ảnh.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <a
                href="https://photos.google.com/?pli=1"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 underline font-medium"
              >
                <span>Mở Google Photos ngay</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => {
                  setShowGooglePhotosHelp(false);
                  setIsAdding(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow"
              >
                Bắt Đầu Thêm Ảnh Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Photo */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-rose-500/30 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span className="font-serif text-lg font-semibold text-rose-300">
                  Thêm Khoảnh Khắc Kỷ Niệm
                </span>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drop / Upload Zone */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Chọn ảnh (Google Photos, máy tính, hoặc điện thoại):
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all bg-stone-950/70 relative ${
                  isDragging
                    ? 'border-rose-400 bg-rose-950/20 scale-[1.02]'
                    : 'border-stone-700 hover:border-rose-400/70'
                }`}
              >
                {isCompressing ? (
                  <div className="py-6 flex flex-col items-center justify-center text-xs text-rose-300">
                    <Sparkles className="w-6 h-6 animate-spin mb-2" />
                    <span>Đang xử lý ảnh...</span>
                  </div>
                ) : uploadedBase64 ? (
                  <div className="flex flex-col items-center">
                    <div className="relative group/prev">
                      <img
                        src={uploadedBase64}
                        alt="Preview"
                        className="w-36 h-32 object-cover rounded-lg mb-2 shadow-lg border border-stone-700"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px]">
                        Nhấn để đổi ảnh khác
                      </div>
                    </div>
                    <span className="text-xs text-rose-400 font-medium">
                      ✓ Đã nạp ảnh thành công
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 text-stone-400 space-y-1">
                    <Upload className="w-7 h-7 text-rose-400 mb-1" />
                    <span className="text-xs font-medium text-stone-200">
                      Chạm để chọn từ Google Photos / Bộ sưu tập
                    </span>
                    <span className="text-[11px] text-stone-500">
                      hoặc kéo & thả ảnh vào đây · hoặc bấm Ctrl+V để dán
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Direct URL input alternative */}
            <div>
              <label className="block text-[11px] font-medium text-stone-400 mb-1">
                Hoặc dán link ảnh trực tiếp:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="url"
                  placeholder="https://.../hinh-anh.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleAddFromUrl}
                  disabled={!urlInput.trim() || isCompressing}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 text-xs rounded-lg flex items-center gap-1 font-medium"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Nạp</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Tên kỷ niệm:</label>
              <input
                type="text"
                placeholder="Ví dụ: Buổi chiều ngắm hoàng hôn bên em"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Thời gian:</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Địa điểm:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Lời nhắn gửi:</label>
              <textarea
                rows={2}
                placeholder="Cảm xúc của hai đứa lúc ấy..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 bg-stone-800 text-stone-300 text-xs rounded-lg hover:bg-stone-700"
              >
                Hủy
              </button>
              <button
                onClick={handleSavePhoto}
                disabled={!newTitle.trim()}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Lưu Vào Album</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Polaroid Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-6 pt-2">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            style={{
              transform: `rotate(${photo.rotation || 0}deg)`,
            }}
            className="bg-[#fcfaf7] text-stone-900 rounded-lg p-3.5 pb-5 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer border border-[#e8dfd5] relative group"
          >
            {/* Vintage scotch tape styling on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-100/60 backdrop-blur-xs border border-amber-200/50 rotate-1 shadow-xs pointer-events-none" />

            {/* Photo Frame */}
            <div className="w-full aspect-[4/3] rounded bg-stone-950 overflow-hidden relative mb-3 shadow-inner">
              {photo.imageUrl ? (
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                renderSvgPreset(photo.svgPreset)
              )}

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 text-xs">
                <ZoomIn className="w-4 h-4" />
                <span>Xem chi tiết</span>
              </div>
            </div>

            {/* Polaroid Bottom Notes */}
            <div className="px-1 text-center">
              <h4 className="font-serif font-bold text-base text-stone-900 mb-0.5 truncate">
                {photo.title}
              </h4>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-sans">
                <span>{photo.date}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[140px]">{photo.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#fcfaf7] text-stone-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#e8dfd5] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full aspect-[16/10] rounded-xl bg-stone-950 overflow-hidden mb-5 shadow-md flex items-center justify-center">
              {selectedPhoto.imageUrl ? (
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                renderSvgPreset(selectedPhoto.svgPreset)
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {selectedPhoto.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-stone-600 font-sans">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    {selectedPhoto.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {selectedPhoto.location}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-700 font-serif leading-relaxed italic border-t border-stone-200 pt-3">
                "{selectedPhoto.note}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200 text-xs text-stone-500 font-sans">
                <div className="flex items-center gap-1 text-rose-600 font-medium">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>Kỷ niệm tình yêu 7 năm (25/09/2019 - 25/09/2026)</span>
                </div>

                <button
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa ảnh này</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
