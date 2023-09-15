import { Storage } from "@ionic/storage";
export declare class CachingService {
    private storage;
    initialized: boolean;
    constructor(storage: Storage);
    initStorage(): Promise<void>;
    isInitialized(): boolean;
    set(key: string, data: any): Promise<any>;
    setWithTTL(url: string, data: any): Promise<any>;
    get(key: string): Promise<any>;
    getWithTTL(url: string): Promise<any>;
    keys(): Promise<string[]>;
    clearCachedData(): Promise<void>;
    invalidateCacheEntry(url: string): Promise<void>;
    remove(key: string): Promise<void>;
}
