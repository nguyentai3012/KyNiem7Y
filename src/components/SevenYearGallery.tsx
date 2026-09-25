import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronLeft, ChevronRight, Camera, Maximize2, X, Sparkles, UploadCloud, Grid, Layers, RotateCcw } from 'lucide-react';
import { getPhoto, savePhoto, getAllPhotos } from '../utils/photoStorage.ts';
import { audioService } from '../utils/audio.ts';
import confetti from 'canvas-confetti';

export interface GalleryPhotoItem {
  id: string;
  year: string;
  dateStr: string;
  title: string;
  defaultCaption: string;
  matchedFilename: string;
  fallbackUrl: string;
  rotation: number;
}

export const INITIAL_7_PHOTOS: GalleryPhotoItem[] = [
  {
    id: 'photo_1',
    year: '2019',
    dateStr: '25.09.2019',
    title: 'Khởi Đầu Ngọt Ngào',
    defaultCaption: 'Thuở mới quen ngây ngô cùng nụ cười bẽn lẽn khi em gật đầu đồng ý ❤️',
    matchedFilename: 'FB_IMG_1556690572974.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    rotation: -2,
  },
  {
    id: 'photo_2',
    year: '2021',
    dateStr: '13.04.2021',
    title: 'Nụ Cười Rạng Rỡ',
    defaultCaption: 'Chỉ cần kề bên em, nụ cười của anh luôn là nụ cười hạnh phúc nhất.',
    matchedFilename: 'beauty_20210413190847.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    rotation: 2.5,
  },
  {
    id: 'photo_3',
    year: '2021',
    dateStr: '18.04.2021',
    title: 'Giữa Đồi Xanh Ngát',
    defaultCaption: 'Chuyến đi đón gió sớm cùng nhau, ngắm mây trời và chia nhau từng giọt nước ấm.',
    matchedFilename: 'IMG_20210418_175705.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    rotation: -1.5,
  },
  {
    id: 'photo_4',
    year: '2022',
    dateStr: '10.11.2022',
    title: 'Ấm Áp Bình Yên',
    defaultCaption: 'Những ngày mỏi mệt với thế giới, chỉ cần tựa vào vai nhau là mọi bão giông tan biến.',
    matchedFilename: 'FB_IMG_1668072563655.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
    rotation: 1.8,
  },
  {
    id: 'photo_5',
    year: '2025',
    dateStr: '02.08.2025',
    title: 'Dạo Phố Chiều Tà',
    defaultCaption: 'Cùng em dạo bước dưới ánh hoàng hôn mùa hạ, bình dị mà sâu lắng.',
    matchedFilename: 'IMG_20250802_190615.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    rotation: -2.2,
  },
  {
    id: 'photo_6',
    year: '2025',
    dateStr: '02.08.2025',
    title: 'Hẹn Hò Quán Quen',
    defaultCaption: 'Cốc trà sữa ngọt ngào và những mẩu chuyện không bao giờ cạn giữa hai đứa.',
    matchedFilename: 'IMG_20250802_201700.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    rotation: 2,
  },
  {
    id: 'photo_7',
    year: '2025',
    dateStr: '19.10.2025',
    title: 'Phố Đêm Lung Linh',
    defaultCaption: 'Giữa phố đông ngập tràn ánh đèn hoa lệ, em luôn là ánh sáng duy nhất trong mắt anh.',
    matchedFilename: 'IMG_20251019_185949.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    rotation: -1,
  },
];

