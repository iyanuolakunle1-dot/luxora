/**
 * High-performance client-side cache with Stale-While-Revalidate (SWR) support.
 * Keeps data instant in memory while synchronizing with the database in background.
 */

const memoryCache = new Map();
const listeners = new Map();

export const clientCache = {
  /**
   * Retrieves an item from memory or sessionStorage
   */
  get(key) {
    const entry = memoryCache.get(key);
    if (!entry) {
      try {
        const stored = sessionStorage.getItem(`luxora_cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Date.now() < parsed.expiresAt) {
            memoryCache.set(key, parsed);
            return parsed.data;
          }
          sessionStorage.removeItem(`luxora_cache_${key}`);
        }
      } catch {
        // safe fallback
      }
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      try { sessionStorage.removeItem(`luxora_cache_${key}`); } catch {}
      return null;
    }

    return entry.data;
  },

  /**
   * Sets an item in cache with a TTL (default 2 minutes)
   */
  set(key, data, ttlMs = 2 * 60 * 1000) {
    const expiresAt = Date.now() + ttlMs;
    const entry = { data, expiresAt };
    memoryCache.set(key, entry);

    try {
      sessionStorage.setItem(`luxora_cache_${key}`, JSON.stringify(entry));
    } catch {
      // safe fallback if storage quota is full
    }

    // Notify any active subscribers
    const keyListeners = listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach((fn) => fn(data));
    }
  },

  /**
   * Invalidates cache entries matching a prefix or table name
   */
  invalidate(prefix) {
    const cleanPrefix = prefix.replace(/^\/api\//, '/').replace(/^\//, '');
    
    // Clear matching memory keys
    for (const key of memoryCache.keys()) {
      if (key.includes(cleanPrefix)) {
        memoryCache.delete(key);
      }
    }

    // Clear matching sessionStorage keys
    try {
      const toRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const storageKey = sessionStorage.key(i);
        if (storageKey && storageKey.startsWith('luxora_cache_') && storageKey.includes(cleanPrefix)) {
          toRemove.push(storageKey);
        }
      }
      toRemove.forEach((k) => sessionStorage.removeItem(k));
    } catch {}
  },

  /**
   * Clears the entire cache
   */
  clear() {
    memoryCache.clear();
    try {
      const toRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const storageKey = sessionStorage.key(i);
        if (storageKey && storageKey.startsWith('luxora_cache_')) {
          toRemove.push(storageKey);
        }
      }
      toRemove.forEach((k) => sessionStorage.removeItem(k));
    } catch {}
  },

  /**
   * Subscribe to cache updates for a specific key
   */
  subscribe(key, callback) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);
    return () => {
      const set = listeners.get(key);
      if (set) {
        set.delete(callback);
        if (set.size === 0) listeners.delete(key);
      }
    };
  },
};

export default clientCache;
