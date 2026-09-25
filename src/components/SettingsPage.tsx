import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Gift,
  Mail,
  Settings,
  ArrowLeft,
  Copy,
  Check,
  Upload,
  Camera,
  Trash2,
  Sparkles,
  Music,
  FileText,
  Image as ImageIcon,
  Save,
  RotateCcw,
  ExternalLink,
  Info,
  Plus,
  ArrowUp,
  ArrowDown,
  Cloud,
  UploadCloud,
  RefreshCw,
} from 'lucide-react';
import {
  INITIAL_7_PHOTOS,
  GalleryPhotoItem,
  getStoredGalleryItems,
  saveStoredGalleryItems,
  GalleryImage,
} from './SevenYearGallery.tsx';
import {
  getAllPhotos,
  savePhoto,
  getPhoto,
  deletePhoto,
  clearAllPhotos,
  getGalleryMeta,
  saveGalleryMeta,
} from '../utils/photoStorage.ts';
import {
  syncPhotoToCloud,
  deletePhotoFromCloud,
  syncAllPhotosToCloud,
  subscribeCloudPhotos,
} from '../services/cloudSyncService.ts';
import { NgayDauTienPlayer } from './NgayDauTienPlayer.tsx';
import { audioService } from '../utils/audio.ts';
import { extractDateFromFilename } from '../utils/dateExtractor.ts';
import {
  RomanticGiftItem,
  getStoredGiftsList,
  saveStoredGiftsList,
  DEFAULT_ROMANTIC_GIFTS,
} from './RomanticGiftPickerGame.tsx';

