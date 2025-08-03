// Local API Service - Replaces server API calls with localStorage operations
import { localStorageService } from './localStorageService.js';

export class LocalApiService {
  constructor() {
    this.storage = localStorageService;
  }

  // Simulate async operations for compatibility
  async delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Layout Configuration
  async fetchLayoutConfig() {
    await this.delay();
    const config = this.storage.getData(this.storage.STORAGE_KEYS.LAYOUT_CONFIG);
    if (!config) {
      throw new Error('Layout configuration not found');
    }
    return config;
  }

  async updateLayoutConfig(config) {
    await this.delay();
    const success = this.storage.setData(this.storage.STORAGE_KEYS.LAYOUT_CONFIG, config);
    if (!success) {
      throw new Error('Failed to update layout configuration');
    }
    return { success: true, data: config };
  }

  // Contact Fields Configuration
  async fetchContactFieldsConfig() {
    await this.delay();
    const config = this.storage.getData(this.storage.STORAGE_KEYS.CONTACT_FIELDS);
    if (!config) {
      throw new Error('Contact fields configuration not found');
    }
    return config;
  }

  async updateContactFieldsConfig(config) {
    await this.delay();
    const success = this.storage.setData(this.storage.STORAGE_KEYS.CONTACT_FIELDS, config);
    if (!success) {
      throw new Error('Failed to update contact fields configuration');
    }
    return { success: true, data: config };
  }

  // Contact Data Operations
  async fetchContactData() {
    await this.delay();
    const contacts = this.storage.getData(this.storage.STORAGE_KEYS.CONTACT_DATA);
    if (!contacts) {
      throw new Error('Contact data not found');
    }
    return contacts;
  }

  async getContactById(contactId) {
    await this.delay();
    const contacts = await this.fetchContactData();
    const contact = contacts.find(c => c.id === parseInt(contactId));
    if (!contact) {
      throw new Error(`Contact with ID ${contactId} not found`);
    }
    return contact;
  }

  async getAllContacts() {
    return this.fetchContactData();
  }

  // Contact Save Operations
  async saveContact(contactId, contactData) {
    await this.delay();
    console.log(`💾 Saving contact data - Contact ID: ${contactId}`, contactData);
    
    const contacts = await this.fetchContactData();
    const index = contacts.findIndex(c => c.id === parseInt(contactId));
    
    if (index === -1) {
      throw new Error(`Contact with ID ${contactId} not found`);
    }

    // Update contact data
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      updatedAt: new Date().toISOString()
    };

    contacts[index] = updatedContact;
    
    const success = this.storage.setData(this.storage.STORAGE_KEYS.CONTACT_DATA, contacts);
    if (!success) {
      throw new Error('Failed to save contact');
    }

