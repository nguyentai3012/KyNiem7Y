import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { GalleryPhotoItem } from '../components/SevenYearGallery';
import { savePhoto, getPhoto } from '../utils/photoStorage';

const PHOTOS_COLLECTION = 'anniversary_photos';
const SETTINGS_COLLECTION = 'anniversary_settings';
const SETTINGS_DOC_ID = 'main_config';

export interface CloudSettings {
  herName?: string;
  letterContent?: string;
  letterDateStr?: string;
  updatedAt?: string;
}

// Compress data URL if larger than ~700KB to ensure smooth Firestore write (< 1MB doc limit)
export async function optimizeImageDataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }

  // If already under 600KB (base64 length < 800,000)
  if (dataUrl.length < 800000) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 1200;

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
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Save single photo item & image to Firestore Cloud
 */
export async function syncPhotoToCloud(
  item: GalleryPhotoItem,
  dataUrl?: string,
  orderIndex: number = 0
): Promise<void> {
  try {
    let finalPhotoData = dataUrl || '';
    if (!finalPhotoData) {
      finalPhotoData = (await getPhoto(item.id)) || '';
    }

    if (finalPhotoData && finalPhotoData.startsWith('data:image')) {
      finalPhotoData = await optimizeImageDataUrl(finalPhotoData);
    }

    const docRef = doc(db, PHOTOS_COLLECTION, item.id);
    await setDoc(
      docRef,
      {
        id: item.id,
        year: item.year || '',
        dateStr: item.dateStr || '',
        title: item.title || '',
        defaultCaption: item.defaultCaption || '',
        quote: item.quote || '',
        fallbackUrl: item.fallbackUrl || '',
        rotation: item.rotation || 0,
        photoData: finalPhotoData,
        order: orderIndex,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to sync photo to Firestore Cloud:', err);
  }
}

/**
 * Delete a photo from Cloud
 */
export async function deletePhotoFromCloud(photoId: string): Promise<void> {
  try {
    const docRef = doc(db, PHOTOS_COLLECTION, photoId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete photo from Cloud:', err);
  }
}

/**
 * Sync entire photo list and order to Cloud
 */
export async function syncAllPhotosToCloud(
  items: GalleryPhotoItem[],
  photoDataMap: Record<string, string>
): Promise<void> {
  try {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const data = photoDataMap[item.id] || '';
      await syncPhotoToCloud(item, data, i);
    }
  } catch (err) {
    console.error('Failed to sync all photos to Cloud:', err);
  }
}

/**
 * Subscribe to real-time Cloud photos.
 * Ensures the girlfriend or any device viewing the link sees all uploaded photos immediately!
 */
export function subscribeCloudPhotos(
  onUpdate: (items: GalleryPhotoItem[], photoMap: Record<string, string>) => void
): () => void {
  try {
    const q = query(collection(db, PHOTOS_COLLECTION), orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          return;
        }

        const items: GalleryPhotoItem[] = [];
        const photoMap: Record<string, string> = {};

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const photoId = data.id || docSnap.id;

          items.push({
            id: photoId,
            year: data.year || '',
            dateStr: data.dateStr || '',
            title: data.title || '',
            defaultCaption: data.defaultCaption || '',
            quote: data.quote || '',
            fallbackUrl: data.fallbackUrl || '',
            rotation: data.rotation || 0,
          });

          if (data.photoData) {
            photoMap[photoId] = data.photoData;
            // Also cache locally for instant future load
            savePhoto(photoId, data.photoData);
          }
        });

        if (items.length > 0) {
          onUpdate(items, photoMap);
        }
      },
      (err) => {
        console.warn('Firestore real-time subscription error, using local data:', err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Error setting up cloud photo listener:', err);
    return () => {};
  }
}

/**
 * Save settings (letter, girlfriend name, dates) to Cloud
 */
export async function syncSettingsToCloud(settings: CloudSettings): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(
      docRef,
      {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to sync settings to Cloud:', err);
  }
}

/**
 * Subscribe to real-time Cloud settings
 */
export function subscribeCloudSettings(onUpdate: (settings: CloudSettings) => void): () => void {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as CloudSettings;
          onUpdate(data);
        }
      },
      (err) => {
        console.warn('Firestore settings listener error:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Error setting up cloud settings listener:', err);
    return () => {};
  }
}
