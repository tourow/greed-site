const CACHE_LOCK_KEY = 'greed_cache_lock';
const CACHE_LOCK_DURATION = 10000;

class GlobalCacheManager {
    private channel: BroadcastChannel;
    private static instance: GlobalCacheManager;

    private constructor() {
        this.channel = new BroadcastChannel('greed_cache_channel');
    }

    public static getInstance(): GlobalCacheManager {
        if (!GlobalCacheManager.instance) {
            GlobalCacheManager.instance = new GlobalCacheManager();
        }
        return GlobalCacheManager.instance;
    }

    private async acquireLock(): Promise<boolean> {
        const currentTime = Date.now();
        const lockData = localStorage.getItem(CACHE_LOCK_KEY);

        if (lockData) {
            const { timestamp } = JSON.parse(lockData);
            if (currentTime - timestamp < CACHE_LOCK_DURATION) {
                return false;
            }
        }

        localStorage.setItem(CACHE_LOCK_KEY, JSON.stringify({ timestamp: currentTime }));
        return true;
    }

    private releaseLock(): void {
        localStorage.removeItem(CACHE_LOCK_KEY);
    }

    public clearCache(cacheKey: string): void {
        localStorage.removeItem(cacheKey);
        this.channel.postMessage({
            type: 'CACHE_INVALIDATED',
            key: cacheKey
        });
    }

    public async withGlobalCache<T>(
        cacheKey: string,
        fetchFn: () => Promise<T>,
        cacheDuration: number
    ): Promise<T> {
        // check if we have valid cached data
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < cacheDuration) {
                return data;
            }
        }

        const hasLock = await this.acquireLock();

        if (!hasLock) {
            // if we don't have the lock wait for updates from other users
            return new Promise((resolve) => {
                const handleMessage = (event: MessageEvent) => {
                    if (event.data.type === 'CACHE_UPDATED' && event.data.key === cacheKey) {
                        this.channel.removeEventListener('message', handleMessage);
                        resolve(event.data.data);
                    }
                };

                this.channel.addEventListener('message', handleMessage);

                setTimeout(() => {
                    this.channel.removeEventListener('message', handleMessage);
                    const fallbackData = localStorage.getItem(cacheKey);
                    if (fallbackData) {
                        resolve(JSON.parse(fallbackData).data);
                    } else {
                        fetchFn().then(resolve);
                    }
                }, CACHE_LOCK_DURATION);
            });
        }

        try {
            const newData = await fetchFn();

            localStorage.setItem(cacheKey, JSON.stringify({
                data: newData,
                timestamp: Date.now()
            }));

            this.channel.postMessage({
                type: 'CACHE_UPDATED',
                key: cacheKey,
                data: newData
            });

            return newData;
        } finally {
            this.releaseLock();
        }
    }
}

export const globalCache = GlobalCacheManager.getInstance(); 