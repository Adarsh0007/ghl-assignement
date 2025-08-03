// LocalStorage Service - Handles data storage and retrieval using browser localStorage
export class LocalStorageService {
  constructor() {
    this.STORAGE_KEYS = {
      LAYOUT_CONFIG: 'ghl_layout_config',
      CONTACT_FIELDS: 'ghl_contact_fields',
      CONTACT_DATA: 'ghl_contact_data',
      THEME_CONFIG: 'ghl_theme_config',
      UI_CONFIG: 'ghl_ui_config',
      VALIDATION_RULES: 'ghl_validation_rules',
      CACHE_TIMESTAMPS: 'ghl_cache_timestamps'
    };

    // Initialize default data if not exists (non-async initialization first)
    this.initializeDefaultDataSync();
    
    // Then try to load from JSON files
    this.initializeFromJsonFiles().catch(error => {
      console.error('Failed to initialize from JSON files:', error);
      // Don't throw here, let the app handle the error
    });
  }

  // Initialize default data synchronously (for immediate use)
  initializeDefaultDataSync() {
    
    // Theme Config
    if (!this.getData(this.STORAGE_KEYS.THEME_CONFIG)) {
      this.setData(this.STORAGE_KEYS.THEME_CONFIG, {
        mode: 'light',
        primaryColor: '#3B82F6',
        secondaryColor: '#6B7280',
        accentColor: '#10B981'
      });
    }

    // UI Config
    if (!this.getData(this.STORAGE_KEYS.UI_CONFIG)) {
      this.setData(this.STORAGE_KEYS.UI_CONFIG, {
        sidebarCollapsed: false,
        showNotifications: true,
        autoSave: true,
        language: 'en'
      });
    }

    // Validation Rules
    if (!this.getData(this.STORAGE_KEYS.VALIDATION_RULES)) {
      this.setData(this.STORAGE_KEYS.VALIDATION_RULES, {
        email: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          message: 'Please enter a valid email address'
        },
        phone: {
          pattern: '^\\+?[1-9]\\d{1,14}$',
          message: 'Please enter a valid phone number'
        },
        required: {
          message: 'This field is required'
        },
        minLength: {
          message: 'Minimum length is {min} characters'
        },
        maxLength: {
          message: 'Maximum length is {max} characters'
        }
      });
    }

  }

  // Initialize from JSON files asynchronously
  async initializeFromJsonFiles() {
    // Layout Config
    if (!this.getData(this.STORAGE_KEYS.LAYOUT_CONFIG)) {
      const layoutConfig = await this.fetchJsonFile('/config/layout.json');
      if (layoutConfig) {
        this.setData(this.STORAGE_KEYS.LAYOUT_CONFIG, layoutConfig);
      } else {
        throw new Error('Failed to load layout configuration from JSON file');
      }
    }

    // Contact Fields Config
    if (!this.getData(this.STORAGE_KEYS.CONTACT_FIELDS)) {
      const contactFieldsConfig = await this.fetchJsonFile('/config/contactFields.json');
      if (contactFieldsConfig) {
        this.setData(this.STORAGE_KEYS.CONTACT_FIELDS, contactFieldsConfig);
      } else {
        throw new Error('Failed to load contact fields configuration from JSON file');
      }
    }

    // Contact Data
    if (!this.getData(this.STORAGE_KEYS.CONTACT_DATA)) {
      const contactData = await this.fetchJsonFile('/data/contactData.json');
      if (contactData) {
        this.setData(this.STORAGE_KEYS.CONTACT_DATA, contactData);
      } else {
        throw new Error('Failed to load contact data from JSON file');
      }
    }
  }

  // Fetch JSON file data
  async fetchJsonFile(path) {
    try {
      console.log(`📁 Attempting to fetch: ${path}`);
      const response = await fetch(path);
      
      if (!response.ok) {
        console.error(`❌ Failed to fetch ${path}: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Successfully loaded: ${path}`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${path}:`, error.message);
      
      // Try alternative paths
      const alternativePaths = [
        path.replace('/config/', '/src/config/'),
        path.replace('/data/', '/src/data/'),
        path.replace('/config/', './config/'),
        path.replace('/data/', './data/')
      ];
      
      console.log(`🔄 Trying alternative paths for ${path}:`, alternativePaths);
      
      for (const altPath of alternativePaths) {
        try {
          console.log(`📁 Trying alternative path: ${altPath}`);
          const response = await fetch(altPath);
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Successfully loaded from alternative path: ${altPath}`, data);
            return data;
          } else {
            console.log(`❌ Alternative path failed: ${altPath} - ${response.status} ${response.statusText}`);
          }
        } catch (altError) {
          console.log(`❌ Alternative path error: ${altPath} - ${altError.message}`);
          // Continue to next alternative path
        }
      }
      
      console.error(`❌ All paths failed for: ${path}`);
      return null;
    }
  }

  // Generic data getter
  getData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  // Generic data setter
  setData(key, data) {
    try {
      console.log(`💾 Saving data to localStorage - Key: ${key}`, data);
      localStorage.setItem(key, JSON.stringify(data));
      this.updateTimestamp(key);
      console.log(`✅ Successfully saved data to localStorage - Key: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  // Update timestamp for cache management
  updateTimestamp(key) {
    const timestamps = this.getData(this.STORAGE_KEYS.CACHE_TIMESTAMPS) || {};
    timestamps[key] = Date.now();
    console.log(`⏰ Updating timestamp for key: ${key} - Time: ${new Date().toISOString()}`);
    localStorage.setItem(this.STORAGE_KEYS.CACHE_TIMESTAMPS, JSON.stringify(timestamps));
  }

  // Get timestamp for a key
  getTimestamp(key) {
    const timestamps = this.getData(this.STORAGE_KEYS.CACHE_TIMESTAMPS) || {};
    return timestamps[key] || 0;
  }

  // Check if data is expired
  isExpired(key, ttl = 5 * 60 * 1000) { // Default 5 minutes
    const timestamp = this.getTimestamp(key);
    return Date.now() - timestamp > ttl;
  }

  // Remove data
  removeData(key) {
    try {
      console.log(`🗑️ Removing data from localStorage - Key: ${key}`);
      localStorage.removeItem(key);
      const timestamps = this.getData(this.STORAGE_KEYS.CACHE_TIMESTAMPS) || {};
      delete timestamps[key];
      localStorage.setItem(this.STORAGE_KEYS.CACHE_TIMESTAMPS, JSON.stringify(timestamps));
      console.log(`✅ Successfully removed data from localStorage - Key: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  // Clear all data
  clearAllData() {
    try {
      console.log('🧹 Clearing all localStorage data...');
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed data for key: ${key}`);
      });
      console.log('✅ All localStorage data cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
      return false;
    }
  }

  // Force reload from JSON files
  async forceReloadFromJson() {
    this.clearAllData();
    await this.initializeFromJsonFiles();
  }

  // Get storage usage statistics
  getStorageStats() {
    try {
      const totalSize = new Blob([JSON.stringify(localStorage)]).size;
      const usedSize = Object.keys(localStorage).reduce((size, key) => {
        return size + new Blob([localStorage.getItem(key)]).size;
      }, 0);
      
      return {
        totalSize,
        usedSize,
        availableSize: 5 * 1024 * 1024 - usedSize, // 5MB limit
        usagePercentage: (usedSize / (5 * 1024 * 1024)) * 100
      };
    } catch (error) {
      console.error('Error calculating storage stats:', error);
      return null;
    }
  }

  // Export all data
  exportAllData() {
    try {
      const exportData = {};
      Object.entries(this.STORAGE_KEYS).forEach(([key, storageKey]) => {
        exportData[key] = this.getData(storageKey);
      });
      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  // Import all data
  importAllData(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (this.STORAGE_KEYS[key]) {
          this.setData(this.STORAGE_KEYS[key], value);
        }
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Backup data
  backupData() {
    const data = this.exportAllData();
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data
    };
    
    // Create downloadable backup file
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghl-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return backup;
  }

  // Restore data from backup
  restoreData(backupData) {
    try {
      if (backupData.data) {
        return this.importAllData(backupData.data);
      }
      return false;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  // Check if all required data is loaded
  isDataLoaded() {
    const layoutConfig = this.getData(this.STORAGE_KEYS.LAYOUT_CONFIG);
    const contactFields = this.getData(this.STORAGE_KEYS.CONTACT_FIELDS);
    const contactData = this.getData(this.STORAGE_KEYS.CONTACT_DATA);
    
    return !!(layoutConfig && contactFields && contactData);
  }

  // Get loading status for each data type
  getLoadingStatus() {
    return {
      layoutConfig: !!this.getData(this.STORAGE_KEYS.LAYOUT_CONFIG),
      contactFields: !!this.getData(this.STORAGE_KEYS.CONTACT_FIELDS),
      contactData: !!this.getData(this.STORAGE_KEYS.CONTACT_DATA),
      themeConfig: !!this.getData(this.STORAGE_KEYS.THEME_CONFIG),
      uiConfig: !!this.getData(this.STORAGE_KEYS.UI_CONFIG),
      validationRules: !!this.getData(this.STORAGE_KEYS.VALIDATION_RULES)
    };
  }

  // Ensure data is loaded (wait for async initialization if needed)
  async ensureDataLoaded() {
    const maxRetries = 10;
    const retryDelay = 500; // 500ms
    
    for (let i = 0; i < maxRetries; i++) {
      if (this.isDataLoaded()) {
        return true;
      }
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    
    // If we get here, data is still not loaded
    return false;
  }

  // Initialize data with retry mechanism
  async initializeData() {
    try {
      // First try to load from JSON files
      await this.initializeFromJsonFiles();
      return true;
    } catch (error) {
      console.error('Failed to initialize from JSON files:', error);
      return false;
    }
  }
}

// Create singleton instance
export const localStorageService = new LocalStorageService(); 