// Validation service with regex patterns for different field types
import { CountryCodesService } from './countryCodesService.js';

export class ValidationService {
  // Regex patterns for different field types
  static patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[+]?[1-9]\d{0,15}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    time: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    number: /^\d+(\.\d+)?$/,
    integer: /^\d+$/,
    alphanumeric: /^[a-zA-Z0-9\s]+$/,
    alphabetic: /^[a-zA-Z\s]+$/,
    required: /.+/,
  };

  // Validation rules for different field types
  static rules = {
    text: {
      required: true,
      minLength: 1,
      maxLength: 255,
    },
    email: {
      required: true,
      pattern: 'email',
      maxLength: 254,
    },
    phone: {
      required: false,
      pattern: 'phone',
      minLength: 10,
      maxLength: 15,
    },
    textarea: {
      required: false,
      minLength: 0,
      maxLength: 1000,
    },
    select: {
      required: false,
    },
    multiselect: {
      required: false,
    },
    url: {
      required: false,
      pattern: 'url',
      maxLength: 2083,
    },
    number: {
      required: false,
      pattern: 'number',
    },
    date: {
      required: false,
      pattern: 'date',
    },
  };

  // Validate a single field
  static validateField(value, fieldType, isRequired = false, country = null) {
    const rules = this.rules[fieldType] || this.rules.text;
    
    // Handle different field types for required validation
    let isEmpty = false;
    if (fieldType === 'multiselect' || fieldType === 'select') {
      // For multiselect/select fields, check if array is empty or has no valid selections
      isEmpty = !value || (Array.isArray(value) && value.length === 0) || value === '';
    } else {
      // For other fields, check if string is empty
      isEmpty = !value || (typeof value === 'string' && value.trim() === '');
    }
    
    // Check if field is required
    if (isRequired && isEmpty) {
      return { isValid: false, error: 'This field is required' };
    }

    // If not required and empty, it's valid
    if (!isRequired && isEmpty) {
      return { isValid: true, error: null };
    }

    // Handle different field types for validation
    if (fieldType === 'multiselect' || fieldType === 'select') {
      // For multiselect/select fields, validate each selected item
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && item.trim() === '') {
            return { isValid: false, error: 'Invalid selection' };
          }
        }
      }
      return { isValid: true, error: null };
    }

    // For other field types, convert to string and trim
    const stringValue = String(value).trim();

    // Special handling for phone validation with country
    if (fieldType === 'phone' && country) {
      const parsed = CountryCodesService.parsePhoneNumber(stringValue);
      const isValid = CountryCodesService.validatePhoneNumber(parsed.country, parsed.number);
      
      if (!isValid) {
        const errorMessage = this.getPatternErrorMessage('phone', country);
        return { isValid: false, error: errorMessage };
      }
      
      return { isValid: true, error: null };
    }

    // Check min length
    if (rules.minLength && stringValue.length < rules.minLength) {
      return { 
        isValid: false, 
        error: `Minimum length is ${rules.minLength} characters` 
      };
    }

    // Check max length
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return { 
        isValid: false, 
        error: `Maximum length is ${rules.maxLength} characters` 
      };
    }

    // Check pattern
    if (rules.pattern && this.patterns[rules.pattern]) {
      if (!this.patterns[rules.pattern].test(stringValue)) {
        const errorMessage = this.getPatternErrorMessage(rules.pattern, country);
        return { 
          isValid: false, 
          error: errorMessage 
        };
      }
    }

    return { isValid: true, error: null };
  }

  // Get user-friendly error messages for patterns
  static getPatternErrorMessage(pattern, country = null) {
    const messages = {
      email: 'Please enter a valid email address',
      phone: this.getPhoneErrorMessage(country),
      url: 'Please enter a valid URL',
      zipCode: 'Please enter a valid ZIP code',
      date: 'Please enter a valid date (YYYY-MM-DD)',
      time: 'Please enter a valid time (HH:MM)',
      number: 'Please enter a valid number',
      integer: 'Please enter a valid integer',
      alphanumeric: 'Please use only letters, numbers, and spaces',
      alphabetic: 'Please use only letters and spaces',
    };
    return messages[pattern] || 'Invalid format';
  }

  // Get country-specific phone error message with format
  static getPhoneErrorMessage(country = null) {
    if (!country) {
      return 'Please enter a valid phone number (e.g., 123-456-7890)';
    }

    const formatExamples = {
      'US': '(555) 123-4567',
      'CA': '(555) 123-4567',
      'IN': '98765 43210',
      'GB': '0712 345678',
      'AU': '0412 345 678',
      'DE': '030 12345678',
      'FR': '1 23 45 67 89',
      'JP': '03-1234-5678',
      'BR': '11 98765-4321',
      'CN': '138 1234 5678'
    };

    const example = formatExamples[country.code] || '123-456-7890';
    const format = country.format ? `Format: ${country.format}` : '';
    
    return `Please enter a valid phone number for ${country.name}. ${format} Example: ${example}`;
  }

  // Validate multiple fields
  static validateFields(fields, values) {
    const errors = {};
    let isValid = true;

    fields.forEach(field => {
      const value = values[field.key];
      const validation = this.validateField(value, field.type, field.required);
      
      if (!validation.isValid) {
        errors[field.key] = validation.error;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  // Sanitize input value
  static sanitizeValue(value, fieldType) {
    if (!value) return '';
    
    // Handle multiselect and select fields
    if (fieldType === 'multiselect' || fieldType === 'select') {
      if (Array.isArray(value)) {
        // For arrays, sanitize each item and filter out empty ones
        return value
          .map(item => String(item).trim())
          .filter(item => item !== '');
      }
      // If it's not an array, convert to string and trim
      return String(value).trim();
    }
    
    let sanitized = String(value).trim();
    
    switch (fieldType) {
      case 'email':
        sanitized = sanitized.toLowerCase();
        break;
      case 'phone':
        // Remove all non-digit characters except +
        sanitized = sanitized.replace(/[^\d+]/g, '');
        break;
      case 'number':
        // Remove all non-digit and non-decimal characters
        sanitized = sanitized.replace(/[^\d.]/g, '');
        break;
      case 'integer':
        // Remove all non-digit characters
        sanitized = sanitized.replace(/\D/g, '');
        break;
      case 'url':
        // Ensure URL has protocol
        if (sanitized && !sanitized.match(/^https?:\/\//)) {
          sanitized = 'https://' + sanitized;
        }
        break;
      default:
        // For text fields, remove excessive whitespace
        sanitized = sanitized.replace(/\s+/g, ' ');
        break;
    }
    
    return sanitized;
  }
} 