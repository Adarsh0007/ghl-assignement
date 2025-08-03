// Main API Service - Uses localStorage-based service instead of server API calls
import { LocalApiService } from './localApiService.js';

// Create local API service instance
const localApiService = new LocalApiService();

// Main API Service facade
export class ApiService {
  // Layout Configuration
  static async fetchLayoutConfig() {
    return localApiService.fetchLayoutConfig();
  }

  // Contact Fields Configuration
  static async fetchContactFieldsConfig() {
    return localApiService.fetchContactFieldsConfig();
  }

  // Contact Data Operations
  static async fetchContactData() {
    return localApiService.fetchContactData();
  }

  // Contact Save Operations
  static async saveContact(contactId, contactData) {
    return localApiService.saveContact(contactId, contactData);
  }

  // Call Operations
  static async makeCall(phoneNumber) {
    return localApiService.makeCall(phoneNumber);
  }
} 