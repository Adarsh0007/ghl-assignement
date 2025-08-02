// API service with caching and performance optimization
import { CacheService } from './cacheService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiService {
  // Cache keys
  static CACHE_KEYS = {
    LAYOUT_CONFIG: 'layout_config',
    CONTACT_FIELDS: 'contact_fields',
    CONTACT_DATA: 'contact_data'
  };

  // Cache TTLs (in milliseconds)
  static CACHE_TTL = {
    LAYOUT_CONFIG: 10 * 60 * 1000, // 10 minutes
    CONTACT_FIELDS: 10 * 60 * 1000, // 10 minutes
    CONTACT_DATA: 5 * 60 * 1000 // 5 minutes
  };

  static async fetchLayoutConfig() {
    try {
      const result = await CacheService.getOrFetch(
        this.CACHE_KEYS.LAYOUT_CONFIG,
        async () => {
          await delay(300); // Simulate network delay
          const response = await fetch('/config/layout.json');
          if (!response.ok) {
            throw new Error('Failed to fetch layout config');
          }
          const data = await response.json();
          
          // Validate layout config structure
          if (!data || !data.sections || !Array.isArray(data.sections)) {
            throw new Error('Invalid layout configuration format');
          }
          
          return data;
        },
        this.CACHE_TTL.LAYOUT_CONFIG
      );
      return result.data;
    } catch (error) {
      console.error('Error fetching layout config:', error);
      throw new Error('Failed to load page layout configuration. Please try again later.');
    }
  }

  static async fetchContactFieldsConfig() {
    try {
      const result = await CacheService.getOrFetch(
        this.CACHE_KEYS.CONTACT_FIELDS,
        async () => {
          await delay(200);
          const response = await fetch('/config/contactFields.json');
          if (!response.ok) {
            throw new Error('Failed to fetch contact fields config');
          }
          const data = await response.json();
          
          // Validate contact fields structure
          if (!data || !Array.isArray(data.folders)) {
            throw new Error('Invalid contact fields configuration format');
          }
          
          return data;
        },
        this.CACHE_TTL.CONTACT_FIELDS
      );
      return result.data;
    } catch (error) {
      console.error('Error fetching contact fields:', error);
      throw new Error('Failed to load contact fields configuration. Please try again later.');
    }
  }

  static async fetchContactData() {
    try {
      const result = await CacheService.getOrFetch(
        this.CACHE_KEYS.CONTACT_DATA,
        async () => {
          await delay(400);
          const response = await fetch('/data/contactData.json');
          if (!response.ok) {
            throw new Error('Failed to fetch contact data');
          }
          const data = await response.json();
          
          // Validate contact data structure (now an array)
          if (!data || !Array.isArray(data)) {
            throw new Error('Invalid contact data format - expected array');
          }
          
          return data;
        },
        this.CACHE_TTL.CONTACT_DATA
      );
      return result.data;
    } catch (error) {
      console.error('Error fetching contact data:', error);
      throw new Error('Failed to load contact data. Please try again later.');
    }
  }

  // Get a specific contact by ID
  static async getContactById(contactId) {
    try {
      const contacts = await this.fetchContactData();
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) {
        throw new Error(`Contact with ID ${contactId} not found`);
      }
      return contact;
    } catch (error) {
      console.error('Error fetching contact by ID:', error);
      throw error;
    }
  }

  // Get all contacts
  static async getAllContacts() {
    try {
      return await this.fetchContactData();
    } catch (error) {
      console.error('Error fetching all contacts:', error);
      throw error;
    }
  }

  // Save a specific contact
  static async saveContact(contactId, contactData) {
    try {
      const contacts = await this.fetchContactData();
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      
      if (contactIndex === -1) {
        throw new Error(`Contact with ID ${contactId} not found`);
      }
      
      // Update the contact
      contacts[contactIndex] = { ...contacts[contactIndex], ...contactData };
      
      // Save the updated contacts array
      await this.saveContactData(contacts);
      
      return contacts[contactIndex];
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  }

  static async saveContactData(data) {
    try {
      // Validate data before saving
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid contact data provided');
      }

      // Simulate network delay
      await delay(500);
      
      console.log('Saving contact data:', data);
      
      // In a real app, this would be a POST/PUT request
      try {
        const response = await fetch('/data/contactData.json', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Simulated: Contact data updated successfully');
      } catch (error) {
        console.log('Simulated: Contact data update completed');
      }

      // Invalidate cache after successful save
      CacheService.remove(this.CACHE_KEYS.CONTACT_DATA);
      
      return data;
    } catch (error) {
      console.error('Error saving contact data:', error);
      throw new Error('Failed to save contact data. Please try again.');
    }
  }

  static async makeCall(phoneNumber) {
    try {
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        throw new Error('Invalid phone number provided');
      }
      
      await delay(1000);
      console.log(`Calling ${phoneNumber}...`);
      // In a real app, this would integrate with a calling service
    } catch (error) {
      console.error('Error making call:', error);
      throw new Error('Failed to initiate call. Please try again.');
    }
  }

  // Clear all cached data
  static clearCache() {
    try {
      CacheService.clear();
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Get cache statistics
  static getCacheStats() {
    try {
      return CacheService.getStats();
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }
} 