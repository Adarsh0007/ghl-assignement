import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Edit3, Phone, AlertCircle, ChevronDown } from 'lucide-react';
import { ApiService } from '../services/api.js';
import { ValidationService } from '../services/validationService.js';
import { CountryCodesService } from '../services/countryCodesService.js';

// Lazy load child components
const ErrorMessage = React.lazy(() => import('./ErrorMessage.js'));

// Lazy load CustomButton component
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));

// Lazy load the generic loading fallback
const ComponentLoadingFallback = React.lazy(() => import('./globalComponents/ComponentLoadingFallback.js'));

// Fallback button component for loading state
const ButtonFallback = ({ onClick, children, iconClassName, textClassName, ...props }) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
);

const FieldRenderer = ({
  field,
  value,
  onChange,
  isEditing: externalIsEditing,
  onOpenCountrySelector,
  onFieldEditStart,
  onFieldEditCancel,
  onFieldError,
  onFieldErrorClear,
  hasError,
  errorMessage
}) => {
  const [validationError, setValidationError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Accessibility IDs
  const fieldId = `field-${field.key}`;
  const errorId = `error-${field.key}`;
  const descriptionId = `description-${field.key}`;

  // Parse phone number and set country when value changes
  useEffect(() => {
    if (field.type === 'phone') {
      const parsed = CountryCodesService.parsePhoneNumber(value);
      setSelectedCountry(parsed.country);
      setPhoneNumber(parsed.number);
    }
    setEditValue(value);
  }, [value, field.type]);

  // Reset edit value when external editing state changes
  useEffect(() => {
    if (!externalIsEditing) {
      setEditValue(value);
      setValidationError(null);
      setSaveError(null);
    }
  }, [externalIsEditing, value]);

  // Validate field on value change
  useEffect(() => {
    if (externalIsEditing && editValue !== undefined) {
      const validation = ValidationService.validateField(editValue, field.type, field.required, selectedCountry);
      const error = validation.isValid ? null : validation.error;
      setValidationError(error);
      
      // Notify parent about validation errors
      if (onFieldError) {
        onFieldError(field.key, error);
      }
    } else {
      setValidationError(null);
      // Clear error in parent when not editing
      if (onFieldErrorClear) {
        onFieldErrorClear(field.key);
      }
    }
  }, [editValue, field.type, field.required, externalIsEditing, selectedCountry, phoneNumber, onFieldError, onFieldErrorClear, field.key]);

  const handleEditChange = useCallback((newValue) => {
    setEditValue(newValue);
    setSaveError(null);
    
    // For non-phone fields, immediately validate and clear errors if valid
    if (field.type !== 'phone') {
      const validation = ValidationService.validateField(newValue, field.type, field.required, selectedCountry);
      setValidationError(validation.isValid ? null : validation.error);
    }
  }, [field.type, field.required, selectedCountry]);

  const handleSave = useCallback(async () => {
    // Validate before saving
    const validation = ValidationService.validateField(editValue, field.type, field.required, selectedCountry);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError(null);
    setSaveError(null);

    // Sanitize the value
    const sanitizedValue = ValidationService.sanitizeValue(editValue, field.type);
    
    try {
      setIsSaving(true);
      await onChange(field.key, sanitizedValue);
      // Note: The parent will handle clearing the editing state after successful save
    } catch (error) {
      console.error('Error saving field:', error);
      setSaveError(error.message || 'Failed to save field');
    } finally {
      setIsSaving(false);
    }
  }, [editValue, field.type, field.required, field.key, onChange, selectedCountry]);

  const handleCancel = useCallback(() => {
    setEditValue(value); // Reset to original value
    setValidationError(null);
    setSaveError(null);
    
    // Notify parent about edit cancel
    if (onFieldEditCancel) {
      onFieldEditCancel(field.key);
    }
  }, [value, onFieldEditCancel, field.key]);

  const handleEdit = useCallback(() => {
    setEditValue(value);
    setValidationError(null);
    setSaveError(null);
    
    // Notify parent about edit start
    if (onFieldEditStart) {
      onFieldEditStart(field.key);
    }
  }, [value, onFieldEditStart, field.key]);

  // Phone-specific handlers
  const handleCountrySelect = useCallback((country) => {
    setSelectedCountry(country);
    // Update the full phone number with new country code
    const fullNumber = country.dialCode + ' ' + phoneNumber;
    setEditValue(fullNumber);
    
    // Immediately validate the phone number with new country and clear errors if valid
    const validation = ValidationService.validateField(fullNumber, field.type, field.required, country);
    setValidationError(validation.isValid ? null : validation.error);
  }, [phoneNumber, field.type, field.required]);

  const handlePhoneNumberChange = useCallback((newNumber) => {
    setPhoneNumber(newNumber);
    if (selectedCountry) {
      const fullNumber = selectedCountry.dialCode + ' ' + newNumber;
      setEditValue(fullNumber);
      
      // Immediately validate the new phone number and clear errors if valid
      const validation = ValidationService.validateField(fullNumber, field.type, field.required, selectedCountry);
      setValidationError(validation.isValid ? null : validation.error);
    }
  }, [selectedCountry, field.type, field.required]);

  const handleOpenCountrySelector = useCallback(() => {
    if (onOpenCountrySelector) {
      onOpenCountrySelector(selectedCountry, handleCountrySelect, field.key);
    }
  }, [onOpenCountrySelector, selectedCountry, handleCountrySelect, field.key]);

  const handleCall = useCallback(async () => {
    if (field.type === 'phone' && value) {
      try {
        await ApiService.makeCall(value);
      } catch (error) {
        console.error('Error making call:', error);
        // Could show a toast notification here
      }
    }
  }, [field.type, value]);

  // Memoized field value rendering to prevent unnecessary re-renders
  const renderFieldValue = useMemo(() => {
    if (!externalIsEditing) {
      return (
        <div className="text-gray-900 dark:text-white">
          {field.type === 'phone' && value ? (
            <div className="flex items-center space-x-2">
              {(() => {
                const parsed = CountryCodesService.parsePhoneNumber(value);
                return (
                  <>
                    <span className="text-lg">{parsed.country.flag}</span>
                    <span>{CountryCodesService.formatPhoneNumber(parsed.country, parsed.number)}</span>
                  </>
                );
              })()}
            </div>
          ) : field.type === 'multiselect' && Array.isArray(value) ? (
            <div className="flex flex-wrap gap-1">
              {value.map((item, index) => (
                <span
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span>{value || '-'}</span>
          )}
        </div>
      );
    }

    // Render input fields when editing
    switch (field.type) {
      case 'text':
        return (
          <input
            id={fieldId}
            type="text"
            value={editValue || ''}
            onChange={(e) => handleEditChange(e.target.value)}
            className={`input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
            required={field.required}
            disabled={isSaving}
            maxLength={255}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            aria-describedby={descriptionId}
            aria-invalid={!!validationError}
            aria-required={field.required}
          />
        );
      
      case 'email':
        return (
          <input
            id={fieldId}
            type={field.type}
            value={editValue || ''}
            onChange={(e) => handleEditChange(e.target.value)}
            className={`input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
            required={field.required}
            disabled={isSaving}
            maxLength={254}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            aria-describedby={descriptionId}
            aria-invalid={!!validationError}
            aria-required={field.required}
          />
        );
      
      case 'phone':
        return (
          <div className="space-y-2">
            {/* Country Selector Button */}
            <Suspense fallback={
              <ButtonFallback
                type="button"
                onClick={handleOpenCountrySelector}
                onKeyDown={(e) => handleKeyDown(e, handleOpenCountrySelector)}
                disabled={isSaving}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={`Select country code (currently ${selectedCountry?.name || 'United States'})`}
                aria-haspopup="dialog"
                aria-expanded="false"
              >
                <span className="text-lg" aria-hidden="true">{selectedCountry?.flag || '🌍'}</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {selectedCountry?.dialCode || '+1'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              </ButtonFallback>
            }>
              <CustomButton
                onClick={handleOpenCountrySelector}
                onKeyDown={(e) => handleKeyDown(e, handleOpenCountrySelector)}
                disabled={isSaving}
                variant="outline"
                size="md"
                icon={ChevronDown}
                aria-label={`Select country code (currently ${selectedCountry?.name || 'United States'})`}
                aria-haspopup="dialog"
                aria-expanded="false"
                className="flex items-center space-x-2 px-3 py-2"
                iconPosition="right"
              >
                <span className="text-lg" aria-hidden="true">{selectedCountry?.flag || '🌍'}</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {selectedCountry?.dialCode || '+1'}
                </span>
              </CustomButton>
            </Suspense>

            {/* Phone Number Input */}
            <div className="flex items-center space-x-2">
              <input
                id={fieldId}
                type="tel"
                value={phoneNumber || ''}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                className={`input-field flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
                required={field.required}
                disabled={isSaving}
                maxLength={15}
                placeholder={selectedCountry ? `Enter ${selectedCountry.name} phone number` : "Enter phone number"}
                title={selectedCountry ? `Format: ${selectedCountry.format || 'No specific format'}` : "Enter phone number"}
                aria-describedby={descriptionId}
                aria-invalid={!!validationError}
                aria-required={field.required}
              />
              {field.showCallButton && editValue && (
                <Suspense fallback={
                  <ButtonFallback
                    onClick={handleCall}
                    onKeyDown={(e) => handleKeyDown(e, handleCall)}
                    disabled={isSaving}
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label={`Call ${editValue}`}
                    title={`Call ${editValue}`}
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                  </ButtonFallback>
                }>
                  <CustomButton
                    onClick={handleCall}
                    onKeyDown={(e) => handleKeyDown(e, handleCall)}
                    disabled={isSaving}
                    variant="success"
                    size="sm"
                    icon={Phone}
                    aria-label={`Call ${editValue}`}
                    title={`Call ${editValue}`}
                    className="p-2"
                  />
                </Suspense>
              )}
            </div>

            {/* Country Selector Modal */}
            
          </div>
        );
      
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={editValue || ''}
            onChange={(e) => handleEditChange(e.target.value)}
            className={`input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
            rows={3}
            required={field.required}
            disabled={isSaving}
            maxLength={1000}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            aria-describedby={descriptionId}
            aria-invalid={!!validationError}
            aria-required={field.required}
          />
        );
      
      case 'select':
        return (
          <select
            id={fieldId}
            value={editValue || ''}
            onChange={(e) => handleEditChange(e.target.value)}
            className={`input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
            required={field.required}
            disabled={isSaving}
            aria-describedby={descriptionId}
            aria-invalid={!!validationError}
            aria-required={field.required}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={isSaving}
              className={`input-field flex items-center justify-between bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ${validationError ? 'border-red-500 focus:ring-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className={editValue && editValue.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                {editValue && editValue.length > 0 
                  ? `${editValue.length} selected` 
                  : 'Select options'
                }
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {isExpanded && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                {field.options?.map((option) => (
                  <label
                    key={option}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editValue?.includes(option) || false}
                      onChange={(e) => {
                        const currentValues = editValue || [];
                        if (e.target.checked) {
                          handleEditChange([...currentValues, option]);
                        } else {
                          handleEditChange(currentValues.filter((v) => v !== option));
                        }
                      }}
                      disabled={isSaving}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'number':
      case 'integer':
        return (
          <input
            id={fieldId}
            type="number"
            value={editValue || ''}
            onChange={(e) => handleEditChange(e.target.value)}
            className={`input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
            required={field.required}
            disabled={isSaving}
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            aria-describedby={descriptionId}
            aria-invalid={!!validationError}
            aria-required={field.required}
          />
        );
      
      case 'date':
        return (
          <input
            id={fieldId}
            type="date"
            value={editValue || ''}
            onChange={(e) => handleEditChange(e.target.value)}
            className={`input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
            required={field.required}
            disabled={isSaving}
            aria-describedby={descriptionId}
            aria-invalid={!!validationError}
            aria-required={field.required}
          />
        );
      
      case 'time':
        return (
          <input
            id={fieldId}
            type="time"
            value={editValue || ''}
            onChange={(e) => handleEditChange(e.target.value)}
            className={`input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
            required={field.required}
            disabled={isSaving}
            aria-describedby={descriptionId}
            aria-invalid={!!validationError}
            aria-required={field.required}
          />
        );
      
      case 'url':
        return (
          <input
            id={fieldId}
            type="url"
            value={editValue || ''}
            onChange={(e) => handleEditChange(e.target.value)}
            className={`input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500 focus:ring-red-500' : ''}`}
            required={field.required}
            disabled={isSaving}
            maxLength={2083}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            aria-describedby={descriptionId}
            aria-invalid={!!validationError}
            aria-required={field.required}
          />
        );
      
      default:
        return <span>{value || '-'}</span>;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalIsEditing, field.type, field.label, field.required, field.options, field.showCallButton, field.step, field.min, field.max, editValue, validationError, isSaving, isExpanded, handleEditChange, handleCall, selectedCountry, phoneNumber, handlePhoneNumberChange, handleOpenCountrySelector, handleCountrySelect]);

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div 
      className={`py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${hasError ? 'bg-red-50 dark:bg-red-900/10 border-l-4 border-l-red-500' : ''}`}
      role="group"
      aria-labelledby={`${fieldId}-label`}
      aria-describedby={validationError || errorMessage ? errorId : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <label 
            id={`${fieldId}-label`}
            htmlFor={fieldId}
            className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            {hasError && <span className="text-red-500 ml-1" aria-label="has error">⚠️</span>}
          </label>
          <div id={descriptionId} className="sr-only">
            {field.type === 'phone' && 'Phone number field with country code selection'}
            {field.type === 'email' && 'Email address field'}
            {field.type === 'multiselect' && 'Multiple selection field'}
            {field.type === 'select' && 'Single selection dropdown'}
            {field.type === 'textarea' && 'Multi-line text field'}
            {field.type === 'number' && 'Numeric input field'}
            {field.type === 'date' && 'Date picker field'}
            {field.type === 'time' && 'Time picker field'}
            {field.type === 'url' && 'Website URL field'}
            {field.type === 'text' && 'Text input field'}
          </div>
          {renderFieldValue}
          
          {(validationError || errorMessage) && (
            <div 
              id={errorId}
              className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                    Invalid {field.label}
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                    {validationError || errorMessage}
                  </p>
                  {field.type === 'phone' && selectedCountry && (
                    <div className="mt-2 p-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded text-xs">
                      <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                        Expected format for {selectedCountry.name}:
                      </p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono">
                        {selectedCountry.format || 'No specific format'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {saveError && (
            <div role="alert" aria-live="polite">
              <Suspense fallback={<ComponentLoadingFallback componentName="ErrorMessage" />}>
                <ErrorMessage 
                  error={saveError} 
                  variant="error" 
                  showIcon={true}
                  className="text-sm mt-2"
                />
              </Suspense>
            </div>
          )}
        </div>
        
        {field.editable && !externalIsEditing && (
          <Suspense fallback={
            <ButtonFallback
              onClick={handleEdit}
              onKeyDown={(e) => handleKeyDown(e, handleEdit)}
              disabled={isSaving}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label={`Edit ${field.label}`}
              title={`Edit ${field.label}`}
            >
              <Edit3 className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            </ButtonFallback>
          }>
            <CustomButton
              onClick={handleEdit}
              onKeyDown={(e) => handleKeyDown(e, handleEdit)}
              disabled={isSaving}
              variant="none"
              size="sm"
              icon={Edit3}
              aria-label={`Edit ${field.label}`}
              title={`Edit ${field.label}`}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              iconClassName="w-4 h-4 text-gray-500 dark:text-gray-400"
            />
          </Suspense>
        )}
        
        {externalIsEditing && (
          <div 
            className="flex items-center space-x-2 ml-2"
            role="group"
            aria-label={`Actions for ${field.label}`}
          >
            <Suspense fallback={
              <ButtonFallback
                onClick={handleSave}
                onKeyDown={(e) => handleKeyDown(e, handleSave)}
                disabled={isSaving || !!validationError}
                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label={isSaving ? 'Saving changes...' : 'Save changes'}
                title="Save changes"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </ButtonFallback>
            }>
              <CustomButton
                onClick={handleSave}
                onKeyDown={(e) => handleKeyDown(e, handleSave)}
                disabled={isSaving || !!validationError}
                variant="success"
                size="sm"
                text={isSaving ? 'Saving...' : 'Save'}
                aria-label={isSaving ? 'Saving changes...' : 'Save changes'}
                title="Save changes"
                className="px-2 py-1 text-xs"
                loading={isSaving}
              />
            </Suspense>
            
            <Suspense fallback={
              <ButtonFallback
                onClick={handleCancel}
                onKeyDown={(e) => handleKeyDown(e, handleCancel)}
                disabled={isSaving}
                className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Cancel editing"
                title="Cancel editing"
              >
                Cancel
              </ButtonFallback>
            }>
              <CustomButton
                onClick={handleCancel}
                onKeyDown={(e) => handleKeyDown(e, handleCancel)}
                disabled={isSaving}
                variant="secondary"
                size="sm"
                text="Cancel"
                aria-label="Cancel editing"
                title="Cancel editing"
                className="px-2 py-1 text-xs"
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldRenderer;