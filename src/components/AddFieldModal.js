import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { DynamicFieldService } from '../services/dynamicFieldService.js';

const AddFieldModal = ({ 
  isOpen, 
  onClose, 
  onAddField, 
  folderName,
  existingFields = []
}) => {
  const [fieldConfig, setFieldConfig] = useState({
    key: '',
    label: '',
    type: 'text',
    required: false,
    editable: true,
    minLength: '',
    maxLength: '',
    options: []
  });
  const [newOption, setNewOption] = useState('');
  const [errors, setErrors] = useState({});

  // Get available field types for this folder
  const availableFieldTypes = useMemo(() => {
    return DynamicFieldService.getAvailableFieldTypes(folderName);
  }, [folderName]);

  // Generate suggested field name
  const suggestedName = useMemo(() => {
    return DynamicFieldService.suggestFieldName(folderName, existingFields);
  }, [folderName, existingFields]);

  // Generate unique key when label changes
  const generateKey = useCallback((label) => {
    if (!label) return '';
    const key = label.toLowerCase().replace(/[^a-z0-9]/g, '');
    return DynamicFieldService.generateUniqueKey(key, existingFields);
  }, [existingFields]);

  // Validate fields when fieldConfig changes
  useEffect(() => {
    const validation = DynamicFieldService.validateFieldConfig(fieldConfig);
    
    if (!validation.isValid) {
      const errorMap = {};
      validation.errors.forEach(error => {
        if (error.includes('key')) errorMap.key = error;
        if (error.includes('label')) errorMap.label = error;
        if (error.includes('type')) errorMap.type = error;
        if (error.includes('Options')) errorMap.options = error;
        if (error.includes('length')) {
          // Handle length-specific errors
          if (error.includes('Minimum length')) {
            errorMap.minLength = error;
          } else if (error.includes('Maximum length')) {
            errorMap.maxLength = error;
          } else if (error.includes('cannot be greater')) {
            errorMap.minLength = error;
            errorMap.maxLength = error;
          } else {
            errorMap.length = error;
          }
        }
      });
      setErrors(prev => ({ ...prev, ...errorMap }));
    } else {
      // Clear all errors if validation passes
      setErrors({});
    }
  }, [fieldConfig]);

  // Handle field config changes
  const handleConfigChange = useCallback((field, value) => {
    setFieldConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      
      // Auto-generate key when label changes
      if (field === 'label') {
        newConfig.key = generateKey(value);
      }
      
      return newConfig;
    });
    
    // Don't clear errors immediately - let useEffect handle validation
  }, [generateKey]);

  // Check if there are any errors
  const hasErrors = useMemo(() => {
    return Object.keys(errors).some(key => errors[key] !== null && errors[key] !== undefined);
  }, [errors]);

  // Check if required fields are filled
  const isFormValid = useMemo(() => {
    return fieldConfig.label.trim() !== '' && 
           fieldConfig.key.trim() !== '' && 
           !hasErrors;
  }, [fieldConfig.label, fieldConfig.key, hasErrors]);

  // Handle adding option for select/multiselect
  const handleAddOption = useCallback(() => {
    if (newOption.trim() && !fieldConfig.options.includes(newOption.trim())) {
      setFieldConfig(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  }, [newOption, fieldConfig.options]);

  // Handle removing option
  const handleRemoveOption = useCallback((optionToRemove) => {
    setFieldConfig(prev => ({
      ...prev,
      options: prev.options.filter(option => option !== optionToRemove)
    }));
  }, []);

  // Validate field configuration
  const validateConfig = useCallback(() => {
    const validation = DynamicFieldService.validateFieldConfig(fieldConfig);
    if (!validation.isValid) {
      const errorMap = {};
      validation.errors.forEach(error => {
        if (error.includes('key')) errorMap.key = error;
        if (error.includes('label')) errorMap.label = error;
        if (error.includes('type')) errorMap.type = error;
        if (error.includes('Options')) errorMap.options = error;
        if (error.includes('length')) {
          // Handle length-specific errors
          if (error.includes('Minimum length')) {
            errorMap.minLength = error;
          } else if (error.includes('Maximum length')) {
            errorMap.maxLength = error;
          } else if (error.includes('cannot be greater')) {
            errorMap.minLength = error;
            errorMap.maxLength = error;
          } else {
            errorMap.length = error;
          }
        }
      });
      setErrors(errorMap);
      return false;
    }
    return true;
  }, [fieldConfig]);

  // Handle save
  const handleSave = useCallback(() => {
    if (!validateConfig()) return;

    const newField = {
      ...fieldConfig,
      minLength: fieldConfig.minLength !== '' ? parseInt(fieldConfig.minLength) : undefined,
      maxLength: fieldConfig.maxLength !== '' ? parseInt(fieldConfig.maxLength) : undefined
    };

    onAddField(newField);
    onClose();
  }, [fieldConfig, validateConfig, onAddField, onClose]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setFieldConfig({
      key: '',
      label: '',
      type: 'text',
      required: false,
      editable: true,
      minLength: '',
      maxLength: '',
      options: []
    });
    setNewOption('');
    setErrors({});
    onClose();
  }, [onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add New Field
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add a new field to {folderName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Field Label */}
            <div>
              <label htmlFor="field-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Field Label *
              </label>
              <input
                id="field-label"
                type="text"
                value={fieldConfig.label}
                onChange={(e) => handleConfigChange('label', e.target.value)}
                placeholder={suggestedName}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.label ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.label && (
                <p className="text-sm text-red-500 mt-1">{errors.label}</p>
              )}
            </div>

            {/* Field Key */}
            <div>
              <label htmlFor="field-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Field Key *
              </label>
              <input
                id="field-key"
                type="text"
                value={fieldConfig.key}
                onChange={(e) => handleConfigChange('key', e.target.value)}
                placeholder="auto-generated"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.key ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.key && (
                <p className="text-sm text-red-500 mt-1">{errors.key}</p>
              )}
            </div>

            {/* Field Type */}
            <div>
              <label htmlFor="field-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Field Type *
              </label>
              <select
                id="field-type"
                value={fieldConfig.type}
                onChange={(e) => handleConfigChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {availableFieldTypes.map(type => (
                  <option key={type.type} value={type.type}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Field Properties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={fieldConfig.required}
                  onChange={(e) => handleConfigChange('required', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="required" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Required Field
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editable"
                  checked={fieldConfig.editable}
                  onChange={(e) => handleConfigChange('editable', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="editable" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Editable
                </label>
              </div>
            </div>

            {/* Length Constraints for Text Fields */}
            {(fieldConfig.type === 'text' || fieldConfig.type === 'textarea') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="field-min-length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Min Length
                    </label>
                    <input
                      id="field-min-length"
                      type="number"
                      value={fieldConfig.minLength}
                      onChange={(e) => handleConfigChange('minLength', e.target.value)}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.minLength ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.minLength && (
                      <p className="text-sm text-red-500 mt-1">{errors.minLength}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="field-max-length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Length
                    </label>
                    <input
                      id="field-max-length"
                      type="number"
                      value={fieldConfig.maxLength}
                      onChange={(e) => handleConfigChange('maxLength', e.target.value)}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.maxLength ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.maxLength && (
                      <p className="text-sm text-red-500 mt-1">{errors.maxLength}</p>
                    )}
                  </div>
                </div>
                {errors.length && !errors.minLength && !errors.maxLength && (
                  <p className="text-sm text-red-500">{errors.length}</p>
                )}
              </div>
            )}

            {/* Options for Select/Multiselect */}
            {(fieldConfig.type === 'select' || fieldConfig.type === 'multiselect') && (
              <div>
                <label htmlFor="field-options" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Options *
                </label>
                <div className="space-y-2">
                  {fieldConfig.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {option}
                      </span>
                      <button
                        onClick={() => handleRemoveOption(option)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      id="field-options"
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                    />
                    <button
                      onClick={handleAddOption}
                      disabled={!newOption.trim()}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {errors.options && (
                  <p className="text-sm text-red-500 mt-1">{errors.options}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isFormValid
                ? 'text-white bg-primary-600 hover:bg-primary-700'
                : 'text-gray-400 bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
            title={!isFormValid ? 'Please fix all errors before adding the field' : ''}
          >
            Add Field {hasErrors && `(${Object.keys(errors).filter(key => errors[key]).length} errors)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal; 