/**
 * Product Image Storage using IndexedDB
 * 
 * Stores full binary/optimized WebP images inside browser IndexedDB
 * so images persist on the same browser/device without exceeding localStorage limits.
 */

export interface StoredProductImage {
  id: string; // unique image id
  productId: string; // associated product id
  filename: string;
  size: number;
  type: string;
  dataUrl: string; // optimized dataUrl or Blob stored in IndexedDB
  color?: string; // optionally assigned color name (e.g. "Natural Titanium")
  isPrimary: boolean;
  createdAt: number;
}

const DB_NAME = "TheekzuProductImageDB";
const STORE_NAME = "product_images";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only available in the browser"));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("productId", "productId", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}

/**
 * Compress an image file to max 1800px on the longest side using canvas and WebP/JPEG format
 */
export async function compressImage(file: File, maxDimension = 1800, quality = 0.85): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Failed to get 2d context for image compression"));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        // Approximate byte size
        const head = dataUrl.indexOf(",") + 1;
        const size = Math.round(((dataUrl.length - head) * 3) / 4);

        resolve({ dataUrl, size });
      };
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Save an uploaded product image
 */
export async function saveImage(image: StoredProductImage): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // If this image is primary, clear isPrimary for other images of this product
    if (image.isPrimary) {
      const index = store.index("productId");
      const request = index.getAll(image.productId);
      request.onsuccess = () => {
        const list: StoredProductImage[] = request.result || [];
        for (const item of list) {
          if (item.id !== image.id && item.isPrimary) {
            item.isPrimary = false;
            store.put(item);
          }
        }
        store.put(image);
      };
      request.onerror = () => reject(request.error);
    } else {
      store.put(image);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get all images for a specific product
 */
export async function getProductImages(productId: string): Promise<StoredProductImage[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const index = store.index("productId");
      const request = index.getAll(productId);

      request.onsuccess = () => {
        const list: StoredProductImage[] = request.result || [];
        // Sort primary first, then created time
        list.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0) || a.createdAt - b.createdAt);
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to read images from IndexedDB for product", productId, err);
    return [];
  }
}

/**
 * Get a single image by id
 */
export async function getImage(id: string): Promise<StoredProductImage | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete an image by id
 */
export async function deleteImage(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Set an image as primary for its product
 */
export async function setPrimaryImage(productId: string, imageId: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("productId");
    const request = index.getAll(productId);

    request.onsuccess = () => {
      const list: StoredProductImage[] = request.result || [];
      for (const item of list) {
        item.isPrimary = item.id === imageId;
        store.put(item);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Assign an image to a specific color
 */
export async function assignImageToColor(imageId: string, colorName: string | undefined): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(imageId);

    request.onsuccess = () => {
      const item: StoredProductImage = request.result;
      if (item) {
        item.color = colorName && colorName.trim() ? colorName.trim() : undefined;
        store.put(item);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Load all images for all products at once (useful for initial hydration)
 */
export async function getAllStoredImages(): Promise<Record<string, StoredProductImage[]>> {
  if (typeof window === "undefined") return {};
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const map: Record<string, StoredProductImage[]> = {};
        const list: StoredProductImage[] = request.result || [];
        for (const item of list) {
          if (!map[item.productId]) map[item.productId] = [];
          map[item.productId].push(item);
        }
        for (const pid in map) {
          map[pid].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0) || a.createdAt - b.createdAt);
        }
        resolve(map);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB getAllStoredImages error:", e);
    return {};
  }
}
