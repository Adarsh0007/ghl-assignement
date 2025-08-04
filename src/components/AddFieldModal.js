import React, { useState, useCallback, useMemo, useEffect, Suspense } from 'react';
import { X, Plus } from 'lucide-react';
import { DynamicFieldService } from '../services/dynamicFieldService.js';

// Lazy load FormField
const FormField = React.lazy(() => import('./globalComponents/FormField.js'));

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

  // Handle adding new option
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

  // Handle save
  const handleSave = useCallback(() => {
    if (isFormValid) {
      onAddField(fieldConfig);
      onClose();
    }
  }, [isFormValid, fieldConfig, onAddField, onClose]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  // Early return for closed modal
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Field to {folderName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Field Label */}
            <Suspense fallback={<div>
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
            </div>}>
              <FormField
                type="text"
                name="label"
                label="Field Label"
                value={fieldConfig.label}
                onChange={(value) => handleConfigChange('label', value)}
                placeholder={suggestedName}
                required
                error={errors.label}
                touched={!!errors.label}
                className="mb-0"
              />
            </Suspense>

            {/* Field Key */}
            <Suspense fallback={<div>
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
            </div>}>
              <FormField
                type="text"
                name="key"
                label="Field Key"
                value={fieldConfig.key}
                onChange={(value) => handleConfigChange('key', value)}
                placeholder="auto-generated"
                required
                error={errors.key}
                touched={!!errors.key}
                className="mb-0"
              />
            </Suspense>

            {/* Field Type */}
            <Suspense fallback={<div>
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
            </div>}>
              <FormField
                type="select"
                name="type"
                label="Field Type"
                value={fieldConfig.type}
                onChange={(value) => handleConfigChange('type', value)}
                options={availableFieldTypes.map(type => ({
                  value: type.type,
                  label: `${type.label} - ${type.description}`
                }))}
                required
                className="mb-0"
              />
            </Suspense>

            {/* Field Properties */}
            <div className="grid grid-cols-2 gap-4">
              <Suspense fallback={<div className="flex items-center">
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
              </div>}>
                <FormField
                  type="checkbox"
                  name="required"
                  label="Required Field"
                  value={fieldConfig.required ? ['required'] : []}
                  onChange={(value) => handleConfigChange('required', value.length > 0)}
                  options={[{ value: 'required', label: 'Required Field' }]}
                  className="mb-0"
                />
              </Suspense>
              <Suspense fallback={<div className="flex items-center">
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
              </div>}>
                <FormField
                  type="checkbox"
                  name="editable"
                  label="Editable"
                  value={fieldConfig.editable ? ['editable'] : []}
                  onChange={(value) => handleConfigChange('editable', value.length > 0)}
                  options={[{ value: 'editable', label: 'Editable' }]}
                  className="mb-0"
                />
              </Suspense>
            </div>

            {/* Length Constraints for Text Fields */}
            {(fieldConfig.type === 'text' || fieldConfig.type === 'textarea') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Suspense fallback={<div>
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
                  </div>}>
                    <FormField
                      type="number"
                      name="minLength"
                      label="Min Length"
                      value={fieldConfig.minLength}
                      onChange={(value) => handleConfigChange('minLength', value)}
                      min={0}
                      error={errors.minLength}
                      touched={!!errors.minLength}
                      className="mb-0"
                    />
                  </Suspense>
                  <Suspense fallback={<div>
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
                  </div>}>
                    <FormField
                      type="number"
                      name="maxLength"
                      label="Max Length"
                      value={fieldConfig.maxLength}
                      onChange={(value) => handleConfigChange('maxLength', value)}
                      min={1}
                      error={errors.maxLength}
                      touched={!!errors.maxLength}
                      className="mb-0"
                    />
                  </Suspense>
                </div>
                {errors.length && !errors.minLength && !errors.maxLength && (
                  <p className="text-sm text-red-500">{errors.length}</p>
                )}
              </div>
            )}

            {/* Options for Select/Multiselect */}
            {(fieldConfig.type === 'select' || fieldConfig.type === 'multiselect') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    <Suspense fallback={<input
                      id="field-options"
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                    />}>
                      <FormField
                        type="text"
                        name="newOption"
                        value={newOption}
                        onChange={(value) => setNewOption(value)}
                        placeholder="Add new option"
                        className="flex-1 mb-0"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                      />
                    </Suspense>
                    <button
                      onClick={handleAddOption}
                      disabled={!newOption.trim()}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        newOption.trim()
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
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
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-gray-400 bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
            title={!isFormValid ? 'Please fix all errors before adding the field' : ''}
          >
            <span className="font-semibold">Add Field</span> {hasErrors && `(${Object.keys(errors).filter(key => errors[key]).length} errors)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal; 