// Dynamic field service for generating new fields based on folder types
export class DynamicFieldService {
  // Field type templates for different folders
  static fieldTemplates = {
    'Contact': [
      {
        type: 'text',
        label: 'Custom Field',
        required: false,
        editable: true,
        minLength: 1,
        maxLength: 100
      },
      {
        type: 'email',
        label: 'Additional Email',
        required: false,
        editable: true
      },
      {
        type: 'phone',
        label: 'Additional Phone',
        required: false,
        editable: true,
        showCallButton: true,
        showEditButton: true
      },
      {
        type: 'textarea',
        label: 'Description',
        required: false,
        editable: true,
        minLength: 1,
        maxLength: 500
      }
    ],
    'Additional Info': [
      {
        type: 'text',
        label: 'Custom Info',
        required: false,
        editable: true,
        minLength: 1,
        maxLength: 100
      },
      {
        type: 'url',
        label: 'Website',
        required: false,
        editable: true
      },
      {
        type: 'number',
        label: 'Custom Number',
        required: false,
        editable: true
      },
      {
        type: 'date',
        label: 'Important Date',
        required: false,
        editable: true
      }
    ],
    'Used Car Buyer Preferences': [
      {
        type: 'multiselect',
        label: 'Additional Preferences',
        required: false,
        editable: true,
        options: ['SUV', 'Sedan', 'Hatchback', 'Truck', 'Electric', 'Hybrid', 'Diesel', 'Gasoline']
      },
      {
        type: 'select',
        label: 'Priority Level',
        required: false,
        editable: true,
        options: ['Low', 'Medium', 'High', 'Urgent']
      },
      {
        type: 'text',
        label: 'Specific Requirements',
        required: false,
        editable: true,
        minLength: 1,
        maxLength: 200
      },
      {
        type: 'textarea',
        label: 'Additional Notes',
        required: false,
        editable: true,
        minLength: 1,
        maxLength: 1000
      }
    ]
  };

  // Default field templates for unknown folders
  static defaultTemplates = [
    {
      type: 'text',
      label: 'Custom Field',
      required: false,
      editable: true,
      minLength: 1,
      maxLength: 100
    },
    {
      type: 'textarea',
      label: 'Description',
      required: false,
      editable: true,
      minLength: 1,
      maxLength: 500
    },
    {
      type: 'select',
      label: 'Category',
      required: false,
      editable: true,
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  ];

  // Generate a new field based on folder type
  static generateField(folderName, existingFields = []) {
    const templates = this.fieldTemplates[folderName] || this.defaultTemplates;
    
    // Find a unique key for the new field
    const baseKey = this.getBaseKeyFromFolder(folderName);
    const key = this.generateUniqueKey(baseKey, existingFields);
    
    // Select a random template or use the first one
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      key,
      label: template.label,
      type: template.type,
      required: template.required || false,
      editable: template.editable !== false,
      ...template
    };
  }

  // Generate unique key for new field
  static generateUniqueKey(baseKey, existingFields) {
    let counter = 1;
    
    const checkKeyExists = (keyToCheck) => existingFields.some(field => field.key === keyToCheck);
    
    while (checkKeyExists(`${baseKey}${counter}`)) {
      counter++;
    }
    
    return `${baseKey}${counter}`;
  }

  // Get base key from folder name
  static getBaseKeyFromFolder(folderName) {
    const keyMap = {
      'Contact': 'customContact',
      'Additional Info': 'customInfo',
      'Used Car Buyer Preferences': 'customPreference'
    };
    
    return keyMap[folderName] || 'customField';
  }

  // Get available field types for a folder
  static getAvailableFieldTypes(folderName) {
    const templates = this.fieldTemplates[folderName] || this.defaultTemplates;
    return templates.map(template => ({
      type: template.type,
      label: template.label,
      description: this.getFieldTypeDescription(template.type)
    }));
  }

  // Get field type description
  static getFieldTypeDescription(type) {
    const descriptions = {
      'text': 'Single line text input',
      'textarea': 'Multi-line text input',
      'email': 'Email address with validation',
      'phone': 'Phone number with country support',
      'url': 'Website URL with validation',
      'number': 'Numeric input',
      'integer': 'Whole number input',
      'date': 'Date picker',
      'time': 'Time picker',
      'select': 'Single selection dropdown',
      'multiselect': 'Multiple selection options',
      'zipCode': 'ZIP/Postal code input'
    };
    
    return descriptions[type] || 'Custom field type';
  }

  // Validate field configuration
  static validateFieldConfig(field) {
    const errors = [];
    
    if (!field.key || field.key.trim() === '') {
      errors.push('Field key is required');
    }
    
    if (!field.label || field.label.trim() === '') {
      errors.push('Field label is required');
    }
    
    if (!field.type) {
      errors.push('Field type is required');
    }
    
    // Validate field type specific rules
    if (field.type === 'text' || field.type === 'textarea') {
      const minLength = field.minLength !== '' ? parseInt(field.minLength) : null;
      const maxLength = field.maxLength !== '' ? parseInt(field.maxLength) : null;
      
      // Validate min length
      if (minLength !== null) {
        if (isNaN(minLength) || minLength < 0) {
          errors.push('Minimum length must be a positive number');
        }
      }
      
      // Validate max length
      if (maxLength !== null) {
        if (isNaN(maxLength) || maxLength < 1) {
          errors.push('Maximum length must be at least 1');
        }
      }
      
      // Validate min vs max length relationship
      if (minLength !== null && maxLength !== null) {
        if (minLength > maxLength) {
          errors.push('Minimum length cannot be greater than maximum length');
        }
      }
    }
    
    if (field.type === 'select' || field.type === 'multiselect') {
      if (!field.options || !Array.isArray(field.options) || field.options.length === 0) {
        errors.push('Options are required for select/multiselect fields');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get default value for field type
  static getDefaultValue(fieldType) {
    const defaults = {
      'text': '',
      'textarea': '',
      'email': '',
      'phone': '',
      'url': '',
      'number': 0,
      'integer': 0,
      'date': '',
      'time': '',
      'select': '',
      'multiselect': [],
      'zipCode': ''
    };
    
    return defaults[fieldType] || '';
  }

  // Suggest field name based on folder and existing fields
  static suggestFieldName(folderName, existingFields) {
    const suggestions = {
      'Contact': ['Nickname', 'Alternate Phone', 'Emergency Contact', 'Social Media'],
      'Additional Info': ['Company', 'Department', 'Position', 'Reference'],
      'Used Car Buyer Preferences': ['Color Preference', 'Transmission Type', 'Fuel Type', 'Features']
    };
    
    const folderSuggestions = suggestions[folderName] || ['Custom Field', 'Additional Info', 'Notes'];
    const existingLabels = existingFields.map(field => field.label.toLowerCase());
    
    for (const suggestion of folderSuggestions) {
      if (!existingLabels.includes(suggestion.toLowerCase())) {
        return suggestion;
      }
    }
    
    return 'Custom Field';
  }
} 