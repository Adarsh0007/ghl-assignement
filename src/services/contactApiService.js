// Contact API Service - Extends BaseApiService for contact-specific operations
import { BaseApiService } from './baseApiService.js';

export class ContactApiService extends BaseApiService {
  constructor(config = {}) {
    super({
      baseURL: 'http://localhost:3001',
      timeout: 15000,
      retries: 2,
      retryDelay: 500,
      enableCache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      ...config
    });

    // Contact-specific cache keys
    this.CACHE_KEYS = {
      LAYOUT_CONFIG: 'layout_config',
      CONTACT_FIELDS: 'contact_fields',
      CONTACT_DATA: 'contact_data',
      CONTACT_BY_ID: 'contact_by_id'
    };

    // Contact-specific cache TTLs
    this.CACHE_TTL = {
      LAYOUT_CONFIG: 10 * 60 * 1000, // 10 minutes
      CONTACT_FIELDS: 10 * 60 * 1000, // 10 minutes
      CONTACT_DATA: 5 * 60 * 1000, // 5 minutes
      CONTACT_BY_ID: 2 * 60 * 1000 // 2 minutes
    };

    // Initialize contact-specific middlewares
    this.initializeContactMiddlewares();
  }

  // Initialize contact-specific middlewares
  initializeContactMiddlewares() {
    // Add contact-specific request middleware
    this.addRequestMiddleware(async (config) => {
      // Add contact-specific headers if needed
      config.headers = {
        ...config.headers,
        'X-Service': 'ContactAPI'
      };
      return config;
    });

    // Add contact-specific response middleware
    this.addResponseMiddleware(async (response) => {
      // Validate contact data structure
      if (response.config.url.includes('/api/data/contacts') && response.data) {
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid contact data format - expected array');
        }
      }
      return response;
    });

