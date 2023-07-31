import { Storage } from "@ionic/storage";

// Expire time in seconds
const TTL = 30;
// Key to identify only cached API data
const CACHE_KEY = "_mycached_";

export class CachingService {
  initialized = false;

  constructor(private storage: Storage) {}

  // Setup Ionic Storage
  async initStorage() {
    console.log("initStorage");

    await this.storage.create();
    this.initialized = true;
  }

  isInitialized() {
    return this.initialized;
  }

  // Store request data with TTL
  async set(key: string, data: any): Promise<any> {
    if (!this.isInitialized) await this.initStorage();

    return this.storage.set(key, data);
  }

  // Store request data with TTL
  async setWithTTL(url: string, data: any): Promise<any> {
    if (!this.isInitialized) await this.initStorage();

    const validUntil = new Date().getTime() + TTL * 1000;
    url = `${CACHE_KEY}${url}`;
    return this.storage.set(url, { validUntil, data });
  }

  //no TTL
  async get(key: string): Promise<any> {
    if (!this.isInitialized) await this.initStorage();

    const storedValue = await this.storage.get(key);
    if (!storedValue) {
      return null;
    } else {
      return storedValue;
    }
  }

  // Try to load cached data with TTL
  async getWithTTL(url: string): Promise<any> {
    if (!this.isInitialized) await this.initStorage();

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
    if (!this.isInitialized) await this.initStorage();

    return this.storage.keys();
  }

  // Remove all cached data & files with TTL
  async clearCachedData() {
    if (!this.isInitialized) await this.initStorage();

    const keys = await this.storage.keys();

    keys.map(async (key) => {
      if (key.startsWith(CACHE_KEY)) {
        await this.storage.remove(key);
      }
    });
  }

  // Example to remove one cached URL with TTL
  async invalidateCacheEntry(url: string) {
    if (!this.isInitialized) await this.initStorage();

    url = `${CACHE_KEY}${url}`;
    await this.storage.remove(url);
  }

  async remove(key: string) {
    if (!this.isInitialized) await this.initStorage();

    await this.storage.remove(key);
  }
}
