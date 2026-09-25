// IndexedDB storage for custom user audio files (e.g., Ngày Đầu Tiên.mp3)

const DB_NAME = 'AnniversaryAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_audio';

function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
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

export interface StoredAudio {
  blob: Blob;
  name: string;
  type: string;
  updatedAt: number;
}

export async function saveCustomAudio(file: File | Blob, name: string): Promise<void> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const data: StoredAudio = {
        blob: file,
        name,
        type: file.type || 'audio/mpeg',
        updatedAt: Date.now(),
      };
      store.put(data, 'primary_song');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save audio to IndexedDB', err);
    throw err;
  }
}

export async function getCustomAudio(): Promise<{ url: string; name: string } | null> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('primary_song');
      req.onsuccess = () => {
        const item = req.result as StoredAudio | undefined;
        if (item && item.blob) {
          const url = URL.createObjectURL(item.blob);
          resolve({ url, name: item.name });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to load audio from IndexedDB', err);
    return null;
  }
}

export async function clearCustomAudio(): Promise<void> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete('primary_song');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to delete audio from IndexedDB', err);
  }
}