    // Add contact-specific error middleware
    this.addErrorMiddleware(async (error) => {
      // Handle contact-specific errors
      if (error.status === 404 && error.config.url.includes('/api/contacts/')) {
        error.message = 'Contact not found';
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

  // Contact Data Operations
  async fetchContactData() {
    try {
      const response = await this.getCached(
        '/api/data/contacts',
        this.CACHE_KEYS.CONTACT_DATA,
        this.CACHE_TTL.CONTACT_DATA
      );

      // Validate contact data structure
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid contact data format - expected array');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching contact data:', error);
      throw new Error(`Failed to load contact data: ${error.message}`);
    }
  }

  async getContactById(contactId) {
    try {
      const cacheKey = `${this.CACHE_KEYS.CONTACT_BY_ID}_${contactId}`;
      
      const response = await this.getCached(
        `/api/contacts/${contactId}`,
        cacheKey,
        this.CACHE_TTL.CONTACT_BY_ID
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${contactId}:`, error);
      throw new Error(`Failed to fetch contact: ${error.message}`);
    }
  }

  async getAllContacts() {
    try {
      return await this.fetchContactData();
    } catch (error) {
      console.error('Error fetching all contacts:', error);
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }
  }

  // Contact Save Operations
  async saveContact(contactId, contactData) {
    try {
      const response = await this.put(`/api/contacts/${contactId}`, contactData);

      // Invalidate related caches
      this.clearContactCache(contactId);
      this.clearContactCache('all');

      return response.data;
    } catch (error) {
      console.error('Error saving contact:', error);
      throw new Error(`Failed to save contact: ${error.message}`);
    }
  }

  async saveContactData(data) {
    try {
      // Validate data before saving
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid contact data provided');
      }

      // For bulk operations, update each contact individually
      if (Array.isArray(data)) {
        const results = [];
        for (const contact of data) {
          if (contact.id) {
            const result = await this.saveContact(contact.id, contact);
            results.push(result);
          }
        }
        return results;
      }

      return data;
    } catch (error) {
      console.error('Error saving contact data:', error);
      throw new Error(`Failed to save contact data: ${error.message}`);
    }
  }

  async updateContactField(contactId, fieldKey, fieldValue) {
    try {
      const updateData = { [fieldKey]: fieldValue };
      return await this.saveContact(contactId, updateData);
    } catch (error) {
      console.error('Error updating contact field:', error);
      throw new Error(`Failed to update contact field: ${error.message}`);
    }
  }

  // Contact Tags Operations
  async addContactTag(contactId, tag) {
    try {
      const contact = await this.getContactById(contactId);
      const tags = contact.tags || [];
      
      if (!tags.includes(tag)) {
        tags.push(tag);
        return await this.saveContact(contactId, { tags });
      }
      
      return contact;
    } catch (error) {
      console.error('Error adding contact tag:', error);
      throw new Error(`Failed to add contact tag: ${error.message}`);
    }
  }

  async removeContactTag(contactId, tag) {
    try {
      const contact = await this.getContactById(contactId);
      const tags = contact.tags || [];
      
      const updatedTags = tags.filter(t => t !== tag);
      return await this.saveContact(contactId, { tags: updatedTags });
    } catch (error) {
      console.error('Error removing contact tag:', error);
      throw new Error(`Failed to remove contact tag: ${error.message}`);
    }
  }

  // Contact Owner/Followers Operations
  async updateContactOwner(contactId, owner) {
    try {
      return await this.saveContact(contactId, { owner });
    } catch (error) {
      console.error('Error updating contact owner:', error);
      throw new Error(`Failed to update contact owner: ${error.message}`);
    }
  }

  async updateContactFollowers(contactId, followers) {
    try {
      return await this.saveContact(contactId, { followers });
    } catch (error) {
      console.error('Error updating contact followers:', error);
      throw new Error(`Failed to update contact followers: ${error.message}`);
    }
  }

  // Call Operations
  async makeCall(phoneNumber) {
    try {
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        throw new Error('Invalid phone number provided');
      }
      
      // Simulate call operation
      await this.delay(1000);
      console.log(`Calling ${phoneNumber}...`);
      
      return { success: true, message: `Call initiated to ${phoneNumber}` };
    } catch (error) {
      console.error('Error making call:', error);
      throw new Error(`Failed to initiate call: ${error.message}`);
    }
  }

  // Search Operations
  async searchContacts(query, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (Object.keys(filters).length > 0) {
        params.append('filters', JSON.stringify(filters));
      }

      const url = `/api/contacts/search${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await this.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw new Error(`Failed to search contacts: ${error.message}`);
    }
  }

  // Bulk Operations
  async bulkUpdateContacts(updates) {
    try {
      const results = [];
      for (const update of updates) {
        const { contactId, ...updateData } = update;
        const result = await this.saveContact(contactId, updateData);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Error bulk updating contacts:', error);
      throw new Error(`Failed to bulk update contacts: ${error.message}`);
    }
  }

  // Export/Import Operations
  async exportContacts(format = 'json') {
    try {
      const contacts = await this.fetchContactData();
      
      if (format === 'json') {
        return JSON.stringify(contacts, null, 2);
      }
      
      // Add other format support (CSV, XML, etc.) as needed
      throw new Error(`Export format '${format}' not supported`);
    } catch (error) {
      console.error('Error exporting contacts:', error);
      throw new Error(`Failed to export contacts: ${error.message}`);
    }
  }

  async importContacts(data, format = 'json') {
    try {
      let contacts;
      
      if (format === 'json') {
        contacts = typeof data === 'string' ? JSON.parse(data) : data;
      } else {
        throw new Error(`Import format '${format}' not supported`);
      }

      // Validate contacts structure
      if (!Array.isArray(contacts)) {
        throw new Error('Invalid contacts data format - expected array');
      }

      // Import each contact
      const results = [];
      for (const contact of contacts) {
        if (contact.id) {
          const result = await this.saveContact(contact.id, contact);
          results.push(result);
        } else {
          // Create new contact
          const result = await this.post('/api/contacts', contact);
          results.push(result.data);
        }
      }

      return results;
    } catch (error) {
      console.error('Error importing contacts:', error);
      throw new Error(`Failed to import contacts: ${error.message}`);
    }
  }

  // Cache Management
  clearContactCache(contactId) {
    if (contactId === 'all') {
      this.clearCache(this.CACHE_KEYS.CONTACT_DATA);
      this.clearCache(this.CACHE_KEYS.CONTACT_FIELDS);
    } else {
      this.clearCache(`${this.CACHE_KEYS.CONTACT_BY_ID}_${contactId}`);
    }
  }

  clearAllContactCache() {
    this.clearCache();
  }

  // Health Check
  async healthCheck() {
    try {
      await this.get('/api/health');
      return {
        status: 'healthy',
        service: 'ContactApiService',
        timestamp: new Date().toISOString(),
        config: this.getStatus(),
        cacheKeys: Object.keys(this.CACHE_KEYS)
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'ContactApiService',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
} 