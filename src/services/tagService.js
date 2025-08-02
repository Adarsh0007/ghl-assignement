// Tag service for managing contact tags with localStorage persistence
const STORAGE_KEY = 'contact_tags';

export class TagService {
  // Get tags from localStorage
  static getTags() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading tags from localStorage:', error);
      return [];
    }
  }

  // Save tags to localStorage
  static saveTags(tags) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
    }
  }

  // Add a new tag
  static addTag(tag) {
    const tags = this.getTags();
    const trimmedTag = tag.trim();
    
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      this.saveTags(newTags);
      return newTags;
    }
    
    return tags;
  }

  // Remove a tag
  static removeTag(tagToRemove) {
    const tags = this.getTags();
    const newTags = tags.filter(tag => tag !== tagToRemove);
    this.saveTags(newTags);
    return newTags;
  }

  // Get all available tags (for suggestions)
  static getAllTags() {
    return this.getTags();
  }

  // Check if a tag exists
  static hasTag(tag) {
    const tags = this.getTags();
    return tags.includes(tag);
  }

  // Initialize with default tags if none exist
  static initializeDefaultTags() {
    const tags = this.getTags();
    if (tags.length === 0) {
      const defaultTags = ['Shared Contact', 'VIP', 'Important', 'Follow Up', 'Lead'];
      this.saveTags(defaultTags);
      return defaultTags;
    }
    return tags;
  }
} 