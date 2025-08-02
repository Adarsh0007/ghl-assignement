// Config API Service - Extends BaseApiService for configuration operations
import { BaseApiService } from './baseApiService.js';

export class ConfigApiService extends BaseApiService {
  constructor(config = {}) {
    super({
      baseURL: 'http://localhost:3001',
      timeout: 10000,
      retries: 1,
      retryDelay: 1000,
      enableCache: true,
      cacheTTL: 15 * 60 * 1000, // 15 minutes for config
      ...config
    });

    // Config-specific cache keys
    this.CACHE_KEYS = {
      LAYOUT_CONFIG: 'layout_config',
      CONTACT_FIELDS: 'contact_fields',
      VALIDATION_RULES: 'validation_rules',
      UI_CONFIG: 'ui_config',
      THEME_CONFIG: 'theme_config',
      CONFIG_SCHEMA: 'config_schema',
      CONFIG_VERSIONS: 'config_versions'
    };

    // Config-specific cache TTLs
    this.CACHE_TTL = {
      LAYOUT_CONFIG: 15 * 60 * 1000, // 15 minutes
      CONTACT_FIELDS: 15 * 60 * 1000, // 15 minutes
      VALIDATION_RULES: 30 * 60 * 1000, // 30 minutes
      UI_CONFIG: 10 * 60 * 1000, // 10 minutes
      THEME_CONFIG: 5 * 60 * 1000, // 5 minutes
      CONFIG_SCHEMA: 60 * 60 * 1000, // 1 hour
      CONFIG_VERSIONS: 5 * 60 * 1000 // 5 minutes
    };

    // Initialize config-specific middlewares
    this.initializeConfigMiddlewares();
  }

  // Initialize config-specific middlewares
  initializeConfigMiddlewares() {
    // Add config-specific request middleware
    this.addRequestMiddleware(async (config) => {
      // Add config-specific headers
      config.headers = {
        ...config.headers,
        'X-Service': 'ConfigAPI',
        'X-Config-Version': '1.0'
      };
      return config;
    });

    // Add config-specific response middleware
    this.addResponseMiddleware(async (response) => {
      // Validate config data structure
      if (response.config.url.includes('/api/config/') && response.data) {
        // Basic validation for config responses
        if (typeof response.data !== 'object') {
          throw new Error('Invalid configuration format - expected object');
        }
      }
      return response;
    });

    // Add config-specific error middleware
    this.addErrorMiddleware(async (error) => {
      // Handle config-specific errors
      if (error.status === 404 && error.config.url.includes('/api/config/')) {
        error.message = 'Configuration not found';
      }
      return error;
    });
  }

