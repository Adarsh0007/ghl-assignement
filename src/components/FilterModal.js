import React, { useState, useCallback } from 'react';
import { X, Filter } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, onApplyFilters, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    fieldType: '',
    required: false,
    editable: false,
    hasValue: false,
    folder: '',
    ...currentFilters
  });

  // Field type options
  const fieldTypes = [
    { value: '', label: 'All Types' },
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Select' },
    { value: 'multiselect', label: 'Multi Select' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'url', label: 'URL' }
  ];

  // Folder options
  const folders = [
    { value: '', label: 'All Folders' },
    { value: 'Contact', label: 'Contact' },
    { value: 'Additional Info', label: 'Additional Info' },
    { value: 'Used Car Buyer Preferences', label: 'Used Car Buyer Preferences' }
  ];

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      fieldType: '',
      required: false,
      editable: false,
      hasValue: false,
      folder: ''
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    onApplyFilters(filters);
    onClose();
  }, [filters, onApplyFilters, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Advanced Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* Field Type Filter */}
          <div>
            <label htmlFor="filter-field-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Field Type
            </label>
            <select
              id="filter-field-type"
              value={filters.fieldType}
              onChange={(e) => handleFilterChange('fieldType', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Folder Filter */}
          <div>
            <label htmlFor="filter-folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Folder
            </label>
            <select
              id="filter-folder"
              value={filters.folder}
              onChange={(e) => handleFilterChange('folder', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {folders.map(folder => (
                <option key={folder.value} value={folder.value}>
                  {folder.label}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label htmlFor="filter-required" className="flex items-center space-x-3 cursor-pointer">
              <input
                id="filter-required"
                type="checkbox"
                checked={filters.required}
                onChange={(e) => handleFilterChange('required', e.target.checked)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Required Fields</span>
            </label>

            <label htmlFor="filter-editable" className="flex items-center space-x-3 cursor-pointer">
              <input
                id="filter-editable"
                type="checkbox"
                checked={filters.editable}
                onChange={(e) => handleFilterChange('editable', e.target.checked)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Editable Fields</span>
            </label>

            <label htmlFor="filter-has-value" className="flex items-center space-x-3 cursor-pointer">
              <input
                id="filter-has-value"
                type="checkbox"
                checked={filters.hasValue}
                onChange={(e) => handleFilterChange('hasValue', e.target.checked)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Has Value</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Clear All
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 