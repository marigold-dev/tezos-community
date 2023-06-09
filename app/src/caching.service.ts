import { Storage } from "@ionic/storage";

// Expire time in seconds
const TTL = 30;
// Key to identify only cached API data
const CACHE_KEY = "_mycached_";

export class CachingService {
  constructor(private storage: Storage) {}

  // Setup Ionic Storage
  async initStorage() {
    await this.storage.create();
  }

  // Store request data with TTL
  async set(key: string, data: any): Promise<any> {
    return this.storage.set(key, data);
  }

  // Store request data with TTL
  async cacheRequest(url: string, data: any): Promise<any> {
    const validUntil = new Date().getTime() + TTL * 1000;
    url = `${CACHE_KEY}${url}`;
    return this.storage.set(url, { validUntil, data });
  }

  //no TTL
  async get(key: string): Promise<any> {
    const storedValue = await this.storage.get(key);
    if (!storedValue) {
      return null;
    } else {
      return storedValue;
    }
  }

  // Try to load cached data with TTL
  async getCachedRequest(url: string): Promise<any> {
    const currentTime = new Date().getTime();
    url = `${CACHE_KEY}${url}`;

    const storedValue = await this.storage.get(url);

    if (!storedValue) {
      //console.log("*** NOT FOUND ON CACHE ***", storedValue);
      return null;
    } else if (storedValue.validUntil < currentTime) {
      //console.log("*** REMOVE ON CACHE ***", storedValue);
      await this.storage.remove(url);
      return null;
    } else {
      //console.log("*** RETURN FROM CACHE ***", storedValue);
      return storedValue.data;
    }
  }

  async keys(): Promise<string[]> {
    return this.storage.keys();
  }

  // Remove all cached data & files with TTL
  async clearCachedData() {
    const keys = await this.storage.keys();

    keys.map(async (key) => {
      if (key.startsWith(CACHE_KEY)) {
        await this.storage.remove(key);
      }
    });
  }

  // Example to remove one cached URL with TTL
  async invalidateCacheEntry(url: string) {
    url = `${CACHE_KEY}${url}`;
    await this.storage.remove(url);
  }

  async remove(key: string) {
    await this.storage.remove(key);
  }
}
