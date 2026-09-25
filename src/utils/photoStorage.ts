// Robust IndexedDB & In-Memory Photo Storage for Anniversary App
// Solves localStorage 5MB quota limitation and ensures instant slideshow rendering

const DB_NAME = 'AnniversaryAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';
const META_KEY = '__anniv_gallery_items_meta__';

// In-Memory Fast Cache
const memoryPhotoCache: Record<string, string> = {};
let memoryGalleryMeta: any[] | null = null;

// Clean up old bloated localStorage base64 data to free up 5MB quota
export function cleanOldLocalStorageBloat(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('anniv_photo_') || key.startsWith('custom_photo_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Cleanup error', e);
  }
}

// Auto clean once on script import
if (typeof window !== 'undefined') {
  cleanOldLocalStorageBloat();
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhoto(key: string, dataUrl: string): Promise<void> {
  // Store in memory cache immediately for instantaneous access
  memoryPhotoCache[key] = dataUrl;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(dataUrl, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save to IndexedDB', err);
  }
}

export async function getPhoto(key: string): Promise<string | null> {
  // 1. Check in-memory cache first (instant)
  if (memoryPhotoCache[key]) {
    return memoryPhotoCache[key];
  }

  // 2. Query IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result && typeof req.result === 'string') {
          memoryPhotoCache[key] = req.result;
          resolve(req.result);
        } else {
          // fallback to localStorage if any
          const local = localStorage.getItem(`anniv_photo_${key}`);
          if (local) memoryPhotoCache[key] = local;
          resolve(local);
        }
      };
      req.onerror = () => {
        resolve(localStorage.getItem(`anniv_photo_${key}`));
      };
    });
  } catch (err) {
    return localStorage.getItem(`anniv_photo_${key}`);
  }
}

export async function getAllPhotos(): Promise<Record<string, string>> {
  const result: Record<string, string> = { ...memoryPhotoCache };

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const key = cursor.key.toString();
          if (key !== META_KEY && typeof cursor.value === 'string') {
            result[key] = cursor.value;
            memoryPhotoCache[key] = cursor.value;
          }
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      cursorReq.onerror = () => resolve(result);
    });
  } catch (err) {
    return result;
  }
}

export async function deletePhoto(key: string): Promise<void> {
  delete memoryPhotoCache[key];
  try {
    localStorage.removeItem(`anniv_photo_${key}`);
  } catch {}

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.error(err);
  }
}

export async function clearAllPhotos(): Promise<void> {
  Object.keys(memoryPhotoCache).forEach((k) => delete memoryPhotoCache[k]);
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.error(err);
  }
}

export async function saveGalleryMeta(items: any[]): Promise<void> {
  memoryGalleryMeta = items;

  // Clean items of any data: urls before storing to keep size tiny
  const cleanItems = items.map((item) => ({
    ...item,
    fallbackUrl: item.fallbackUrl?.startsWith('data:') ? '' : item.fallbackUrl,
  }));

  try {
    const serialized = JSON.stringify(cleanItems);
    localStorage.setItem('anniv_gallery_items', serialized);
  } catch (e) {
    console.warn('LocalStorage save failed, relying on IndexedDB', e);
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(JSON.stringify(cleanItems), META_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.error('Failed to save gallery meta to IndexedDB', err);
  }
}

export async function getGalleryMeta(): Promise<any[] | null> {
  if (memoryGalleryMeta && Array.isArray(memoryGalleryMeta) && memoryGalleryMeta.length > 0) {
    return memoryGalleryMeta;
  }

  // 1. Try IndexedDB
  try {
    const db = await openDB();
    const idbResult = await new Promise<any[] | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(META_KEY);
      req.onsuccess = () => {
        if (req.result) {
          try {
            resolve(JSON.parse(req.result));
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });

    if (idbResult && Array.isArray(idbResult) && idbResult.length > 0) {
      memoryGalleryMeta = idbResult;
      return idbResult;
    }
  } catch {
    // fallback
  }

  // 2. Try localStorage
  try {
    const saved = localStorage.getItem('anniv_gallery_items');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryGalleryMeta = parsed;
        return parsed;
      }
    }
  } catch {}

  return null;
}
