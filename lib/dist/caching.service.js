// Expire time in seconds
const TTL = 60 * 30; //30min
// Key to identify only cached API data
const CACHE_KEY = "_mycached_";
export class CachingService {
    constructor(storage) {
        Object.defineProperty(this, "storage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: storage
        });
        Object.defineProperty(this, "initialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    // Setup Ionic Storage
    async initStorage() {
        console.log("initStorage");
        await this.storage.create();
        this.initialized = true;
    }
    isInitialized() {
        return this.initialized;
    }
    // Store request data without TTL
    async set(key, data) {
        if (!this.isInitialized)
            await this.initStorage();
        //console.log("set - adding key : ", key);
        return await this.storage.set(key, data);
    }
    // Store request data with TTL
    async setWithTTL(url, data) {
        if (!this.isInitialized)
            await this.initStorage();
        const validUntil = new Date().getTime() + TTL * 1000;
        url = `${CACHE_KEY}${url}`;
        //console.log("setWithTTL - adding key : ", url);
        return await this.storage.set(url, { validUntil, data });
    }
    //no TTL
    async get(key) {
        if (!this.isInitialized)
            await this.initStorage();
        const storedValue = await this.storage.get(key);
        if (!storedValue) {
            return null;
        }
        else {
            return storedValue;
        }
    }
    // Try to load cached data with TTL
    async getWithTTL(url) {
        if (!this.isInitialized)
            await this.initStorage();
        const currentTime = new Date().getTime();
        url = `${CACHE_KEY}${url}`;
        const storedValue = await this.storage.get(url);
        if (!storedValue) {
            //console.log("*** NOT FOUND ON CACHE ***", storedValue);
            return null;
        }
        else if (storedValue.validUntil < currentTime) {
            //console.log("getWithTTL - removing key : ", url);
            await this.storage.remove(url);
            return null;
        }
        else {
            //console.log("*** RETURN FROM CACHE ***", storedValue);
            return storedValue.data;
        }
    }
    async keys() {
        if (!this.isInitialized)
            await this.initStorage();
        return await this.storage.keys();
    }
    // Remove all cached data & files with TTL
    async clearCachedData() {
        if (!this.isInitialized)
            await this.initStorage();
        const keys = await this.storage.keys();
        keys.map(async (key) => {
            if (key.startsWith(CACHE_KEY)) {
                //console.log("clearCachedData - removing key : ", key);
                await this.storage.remove(key);
            }
        });
    }
    // Example to remove one cached URL with TTL
    async invalidateCacheEntry(url) {
        if (!this.isInitialized)
            await this.initStorage();
        url = `${CACHE_KEY}${url}`;
        //console.log("invalidateCacheEntry - removing key : ", url);
        await this.storage.remove(url);
    }
    async remove(key) {
        if (!this.isInitialized)
            await this.initStorage();
        //console.log("remove - removing key : ", key);
        await this.storage.remove(key);
    }
}