  // Layout Configuration
  async fetchLayoutConfig() {
    try {
      const response = await this.getCached(
        '/api/config/layout',
        this.CACHE_KEYS.LAYOUT_CONFIG,
        this.CACHE_TTL.LAYOUT_CONFIG
      );

      // Validate layout config structure
      if (!response.data || !response.data.sections || !Array.isArray(response.data.sections)) {
        throw new Error('Invalid layout configuration format');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching layout config:', error);
      throw new Error(`Failed to load layout configuration: ${error.message}`);
    }
  }

  async updateLayoutConfig(config) {
    try {
      // Validate config structure
      if (!config || !config.sections || !Array.isArray(config.sections)) {
        throw new Error('Invalid layout configuration format');
      }

      const response = await this.put('/api/config/layout', config);

      // Invalidate cache
      this.clearConfigCache(this.CACHE_KEYS.LAYOUT_CONFIG);

      return response.data;
    } catch (error) {
      console.error('Error updating layout config:', error);
      throw new Error(`Failed to update layout configuration: ${error.message}`);
    }
  }

  // Contact Fields Configuration
  async fetchContactFieldsConfig() {
    try {
      const response = await this.getCached(
        '/api/config/contactFields',
        this.CACHE_KEYS.CONTACT_FIELDS,
        this.CACHE_TTL.CONTACT_FIELDS
      );

      // Validate contact fields structure
      if (!response.data || !Array.isArray(response.data.folders)) {
        throw new Error('Invalid contact fields configuration format');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching contact fields config:', error);
      throw new Error(`Failed to load contact fields configuration: ${error.message}`);
    }
  }

  async updateContactFieldsConfig(config) {
    try {
      // Validate config structure
      if (!config || !Array.isArray(config.folders)) {
        throw new Error('Invalid contact fields configuration format');
      }

      const response = await this.put('/api/config/contactFields', config);

      // Invalidate cache
      this.clearConfigCache(this.CACHE_KEYS.CONTACT_FIELDS);

      return response.data;
    } catch (error) {
      console.error('Error updating contact fields config:', error);
      throw new Error(`Failed to update contact fields configuration: ${error.message}`);
    }
  }

  // Validation Rules
  async fetchValidationRules() {
    try {
      const response = await this.getCached(
        '/api/config/validationRules',
        this.CACHE_KEYS.VALIDATION_RULES,
        this.CACHE_TTL.VALIDATION_RULES
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching validation rules:', error);
      throw new Error(`Failed to load validation rules: ${error.message}`);
    }
  }

  async updateValidationRules(rules) {
    try {
      const response = await this.put('/api/config/validationRules', rules);

      // Invalidate cache
      this.clearConfigCache(this.CACHE_KEYS.VALIDATION_RULES);

      return response.data;
    } catch (error) {
      console.error('Error updating validation rules:', error);
      throw new Error(`Failed to update validation rules: ${error.message}`);
    }
  }

  // UI Configuration
  async fetchUIConfig() {
    try {
      const response = await this.getCached(
        '/api/config/ui',
        this.CACHE_KEYS.UI_CONFIG,
        this.CACHE_TTL.UI_CONFIG
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching UI config:', error);
      throw new Error(`Failed to load UI configuration: ${error.message}`);
    }
  }

  async updateUIConfig(config) {
    try {
      const response = await this.put('/api/config/ui', config);

      // Invalidate cache
      this.clearConfigCache(this.CACHE_KEYS.UI_CONFIG);

      return response.data;
    } catch (error) {
      console.error('Error updating UI config:', error);
      throw new Error(`Failed to update UI configuration: ${error.message}`);
    }
  }

  // Theme Configuration
  async fetchThemeConfig() {
    try {
      const response = await this.getCached(
        '/api/config/theme',
        this.CACHE_KEYS.THEME_CONFIG,
        this.CACHE_TTL.THEME_CONFIG
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching theme config:', error);
      throw new Error(`Failed to load theme configuration: ${error.message}`);
    }
  }

  async updateThemeConfig(config) {
    try {
      const response = await this.put('/api/config/theme', config);

      // Invalidate cache
      this.clearConfigCache(this.CACHE_KEYS.THEME_CONFIG);

      return response.data;
    } catch (error) {
      console.error('Error updating theme config:', error);
      throw new Error(`Failed to update theme configuration: ${error.message}`);
    }
  }

  // Dynamic Field Management
  async addDynamicField(folder, config) {
    try {
      const response = await this.post('/api/config/dynamicFields', {
        folder,
        config
      });

      // Invalidate related caches
      this.clearConfigCache(this.CACHE_KEYS.CONTACT_FIELDS);

      return response.data;
    } catch (error) {
      console.error('Error adding dynamic field:', error);
      throw new Error(`Failed to add dynamic field: ${error.message}`);
    }
  }

  async updateDynamicField(id, config) {
    try {
      const response = await this.put(`/api/config/dynamicFields/${id}`, config);

      // Invalidate related caches
      this.clearConfigCache(this.CACHE_KEYS.CONTACT_FIELDS);

      return response.data;
    } catch (error) {
      console.error('Error updating dynamic field:', error);
      throw new Error(`Failed to update dynamic field: ${error.message}`);
    }
  }

  async removeDynamicField(id) {
    try {
      const response = await this.delete(`/api/config/dynamicFields/${id}`);

      // Invalidate related caches
      this.clearConfigCache(this.CACHE_KEYS.CONTACT_FIELDS);

      return response.data;
    } catch (error) {
      console.error('Error removing dynamic field:', error);
      throw new Error(`Failed to remove dynamic field: ${error.message}`);
    }
  }

  // Configuration Validation
  async validateConfiguration(config, type) {
    try {
      const response = await this.post('/api/config/validate', {
        config,
        type
      });

      return response.data;
    } catch (error) {
      console.error('Error validating configuration:', error);
      throw new Error(`Failed to validate configuration: ${error.message}`);
    }
  }

  // Configuration Backup/Restore
  async backupConfiguration() {
    try {
      const response = await this.get('/api/config/backup');
      return response.data;
    } catch (error) {
      console.error('Error backing up configuration:', error);
      throw new Error(`Failed to backup configuration: ${error.message}`);
    }
  }

  async restoreConfiguration(data) {
    try {
      const response = await this.post('/api/config/restore', data);

      // Invalidate all config caches
      this.clearAllConfigCache();

      return response.data;
    } catch (error) {
      console.error('Error restoring configuration:', error);
      throw new Error(`Failed to restore configuration: ${error.message}`);
    }
  }

  // Configuration Export/Import
  async exportConfiguration(format = 'json') {
    try {
      const response = await this.get(`/api/config/export?format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting configuration:', error);
      throw new Error(`Failed to export configuration: ${error.message}`);
    }
  }

  async importConfiguration(data, format = 'json') {
    try {
      const response = await this.post(`/api/config/import?format=${format}`, data);

      // Invalidate all config caches
      this.clearAllConfigCache();

      return response.data;
    } catch (error) {
      console.error('Error importing configuration:', error);
      throw new Error(`Failed to import configuration: ${error.message}`);
    }
  }

  // Configuration Schema
  async fetchConfigurationSchema() {
    try {
      const response = await this.getCached(
        '/api/config/schema',
        this.CACHE_KEYS.CONFIG_SCHEMA,
        this.CACHE_TTL.CONFIG_SCHEMA
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching configuration schema:', error);
      throw new Error(`Failed to load configuration schema: ${error.message}`);
    }
  }

  // Configuration Versions
  async getConfigurationVersions() {
    try {
      const response = await this.getCached(
        '/api/config/versions',
        this.CACHE_KEYS.CONFIG_VERSIONS,
        this.CACHE_TTL.CONFIG_VERSIONS
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching configuration versions:', error);
      throw new Error(`Failed to load configuration versions: ${error.message}`);
    }
  }

  async revertToVersion(id) {
    try {
      const response = await this.post(`/api/config/revert/${id}`);

      // Invalidate all config caches
      this.clearAllConfigCache();

      return response.data;
    } catch (error) {
      console.error('Error reverting to version:', error);
      throw new Error(`Failed to revert to version: ${error.message}`);
    }
  }

  // Cache Management
  clearConfigCache(cacheKey) {
    if (cacheKey) {
      this.clearCache(cacheKey);
    } else {
      this.clearCache();
    }
  }

  clearAllConfigCache() {
    Object.values(this.CACHE_KEYS).forEach(key => {
      this.clearCache(key);
    });
  }

  // Health Check
  async healthCheck() {
    try {
      await this.get('/api/health');
      return {
        status: 'healthy',
        service: 'ConfigApiService',
        timestamp: new Date().toISOString(),
        config: this.getStatus(),
        cacheKeys: Object.keys(this.CACHE_KEYS)
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'ConfigApiService',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
} 