// ============================================
// In-Memory Cache (Redis mock for hackathon)
// ============================================

class MemoryCache {
  private store: Map<string, { value: unknown; expiresAt: number }> = new Map();

  set(key: string, value: unknown, ttlSeconds = 300) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { this.store.delete(key); return null; }
    return entry.value as T;
  }

  delete(key: string) { this.store.delete(key); }
  clear() { this.store.clear(); }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(key);
    }
  }
}

export const cache = new MemoryCache();
setInterval(() => cache.cleanup(), 60000);