interface SettingsPageProps {
  onBackToShowcase: () => void;
  herName: string;
  onUpdateHerName: (name: string) => void;
  letterContent: string;
  onUpdateLetterContent: (content: string) => void;
  letterDateStr?: string;
  onUpdateLetterDateStr?: (val: string) => void;
  petalsEnabled: boolean;
  onTogglePetals: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onBackToShowcase,
  herName,
  onUpdateHerName,
  letterContent,
  onUpdateLetterContent,
  letterDateStr = 'Ngày 25 tháng 09 năm 2026',
  onUpdateLetterDateStr,
  petalsEnabled,
  onTogglePetals,
}) => {
  // Local editable states
  const [tempName, setTempName] = useState(herName);
  const [nameSavedNotice, setNameSavedNotice] = useState(false);

  const [tempLetter, setTempLetter] = useState(letterContent);
  const [tempDateStr, setTempDateStr] = useState(letterDateStr);
  const [letterSavedNotice, setLetterSavedNotice] = useState(false);

  // Dynamic Photos list (unlimited)
  const [galleryItems, setGalleryItems] = useState<GalleryPhotoItem[]>(getStoredGalleryItems);
  const [photoData, setPhotoData] = useState<Record<string, string>>({});
  const [captions, setCaptions] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('anniv_gallery_captions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [activePhotoUploadId, setActivePhotoUploadId] = useState<string | null>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [cloudSyncedTime, setCloudSyncedTime] = useState<string | null>(null);

  // Load photos from IndexedDB storage and listen to Cloud
  useEffect(() => {
    let active = true;
    getGalleryMeta().then((meta) => {
      if (active && meta && Array.isArray(meta) && meta.length > 0) {
        setGalleryItems(meta);
      }
    });
    getAllPhotos().then((photos) => {
      if (active && photos) setPhotoData(photos);
    });

    const unsubCloud = subscribeCloudPhotos((cloudItems, cloudPhotoMap) => {
      if (!active) return;
      if (cloudItems && cloudItems.length > 0) {
        setGalleryItems(cloudItems);
        setPhotoData((prev) => ({ ...prev, ...cloudPhotoMap }));
        saveStoredGalleryItems(cloudItems);
        setCloudSyncedTime(new Date().toLocaleTimeString('vi-VN'));
      }
    });

    return () => {
      active = false;
      unsubCloud();
    };
  }, []);

  // Gift picker game state
  const [giftsList, setGiftsList] = useState<RomanticGiftItem[]>(getStoredGiftsList);
  const [giftSavedNotice, setGiftSavedNotice] = useState(false);

  const handleUpdateGift = (id: string, field: keyof RomanticGiftItem, val: string) => {
    const updated = giftsList.map((g) => (g.id === id ? { ...g, [field]: val } : g));
    setGiftsList(updated);
    saveStoredGiftsList(updated);
    setGiftSavedNotice(true);
    setTimeout(() => setGiftSavedNotice(false), 2000);
  };

  const handleAddGift = () => {
    const newGift: RomanticGiftItem = {
      id: `gift_${Date.now()}`,
      title: 'Món Quà Mới Cho Em',
      description: 'Mô tả chi tiết món quà hoặc đặc quyền em muốn anh thực hiện...',
      category: 'Tự Chọn',
      icon: '🎁',
      color: 'from-pink-500 to-rose-600',
      badge: 'Mới',
      boyfriendPromise: 'Anh cam kết thực hiện 100%!',
    };
    const updated = [...giftsList, newGift];
    setGiftsList(updated);
    saveStoredGiftsList(updated);
    audioService.playChime();
  };

  const handleDeleteGift = (id: string) => {
    if (giftsList.length <= 1) {
      alert('Cần giữ lại ít nhất 1 món quà cho game.');
      return;
    }
    const updated = giftsList.filter((g) => g.id !== id);
    setGiftsList(updated);
    saveStoredGiftsList(updated);
  };

  const handleResetGifts = () => {
    if (confirm('Khôi phục lại danh sách món quà lãng mạn mặc định?')) {
      setGiftsList(DEFAULT_ROMANTIC_GIFTS);
      saveStoredGiftsList(DEFAULT_ROMANTIC_GIFTS);
      audioService.playChime();
    }
  };

  const showcaseUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : '';
  const settingsUrl = typeof window !== 'undefined' ? `${window.location.origin}/settings` : '';

  const handleCopyShowcaseUrl = async () => {
    try {
      await navigator.clipboard.writeText(showcaseUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      audioService.playChime();
    } catch {
      prompt('Sao chép link dưới đây để gửi cho người yêu:', showcaseUrl);
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const val = tempName.trim() || 'Bé iu của anh';
    onUpdateHerName(val);
    localStorage.setItem('anniv_her_name', val);
    setNameSavedNotice(true);
    setTimeout(() => setNameSavedNotice(false), 2000);
    audioService.playChime();
  };

  const handleSaveLetter = () => {
    onUpdateLetterContent(tempLetter);
    localStorage.setItem('anniv_letter_simple', tempLetter);
    const dateVal = tempDateStr.trim() || 'Ngày 25 tháng 09 năm 2026';
    if (onUpdateLetterDateStr) {
      onUpdateLetterDateStr(dateVal);
    }
    localStorage.setItem('anniv_letter_date', dateVal);
    setLetterSavedNotice(true);
    setTimeout(() => setLetterSavedNotice(false), 2000);
    audioService.playChime();
  };

  const handleResetLetter = () => {
    const defaultText = `Gửi người con gái anh yêu thương nhất,\n\nNgày mai 25/09 là tròn 7 năm kể từ ngày em gật đầu đồng ý cùng anh bước vào một câu chuyện tình yêu đẹp nhất trần đời.\n\n7 năm qua, có những ngày ngập tràn tiếng cười rực rỡ, cũng có những ngày giông bão mưa rơi. Nhưng điều kỳ diệu nhất là dù ở đâu, chỉ cần nhìn về phía em, anh luôn tìm thấy bến đỗ bình yên và động lực để vững bước mỗi ngày.\n\nCảm ơn em vì đã luôn dịu dàng, bao dung cho những vụng về của anh, và cùng anh đi qua những năm tháng thanh xuân quý giá nhất.\n\n7 năm mới chỉ là chặng đường đầu tiên. Mong rằng 10 năm, 20 năm hay cả cuộc đời sau này, người nắm tay anh đón mùa thu vẫn mãi mãi là em.\n\nYêu em nhiều hơn tất cả mọi điều trên thế gian!`;
    setTempLetter(defaultText);
    onUpdateLetterContent(defaultText);
    localStorage.setItem('anniv_letter_simple', defaultText);
    setLetterSavedNotice(true);
    setTimeout(() => setLetterSavedNotice(false), 2000);
    audioService.playChime();
  };

  // Compress image
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1400;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.86));
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

  // Upload single photo replacement
  const triggerSingleUpload = (photoId: string) => {
    setActivePhotoUploadId(photoId);
    singleFileInputRef.current?.click();
  };

  const handleSinglePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePhotoUploadId) return;

    try {
      const dataUrl = await compressImage(file);
      await savePhoto(activePhotoUploadId, dataUrl);
      setPhotoData((prev) => ({ ...prev, [activePhotoUploadId]: dataUrl }));

      const targetItem = galleryItems.find((it) => it.id === activePhotoUploadId);
      if (targetItem) {
        const orderIdx = galleryItems.findIndex((it) => it.id === activePhotoUploadId);
        syncPhotoToCloud(targetItem, dataUrl, orderIdx >= 0 ? orderIdx : 0);
      }

      setUploadStatusMsg('Đã cập nhật ảnh và tự động lưu lên Cloud! ☁️');
      setTimeout(() => setUploadStatusMsg(null), 2500);
      audioService.playChime();
    } catch (err) {
      console.error(err);
      alert('Không thể lưu ảnh, vui lòng thử lại với ảnh dung lượng nhỏ hơn.');
    } finally {
      if (singleFileInputRef.current) singleFileInputRef.current.value = '';
    }
  };

  // Add more photos (Unlimited, multiple files)
  const handleAddPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    try {
      setUploadStatusMsg(`Đang xử lý và tải ${files.length} ảnh lên Cloud...`);
      const fileList = Array.from(files);
      const newItems = [...galleryItems];
      const newPhotoData = { ...photoData };

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const dataUrl = await compressImage(file);
        const newId = `photo_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`;

        await savePhoto(newId, dataUrl);
        newPhotoData[newId] = dataUrl;

        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();

        const dateInfo = extractDateFromFilename(file.name);

        const newItem: GalleryPhotoItem = {
          id: newId,
          year: dateInfo.year,
          dateStr: dateInfo.dateStr,
          title: cleanName.length > 25 ? cleanName.substring(0, 25) + '...' : cleanName || `Khoảnh khắc #${newItems.length + 1}`,
          defaultCaption: 'Một khoảnh khắc tuyệt đẹp và ngập tràn tình yêu giữa hai chúng mình ❤️',
          fallbackUrl: '',
          rotation: (Math.random() - 0.5) * 4,
        };

        newItems.push(newItem);
        // Automatically sync to Cloud Firestore
        syncPhotoToCloud(newItem, dataUrl, newItems.length - 1);
      }

      setPhotoData(newPhotoData);
      setGalleryItems(newItems);
      saveStoredGalleryItems(newItems);

      setUploadStatusMsg(`☁️ Đã thêm và đồng bộ ${fileList.length} ảnh lên Cloud thành công! Tổng cộng ${newItems.length} ảnh.`);
      setTimeout(() => setUploadStatusMsg(null), 4000);
      audioService.playChime();
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi lưu ảnh.');
    } finally {
      setIsProcessingPhotos(false);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  // Delete a photo from album
  const handleDeletePhoto = async (photoId: string, title: string) => {
    if (galleryItems.length <= 1) {
      alert('Album cần giữ lại ít nhất 1 ảnh.');
      return;
    }

    if (confirm(`Bạn có chắc muốn xóa bức ảnh "${title}" này khỏi album không?`)) {
      try {
        await deletePhoto(photoId);
        deletePhotoFromCloud(photoId);

        const updatedItems = galleryItems.filter((item) => item.id !== photoId);
        setGalleryItems(updatedItems);
        saveStoredGalleryItems(updatedItems);

        // Clean up from state
        setPhotoData((prev) => {
          const next = { ...prev };
          delete next[photoId];
          return next;
        });

        setUploadStatusMsg(`Đã xóa ảnh. Album còn ${updatedItems.length} ảnh.`);
        setTimeout(() => setUploadStatusMsg(null), 2500);
        audioService.playChime();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Move photo up in sequence
  const handleMovePhotoUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...galleryItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setGalleryItems(newItems);
    saveStoredGalleryItems(newItems);
    syncAllPhotosToCloud(newItems, photoData);
  };

  // Move photo down in sequence
  const handleMovePhotoDown = (index: number) => {
    if (index === galleryItems.length - 1) return;
    const newItems = [...galleryItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setGalleryItems(newItems);
    saveStoredGalleryItems(newItems);
    syncAllPhotosToCloud(newItems, photoData);
  };

  // Update field of a photo item (title, year, dateStr)
  const handleUpdateItemField = (
    photoId: string,
    field: 'title' | 'year' | 'dateStr',
    value: string
  ) => {
    const updatedItems = galleryItems.map((item) => {
      if (item.id === photoId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setGalleryItems(updatedItems);
    saveStoredGalleryItems(updatedItems);

    const updatedItem = updatedItems.find((i) => i.id === photoId);
    if (updatedItem) {
      const idx = updatedItems.findIndex((i) => i.id === photoId);
      syncPhotoToCloud(updatedItem, photoData[photoId], idx >= 0 ? idx : 0);
    }
  };

  // Sync entire album manually to Cloud Firestore
  const handleSyncAllToCloud = async () => {
    setIsSyncingCloud(true);
    setUploadStatusMsg('Đang đồng bộ toàn bộ album lên Đám Mây (Cloud Firestore)...');
    try {
      const fullMap: Record<string, string> = { ...photoData };
      for (const item of galleryItems) {
        if (!fullMap[item.id]) {
          const val = await getPhoto(item.id);
          if (val) fullMap[item.id] = val;
        }
      }
      await syncAllPhotosToCloud(galleryItems, fullMap);
      setPhotoData(fullMap);
      setCloudSyncedTime(new Date().toLocaleTimeString('vi-VN'));
      setUploadStatusMsg(`☁️ Đã đồng bộ toàn bộ ${galleryItems.length} ảnh lên Cloud thành công! Bạn gái mở link ở bất cứ thiết bị nào cũng xem được ngay!`);
      setTimeout(() => setUploadStatusMsg(null), 4000);
      audioService.playChime();
    } catch (err) {
      console.error(err);
      setUploadStatusMsg('Có lỗi khi kết nối Cloud, vui lòng thử lại.');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Update caption
  const handleUpdateCaption = (photoId: string, newCaption: string) => {
    const updated = { ...captions, [photoId]: newCaption };
    setCaptions(updated);
    localStorage.setItem('anniv_gallery_captions', JSON.stringify(updated));
  };

  // Reset to original initial 7 photos
  const handleResetToInitialPhotos = async () => {
    if (
      confirm(
        'Bạn có chắc muốn đặt lại toàn bộ album về 7 bức ảnh mẫu ban đầu không? Các ảnh bạn đã tải lên sẽ được xóa.'
      )
    ) {
      await clearAllPhotos();
      setPhotoData({});
      setCaptions({});
      localStorage.removeItem('anniv_gallery_captions');
      setGalleryItems(INITIAL_7_PHOTOS);
      saveStoredGalleryItems(INITIAL_7_PHOTOS);
      setUploadStatusMsg('Đã khôi phục album về 7 bức ảnh mẫu ban đầu.');
      setTimeout(() => setUploadStatusMsg(null), 3000);
      audioService.playChime();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0b12] text-stone-100 flex flex-col font-sans pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-stone-950/90 border-b border-stone-800/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToShowcase}
            className="p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/60 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Quay lại trang kỷ niệm chính"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Xem trang kỷ niệm</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-serif text-stone-100 flex items-center gap-2">
                <span>Cài Đặt Trang Kỷ Niệm</span>
                <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60">
                  {galleryItems.length} ảnh
                </span>
              </h1>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                URL này chỉ dành cho bạn thiết lập. URL chính chỉ để hiển thị cho người ấy.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShowcaseUrl}
            className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-rose-900/40 transition-all active:scale-95"
            title="Sao chép URL sạch gửi cho bạn gái"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã sao chép link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép link gửi người ấy</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-10">
        {/* SECTION 1: URL & SHARING INSTRUCTIONS */}
        <section className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-rose-950/20 border border-rose-500/30 shadow-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h2 className="text-base font-serif font-bold text-stone-100 flex items-center gap-2">
                <span>Phân chia 2 đường link riêng biệt</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Trang hiển thị cho người yêu và trang cài đặt này được tách biệt hoàn toàn:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
            {/* Main Showcase Link */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-emerald-400" />
                  URL Chính (Gửi cho người yêu)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  Chỉ Xem
                </span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900 p-2 rounded-lg border border-stone-800">
                <input
                  type="text"
                  readOnly
                  value={showcaseUrl}
                  className="bg-transparent text-stone-200 text-xs w-full focus:outline-hidden font-mono"
                />
                <button
                  onClick={handleCopyShowcaseUrl}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-emerald-300 font-medium shrink-0 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                Đường dẫn sạch đẹp nhất. Khi người ấy mở lên sẽ thấy phong thư lãng mạn, hoàn toàn không có bất kỳ nút sửa đổi nào.
              </p>
            </div>

            {/* Settings Link */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  URL Cài Đặt (Dành riêng cho bạn)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                  Quản Trị / Tùy Chỉnh
                </span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900 p-2 rounded-lg border border-stone-800">
                <input
                  type="text"
                  readOnly
                  value={settingsUrl}
                  className="bg-transparent text-stone-200 text-xs w-full focus:outline-hidden font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(settingsUrl);
                    alert('Đã chép URL cài đặt!');
                  }}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-rose-300 font-medium shrink-0 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                Thêm <code>/settings</code> hoặc <code>?settings</code> vào cuối tên miền để quay lại màn hình này bất cứ lúc nào.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: RECIPIENT NAME & MILESTONE INFO */}
        <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h3 className="font-serif text-lg font-bold text-stone-100">
                1. Tên Bạn Gái & Thông Tin Kỷ Niệm
              </h3>
            </div>
            {nameSavedNotice && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã lưu thành công!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveName} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Tên hoặc Biệt danh bạn gái (hiển thị trên phong thư & tiêu đề):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="vd: Bé iu của anh, Lan Anh, Em..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-rose-500 text-stone-100 text-sm focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 transition-colors shadow"
                  >
                    Lưu tên
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Ngày kỷ niệm bắt đầu:
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 text-sm font-mono flex items-center justify-between">
                  <span>25/09/2019 — 25/09/2026 (7 Năm Yêu)</span>
                  <span className="text-xs text-rose-400 font-sans">Cố định</span>
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* SECTION 3: LOVE LETTER (BỨC THƯ TAY) */}
        <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-400" />
              <h3 className="font-serif text-lg font-bold text-stone-100">
                2. Bức Thư Tay Gửi Em
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {letterSavedNotice && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 mr-2">
                  <Check className="w-3.5 h-3.5" /> Đã lưu thư!
                </span>
              )}
              <button
                type="button"
                onClick={handleResetLetter}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1 transition-colors"
                title="Khôi phục lại nội dung mẫu đầy cảm xúc"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Khôi phục mẫu</span>
              </button>
              <button
                type="button"
                onClick={handleSaveLetter}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu bức thư</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Editor Area */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-stone-400">
                Soạn nội dung tâm thư của bạn (hỗ trợ xuống dòng tự nhiên):
              </label>
              <textarea
                value={tempLetter}
                onChange={(e) => setTempLetter(e.target.value)}
                rows={13}
                className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 focus:border-rose-500 text-stone-200 text-xs sm:text-sm font-sans leading-relaxed focus:outline-hidden resize-y"
                placeholder="Viết những lời chân thành từ trái tim bạn dành cho người ấy..."
              />
              <div className="text-[11px] text-stone-500 flex justify-between">
                <span>Số từ: {tempLetter.trim().split(/\s+/).filter(Boolean).length} từ</span>
                <span>Nhớ bấm "Lưu bức thư" sau khi soạn thảo xong</span>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-medium text-stone-400 mb-1">
                  Địa điểm & Ngày ký thư (ở góc cuối bức thư):
                </label>
                <input
                  type="text"
                  value={tempDateStr}
                  onChange={(e) => setTempDateStr(e.target.value)}
                  placeholder="vd: Ngày 25 tháng 09 năm 2026"
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:border-rose-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Live Paper Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-stone-400">
                Xem trước giao diện giấy cổ điển khi người ấy đọc:
              </label>
              <div className="p-5 sm:p-6 rounded-xl bg-[#faf6ed] text-[#2c221e] border border-[#e2d5c3] shadow-md max-h-[380px] overflow-y-auto space-y-3 font-serif">
                <div className="text-center font-bold text-rose-900 border-b border-rose-900/20 pb-2 text-sm tracking-wide">
                  BỨC THƯ TAY KỶ NIỆM 7 NĂM
                </div>
                <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed italic opacity-90">
                  {tempLetter}
                </div>
                <div className="pt-3 border-t border-[#e2d5c3] flex items-center justify-between text-xs text-[#735d49]">
                  <span className="font-sans text-[11px]">{tempDateStr}</span>
                  <span className="font-handwriting text-base text-rose-800 font-bold">
                    Người yêu em nhiều nhất
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: UNLIMITED PHOTO ALBUM MANAGER */}
        <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-5">
          {/* Hidden inputs */}
          <input
            type="file"
            ref={singleFileInputRef}
            accept="image/*"
            onChange={handleSinglePhotoChange}
            className="hidden"
          />
          <input
            type="file"
            ref={multiFileInputRef}
            multiple
            accept="image/*"
            onChange={handleAddPhotosUpload}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                  <span>3. Quản Lý Album Kỷ Niệm</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-mono">
                    {galleryItems.length} Bức Ảnh
                  </span>
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Bạn có thể tải lên thoải mái bao nhiêu ảnh tùy thích (10, 20, 50 ảnh...). Cả trang xem và trình chiếu Polaroid đều hiển thị đầy đủ!
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleResetToInitialPhotos}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-xs transition-colors flex items-center gap-1"
                title="Khôi phục lại 7 ảnh mẫu ban đầu"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Khôi phục mẫu</span>
              </button>

              <button
                type="button"
                onClick={() => multiFileInputRef.current?.click()}
                disabled={isProcessingPhotos}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
                title="Chọn một hoặc nhiều ảnh từ điện thoại hay máy tính để thêm vào album"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isProcessingPhotos ? 'Đang thêm...' : 'Thêm nhiều ảnh vào album'}</span>
              </button>
            </div>
          </div>

          {/* Cloud Firestore Status & Sync All Button */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-stone-950 via-rose-950/20 to-stone-950 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <Cloud className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                  <span>Đã kết nối Cloud Firestore</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="text-[11px] text-stone-400">
                  Ảnh và cài đặt được lưu trên Đám Mây. Bạn gái mở link ở bất cứ đâu cũng xem được ngay!
                  {cloudSyncedTime && <span className="ml-1 text-emerald-300 font-mono">(Lần đồng bộ gần nhất: {cloudSyncedTime})</span>}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncAllToCloud}
              disabled={isSyncingCloud}
              className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-stone-700 hover:border-rose-400/50 transition-colors shadow-sm disabled:opacity-50 shrink-0"
              title="Đẩy toàn bộ ảnh hiện tại lên Cloud Firestore để đảm bảo mọi thiết bị đều xem được"
            >
              <RefreshCw className={`w-3 h-3 text-rose-300 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{isSyncingCloud ? 'Đang tải lên Cloud...' : 'Đồng bộ toàn bộ lên Cloud'}</span>
            </button>
          </div>

          {uploadStatusMsg && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs text-center font-sans animate-in fade-in">
              {uploadStatusMsg}
            </div>
          )}

          {/* List of all photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryItems.map((item, idx) => {
              const currentImg = photoData[item.id] || item.fallbackUrl;
              const hasCustomPhoto = Boolean(photoData[item.id]);
              const currentCaption = captions[item.id] || item.defaultCaption;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-stone-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-3.5 items-start">
                    {/* Thumbnail preview */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 border border-stone-800 bg-stone-900 group flex items-center justify-center">
                      <GalleryImage
                        photoId={item.id}
                        fallbackUrl={item.fallbackUrl}
                        photoData={photoData}
                        alt={item.title}
                        onLoaded={(id, val) => setPhotoData((prev) => ({ ...prev, [id]: val }))}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => triggerSingleUpload(item.id)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] gap-1"
                      >
                        <Camera className="w-4 h-4 text-rose-400" />
                        <span>Đổi ảnh</span>
                      </button>

                      {hasCustomPhoto && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600 text-[9px] text-white font-semibold">
                          Ảnh riêng
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-900 text-rose-300 border border-stone-800 font-semibold truncate max-w-[160px]">
                          #{idx + 1} {item.year ? `· ${item.year}` : ''} {item.dateStr ? `· ${item.dateStr}` : ''}
                        </span>

                        {/* Reorder and Delete controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMovePhotoUp(idx)}
                            disabled={idx === 0}
                            className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-30 transition-colors"
                            title="Di chuyển lên trước"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePhotoDown(idx)}
                            disabled={idx === galleryItems.length - 1}
                            className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-30 transition-colors"
                            title="Di chuyển xuống sau"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(item.id, item.title)}
                            className="p-1 rounded bg-stone-900 hover:bg-rose-950 text-stone-400 hover:text-rose-400 transition-colors"
                            title="Xóa ảnh này khỏi album"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title input */}
                      <div>
                        <label className="text-[10px] text-stone-500 block">Tiêu đề ảnh:</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItemField(item.id, 'title', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-800 text-stone-200 text-xs font-serif font-bold focus:border-rose-500 focus:outline-hidden"
                          placeholder="Tiêu đề kỷ niệm..."
                        />
                      </div>

                      {/* Year & Date inputs */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-stone-500 block">Năm:</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => handleUpdateItemField(item.id, 'year', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 text-[11px] font-mono focus:border-rose-500 focus:outline-hidden"
                            placeholder="Để trống nếu không rõ"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-500 block">Ngày tháng:</label>
                          <input
                            type="text"
                            value={item.dateStr}
                            onChange={(e) => handleUpdateItemField(item.id, 'dateStr', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 text-[11px] font-mono focus:border-rose-500 focus:outline-hidden"
                            placeholder="Để trống nếu không có"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption Editor */}
                  <div className="space-y-1 pt-1 border-t border-stone-800/80">
                    <label className="text-[11px] text-stone-400 block">Lời tựa kỷ niệm:</label>
                    <input
                      type="text"
                      value={currentCaption}
                      onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                      placeholder="Lời tựa cho bức ảnh này..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:border-rose-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add more button at bottom of list */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => multiFileInputRef.current?.click()}
              disabled={isProcessingPhotos}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-rose-300 border border-rose-500/40 text-xs font-semibold inline-flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-rose-400" />
              <span>Thêm ảnh mới vào album ({galleryItems.length} ảnh hiện tại)</span>
            </button>
          </div>
        </section>

        {/* SECTION 5: MUSIC SETTINGS */}
        <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Music className="w-4 h-4 text-rose-400" />
            <h3 className="font-serif text-lg font-bold text-stone-100">
              4. Quản Lý Nhạc Nền ("Ngày Đầu Tiên" - Đức Phúc)
            </h3>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            Bạn có thể nạp trực tiếp file MP3 bài hát gốc <em>"Ngày Đầu Tiên"</em> (hoặc bất kỳ bài hát tình yêu nào bạn muốn) từ máy của bạn. File sẽ được lưu trong trình duyệt và tự động phát khi người ấy mở phong thư.
          </p>

          {/* Music player with upload ribbon enabled */}
          <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
            <NgayDauTienPlayer compact={false} allowUpload={true} />
          </div>
        </section>

        {/* SECTION 6: VISUAL EFFECTS */}
        <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-stone-100">
              5. Hiệu Ứng Lãng Mạn (Trái Tim & Cánh Hoa Rơi)
            </h3>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-stone-950 border border-stone-800">
            <div>
              <h4 className="text-sm font-semibold text-stone-200">
                Hiệu ứng cánh hoa hồng & trái tim bay từ dưới lên
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Các cánh hoa hồng rơi nhẹ và trái tim nhỏ bay bổng khi cuộn trang hoặc chạm vào màn hình.
              </p>
            </div>
            <button
              onClick={onTogglePetals}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                petalsEnabled
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {petalsEnabled ? 'Đang Bật' : 'Đang Tắt'}
            </button>
          </div>
        </section>

        {/* SECTION 6: ROMANTIC GIFT PICKER GAME GIFTS */}
        <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-rose-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  6. Quản Lý Danh Sách Quà Tặng Cho Game ({giftsList.length} món)
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Các món quà này sẽ xuất hiện trong mini game "Hộp Quà May Mắn" và "Thẻ Cào Tình Yêu" để người yêu bốc thưởng.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {giftSavedNotice && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 mr-2">
                  <Check className="w-3.5 h-3.5" /> Đã lưu quà!
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Đặt lại lượt chọn quà cho Bé Châu? (Em sẽ có thể chọn lại 1 chiếc hộp quà mới)')) {
                    localStorage.removeItem('anniv_final_chosen_gift');
                    audioService.playChime();
                    alert('Đã đặt lại lượt chọn quà! Bé Châu có thể chọn lại món quà mới.');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60 text-amber-200 text-xs flex items-center gap-1 transition-colors"
                title="Cho phép người yêu chọn lại quà"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại lượt chọn quà</span>
              </button>
              <button
                type="button"
                onClick={handleResetGifts}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1 transition-colors"
                title="Khôi phục 6 món quà mẫu"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Khôi phục quà mẫu</span>
              </button>
              <button
                type="button"
                onClick={handleAddGift}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm món quà</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {giftsList.map((gift, idx) => (
              <div
                key={gift.id}
                className="p-4 rounded-xl bg-stone-950 border border-stone-800/90 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{gift.icon}</span>
                    <span className="text-xs font-mono text-amber-300 font-bold">
                      Quà #{idx + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteGift(gift.id)}
                    className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                    title="Xóa món quà này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Tên món quà:</label>
                    <input
                      type="text"
                      value={gift.title}
                      onChange={(e) => handleUpdateGift(gift.id, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs font-medium focus:border-rose-500 focus:outline-hidden"
                      placeholder="Tên món quà..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Mô tả quà tặng:</label>
                    <input
                      type="text"
                      value={gift.description}
                      onChange={(e) => handleUpdateGift(gift.id, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 text-xs focus:border-rose-500 focus:outline-hidden"
                      placeholder="Mô tả cụ thể..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-0.5">Biểu tượng (Emoji):</label>
                      <input
                        type="text"
                        value={gift.icon}
                        onChange={(e) => handleUpdateGift(gift.id, 'icon', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:border-rose-500 focus:outline-hidden text-center"
                        placeholder="💄, ✈️, 🍷..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-0.5">Huy hiệu nhỏ:</label>
                      <input
                        type="text"
                        value={gift.badge}
                        onChange={(e) => handleUpdateGift(gift.id, 'badge', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:border-rose-500 focus:outline-hidden text-center"
                        placeholder="Đặc Biệt, Hot..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Lời cam kết của bạn trai:</label>
                    <input
                      type="text"
                      value={gift.boyfriendPromise}
                      onChange={(e) => handleUpdateGift(gift.id, 'boyfriendPromise', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-amber-200 text-xs italic focus:border-rose-500 focus:outline-hidden"
                      placeholder="Anh cam kết thực hiện..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: SWEET MESSAGES RECEIVED FROM HER */}
        <section className="p-6 rounded-2xl bg-stone-900/60 border border-purple-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  7. Hộp Thư Lời Ngọt Ngào Từ Bé Châu
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Các lời nhắn ngọt ngào Bé Châu gửi để xin mở thêm hộp quà (tự động chuyển tới hòm thư <strong className="text-amber-300 font-mono">nguyentai3021@gmail.com</strong>).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Xóa danh sách lưu trữ lời nhắn ngọt ngào?')) {
                  localStorage.removeItem('anniv_sweet_messages_to_boyfriend');
                  audioService.playChime();
                  window.location.reload();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa lịch sử</span>
            </button>
          </div>

          {(() => {
            let messages: { id: string; text: string; dateStr: string; chosenGiftTitle?: string }[] = [];
            try {
              const saved = localStorage.getItem('anniv_sweet_messages_to_boyfriend');
              if (saved) messages = JSON.parse(saved);
            } catch (e) {
              console.error(e);
            }

            if (messages.length === 0) {
              return (
                <div className="text-center py-8 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-2">
                  <Mail className="w-7 h-7 text-stone-600 mx-auto" />
                  <p className="text-xs text-stone-400">
                    Chưa có lời nhắn nào được gửi. Khi Bé Châu muốn mở thêm hộp quà và gửi lời ngọt ngào, tin nhắn sẽ hiển thị tại đây và chuyển về <strong className="text-amber-300">nguyentai3021@gmail.com</strong>!
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-stone-950 to-rose-950/30 border border-purple-500/25 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-purple-300 font-bold flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                        Lời nhắn #{messages.length - idx}
                      </span>
                      <span className="text-stone-500">{msg.dateStr}</span>
                    </div>

                    <p className="text-sm text-stone-100 font-serif italic bg-stone-900/60 p-3 rounded-lg border border-stone-800 leading-relaxed">
                      "{msg.text}"
                    </p>

                    {msg.chosenGiftTitle && (
                      <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                        <span>Quà đã chọn trước đó:</span>
                        <span className="text-amber-300 font-semibold">{msg.chosenGiftTitle}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </section>

        {/* SECTION 8: FINISH & RETURN TO SHOWCASE */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-stone-900 to-rose-950/40 border border-rose-500/40 text-center space-y-4 shadow-2xl">
          <div className="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-400 mb-1">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
            Album {galleryItems.length} bức ảnh đã sẵn sàng!
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            Bấm nút bên dưới để chuyển sang xem trang kỷ niệm chính thức không có nút chỉnh sửa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onBackToShowcase}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-semibold shadow-lg shadow-rose-950 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Xem Trang Kỷ Niệm Chính ({galleryItems.length} ảnh)</span>
            </button>

            <button
              onClick={handleCopyShowcaseUrl}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-stone-700"
            >
              <Copy className="w-4 h-4 text-rose-400" />
              <span>Sao chép link gửi cho em</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
