// Conversation and Notes Service for loading and managing data from JSON files
export class ConversationService {
  // Cache for loaded data
  static conversationsCache = null;
  static notesCache = null;
  static NOTES_STORAGE_KEY = 'notes_data';

  // Load conversations data from JSON file
  static async loadConversationsData() {
    if (this.conversationsCache) {
      return this.conversationsCache;
    }

    try {
      console.log('📂 Loading conversations data from JSON file...');
      const response = await fetch('/data/conversations.json');
      if (!response.ok) {
        throw new Error(`Failed to load conversations data: ${response.status}`);
      }
      const data = await response.json();
      this.conversationsCache = data;
      console.log('✅ Conversations data loaded successfully');
      return data;
    } catch (error) {
      console.error('❌ Error loading conversations data:', error);
      return {};
    }
  }

  // Load notes data from localStorage or JSON file
  static async loadNotesData() {
    // Try localStorage first
    const local = localStorage.getItem(this.NOTES_STORAGE_KEY);
    if (local) {
      try {
        const data = JSON.parse(local);
        this.notesCache = data;
        return data;
      } catch (e) {
        console.error('❌ Error parsing notes from localStorage:', e);
      }
    }
    // Fallback to JSON file
    if (this.notesCache) return this.notesCache;
    try {
      const response = await fetch('/data/notes.json');
      if (!response.ok) throw new Error(`Failed to load notes data: ${response.status}`);
      const data = await response.json();
      this.notesCache = data;
      // Save to localStorage for next time
      localStorage.setItem(this.NOTES_STORAGE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('❌ Error loading notes data:', error);
      return {};
    }
  }

  // Save notes data to localStorage
  static saveNotesToLocalStorage(data) {
    console.log('💾 Saving notes data to localStorage:', data);
    this.notesCache = data;
    localStorage.setItem(this.NOTES_STORAGE_KEY, JSON.stringify(data));
    console.log('✅ Notes data saved to localStorage successfully');
  }

  // Get conversations for a specific contact
  static async getConversations(contactId, contactName, contactData) {
    console.log('🔄 Loading conversations for contact:', contactId, contactName);
    const conversationsData = await this.loadConversationsData();
    const conversations = conversationsData[contactId] || [];
    console.log('✅ Loaded conversations:', conversations.length, 'conversations');
    return conversations;
  }

  // Get notes for a specific contact
  static async getNotes(contactId, contactName, contactData) {
    console.log('🔄 Getting notes for contact:', contactId, contactName);
    const notesData = await this.loadNotesData();
    const notes = notesData[contactId] || [];
    console.log('✅ Retrieved notes for contact:', contactId, 'Count:', notes.length);
    return notes.map(note => ({
      ...note,
      timestamp: new Date(note.timestamp)
    }));
  }

  // Add a new note
  static async addNote(contactId, noteData) {
    console.log('🔄 Adding new note for contact:', contactId, noteData);
    
    try {
      const notesData = await this.loadNotesData();
      const contactNotes = notesData[contactId] || [];
      
      const newNote = {
        id: Date.now(),
        content: noteData.content,
        timestamp: new Date().toISOString(),
        author: noteData.author || "Current User",
        conversationId: noteData.conversationId || null
      };
      
      contactNotes.unshift(newNote);
      notesData[contactId] = contactNotes;
      
      // Update cache
      this.saveNotesToLocalStorage(notesData);
      
      // In a real app, this would save to backend
      console.log('✅ Note added successfully to localStorage');
      return { success: true, data: newNote };
    } catch (error) {
      console.error('❌ Error adding note:', error);
      return { success: false, error: error.message };
    }
  }

  // Update an existing note
  static async updateNote(contactId, noteId, updatedContent) {
    console.log('🔄 Updating note for contact:', contactId, 'note:', noteId, 'content:', updatedContent);
    
    try {
      const notesData = await this.loadNotesData();
      const contactNotes = notesData[contactId] || [];
      
      const noteIndex = contactNotes.findIndex(note => note.id === noteId);
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }
      
      contactNotes[noteIndex] = {
        ...contactNotes[noteIndex],
        content: updatedContent,
        timestamp: new Date().toISOString()
      };
      
      notesData[contactId] = contactNotes;
      
      // Update cache
      this.saveNotesToLocalStorage(notesData);
      
      // In a real app, this would save to backend
      console.log('✅ Note updated successfully in localStorage');
      return { success: true, data: contactNotes[noteIndex] };
    } catch (error) {
      console.error('❌ Error updating note:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a note
  static async deleteNote(contactId, noteId) {
    console.log('🔄 Deleting note for contact:', contactId, 'note:', noteId);
    
    try {
      const notesData = await this.loadNotesData();
      const contactNotes = notesData[contactId] || [];
      
      const filteredNotes = contactNotes.filter(note => note.id !== noteId);
      notesData[contactId] = filteredNotes;
      
      // Update cache
      this.saveNotesToLocalStorage(notesData);
      
      // In a real app, this would save to backend
      console.log('✅ Note deleted successfully from localStorage');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting note:', error);
      return { success: false, error: error.message };
    }
  }

  // Get notes for a specific conversation
  static async getNotesForConversation(contactId, conversationId) {
    console.log('🔄 Loading notes for conversation:', conversationId, 'contact:', contactId);
    const notesData = await this.loadNotesData();
    const contactNotes = notesData[contactId] || [];
    const conversationNotes = contactNotes.filter(note => note.conversationId === conversationId);
    console.log('✅ Loaded conversation notes:', conversationNotes.length, 'notes');
    return conversationNotes.map(note => ({
      ...note,
      timestamp: new Date(note.timestamp)
    }));
  }

  // Clear cache (useful for testing or when data changes)
  static clearCache() {
    this.conversationsCache = null;
    this.notesCache = null;
    console.log('🧹 Cache cleared');
  }

  // Legacy methods for backward compatibility (now use JSON data)
  static generateConversations(contactId, contactName) {
    console.warn('⚠️ generateConversations is deprecated. Use getConversations instead.');
    return [];
  }

  static generateNotes(contactId, contactName, contactData) {
    console.warn('⚠️ generateNotes is deprecated. Use getNotes instead.');
    return [];
  }

  // Utility methods
  static getRandomVehicle() {
    const vehicles = [
      "Toyota Camry",
      "Honda Accord", 
      "Ford Mustang",
      "BMW 3 Series",
      "Mercedes C-Class",
      "Audi A4",
      "Tesla Model 3",
      "Hyundai Sonata",
      "Kia K5",
      "Chevrolet Malibu"
    ];
    return vehicles[Math.floor(Math.random() * vehicles.length)];
  }

  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Save conversation data (for future persistence)
  static async saveConversation(contactId, conversationData) {
    // In a real app, this would save to API/database
    console.log('💾 Saving conversation data for contact:', contactId, conversationData);
    return { success: true, data: conversationData };
  }

  // Save notes data (for future persistence)
  static async saveNotes(contactId, notesData) {
    // In a real app, this would save to API/database
    console.log('💾 Saving notes data for contact:', contactId, notesData);
    return { success: true, data: notesData };
  }
} 