export class CountryCodesService {
  // Popular countries with their codes, flags, and dial codes
  static countries = [
    {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      dialCode: '+1',
      format: '(###) ###-####'
    },
    {
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      dialCode: '+91',
      format: '##### #####'
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      flag: '🇬🇧',
      dialCode: '+44',
      format: '#### ######'
    },
    {
      code: 'CA',
      name: 'Canada',
      flag: '🇨🇦',
      dialCode: '+1',
      format: '(###) ###-####'
    },
    {
      code: 'AU',
      name: 'Australia',
      flag: '🇦🇺',
      dialCode: '+61',
      format: '### ### ###'
    },
    {
      code: 'DE',
      name: 'Germany',
      flag: '🇩🇪',
      dialCode: '+49',
      format: '### #######'
    },
    {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      dialCode: '+33',
      format: '# ## ## ## ##'
    },
    {
      code: 'JP',
      name: 'Japan',
      flag: '🇯🇵',
      dialCode: '+81',
      format: '##-####-####'
    },
    {
      code: 'BR',
      name: 'Brazil',
      flag: '🇧🇷',
      dialCode: '+55',
      format: '## #####-####'
    },
    {
      code: 'CN',
      name: 'China',
      flag: '🇨🇳',
      dialCode: '+86',
      format: '### #### ####'
    }
  ];

  // Cache for country codes
  static cache = new Map();

  // Get all countries
  static getAllCountries() {
    return this.countries;
  }

  // Get country by code
  static getCountryByCode(code) {
    return this.countries.find(country => country.code === code);
  }

  // Get country by dial code
  static getCountryByDialCode(dialCode) {
    return this.countries.find(country => country.dialCode === dialCode);
  }

  // Search countries by name or code
  static searchCountries(query) {
    if (!query || query.trim() === '') {
      return this.countries;
    }

    const searchTerm = query.toLowerCase().trim();
    return this.countries.filter(country => 
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm) ||
      country.dialCode.includes(searchTerm)
    );
  }

  // Get default country (US)
  static getDefaultCountry() {
    return this.getCountryByCode('US');
  }

  // Parse phone number to extract country and number
  static parsePhoneNumber(phoneNumber) {
    if (!phoneNumber) return { country: this.getDefaultCountry(), number: '' };

    // Try to match dial code
    for (const country of this.countries) {
      if (phoneNumber.startsWith(country.dialCode)) {
        const number = phoneNumber.substring(country.dialCode.length);
        return { country, number: number.trim() };
      }
    }

    // Default to US if no match
    return { country: this.getDefaultCountry(), number: phoneNumber };
  }

  // Format phone number according to country format
  static formatPhoneNumber(country, number) {
    if (!country || !number) return number;

    // Remove all non-digits
    const digits = number.replace(/\D/g, '');
    
    // Simple formatting based on country format
    let formatted = digits;
    const format = country.format;
    
    if (format) {
      let digitIndex = 0;
      formatted = '';
      
      for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
        if (format[i] === '#') {
          formatted += digits[digitIndex];
          digitIndex++;
        } else {
          formatted += format[i];
        }
      }
    }

    return country.dialCode + ' ' + formatted;
  }

  // Validate phone number for a specific country
  static validatePhoneNumber(country, number) {
    if (!country || !number) return false;

    // Remove all non-digits
    const digits = number.replace(/\D/g, '');
    
    // Basic validation - check if number has reasonable length
    // This is a simplified validation - in production you'd want more sophisticated validation
    const minLength = 7;
    const maxLength = 15;
    
    return digits.length >= minLength && digits.length <= maxLength;
  }

  // Cache management
  static getCached(key) {
    return this.cache.get(key);
  }

  static setCached(key, value, ttl = 300000) { // 5 minutes default TTL
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  static clearCache() {
    this.cache.clear();
  }

  static getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp < entry.ttl) {
        validEntries++;
      } else {
        expiredEntries++;
        this.cache.delete(key);
      }
    }

    return {
      total: validEntries + expiredEntries,
      valid: validEntries,
      expired: expiredEntries
    };
  }
} 