// Base API Service - Handles middlewares and abstracts HTTP methods
import { CacheService } from './cacheService.js';

export class BaseApiService {
  constructor(config = {}) {
    this.config = {
      baseURL: 'http://localhost:3001',
      timeout: 10000,
      retries: 2,
      retryDelay: 1000,
      enableCache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      ...config
    };

    // Middleware arrays
    this.requestMiddlewares = [];
    this.responseMiddlewares = [];
    this.errorMiddlewares = [];

    // Initialize default middlewares
    this.initializeDefaultMiddlewares();
  }

  // Initialize default middlewares
  initializeDefaultMiddlewares() {
    // Request middleware for logging
    this.addRequestMiddleware(async (config) => {
      console.log(`[API] ${config.method} ${config.url}`);
      return config;
    });

    // Response middleware for logging
    this.addResponseMiddleware(async (response) => {
      console.log(`[API] ${response.config.method} ${response.config.url} - ${response.status}`);
      return response;
    });

    // Error middleware for logging
    this.addErrorMiddleware(async (error) => {
      console.error(`[API] Error: ${error.message}`, error);
      return error;
    });
  }

  // Middleware management
  addRequestMiddleware(middleware) {
    this.requestMiddlewares.push(middleware);
    return this;
  }

  addResponseMiddleware(middleware) {
    this.responseMiddlewares.push(middleware);
    return this;
  }

  addErrorMiddleware(middleware) {
    this.errorMiddlewares.push(middleware);
    return this;
  }

  // Execute middlewares
  async executeRequestMiddlewares(config) {
    let currentConfig = { ...config };
    for (const middleware of this.requestMiddlewares) {
      currentConfig = await middleware(currentConfig);
    }
    return currentConfig;
  }

  async executeResponseMiddlewares(response) {
    let currentResponse = response;
    for (const middleware of this.responseMiddlewares) {
      currentResponse = await middleware(currentResponse);
    }
    return currentResponse;
  }

  async executeErrorMiddlewares(error) {
    let currentError = error;
    for (const middleware of this.errorMiddlewares) {
      currentError = await middleware(currentError);
    }
    return currentError;
  }

  // Core HTTP methods
  async request(method, url, data = null, options = {}) {
    const config = {
      method: method.toUpperCase(),
      url: url.startsWith('http') ? url : `${this.config.baseURL}${url}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: options.timeout || this.config.timeout,
      ...options
    };

    try {
      // Execute request middlewares
      const processedConfig = await this.executeRequestMiddlewares(config);

      // Make the actual request
      const response = await this.makeRequest(processedConfig);

      // Execute response middlewares
      const processedResponse = await this.executeResponseMiddlewares(response);

      return processedResponse;
    } catch (error) {
      // Execute error middlewares
      const processedError = await this.executeErrorMiddlewares(error);
      throw processedError;
    }
  }

  // Actual HTTP request implementation
  async makeRequest(config) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.config = config;
        throw error;
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout after ${config.timeout}ms`);
        timeoutError.config = config;
        throw timeoutError;
      }
      
      error.config = config;
      throw error;
    }
  }

  // Convenience methods
  async get(url, options = {}) {
    return this.request('GET', url, null, options);
  }

  async post(url, data = null, options = {}) {
    return this.request('POST', url, data, options);
  }

  async put(url, data = null, options = {}) {
    return this.request('PUT', url, data, options);
  }

  async patch(url, data = null, options = {}) {
    return this.request('PATCH', url, data, options);
  }

  async delete(url, options = {}) {
    return this.request('DELETE', url, null, options);
  }

  // Cached request method
  async getCached(url, cacheKey, ttl = null) {
    if (!this.config.enableCache) {
      return this.get(url);
    }

    const effectiveTTL = ttl || this.config.cacheTTL;
    const cachedData = CacheService.get(cacheKey);

    if (cachedData !== null) {
      console.log(`[API] Cache hit for ${cacheKey}`);
      return {
        data: cachedData,
        fromCache: true,
        status: 200,
        statusText: 'OK (Cached)'
      };
    }

    const response = await this.get(url);
    
    if (response.data) {
      CacheService.set(cacheKey, response.data, effectiveTTL);
    }

    return {
      ...response,
      fromCache: false
    };
  }

  // Retry mechanism
  async requestWithRetry(method, url, data = null, options = {}) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        return await this.request(method, url, data, options);
      } catch (error) {
        lastError = error;
        
        if (attempt < this.config.retries) {
          console.log(`[API] Retry attempt ${attempt + 1}/${this.config.retries}`);
          await this.delay(this.config.retryDelay * (attempt + 1));
        }
      }
    }
    
    throw lastError;
  }

  // Utility methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Configuration methods
  setBaseURL(baseURL) {
    this.config.baseURL = baseURL;
    return this;
  }

  setTimeout(timeout) {
    this.config.timeout = timeout;
    return this;
  }

  setRetries(retries) {
    this.config.retries = retries;
    return this;
  }

  enableCaching(enable = true) {
    this.config.enableCache = enable;
    return this;
  }

  setCacheTTL(ttl) {
    this.config.cacheTTL = ttl;
    return this;
  }

  // Get service status
  getStatus() {
    return {
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      retries: this.config.retries,
      enableCache: this.config.enableCache,
      cacheTTL: this.config.cacheTTL,
      requestMiddlewares: this.requestMiddlewares.length,
      responseMiddlewares: this.responseMiddlewares.length,
      errorMiddlewares: this.errorMiddlewares.length
    };
  }

  // Clear cache
  clearCache(pattern = null) {
    if (pattern) {
      CacheService.remove(pattern);
    } else {
      CacheService.clear();
    }
    return this;
  }

  // Health check
  async healthCheck() {
    try {
      await this.get('/api/health');
      return {
        status: 'healthy',
        service: this.constructor.name,
        timestamp: new Date().toISOString(),
        config: this.getStatus()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: this.constructor.name,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
} 