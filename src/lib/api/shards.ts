interface ShardData {
    uptime: number;
    latency: number;
    servers: number;
    users: number;
    shard: number;
}

interface ShardsResponse {
    shards: ShardData[];
}

// Define outage interface
interface Outage {
    id: string;
    title: string;
    description: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    createdAt: string;
    updatedAt: string;
    affectedComponents: string[];
}

const API_BASE_URL = 'https://api.greed.rocks';
const CACHE_KEY = 'greed_shard_data';
const OUTAGES_CACHE_KEY = 'greed_outages_data';
const CACHE_DURATION = 10000; // 10 seconds in milliseconds
const OUTAGES_CACHE_DURATION = 60000; // 1 minute in milliseconds

import { globalCache } from './globalCache';

/**
 * Fetches shard information from the API with global caching
 * @param skipCache Whether to skip the cache and force a fresh fetch
 * @returns Promise containing array of shard data
 * @throws Error if the API request fails
 */
export async function getShards(skipCache = false): Promise<ShardData[]> {
    const fetchData = async (): Promise<ShardData[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/status`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data: ShardsResponse = await response.json();
            return data.shards;
        } catch (error) {
            console.error('Failed to fetch shard data:', error);
            throw error;
        }
    };

    if (skipCache) {
        return fetchData();
    }

    try {
        return await globalCache.withGlobalCache<ShardData[]>(
            CACHE_KEY,
            fetchData,
            CACHE_DURATION
        );
    } catch (error) {
        console.error('Failed to fetch or retrieve cached shard data:', error);
        throw error;
    }
}

/**
 * Gets cached shard data even if the API is down
 * @returns Cached shard data or empty array if no cache exists
 */
export function getCachedShards(): ShardData[] {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data } = JSON.parse(cachedData);
            return data;
        }
    } catch (error) {
        console.error('Failed to retrieve cached shard data:', error);
    }
    return [];
}

/**
 * Fetches current outages from the API with caching
 * @param skipCache Whether to skip the cache and force a fresh fetch
 * @returns Promise containing array of outage data
 */
export async function getOutages(skipCache = false): Promise<Outage[]> {
    const fetchData = async (): Promise<Outage[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/outages`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch outage data:', error);
            throw error;
        }
    };

    if (skipCache) {
        return fetchData();
    }

    try {
        return await globalCache.withGlobalCache<Outage[]>(
            OUTAGES_CACHE_KEY,
            fetchData,
            OUTAGES_CACHE_DURATION
        );
    } catch (error) {
        console.error('Failed to fetch or retrieve cached outage data:', error);
        // Return empty array instead of throwing
        return getCachedOutages();
    }
}

/**
 * Gets cached outage data even if the API is down
 * @returns Cached outage data or empty array if no cache exists
 */
export function getCachedOutages(): Outage[] {
    try {
        const cachedData = localStorage.getItem(OUTAGES_CACHE_KEY);
        if (cachedData) {
            const { data } = JSON.parse(cachedData);
            return data;
        }
    } catch (error) {
        console.error('Failed to retrieve cached outage data:', error);
    }
    return [];
}

/**
 * Posts a new outage to the API
 * @param outage The outage data to post
 * @param apiKey API key for authentication
 * @returns Promise with the created outage
 */
export async function postOutage(
    outage: Omit<Outage, 'id' | 'createdAt' | 'updatedAt'>, 
    apiKey: string
): Promise<Outage> {
    try {
        const response = await fetch(`${API_BASE_URL}/outages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(outage)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to post outage:', error);
        throw error;
    }
}

/**
 * Calculates total statistics across all shards
 * @param shards Array of shard data
 * @returns Object containing total statistics
 */
export function getTotalStats(shards: ShardData[]) {
    return shards.reduce((acc, shard) => ({
        servers: acc.servers + shard.servers,
        users: acc.users + shard.users,
        averageLatency: Math.round((acc.averageLatency * acc.shardCount + shard.latency) / (acc.shardCount + 1)),
        shardCount: acc.shardCount + 1
    }), {
        servers: 0,
        users: 0,
        averageLatency: 0,
        shardCount: 0
    });
}

/**
 * Updates an existing outage in the API
 * @param id The ID of the outage to update
 * @param update The outage data to update
 * @param apiKey API key for authentication
 * @returns Promise with the updated outage
 */
export async function updateOutage(
    id: string,
    update: Partial<Omit<Outage, 'id' | 'createdAt' | 'updatedAt'>>,
    apiKey: string
): Promise<Outage> {
    try {
        const response = await fetch(`${API_BASE_URL}/outages/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(update)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const updatedOutage = await response.json();
        
        // Invalidate cache to ensure fresh data on next fetch
        globalCache.clearCache(OUTAGES_CACHE_KEY);
        
        return updatedOutage;
    } catch (error) {
        console.error('Failed to update outage:', error);
        throw error;
    }
}

export type { ShardData, Outage };