    console.log(`✅ Successfully saved contact data - Contact ID: ${contactId}`);
    return { success: true, data: updatedContact };
  }

  async saveContactData(data) {
    await this.delay();
    console.log(`💾 Saving contact data array - Count: ${data.length}`, data);
    const success = this.storage.setData(this.storage.STORAGE_KEYS.CONTACT_DATA, data);
    if (!success) {
      throw new Error('Failed to save contact data');
    }
    console.log(`✅ Successfully saved contact data array - Count: ${data.length}`);
    return { success: true, data };
  }

  // Contact Field Operations
  async updateContactField(contactId, fieldKey, fieldValue) {
    return this.saveContact(contactId, { [fieldKey]: fieldValue });
  }

  // Contact Tags Operations
  async addContactTag(contactId, tag) {
    const contact = await this.getContactById(contactId);
    const tags = contact.tags || [];
    
    if (!tags.includes(tag)) {
      tags.push(tag);
      return this.saveContact(contactId, { tags });
    }
    
    return { success: true, data: contact };
  }

  async removeContactTag(contactId, tag) {
    const contact = await this.getContactById(contactId);
    const tags = contact.tags || [];
    const updatedTags = tags.filter(t => t !== tag);
    
    return this.saveContact(contactId, { tags: updatedTags });
  }

  // Contact Owner/Followers Operations
  async updateContactOwner(contactId, owner) {
    return this.saveContact(contactId, { owner });
  }

  async updateContactFollowers(contactId, followers) {
    return this.saveContact(contactId, { followers });
  }

  // Call Operations (simulated)
  async makeCall(phoneNumber) {
    await this.delay();
    console.log(`Simulated call to: ${phoneNumber}`);
    return { success: true, message: `Call initiated to ${phoneNumber}` };
  }

  // Search Operations
  async searchContacts(query, filters = {}) {
    await this.delay();
    const contacts = await this.fetchContactData();
    
    if (!query && Object.keys(filters).length === 0) {
      return contacts;
    }

    return contacts.filter(contact => {
      // Text search
      if (query) {
        const searchText = query.toLowerCase();
        const searchableFields = [
          contact.firstName,
          contact.lastName,
          contact.email,
          contact.company,
          contact.jobTitle,
          contact.notes
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableFields.includes(searchText)) {
          return false;
        }
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        const contactTags = contact.tags || [];
        if (!filters.tags.some(tag => contactTags.includes(tag))) {
          return false;
        }
      }

      // Filter by owner
      if (filters.owner && contact.owner !== filters.owner) {
        return false;
      }

      // Filter by company
      if (filters.company && contact.company !== filters.company) {
        return false;
      }

      return true;
    });
  }

  // Bulk Operations
  async bulkUpdateContacts(updates) {
    await this.delay();
    const contacts = await this.fetchContactData();
    
    for (const update of updates) {
      const index = contacts.findIndex(c => c.id === update.contactId);
      if (index !== -1) {
        contacts[index] = {
          ...contacts[index],
          ...update.data,
          updatedAt: new Date().toISOString()
        };
      }
    }
    
    const success = this.storage.setData(this.storage.STORAGE_KEYS.CONTACT_DATA, contacts);
    if (!success) {
      throw new Error('Failed to bulk update contacts');
    }
    
    return { success: true, updatedCount: updates.length };
  }

  // Export/Import Operations
  async exportContacts(format = 'json') {
    await this.delay();
    const contacts = await this.fetchContactData();
    
    if (format === 'json') {
      return contacts;
    } else if (format === 'csv') {
      // Convert to CSV format
      const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Job Title', 'Owner', 'Tags'];
      const csvData = contacts.map(contact => [
        contact.id,
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.phone,
        contact.company,
        contact.jobTitle,
        contact.owner,
        (contact.tags || []).join(', ')
      ]);
      
      const csv = [headers, ...csvData]
        .map(row => row.map(field => `"${field || ''}"`).join(','))
        .join('\n');
      
      return csv;
    }
    
    throw new Error(`Unsupported export format: ${format}`);
  }

  async importContacts(data, format = 'json') {
    await this.delay();
    
    let contacts;
    if (format === 'json') {
      contacts = Array.isArray(data) ? data : [data];
    } else if (format === 'csv') {
      // Parse CSV format
      const lines = data.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      contacts = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        const contact = {};
        headers.forEach((header, index) => {
          contact[header.toLowerCase().replace(/\s+/g, '')] = values[index];
        });
        return contact;
      });
    } else {
      throw new Error(`Unsupported import format: ${format}`);
    }

    // Validate and process contacts
    const processedContacts = contacts.map((contact, index) => ({
      id: contact.id || Date.now() + index,
      firstName: contact.firstname || contact.firstName || '',
      lastName: contact.lastname || contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      jobTitle: contact.jobtitle || contact.jobTitle || '',
      address: contact.address || '',
      notes: contact.notes || '',
      owner: contact.owner || '',
      followers: contact.followers ? contact.followers.split(',').map(f => f.trim()) : [],
      tags: contact.tags ? contact.tags.split(',').map(t => t.trim()) : [],
      createdAt: contact.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const success = this.storage.setData(this.storage.STORAGE_KEYS.CONTACT_DATA, processedContacts);
    if (!success) {
      throw new Error('Failed to import contacts');
    }

    return { success: true, importedCount: processedContacts.length };
  }

  // Configuration Operations
  async fetchValidationRules() {
    await this.delay();
    const rules = this.storage.getData(this.storage.STORAGE_KEYS.VALIDATION_RULES);
    if (!rules) {
      throw new Error('Validation rules not found');
    }
    return rules;
  }

  async updateValidationRules(rules) {
    await this.delay();
    const success = this.storage.setData(this.storage.STORAGE_KEYS.VALIDATION_RULES, rules);
    if (!success) {
      throw new Error('Failed to update validation rules');
    }
    return { success: true, data: rules };
  }

  async fetchUIConfig() {
    await this.delay();
    const config = this.storage.getData(this.storage.STORAGE_KEYS.UI_CONFIG);
    if (!config) {
      throw new Error('UI configuration not found');
    }
    return config;
  }

  async updateUIConfig(config) {
    await this.delay();
    const success = this.storage.setData(this.storage.STORAGE_KEYS.UI_CONFIG, config);
    if (!success) {
      throw new Error('Failed to update UI configuration');
    }
    return { success: true, data: config };
  }

  async fetchThemeConfig() {
    await this.delay();
    const config = this.storage.getData(this.storage.STORAGE_KEYS.THEME_CONFIG);
    if (!config) {
      throw new Error('Theme configuration not found');
    }
    return config;
  }

  async updateThemeConfig(config) {
    await this.delay();
    const success = this.storage.setData(this.storage.STORAGE_KEYS.THEME_CONFIG, config);
    if (!success) {
      throw new Error('Failed to update theme configuration');
    }
    return { success: true, data: config };
  }

  // Dynamic Field Operations
  async addDynamicField(folder, config) {
    const fieldsConfig = await this.fetchContactFieldsConfig();
    const folderIndex = fieldsConfig.folders.findIndex(f => f.name === folder);
    
    if (folderIndex === -1) {
      throw new Error(`Folder '${folder}' not found`);
    }

    fieldsConfig.folders[folderIndex].fields.push(config);
    
    return this.updateContactFieldsConfig(fieldsConfig);
  }

  async updateDynamicField(id, config) {
    const fieldsConfig = await this.fetchContactFieldsConfig();
    
    for (const folder of fieldsConfig.folders) {
      const fieldIndex = folder.fields.findIndex(f => f.key === id);
      if (fieldIndex !== -1) {
        folder.fields[fieldIndex] = { ...folder.fields[fieldIndex], ...config };
        return this.updateContactFieldsConfig(fieldsConfig);
      }
    }
    
    throw new Error(`Field with key '${id}' not found`);
  }

  async removeDynamicField(id) {
    const fieldsConfig = await this.fetchContactFieldsConfig();
    
    for (const folder of fieldsConfig.folders) {
      const fieldIndex = folder.fields.findIndex(f => f.key === id);
      if (fieldIndex !== -1) {
        folder.fields.splice(fieldIndex, 1);
        return this.updateContactFieldsConfig(fieldsConfig);
      }
    }
    
    throw new Error(`Field with key '${id}' not found`);
  }

  // Configuration Validation
  async validateConfiguration(config, type) {
    await this.delay();
    
    // Basic validation based on type
    switch (type) {
      case 'layout':
        if (!config.sections || !Array.isArray(config.sections)) {
          throw new Error('Invalid layout configuration: sections array is required');
        }
        break;
      case 'fields':
        if (!config.folders || !Array.isArray(config.folders)) {
          throw new Error('Invalid fields configuration: folders array is required');
        }
        break;
      default:
        throw new Error(`Unknown configuration type: ${type}`);
    }
    
    return { success: true, valid: true };
  }

  // Backup and Restore
  async backupConfiguration() {
    await this.delay();
    return this.storage.backupData();
  }

  async restoreConfiguration(data) {
    await this.delay();
    const success = this.storage.restoreData(data);
    if (!success) {
      throw new Error('Failed to restore configuration');
    }
    return { success: true };
  }

  async exportConfiguration(format = 'json') {
    await this.delay();
    const data = this.storage.exportAllData();
    
    if (format === 'json') {
      return data;
    }
    
    throw new Error(`Unsupported export format: ${format}`);
  }

  async importConfiguration(data, format = 'json') {
    await this.delay();
    
    if (format === 'json') {
      const success = this.storage.importAllData(data);
      if (!success) {
        throw new Error('Failed to import configuration');
      }
      return { success: true };
    }
    
    throw new Error(`Unsupported import format: ${format}`);
  }
}