export const SevenYearGallery: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, string>>({});
  const [captions, setCaptions] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('anniv_gallery_captions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhotoItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const activeSingleTargetRef = useRef<string | null>(null);

  // Load photos from IndexedDB on mount
  useEffect(() => {
    let mounted = true;
    getAllPhotos().then((photos) => {
      if (mounted && photos) {
        setPhotoData(photos);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % INITIAL_7_PHOTOS.length);
    audioService.playChime();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + INITIAL_7_PHOTOS.length) % INITIAL_7_PHOTOS.length);
    audioService.playChime();
  };

  // Helper to compress an image file to a reasonable size
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Multiple files upload (batch upload all 7 photos)
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadNotice('Đang xử lý ảnh chất lượng cao...');

    try {
      const fileArray = Array.from(files);
      const updatedData: Record<string, string> = { ...photoData };

      for (let i = 0; i < fileArray.length && i < INITIAL_7_PHOTOS.length; i++) {
        const file = fileArray[i];
        const compressed = await compressImage(file);
        
        // Check if filename matches any specific photo
        let targetId = INITIAL_7_PHOTOS[i].id;
        const matched = INITIAL_7_PHOTOS.find((p) =>
          file.name.toLowerCase().includes(p.matchedFilename.toLowerCase().replace('.jpg', ''))
        );
        if (matched) {
          targetId = matched.id;
        }

        updatedData[targetId] = compressed;
        await savePhoto(targetId, compressed);
      }

      setPhotoData(updatedData);
      setUploadNotice(`Đã lưu thành công ${fileArray.length} bức ảnh kỷ niệm!`);
      audioService.playChime();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#ffd700', '#ffffff'],
      });

      setTimeout(() => setUploadNotice(null), 3500);
    } catch (err) {
      console.error(err);
      setUploadNotice('Có lỗi khi tải ảnh, bạn vui lòng thử lại nhé!');
    } finally {
      setIsUploading(false);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  // Single file upload for a specific slot
  const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = activeSingleTargetRef.current;
    if (!file || !targetId) return;

    setIsUploading(true);
    try {
      const compressed = await compressImage(file);
      await savePhoto(targetId, compressed);
      setPhotoData((prev) => ({ ...prev, [targetId]: compressed }));
      audioService.playChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      if (singleFileInputRef.current) singleFileInputRef.current.value = '';
    }
  };

  const triggerSingleUpload = (id: string) => {
    activeSingleTargetRef.current = id;
    singleFileInputRef.current?.click();
  };

  const currentItem = INITIAL_7_PHOTOS[currentIndex];
  const currentImgSrc = photoData[currentItem.id] || currentItem.fallbackUrl;
  const currentCaption = captions[currentItem.id] || currentItem.defaultCaption;

  return (
    <section aria-label="Bộ sưu tập 7 năm kỷ niệm" className="space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={multiFileInputRef}
        multiple
        accept="image/*"
        onChange={handleMultiFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={singleFileInputRef}
        accept="image/*"
        onChange={handleSingleFileUpload}
        className="hidden"
      />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 uppercase tracking-widest font-semibold font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Album 7 Năm Kỷ Niệm (2019 — 2026)</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            7 Khoảnh Khắc Khắc Ghi Tình Yêu
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('stack')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                viewMode === 'stack'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Chế độ xem Polaroid"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trình chiếu</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Chế độ xem lưới ảnh"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tất cả ảnh</span>
            </button>
          </div>

          {/* Quick upload 7 photos button */}
          <button
            onClick={() => multiFileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="Chọn đồng thời các ảnh từ máy của bạn"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Đang lưu...' : 'Thêm ảnh của bạn'}</span>
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs text-center font-sans animate-in fade-in">
          {uploadNotice}
        </div>
      )}

      {/* VIEW MODE 1: POLAROID SLIDESHOW / STACK VIEW */}
      {viewMode === 'stack' && (
        <div className="flex flex-col items-center space-y-4 pt-2">
          {/* Main Polaroid Frame */}
          <div className="relative group">
            <div
              style={{ transform: `rotate(${currentItem.rotation}deg)` }}
              className="w-[310px] sm:w-[380px] bg-[#fbfaf6] p-4 sm:p-5 pb-6 rounded-md shadow-2xl shadow-rose-950/50 border border-[#e3dcd1] transition-transform duration-300 hover:rotate-0"
            >
              {/* Vintage Washi Tape Decor */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-rose-200/80 border border-rose-300/50 rotate-1 shadow-sm pointer-events-none" />

              {/* Photo Year Badge */}
              <div className="absolute top-6 right-6 z-10 px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[11px] font-mono border border-stone-700/60 shadow">
                {currentItem.year}
              </div>

              {/* Photo Area */}
              <div
                onClick={() => setLightboxPhoto(currentItem)}
                className="w-full aspect-[4/3] bg-stone-200 rounded-xs overflow-hidden relative cursor-pointer group/img shadow-inner border border-stone-200/80"
              >
                <img
                  src={currentImgSrc}
                  alt={currentItem.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                />
                
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-stone-900/80 text-white text-xs backdrop-blur-sm flex items-center gap-1 font-sans">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Xem lớn
                  </span>
                </div>
              </div>

              {/* Polaroid Caption & Details */}
              <div className="mt-4 text-center font-serif text-[#31251e] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-500 font-sans border-b border-stone-200/70 pb-1.5 px-1">
                  <span className="font-semibold text-rose-800">{currentItem.title}</span>
                  <span className="font-mono text-[11px]">{currentItem.dateStr}</span>
                </div>

                <p className="text-sm sm:text-base font-serif italic text-stone-800 px-1 pt-0.5 leading-snug">
                  "{currentCaption}"
                </p>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => triggerSingleUpload(currentItem.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-rose-700 font-sans transition-colors"
                  >
                    <Camera className="w-3 h-3 text-rose-500" />
                    <span>Đổi riêng ảnh này</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls & Thumbnails */}
          <div className="w-full max-w-md mx-auto space-y-3 pt-2">
            <div className="flex items-center justify-between px-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors shadow"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs text-stone-400 font-mono tracking-wider">
                Khoảnh khắc {currentIndex + 1} / {INITIAL_7_PHOTOS.length}
              </span>

              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors shadow"
                aria-label="Ảnh sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail dots / bar */}
            <div className="flex items-center justify-center gap-1.5">
              {INITIAL_7_PHOTOS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    audioService.playChime();
                  }}
                  className={`h-1.5 transition-all rounded-full ${
                    idx === currentIndex
                      ? 'w-7 bg-rose-500'
                      : 'w-2 bg-stone-700 hover:bg-stone-500'
                  }`}
                  aria-label={`Chuyển đến ảnh ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FULL GRID OF ALL 7 MEMORIES */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
          {INITIAL_7_PHOTOS.map((item, idx) => {
            const imgSrc = photoData[item.id] || item.fallbackUrl;
            const itemCaption = captions[item.id] || item.defaultCaption;

            return (
              <div
                key={item.id}
                className="bg-[#fbfaf6] p-3.5 pb-4 rounded-md shadow-lg border border-[#e3dcd1] text-[#31251e] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative"
              >
                {/* Badge year */}
                <div className="absolute top-5 right-5 z-10 px-2 py-0.5 rounded-full bg-stone-900/80 text-amber-300 text-[10px] font-mono border border-stone-700/60 shadow">
                  {item.year}
                </div>

                <div>
                  <div
                    onClick={() => setLightboxPhoto(item)}
                    className="w-full aspect-[4/3] bg-stone-200 rounded-xs overflow-hidden relative cursor-pointer border border-stone-200"
                  >
                    <img
                      src={imgSrc}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-1.5 rounded-full bg-stone-900/80 text-white backdrop-blur-xs">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-sans">
                      <span className="font-semibold text-rose-800">{item.title}</span>
                      <span className="font-mono">{item.dateStr}</span>
                    </div>
                    <p className="text-xs font-serif italic text-stone-800 leading-snug line-clamp-2">
                      "{itemCaption}"
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500">
                  <span>Ảnh #{idx + 1}</span>
                  <button
                    onClick={() => triggerSingleUpload(item.id)}
                    className="text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Đổi ảnh</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-mono text-xs">
                  {lightboxPhoto.year}
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  {lightboxPhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-stone-950 rounded-lg overflow-hidden border border-stone-800 flex items-center justify-center">
              <img
                src={photoData[lightboxPhoto.id] || lightboxPhoto.fallbackUrl}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-2 pt-1">
              <p className="font-serif text-stone-200 text-sm sm:text-base italic">
                "{captions[lightboxPhoto.id] || lightboxPhoto.defaultCaption}"
              </p>
              <div className="text-xs text-rose-400 font-mono">
                {lightboxPhoto.dateStr} · 7 Năm Yêu Nhau
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
              <button
                onClick={() => {
                  triggerSingleUpload(lightboxPhoto.id);
                  setLightboxPhoto(null);
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-rose-400" />
                <span>Thay ảnh này</span>
              </button>

              <button
                onClick={() => setLightboxPhoto(null)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium"
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
