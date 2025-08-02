// Main API Service - Uses specialized services that extend BaseApiService
import { ContactApiService } from './contactApiService.js';
import { ConfigApiService } from './configApiService.js';

// Create service instances
const contactService = new ContactApiService();
const configService = new ConfigApiService();

// Main API Service facade
export class ApiService {
  // Cache keys (for backward compatibility)
  static get CACHE_KEYS() {
    return contactService.CACHE_KEYS;
  }
  
  static get CACHE_TTL() {
    return contactService.CACHE_TTL;
  }

  // Layout Configuration
  static async fetchLayoutConfig() {
    return contactService.fetchLayoutConfig();
  }

  // Contact Fields Configuration
  static async fetchContactFieldsConfig() {
    return contactService.fetchContactFieldsConfig();
  }

  // Contact Data Operations
  static async fetchContactData() {
    return contactService.fetchContactData();
  }

  static async getContactById(contactId) {
    return contactService.getContactById(contactId);
  }

  static async getAllContacts() {
    return contactService.getAllContacts();
  }

  // Contact Save Operations
  static async saveContact(contactId, contactData) {
    return contactService.saveContact(contactId, contactData);
  }

  static async saveContactData(data) {
    return contactService.saveContactData(data);
  }

  // Contact Field Operations
  static async updateContactField(contactId, fieldKey, fieldValue) {
    return contactService.updateContactField(contactId, fieldKey, fieldValue);
  }

  // Contact Tags Operations
  static async addContactTag(contactId, tag) {
    return contactService.addContactTag(contactId, tag);
  }

  static async removeContactTag(contactId, tag) {
    return contactService.removeContactTag(contactId, tag);
  }

  // Contact Owner/Followers Operations
  static async updateContactOwner(contactId, owner) {
    return contactService.updateContactOwner(contactId, owner);
  }

  static async updateContactFollowers(contactId, followers) {
    return contactService.updateContactFollowers(contactId, followers);
  }

  // Call Operations
  static async makeCall(phoneNumber) {
    return contactService.makeCall(phoneNumber);
  }

  // Search Operations
  static async searchContacts(query, filters = {}) {
    return contactService.searchContacts(query, filters);
  }

  // Bulk Operations
  static async bulkUpdateContacts(updates) {
    return contactService.bulkUpdateContacts(updates);
  }

  // Export/Import Operations
  static async exportContacts(format = 'json') {
    return contactService.exportContacts(format);
  }

  static async importContacts(data, format = 'json') {
    return contactService.importContacts(data, format);
  }

  // Config Operations
  static async updateLayoutConfig(config) {
    return configService.updateLayoutConfig(config);
  }

  static async updateContactFieldsConfig(config) {
    return configService.updateContactFieldsConfig(config);
  }

  static async fetchValidationRules() {
    return configService.fetchValidationRules();
  }

  static async updateValidationRules(rules) {
    return configService.updateValidationRules(rules);
  }

  static async fetchUIConfig() {
    return configService.fetchUIConfig();
  }

  static async updateUIConfig(config) {
    return configService.updateUIConfig(config);
  }

  static async fetchThemeConfig() {
    return configService.fetchThemeConfig();
  }

  static async updateThemeConfig(config) {
    return configService.updateThemeConfig(config);
  }

  static async addDynamicField(folder, config) {
    return configService.addDynamicField(folder, config);
  }

  static async updateDynamicField(id, config) {
    return configService.updateDynamicField(id, config);
  }

  static async removeDynamicField(id) {
    return configService.removeDynamicField(id);
  }

  static async validateConfiguration(config, type) {
    return configService.validateConfiguration(config, type);
  }

  static async backupConfiguration() {
    return configService.backupConfiguration();
  }

  static async restoreConfiguration(data) {
    return configService.restoreConfiguration(data);
  }

  static async exportConfiguration(format = 'json') {
    return configService.exportConfiguration(format);
  }

  static async importConfiguration(data, format = 'json') {
    return configService.importConfiguration(data, format);
  }

  static async fetchConfigurationSchema() {
    return configService.fetchConfigurationSchema();
  }

  static async getConfigurationVersions() {
    return configService.getConfigurationVersions();
  }

  static async revertToVersion(id) {
    return configService.revertToVersion(id);
  }

  // Health Check
  static async healthCheck() {
    const [contactHealth, configHealth] = await Promise.all([
      contactService.healthCheck(),
      configService.healthCheck()
    ]);

    return {
      status: contactHealth.status === 'healthy' && configHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      services: {
        contact: contactHealth,
        config: configHealth
      },
      timestamp: new Date().toISOString()
    };
  }

  // Cache Management (for backward compatibility)
  static clearCache() {
    contactService.clearAllContactCache();
    configService.clearAllConfigCache();
  }

  static getCacheStats() {
    return {
      contact: contactService.getStatus(),
      config: configService.getStatus()
    };
  }

  // Direct access to the underlying services for advanced usage
  static get contactService() {
    return contactService;
  }

  static get configService() {
    return configService;
  }

  // Service factory for creating new instances
  static createContactService(config = {}) {
    return new ContactApiService(config);
  }

  static createConfigService(config = {}) {
    return new ConfigApiService(config);
  }
} 