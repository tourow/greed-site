import { globalCache } from './globalCache';

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const COMMANDS_CACHE_KEY = 'greed_commands_data';
const API_ENDPOINT = 'https://api.greed.rocks/raw';

// Interface for the API response
export interface CommandData {
  name: string;
  brief?: string | null;
  description?: string | null;
  permissions?: string[] | null;
  bot_permissions?: string[] | null;
  usage?: string | null;
  example?: string | null;
}

// Interface for the static JSON file
export interface StaticCommandData {
  name: string;
  brief?: string | null;
  example?: string | null;
}

export interface CommandsResponse {
  [category: string]: CommandData[];
}

export interface StaticCommandsResponse {
  [category: string]: StaticCommandData[];
}

// Import the static JSON as a fallback
let staticCommandsData: StaticCommandsResponse;

/**
 * Loads the static commands data as a fallback
 */
async function loadStaticCommandsData(): Promise<CommandsResponse> {
  if (!staticCommandsData) {
    try {
      // Dynamic import to avoid bundling this large file unless needed
      const module = await import('@/data/commands.json');
      staticCommandsData = module.default;
    } catch (error) {
      console.error('Failed to load static commands data:', error);
      return {};
    }
  }
  
  // Convert the static data to match the API response format
  const convertedData: CommandsResponse = {};
  
  for (const [category, commands] of Object.entries(staticCommandsData)) {
    convertedData[category] = commands.map(cmd => ({
      name: cmd.name,
      brief: cmd.brief || null,
      description: null,
      permissions: null,
      bot_permissions: null,
      usage: null,
      example: cmd.example || null
    }));
  }
  
  return convertedData;
}

/**
 * Fetches command data from the API with caching
 */
export async function fetchCommands(): Promise<CommandsResponse> {
  return globalCache.withGlobalCache<CommandsResponse>(
    COMMANDS_CACHE_KEY,
    async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          // Add a timeout to the fetch request
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch commands from API, using fallback:', error);
        
        // Try to use cached data first
        const cachedData = localStorage.getItem(COMMANDS_CACHE_KEY);
        if (cachedData) {
          try {
            const { data } = JSON.parse(cachedData);
            if (data && Object.keys(data).length > 0) {
              console.log('Using cached commands data');
              return data;
            }
          } catch (e) {
            console.error('Failed to parse cached data:', e);
          }
        }
        
        // Fall back to static data if no cache or cache parsing failed
        return await loadStaticCommandsData();
      }
    },
    CACHE_DURATION
  );
}

/**
 * Force refresh the commands data
 */
export function refreshCommands(): void {
  globalCache.clearCache(COMMANDS_CACHE_KEY);
} 