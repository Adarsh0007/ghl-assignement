import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { CountryCodesService } from '../services/countryCodesService.js';

// Memoized country item component for performance
const CountryItem = React.memo(({ country, isSelected, onSelect, onClose }) => {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(country);
    onClose();
  }, [country, onSelect, onClose]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <span className="text-lg">{country.flag}</span>
      <div className="flex-1 text-left">
        <div className="font-medium text-gray-900 dark:text-white">
          {country.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {country.dialCode}
        </div>
      </div>
      {isSelected && (
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </button>
  );
});

CountryItem.displayName = 'CountryItem';

const CountrySelector = ({ 
  selectedCountry, 
  onCountrySelect, 
  isOpen, 
  onClose, 
  disabled = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Memoized filtered countries to prevent unnecessary re-computation
  const countries = useMemo(() => {
    return CountryCodesService.getAllCountries();
  }, []);

  // Memoized search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries;
    }
    return CountryCodesService.searchCountries(searchQuery);
  }, [searchQuery, countries]);

  // Update filtered countries when search results change
  useEffect(() => {
    setFilteredCountries(searchResults);
  }, [searchResults]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Handle modal overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Handle search input change
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  // Handle country selection
  const handleCountrySelect = useCallback((country) => {
    onCountrySelect(country);
  }, [onCountrySelect]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Handle close button click
  const handleCloseClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div 
        ref={dropdownRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Select Country
          </h3>
          <button
            type="button"
            onClick={handleCloseClick}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search countries..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={disabled}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Country List */}
        <div className="overflow-y-auto max-h-96">
          {filteredCountries.length > 0 ? (
            <div className="py-2">
              {filteredCountries.map((country) => (
                <CountryItem
                  key={country.code}
                  country={country}
                  isSelected={selectedCountry?.code === country.code}
                  onSelect={handleCountrySelect}
                  onClose={onClose}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No countries found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {filteredCountries.length} countries available
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelector; 