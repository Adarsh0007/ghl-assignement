export class FilterService {
  // Filter contacts based on various criteria
  static filterContacts(contacts, filters) {
    if (!contacts || !Array.isArray(contacts)) return [];
    if (!filters || Object.keys(filters).length === 0) return contacts;

    return contacts.filter(contact => {
      // All contacts pass through since we removed the filtering criteria
      return true;
    });
  }

  // Filter fields based on various criteria
  static filterFields(fields, filters, contactData = {}) {
    if (!fields || !Array.isArray(fields)) return [];
    if (!filters || Object.keys(filters).length === 0) return fields;

    return fields.filter(field => {
      // Filter by field type
      if (filters.fieldType && filters.fieldType.trim()) {
        if (field.type !== filters.fieldType) return false;
      }

      // Filter by required
      if (filters.required) {
        if (!field.required) return false;
      }

      // Filter by editable
      if (filters.editable) {
        if (!field.editable) return false;
      }

      // Filter by has value
      if (filters.hasValue) {
        const fieldValue = contactData[field.key];
        if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
          return false;
        }
      }

      return true;
    });
  }

  // Filter folders based on field filters
  static filterFolders(folders, filters, contactData = {}) {
    if (!folders || !Array.isArray(folders)) return [];
    if (!filters || Object.keys(filters).length === 0) return folders;

    return folders.map(folder => {
      // Filter by folder name
      if (filters.folder && filters.folder.trim()) {
        if (folder.name !== filters.folder) {
          return { ...folder, fields: [] };
        }
      }

      // Filter fields within the folder
      const filteredFields = this.filterFields(folder.fields, filters, contactData);
      
      return {
        ...folder,
        fields: filteredFields
      };
    }).filter(folder => folder.fields.length > 0);
  }

  // Get filter summary (count of filtered results)
  static getFilterSummary(originalCount, filteredCount, filters) {
    const activeFilters = Object.entries(filters || {}).filter(([key, value]) => {
      if (key === 'tags') return value && value.length > 0;
      if (typeof value === 'boolean') return value;
      return value && value.toString().trim() !== '';
    });

    return {
      originalCount,
      filteredCount,
      activeFilters: activeFilters.length,
      hasActiveFilters: activeFilters.length > 0
    };
  }

  // Clear all filters
  static getDefaultFilters() {
    return {
      fieldType: '',
      required: false,
      editable: false,
      hasValue: false,
      folder: ''
    };
  }

  // Check if filters are active
  static hasActiveFilters(filters) {
    if (!filters) return false;
    
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'tags') return value && value.length > 0;
      if (typeof value === 'boolean') return value;
      return value && value.toString().trim() !== '';
    });
  }

  // Get available filter options from data
  static getAvailableOptions(contacts, folders) {
    const options = {
      tags: new Set(),
      owners: new Set(),
      budgets: new Set(),
      fieldTypes: new Set(),
      folders: new Set()
    };

    // Extract from contacts
    contacts?.forEach(contact => {
      if (contact.tags) {
        contact.tags.forEach(tag => options.tags.add(tag));
      }
      if (contact.owner) {
        options.owners.add(contact.owner);
      }
      if (contact.budget) {
        options.budgets.add(contact.budget);
      }
    });

    // Extract from folders
    folders?.forEach(folder => {
      options.folders.add(folder.name);
      folder.fields?.forEach(field => {
        options.fieldTypes.add(field.type);
      });
    });

    return {
      tags: Array.from(options.tags).sort(),
      owners: Array.from(options.owners).sort(),
      budgets: Array.from(options.budgets).sort(),
      fieldTypes: Array.from(options.fieldTypes).sort(),
      folders: Array.from(options.folders).sort()
    };
  }
} 