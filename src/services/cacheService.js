// Cache service for optimizing data fetching and storage performance
export class CacheService {
  static CACHE_PREFIX = 'contact_app_cache_';
  static DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  static MAX_CACHE_SIZE = 50; // Maximum number of cached items

  // Get cached data
  static get(key) {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);
      const now = Date.now();

      // Check if cache has expired
      if (now - timestamp > ttl) {
        this.remove(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  // Set cached data
  static set(key, data, ttl = this.DEFAULT_TTL) {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl
      };

      // Check cache size and clean if necessary
      this.cleanup();

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.warn('Cache set error:', error);
      return false;
    }
  }

  // Remove cached data
  static remove(key) {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      localStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.warn('Cache remove error:', error);
      return false;
    }
  }

  // Clear all cached data
  static clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn('Cache clear error:', error);
      return false;
    }
  }

  // Get cache keys
  static getKeys() {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.CACHE_PREFIX))
        .map(key => key.replace(this.CACHE_PREFIX, ''));
    } catch (error) {
      console.warn('Cache getKeys error:', error);
      return [];
    }
  }

  // Get cache size
  static getSize() {
    return this.getKeys().length;
  }

  // Cleanup expired and excess cache entries
  static cleanup() {
    try {
      const keys = this.getKeys();
      const validEntries = [];

      // Check for expired entries
      keys.forEach(key => {
        const cached = this.get(key);
        if (cached !== null) {
          validEntries.push(key);
        }
      });

      // Remove excess entries if over limit
      if (validEntries.length > this.MAX_CACHE_SIZE) {
        const excessCount = validEntries.length - this.MAX_CACHE_SIZE;
        const keysToRemove = validEntries.slice(0, excessCount);
        
        keysToRemove.forEach(key => {
          this.remove(key);
        });
      }
    } catch (error) {
      console.warn('Cache cleanup error:', error);
    }
  }

  // Get cache statistics
  static getStats() {
    try {
      const keys = this.getKeys();
      const now = Date.now();
      let totalSize = 0;
      let expiredCount = 0;
      let validCount = 0;

      keys.forEach(key => {
        const cacheKey = this.CACHE_PREFIX + key;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          try {
            const { timestamp, ttl } = JSON.parse(cached);
            totalSize += cached.length;
            
            if (now - timestamp > ttl) {
              expiredCount++;
            } else {
              validCount++;
            }
          } catch (error) {
            expiredCount++;
          }
        }
      });

      return {
        totalEntries: keys.length,
        validEntries: validCount,
        expiredEntries: expiredCount,
        totalSize: totalSize,
        maxSize: this.MAX_CACHE_SIZE
      };
    } catch (error) {
      console.warn('Cache stats error:', error);
      return null;
    }
  }

  // Cache with automatic refresh
  static async getOrFetch(key, fetchFunction, ttl = this.DEFAULT_TTL) {
    try {
      // Try to get from cache first
      const cached = this.get(key);
      if (cached !== null) {
        return { data: cached, fromCache: true };
      }
      // If not in cache, fetch and cache
      const data = await fetchFunction();
      this.set(key, data, ttl);
      
      return { data, fromCache: false };
    } catch (error) {
      console.warn('Cache getOrFetch error:', error);
      throw error;
    }
  }

  // Invalidate cache for specific patterns
  static invalidate(pattern) {
    try {
      const keys = this.getKeys();
      const regex = new RegExp(pattern);
      
      keys.forEach(key => {
        if (regex.test(key)) {
          this.remove(key);
        }
      });
    } catch (error) {
      console.warn('Cache invalidate error:', error);
    }
  }
} 