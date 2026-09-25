import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Maximize2,
  X,
  Sparkles,
  Grid,
  Layers,
  Heart,
  Plus,
  Play,
  Pause,
  Sun,
  Flame,
} from 'lucide-react';
import { getPhoto, savePhoto, getAllPhotos, saveGalleryMeta, getGalleryMeta } from '../utils/photoStorage.ts';
import { audioService } from '../utils/audio.ts';
import { extractDateFromFilename } from '../utils/dateExtractor.ts';
import { subscribeCloudPhotos } from '../services/cloudSyncService.ts';

export interface GalleryPhotoItem {
  id: string;
  year: string;
  dateStr: string;
  title: string;
  defaultCaption: string;
  matchedFilename?: string;
  fallbackUrl: string;
  rotation?: number;
  quote?: string;
}

export const GalleryImage: React.FC<{
  photoId: string;
  fallbackUrl?: string;
  photoData: Record<string, string>;
  alt: string;
  className?: string;
  onLoaded?: (id: string, dataUrl: string) => void;
}> = ({ photoId, fallbackUrl, photoData, alt, className, onLoaded }) => {
  const [src, setSrc] = useState<string>(() => photoData[photoId] || fallbackUrl || '');
  const [loading, setLoading] = useState<boolean>(!src);

  useEffect(() => {
    let active = true;

    // 1. If already in photoData
    if (photoData[photoId]) {
      setSrc(photoData[photoId]);
      setLoading(false);
      return;
    }

    // 2. Fallback url
    if (fallbackUrl && fallbackUrl.startsWith('http')) {
      setSrc(fallbackUrl);
      setLoading(false);
    }

    // 3. Query storage
    getPhoto(photoId).then((dataUrl) => {
      if (!active) return;
      if (dataUrl) {
        setSrc(dataUrl);
        setLoading(false);
        if (onLoaded) onLoaded(photoId, dataUrl);
      } else if (fallbackUrl) {
        setSrc(fallbackUrl);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [photoId, photoData[photoId], fallbackUrl]);

  if (loading || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100/90 text-stone-400 p-2">
        <Sparkles className="w-5 h-5 text-rose-300 animate-spin" style={{ animationDuration: '4s' }} />
        <span className="text-[10px] font-serif italic text-stone-500 mt-1">Đang tải ảnh...</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

export const INITIAL_7_PHOTOS: GalleryPhotoItem[] = [
  {
    id: 'photo_1',
    year: '2019',
    dateStr: '25.09.2019',
    title: 'Khởi Đầu Ngọt Ngào',
    defaultCaption: 'Thuở mới quen ngây ngô cùng nụ cười bẽn lẽn khi em gật đầu đồng ý ❤️',
    matchedFilename: 'FB_IMG_1556690572974.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    rotation: -2.5,
  },
  {
    id: 'photo_2',
    year: '2021',
    dateStr: '13.04.2021',
    title: 'Nụ Cười Rạng Rỡ',
    defaultCaption: 'Chỉ cần kề bên em, nụ cười của anh luôn là nụ cười hạnh phúc nhất.',
    matchedFilename: 'beauty_20210413190847.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    rotation: 2.2,
  },
  {
    id: 'photo_3',
    year: '2021',
    dateStr: '18.04.2021',
    title: 'Giữa Đồi Xanh Ngát',
    defaultCaption: 'Chuyến đi đón gió sớm cùng nhau, ngắm mây trời và chia nhau từng giọt nước ấm.',
    matchedFilename: 'IMG_20210418_175705.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    rotation: -1.8,
  },
  {
    id: 'photo_4',
    year: '2022',
    dateStr: '10.11.2022',
    title: 'Ấm Áp Bình Yên',
    defaultCaption: 'Những ngày mỏi mệt với thế giới, chỉ cần tựa vào vai nhau là mọi bão giông tan biến.',
    matchedFilename: 'FB_IMG_1668072563655.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
    rotation: 2.4,
  },
  {
    id: 'photo_5',
    year: '2025',
    dateStr: '02.08.2025',
    title: 'Dạo Phố Chiều Tà',
    defaultCaption: 'Cùng em dạo bước dưới ánh hoàng hôn mùa hạ, bình dị mà sâu lắng.',
    matchedFilename: 'IMG_20250802_190615.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    rotation: -2.0,
  },
  {
    id: 'photo_6',
    year: '2025',
    dateStr: '02.08.2025',
    title: 'Hẹn Hò Quán Quen',
    defaultCaption: 'Cốc trà sữa ngọt ngào và những mẩu chuyện không bao giờ cạn giữa hai đứa.',
    matchedFilename: 'IMG_20250802_201700.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    rotation: 1.6,
  },
  {
    id: 'photo_7',
    year: '2025',
    dateStr: '19.10.2025',
    title: 'Phố Đêm Lung Linh',
    defaultCaption: 'Giữa phố đông ngập tràn ánh đèn hoa lệ, em luôn là ánh sáng duy nhất trong mắt anh.',
    matchedFilename: 'IMG_20251019_185949.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    rotation: -1.2,
  },
];

export const getStoredGalleryItems = (): GalleryPhotoItem[] => {
  try {
    const saved = localStorage.getItem('anniv_gallery_items');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_7_PHOTOS;
};

export const saveStoredGalleryItems = (items: GalleryPhotoItem[]) => {
  // Strip any heavy base64 data URLs before saving to localStorage to prevent QuotaExceededError
  const cleanItems = items.map((item) => ({
    ...item,
    fallbackUrl: item.fallbackUrl?.startsWith('data:') ? '' : item.fallbackUrl,
  }));
  try {
    localStorage.setItem('anniv_gallery_items', JSON.stringify(cleanItems));
  } catch (e) {
    console.warn('LocalStorage quota warning (handled via IndexedDB)', e);
  }
  // Always persist complete metadata list to IndexedDB
  saveGalleryMeta(cleanItems);
  window.dispatchEvent(new Event('anniv_photos_changed'));
};

export interface SevenYearGalleryProps {
  allowEdit?: boolean;
}

export const SevenYearGallery: React.FC<SevenYearGalleryProps> = ({ allowEdit = false }) => {
  const [photosList, setPhotosList] = useState<GalleryPhotoItem[]>(getStoredGalleryItems);
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
  const [direction, setDirection] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhotoItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Auto-play slideshow states & romantic timer
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, number>>({});

  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const activeSingleTargetRef = useRef<string | null>(null);

  const SLIDE_DURATION = 4800; // 4.8 seconds: optimal romantic pacing to gaze & read

  // Sync photosList when updated elsewhere
  useEffect(() => {
    const handleUpdate = async () => {
      const idbItems = await getGalleryMeta();
      if (idbItems && Array.isArray(idbItems) && idbItems.length > 0) {
        setPhotosList(idbItems);
      } else {
        setPhotosList(getStoredGalleryItems());
      }
      try {
        const savedCaps = localStorage.getItem('anniv_gallery_captions');
        if (savedCaps) setCaptions(JSON.parse(savedCaps));
      } catch {}
      const photos = await getAllPhotos();
      if (photos) setPhotoData(photos);
    };

    window.addEventListener('anniv_photos_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('anniv_photos_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Load photos from IndexedDB on mount
  useEffect(() => {
    let mounted = true;

    const loadAllPhotos = async () => {
      // 1. Load photo metadata from IndexedDB or localStorage
      const idbItems = await getGalleryMeta();
      if (mounted && idbItems && Array.isArray(idbItems) && idbItems.length > 0) {
        setPhotosList(idbItems);
      } else {
        const localItems = getStoredGalleryItems();
        if (mounted) setPhotosList(localItems);
      }

      // 2. Load binary photo data from IndexedDB
      const photos = await getAllPhotos();
      if (mounted && photos) {
        setPhotoData(photos);
      }
    };

    loadAllPhotos();

    // 3. Real-time Cloud Photos Listener from Firestore
    const unsubCloud = subscribeCloudPhotos((cloudItems, cloudPhotoMap) => {
      if (!mounted) return;
      if (cloudItems && cloudItems.length > 0) {
        setPhotosList(cloudItems);
        setPhotoData((prev) => ({ ...prev, ...cloudPhotoMap }));
        saveStoredGalleryItems(cloudItems);
      }
    });

    return () => {
      mounted = false;
      unsubCloud();
    };
  }, []);

  // Pre-load current and upcoming photo images from IndexedDB if not cached yet
  useEffect(() => {
    const current = photosList[currentIndex];
    const next = photosList[(currentIndex + 1) % photosList.length];

    if (current && !photoData[current.id]) {
      getPhoto(current.id).then((val) => {
        if (val) {
          setPhotoData((prev) => ({ ...prev, [current.id]: val }));
        }
      });
    }
    if (next && !photoData[next.id]) {
      getPhoto(next.id).then((val) => {
        if (val) {
          setPhotoData((prev) => ({ ...prev, [next.id]: val }));
        }
      });
    }
  }, [currentIndex, photosList, photoData]);

  // Ensure currentIndex stays within bounds
  useEffect(() => {
    if (currentIndex >= photosList.length && photosList.length > 0) {
      setCurrentIndex(0);
    }
  }, [photosList.length, currentIndex]);

  // AUTOMATIC ROMANTIC SLIDESHOW TIMER
  useEffect(() => {
    if (!isAutoPlaying || isHovered || viewMode !== 'stack' || photosList.length <= 1) {
      return;
    }

    const intervalTime = 60; // 60ms tick for fluid progress
    const increment = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDirection(1);
          setCurrentIndex((curr) => (curr + 1) % photosList.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, viewMode, photosList.length]);

  const handleNext = () => {
    if (photosList.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % photosList.length);
    setProgress(0);
    audioService.playChime();
  };

  const handlePrev = () => {
    if (photosList.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + photosList.length) % photosList.length);
    setProgress(0);
    audioService.playChime();
  };

  const handleSelectIndex = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setProgress(0);
    audioService.playChime();
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
    if (!isAutoPlaying) {
      setProgress(0);
    }
  };

  // Tender reaction: drop floating heart sparkles onto the current photo
  const handleLikeCurrentPhoto = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [photoId]: (prev[photoId] || 0) + 1 }));
    audioService.playChime();

    // Trigger sweet mini hearts flurry
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 18,
      spread: 60,
      startVelocity: 25,
      ticks: 80,
      origin: { x, y },
      colors: ['#ff4081', '#f43f5e', '#fda4af', '#fecdd3', '#ffd700'],
      shapes: ['circle'],
      scalar: 0.9,
    });
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

  // Bulk upload: appends any number of files
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileList = Array.from(files);
      const newItems = [...photosList];
      const newPhotoData = { ...photoData };

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const dataUrl = await compressImage(file);
        const newId = `custom_photo_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`;

        await savePhoto(newId, dataUrl);
        newPhotoData[newId] = dataUrl;

        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const dateInfo = extractDateFromFilename(file.name);

        newItems.push({
          id: newId,
          year: dateInfo.year,
          dateStr: dateInfo.dateStr,
          title: cleanName.length > 25 ? cleanName.substring(0, 25) + '...' : cleanName || `Khoảnh khắc #${newItems.length + 1}`,
          defaultCaption: 'Một khoảnh khắc tuyệt đẹp và ngập tràn tình yêu giữa hai chúng mình ❤️',
          fallbackUrl: '',
          rotation: (Math.random() - 0.5) * 4,
        });
      }

      setPhotoData(newPhotoData);
      setPhotosList(newItems);
      saveStoredGalleryItems(newItems);

      setUploadNotice(`Đã thêm thành công ${fileList.length} ảnh! Tổng cộng album hiện có ${newItems.length} ảnh.`);
      setTimeout(() => setUploadNotice(null), 4000);
      audioService.playChime();
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi lưu một số ảnh.');
    } finally {
      setIsUploading(false);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  // Upload single photo replacement
  const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = activeSingleTargetRef.current;
    if (!file || !targetId) return;

    setIsUploading(true);
    try {
      const dataUrl = await compressImage(file);
      await savePhoto(targetId, dataUrl);

      setPhotoData((prev) => ({
        ...prev,
        [targetId]: dataUrl,
      }));

      setUploadNotice('Đã cập nhật ảnh thành công!');
      setTimeout(() => setUploadNotice(null), 3000);
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

  if (photosList.length === 0) return null;

  const currentItem = photosList[currentIndex] || photosList[0];
  const nextItem = photosList[(currentIndex + 1) % photosList.length];
  const nextNextItem = photosList[(currentIndex + 2) % photosList.length];

  const currentImgSrc = photoData[currentItem.id] || currentItem.fallbackUrl;
  const currentCaption = captions[currentItem.id] || currentItem.defaultCaption;
  const currentLikeCount = likedMap[currentItem.id] || 0;

  // ROMANTIC MOTION VARIANTS: Tender floating photo card with physical drift & soft memory blur
  const cardTransitionVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 110 : -110,
      y: 20,
      opacity: 0,
      scale: 0.92,
      rotate: (currentItem.rotation || 0) + (dir > 0 ? 7 : -7),
      filter: 'blur(5px)',
    }),
    center: {
      zIndex: 10,
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: currentItem.rotation || 0,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring' as const, stiffness: 220, damping: 24 },
        y: { type: 'spring' as const, stiffness: 220, damping: 24 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5, ease: 'easeOut' as const },
        rotate: { type: 'spring' as const, stiffness: 180, damping: 22 },
        filter: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 130 : -130,
      y: -25,
      opacity: 0,
      scale: 0.88,
      rotate: (currentItem.rotation || 0) + (dir < 0 ? 9 : -9),
      filter: 'blur(6px)',
      transition: {
        duration: 0.45,
        ease: [0.32, 0, 0.67, 0] as [number, number, number, number],
      },
    }),
  };

  return (
    <section aria-label="Bộ sưu tập kỷ niệm" className="space-y-6">
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
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Album Kỷ Niệm Tình Yêu</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 flex items-center gap-2">
            <span>Những Khoảnh Khắc Khắc Ghi Tình Yêu</span>
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
              title="Chế độ xem trình chiếu tự động"
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
              <span className="hidden sm:inline">Tất cả ({photosList.length})</span>
            </button>
          </div>

          {/* Quick upload photos button if allowed */}
          {allowEdit && (
            <button
              onClick={() => multiFileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
              title="Thêm ảnh vào album"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Đang lưu...' : 'Thêm ảnh'}</span>
            </button>
          )}
        </div>
      </div>

      {uploadNotice && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs text-center font-sans animate-in fade-in">
          {uploadNotice}
        </div>
      )}

      {/* VIEW MODE 1: ROMANTIC POLAROID MEMORY STACK WITH CINEMATIC DRIFT & SUNBURST */}
      {viewMode === 'stack' && (
        <div className="flex flex-col items-center space-y-6 pt-2">
          {/* Main 3D Memory Stack Container */}
          <div
            className="relative w-[320px] sm:w-[390px] min-h-[460px] sm:min-h-[500px] flex items-center justify-center select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Background Layer 2 (Deepest stacked photo card) */}
            {nextNextItem && (
              <div
                style={{
                  transform: `rotate(${((currentItem.rotation || 0) * 1.5) - 3.5}deg) scale(0.91) translateY(14px)`,
                }}
                className="absolute w-[305px] sm:w-[370px] bg-[#f2ede4] p-4 pb-6 rounded-md border border-[#dbd1c1] shadow-md opacity-35 pointer-events-none transition-transform duration-700"
              >
                <div className="w-full aspect-[4/3] bg-stone-300/40 rounded-xs" />
                <div className="h-4 mt-3 bg-stone-300/30 rounded w-1/2 mx-auto" />
              </div>
            )}

            {/* Background Layer 1 (Middle stacked photo card) */}
            {nextItem && (
              <div
                style={{
                  transform: `rotate(${((currentItem.rotation || 0) * -0.9) + 2.8}deg) scale(0.955) translateY(7px)`,
                }}
                className="absolute w-[310px] sm:w-[375px] bg-[#f7f3ea] p-4 pb-6 rounded-md border border-[#e2d8c7] shadow-xl opacity-65 pointer-events-none transition-transform duration-700"
              >
                <div className="w-full aspect-[4/3] bg-stone-300/50 rounded-xs" />
                <div className="h-4 mt-3 bg-stone-300/40 rounded w-2/3 mx-auto" />
              </div>
            )}

            {/* Active Top Card with Romantic Motion Transition */}
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentItem.id}
                custom={direction}
                variants={cardTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40 || info.velocity.x < -300) {
                    handleNext();
                  } else if (info.offset.x > 40 || info.velocity.x > 300) {
                    handlePrev();
                  }
                }}
                className="relative w-[310px] sm:w-[380px] bg-[#fbfaf6] p-4 sm:p-5 pb-5 rounded-md shadow-2xl shadow-rose-950/60 border border-[#e3dcd1] overflow-hidden cursor-grab active:cursor-grabbing group hover:shadow-rose-950/80 transition-shadow duration-500"
              >
                {/* 1. Golden Afternoon Sunlight Memory Flare (Warm nostalgic glow) */}
                <motion.div
                  initial={{ opacity: 0.85, x: -80, rotate: 15 }}
                  animate={{ opacity: 0, x: 200, rotate: 15 }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tr from-amber-400/20 via-rose-300/15 to-transparent mix-blend-screen"
                />

                {/* 2. Vintage Washi Tape Decor */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-rose-200/80 border border-rose-300/60 rotate-1 shadow-sm pointer-events-none z-20 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-rose-800/60 tracking-wider">♥ 25.09 ♥</span>
                </div>

                {/* 3. Photo Year Badge with Beating Heart */}
                {currentItem.year && currentItem.year.trim() !== '' && (
                  <div className="absolute top-5 right-5 z-20 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-300 text-[11px] font-mono border border-stone-700/60 shadow flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                    <span className="font-semibold">{currentItem.year}</span>
                  </div>
                )}

                {/* 4. Photo Image Area with Cinematic Gentle Zoom & Vignette */}
                <div
                  onClick={() => setLightboxPhoto(currentItem)}
                  className="w-full aspect-[4/3] bg-stone-200 rounded-xs overflow-hidden relative group/img shadow-inner border border-stone-200/80 flex items-center justify-center"
                >
                  <GalleryImage
                    photoId={currentItem.id}
                    fallbackUrl={currentItem.fallbackUrl}
                    photoData={photoData}
                    alt={currentItem.title}
                    onLoaded={(id, val) => setPhotoData((prev) => ({ ...prev, [id]: val }))}
                    className="w-full h-full object-cover"
                  />

                  {/* Gentle warm film vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

                  {/* Hover to view larger */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-stone-900/85 text-white text-xs backdrop-blur-sm flex items-center gap-1.5 font-sans shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-rose-300" />
                      Xem phóng to
                    </span>
                  </div>

                  {/* Hover Pause Badge */}
                  {isHovered && isAutoPlaying && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-rose-200 text-[10px] font-sans flex items-center gap-1.5 border border-rose-500/30 shadow-md"
                    >
                      <Pause className="w-3 h-3 text-rose-400" />
                      <span>Đang dừng để bạn ngắm</span>
                    </motion.div>
                  )}
                </div>

                {/* 5. Polaroid Caption, Romantic Typography & Tender Reactions */}
                <div className="mt-3.5 text-center font-serif text-[#31251e] space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-sans border-b border-stone-200/80 pb-1.5 px-1">
                    <span className="font-semibold text-rose-900 truncate flex-1 text-left">
                      {currentItem.title}
                    </span>
                    {currentItem.dateStr && currentItem.dateStr.trim() !== '' && (
                      <span className="font-mono text-[11px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded ml-2 shrink-0">
                        {currentItem.dateStr}
                      </span>
                    )}
                  </div>

                  {/* Poetic caption with glowing quotation marks */}
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-sm sm:text-base font-serif italic text-stone-800 px-1 pt-1 leading-snug line-clamp-3"
                  >
                    <span className="text-rose-600 text-lg leading-none mr-0.5">“</span>
                    {currentCaption}
                    <span className="text-rose-600 text-lg leading-none ml-0.5">”</span>
                  </motion.p>

                  {/* Interactive Heart Button on Polaroid Bottom */}
                  <div className="flex items-center justify-between pt-2 px-1">
                    <button
                      onClick={(e) => handleLikeCurrentPhoto(e, currentItem.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-full border border-rose-200/70 transition-all active:scale-90"
                      title="Gửi tim yêu cho khoảnh khắc này"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 fill-rose-500 text-rose-500 ${
                          currentLikeCount > 0 ? 'scale-110' : ''
                        }`}
                      />
                      <span className="font-sans font-medium text-[11px]">
                        {currentLikeCount > 0 ? `Yêu thích (${currentLikeCount})` : 'Thả tim'}
                      </span>
                    </button>

                    {allowEdit ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerSingleUpload(currentItem.id);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-rose-700 font-sans transition-colors"
                      >
                        <Camera className="w-3 h-3 text-rose-500" />
                        <span>Đổi ảnh này</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-sans italic">
                        Vuốt hoặc bấm phím để xem tiếp
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls, Romantic Heart Progress Bar & Thumbnails */}
          <div className="w-full max-w-md mx-auto space-y-3 pt-1">
            {/* Control Bar: Prev, Romantic Play/Pause Indicator, Next */}
            <div className="flex items-center justify-between px-2 gap-3">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-all shadow-md active:scale-90"
                aria-label="Ảnh trước"
                title="Ảnh trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Middle Play/Pause & Heart Countdown Progress Bar */}
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={toggleAutoPlay}
                    className={`px-3.5 py-1 rounded-full text-xs font-sans flex items-center gap-1.5 transition-all shadow-sm ${
                      isAutoPlaying
                        ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 ring-2 ring-rose-500/20'
                        : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800'
                    }`}
                    title={isAutoPlaying ? 'Tạm dừng tự động chuyển ảnh' : 'Bật tự động đổi ảnh (nhẹ nhàng như lật mở từng trang nhật ký)'}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-3 h-3 text-rose-400" />
                        <span className="text-[11px] font-medium">Tự động phát</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-stone-400 fill-stone-400" />
                        <span className="text-[11px]">Tạm dừng</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs text-stone-400 font-mono tracking-wider font-semibold">
                    {currentIndex + 1} / {photosList.length}
                  </span>
                </div>

                {/* Heart-Head Animated Progress Bar */}
                <div className="relative w-full max-w-[210px] h-1.5 bg-stone-950 rounded-full overflow-visible border border-stone-800/80">
                  <div
                    className={`h-full transition-all duration-75 rounded-full relative ${
                      isAutoPlaying && !isHovered
                        ? 'bg-gradient-to-r from-rose-600 via-pink-400 to-amber-300 shadow-sm shadow-rose-500/50'
                        : 'bg-stone-700'
                    }`}
                    style={{
                      width: isAutoPlaying ? `${Math.min(100, Math.max(0, progress))}%` : '0%',
                    }}
                  >
                    {/* Glowing Little Heart Icon that glides along the progress line */}
                    {isAutoPlaying && !isHovered && progress > 5 && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[10px] drop-shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse">
                        ❤️
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="p-2.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-all shadow-md active:scale-90"
                aria-label="Ảnh sau"
                title="Ảnh sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail dots / bar */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-md px-2 max-h-16 overflow-y-auto">
              {photosList.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectIndex(idx)}
                  className={`h-1.5 transition-all rounded-full ${
                    idx === currentIndex
                      ? 'w-7 bg-gradient-to-r from-rose-500 to-pink-400 shadow-md shadow-rose-500/50'
                      : 'w-2 bg-stone-700 hover:bg-stone-500'
                  }`}
                  aria-label={`Chuyển đến ảnh ${idx + 1}`}
                  title={`${idx + 1}. ${p.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FULL GRID OF ALL MEMORIES (UNLIMITED) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
          {photosList.map((item, idx) => {
            const imgSrc = photoData[item.id] || item.fallbackUrl;
            const itemCaption = captions[item.id] || item.defaultCaption;

            return (
              <div
                key={item.id}
                className="bg-[#fbfaf6] p-3.5 pb-4 rounded-md shadow-xl border border-[#e3dcd1] flex flex-col justify-between group hover:shadow-rose-950/40 transition-shadow"
              >
                <div>
                  <div
                    onClick={() => setLightboxPhoto(item)}
                    className="w-full aspect-[4/3] bg-stone-200 rounded-xs overflow-hidden relative cursor-pointer flex items-center justify-center"
                  >
                    <GalleryImage
                      photoId={item.id}
                      fallbackUrl={item.fallbackUrl}
                      photoData={photoData}
                      alt={item.title}
                      onLoaded={(id, val) => setPhotoData((prev) => ({ ...prev, [id]: val }))}
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
                      <span className="font-semibold text-rose-800 truncate flex-1 text-left">{item.title}</span>
                      {item.dateStr && item.dateStr.trim() !== '' && (
                        <span className="font-mono shrink-0 ml-1.5">{item.dateStr}</span>
                      )}
                    </div>
                    <p className="text-xs font-serif italic text-stone-800 leading-snug line-clamp-2">
                      "{itemCaption}"
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500">
                  <span>
                    Ảnh #{idx + 1}
                    {item.year && item.year.trim() !== '' ? ` (${item.year})` : ''}
                  </span>
                  {allowEdit && (
                    <button
                      onClick={() => triggerSingleUpload(item.id)}
                      className="text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Đổi ảnh</span>
                    </button>
                  )}
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                {lightboxPhoto.year && lightboxPhoto.year.trim() !== '' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-mono text-xs">
                    {lightboxPhoto.year}
                  </span>
                )}
                <h3 className="font-serif text-lg font-bold text-stone-100 truncate max-w-[280px] sm:max-w-md">
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
              <GalleryImage
                photoId={lightboxPhoto.id}
                fallbackUrl={lightboxPhoto.fallbackUrl}
                photoData={photoData}
                alt={lightboxPhoto.title}
                onLoaded={(id, val) => setPhotoData((prev) => ({ ...prev, [id]: val }))}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-2 pt-1">
              <p className="font-serif text-stone-200 text-sm sm:text-base italic">
                "{captions[lightboxPhoto.id] || lightboxPhoto.defaultCaption}"
              </p>
              <div className="text-xs text-rose-400 font-mono">
                {lightboxPhoto.dateStr && lightboxPhoto.dateStr.trim() !== ''
                  ? `${lightboxPhoto.dateStr} · Kỷ Niệm Tình Yêu`
                  : 'Kỷ Niệm Tình Yêu'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
              {allowEdit ? (
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
              ) : <div />}

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
