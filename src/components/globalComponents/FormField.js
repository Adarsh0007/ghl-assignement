import React, { forwardRef, memo, useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, X, Check } from 'lucide-react';

/**
 * Generic Form Field Component
 * A comprehensive form field component that handles multiple input types with accessibility, validation, and optimization
 */
const FormField = forwardRef(({
  // Core props
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  
  // Label and description
  label,
  description,
  required = false,
  
  // Options for select/radio/checkbox
  options = [],
  multiple = false,
  
  // Validation and error handling
  error,
  touched = false,
  validate,
  validationRules,
  
  // Styling and appearance
  className = '',
  inputClassName = '',
  labelClassName = '',
  errorClassName = '',
  
  // Input specific props
  placeholder,
  disabled = false,
  readOnly = false,
  maxLength,
  minLength,
  rows = 3,
  cols,
  
  // Select specific props
  searchable = false,
  clearable = false,
  maxSelected = null,
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  role,
  tabIndex,
  
  // Event handlers
  onKeyDown,
  onKeyPress,
  onKeyUp,
  onMouseEnter,
  onMouseLeave,
  
  // Custom props
  autoFocus = false,
  autoComplete,
  pattern,
  step,
  min,
  max,
  
  // Spread any other props
  ...restProps
}, ref) => {
  
  // Internal state
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalError, setInternalError] = useState(null);
  
  // Generate unique IDs
  const fieldId = useMemo(() => `form-field-${name || Math.random().toString(36).substr(2, 9)}`, [name]);
  const errorId = useMemo(() => `${fieldId}-error`, [fieldId]);
  const descriptionId = useMemo(() => `${fieldId}-description`, [fieldId]);
  
  // Validation
  const validationError = useMemo(() => {
    return error || internalError;
  }, [error, internalError]);
  
  const showError = useMemo(() => {
    return validationError && touched;
  }, [validationError, touched]);
  
  // Filtered options for searchable selects
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter(option => 
      option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchable, searchTerm]);
  
  // Field validation
  const validateField = useCallback((value, rules) => {
    if (!rules) return { isValid: true };
    
    // Required validation
    if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return { isValid: false, error: rules.requiredMessage || 'This field is required' };
    }
    
    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      return { isValid: false, error: rules.minLengthMessage || `Minimum length is ${rules.minLength} characters` };
    }
    
    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return { isValid: false, error: rules.maxLengthMessage || `Maximum length is ${rules.maxLength} characters` };
    }
    
    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      return { isValid: false, error: rules.patternMessage || 'Invalid format' };
    }
    
    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const customResult = rules.custom(value);
      if (customResult !== true) {
        return { isValid: false, error: customResult || 'Invalid value' };
      }
    }
    
    return { isValid: true };
  }, []);
  
  // Handle value changes
  const handleChange = useCallback((newValue) => {
    // Clear internal error when user starts typing
    if (internalError) {
      setInternalError(null);
    }
    
    // Validate if validation rules are provided
    if (validationRules) {
      const validation = validateField(newValue, validationRules);
      if (!validation.isValid) {
        setInternalError(validation.error);
      }
    }
    
    onChange?.(newValue);
  }, [internalError, validationRules, onChange, validateField]);
  
  // Handle focus events
  const handleFocus = useCallback((event) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);
  
  const handleBlur = useCallback((event) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);
  
  // Handle select expansion
  const handleSelectToggle = useCallback(() => {
    if (!disabled && !readOnly) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        setSearchTerm('');
      }
    }
  }, [disabled, readOnly, isExpanded]);
  
  // Handle option selection
  const handleOptionSelect = useCallback((option) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(option.value);
      
      let newValues;
      if (isSelected) {
        newValues = currentValues.filter(v => v !== option.value);
      } else {
        if (maxSelected && currentValues.length >= maxSelected) {
          return; // Don't add more than maxSelected
        }
        newValues = [...currentValues, option.value];
      }
      
      handleChange(newValues);
    } else {
      handleChange(option.value);
      setIsExpanded(false);
      setSearchTerm('');
    }
  }, [multiple, value, maxSelected, handleChange]);
  
  // Handle option removal (for multi-select)
  const handleOptionRemove = useCallback((optionValue) => {
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter(v => v !== optionValue);
      handleChange(newValues);
    }
  }, [multiple, value, handleChange]);
  
  // Handle clear all (for multi-select)
  const handleClearAll = useCallback(() => {
    if (multiple) {
      handleChange([]);
    } else {
      handleChange('');
    }
    setSearchTerm('');
  }, [multiple, handleChange]);
  
  // Generate CSS classes
  const getFieldClasses = useCallback(() => {
    // Base classes for all input types
    const baseClasses = [
      'w-full',
      'px-3',
      'py-2',
      'border',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'focus:outline-none',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'readonly:bg-gray-50',
      'dark:readonly:bg-gray-800'
    ];
    
    // Border and background colors
    if (showError) {
      baseClasses.push(
        'border-red-500',
        'focus:border-red-500',
        'focus:ring-red-500',
        'bg-red-50',
        'dark:bg-red-900/20'
      );
    } else if (isFocused) {
      baseClasses.push(
        'border-blue-500',
        'bg-white',
        'dark:bg-gray-700'
      );
    } else {
      baseClasses.push(
        'border-gray-300',
        'dark:border-gray-600',
        'bg-white',
        'dark:bg-gray-700',
        'hover:border-gray-400',
        'dark:hover:border-gray-500'
      );
    }
    
    // Text colors
    baseClasses.push(
      'text-gray-900',
      'dark:text-white',
      'placeholder-gray-500',
      'dark:placeholder-gray-400'
    );
    
    return [...baseClasses, inputClassName].filter(Boolean).join(' ');
  }, [showError, isFocused, inputClassName]);
  
  // Render different field types
  const renderField = useCallback(() => {
    const commonProps = {
      id: fieldId,
      name,
      ref,
      className: getFieldClasses(),
      disabled,
      readOnly,
      required,
      autoFocus,
      autoComplete,
      'aria-describedby': [descriptionId, showError ? errorId : null].filter(Boolean).join(' '),
      'aria-invalid': showError || ariaInvalid,
      'aria-required': required || ariaRequired,
      role,
      tabIndex,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown,
      onKeyPress,
      onKeyUp,
      onMouseEnter,
      onMouseLeave,
      ...restProps
    };
    
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
      case 'tel':
      case 'number':
      case 'date':
      case 'time':
      case 'datetime-local':
        return (
          <input
            {...commonProps}
            type={type}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            step={step}
            min={min}
            max={max}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            cols={cols}
            maxLength={maxLength}
            minLength={minLength}
          />
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`${fieldId}-${index}`}
                  name={name}
                  value={option.value}
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleChange([...currentValues, option.value]);
                    } else {
                      handleChange(currentValues.filter(v => v !== option.value));
                    }
                  }}
                  disabled={disabled}
                  required={required && index === 0}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  aria-describedby={descriptionId}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label || option.value}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  id={`${fieldId}-${index}`}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={disabled}
                  required={required && index === 0}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  aria-describedby={descriptionId}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label || option.value}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'select':
        if (multiple) {
          return (
            <div className="relative">
              {/* Selected values display */}
              <div className="min-h-[42px] p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(value) && value.length > 0 ? (
                    value.map((selectedValue) => {
                      const option = options.find(opt => opt.value === selectedValue);
                      return (
                        <span
                          key={selectedValue}
                          className="inline-flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-sm"
                        >
                          <span>{option?.label || selectedValue}</span>
                          <button
                            type="button"
                            onClick={() => handleOptionRemove(selectedValue)}
                            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                            aria-label={`Remove ${option?.label || selectedValue}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {placeholder || 'Select options...'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Dropdown button */}
              <button
                type="button"
                onClick={handleSelectToggle}
                disabled={disabled}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                aria-label="Toggle options"
              >
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Clear all button */}
              {clearable && Array.isArray(value) && value.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  aria-label="Clear all selections"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
              
              {/* Dropdown options */}
              {isExpanded && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchable && (
                    <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search options..."
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                      const isSelected = Array.isArray(value) && value.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleOptionSelect(option)}
                          disabled={disabled}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                            isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.label || option.value}</span>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No options found
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div className="relative">
              <select
                {...commonProps}
                value={value || ''}
                onChange={(e) => handleChange(e.target.value)}
              >
                <option value="">{placeholder || 'Select an option...'}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label || option.value}
                  </option>
                ))}
              </select>
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          );
        }
      
      default:
        return (
          <input
            {...commonProps}
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
          />
        );
    }
  }, [
    type,
    fieldId,
    name,
    ref,
    getFieldClasses,
    disabled,
    readOnly,
    required,
    autoFocus,
    autoComplete,
    descriptionId,
    showError,
    errorId,
    ariaInvalid,
    ariaRequired,
    role,
    tabIndex,
    handleFocus,
    handleBlur,
    onKeyDown,
    onKeyPress,
    onKeyUp,
    onMouseEnter,
    onMouseLeave,
    restProps,
    value,
    handleChange,
    placeholder,
    maxLength,
    minLength,
    pattern,
    step,
    min,
    max,
    rows,
    cols,
    options,
    multiple,
    isExpanded,
    searchTerm,
    filteredOptions,
    handleSelectToggle,
    handleOptionSelect,
    handleOptionRemove,
    handleClearAll,
    clearable,
    searchable
  ]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = (event) => {
        if (!event.target.closest(`#${fieldId}`)) {
          setIsExpanded(false);
          setSearchTerm('');
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded, fieldId]);
  
  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={fieldId}
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      {/* Field */}
      <div id={fieldId}>
        {renderField()}
      </div>
      
      {/* Error message */}
      {showError && (
        <p
          id={errorId}
          className={`text-sm text-red-600 dark:text-red-400 ${errorClassName}`}
          role="alert"
          aria-live="polite"
        >
          {validationError}
        </p>
      )}
    </div>
  );
});

// PropTypes for type checking
FormField.propTypes = {
  // Core props
  type: PropTypes.oneOf([
    'text', 'email', 'password', 'url', 'tel', 'number', 'date', 'time', 'datetime-local',
    'textarea', 'select', 'checkbox', 'radio'
  ]),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.bool
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  
  // Label and description
  label: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  
  // Options for select/radio/checkbox
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string
  })),
  multiple: PropTypes.bool,
  
  // Validation and error handling
  error: PropTypes.string,
  touched: PropTypes.bool,
  validate: PropTypes.func,
  validationRules: PropTypes.shape({
    required: PropTypes.bool,
    requiredMessage: PropTypes.string,
    minLength: PropTypes.number,
    minLengthMessage: PropTypes.string,
    maxLength: PropTypes.number,
    maxLengthMessage: PropTypes.string,
    pattern: PropTypes.instanceOf(RegExp),
    patternMessage: PropTypes.string,
    custom: PropTypes.func
  }),
  
  // Styling and appearance
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  
  // Input specific props
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  rows: PropTypes.number,
  cols: PropTypes.number,
  
  // Select specific props
  searchable: PropTypes.bool,
  clearable: PropTypes.bool,
  maxSelected: PropTypes.number,
  
  // Accessibility
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
  'aria-invalid': PropTypes.bool,
  'aria-required': PropTypes.bool,
  role: PropTypes.string,
  tabIndex: PropTypes.number,
  
  // Event handlers
  onKeyDown: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  
  // Custom props
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  pattern: PropTypes.string,
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

// Default props
FormField.defaultProps = {
  type: 'text',
  required: false,
  options: [],
  multiple: false,
  touched: false,
  className: '',
  inputClassName: '',
  labelClassName: '',
  errorClassName: '',
  disabled: false,
  readOnly: false,
  rows: 3,
  searchable: false,
  clearable: false,
  autoFocus: false
};

FormField.displayName = 'FormField';

export default memo(FormField); 