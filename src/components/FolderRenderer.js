import React, { useState, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import FieldRenderer from './FieldRenderer.js';
import AddFieldModal from './AddFieldModal.js';

const FolderRenderer = ({
  folder,
  contactData,
  onFieldChange,
  searchTerm,
  onAddField,
  onOpenCountrySelector,
  onFieldEditStart,
  onFieldEditCancel,
  onFieldError,
  onFieldErrorClear,
  editingFields,
  fieldErrors
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);

  // Use the fields directly since filtering is now handled in parent component
  const filteredFields = useMemo(() => {
    return folder.fields;
  }, [folder.fields]);

  // Toggle expansion handler
  const handleToggleExpansion = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Add field handler
  const handleAddField = useCallback(() => {
    setIsAddFieldModalOpen(true);
  }, []);

  // Handle new field creation
  const handleNewFieldCreated = useCallback((newField) => {
    if (onAddField) {
      onAddField(folder.name, newField);
    }
    setIsAddFieldModalOpen(false);
  }, [onAddField, folder.name]);

  // Handle close modal
  const handleCloseAddFieldModal = useCallback(() => {
    setIsAddFieldModalOpen(false);
  }, []);

  // If no fields match the search, don't render the folder
  if (filteredFields.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">{folder.name}</h3>
          <div className="flex items-center space-x-2">
            {folder.showAddButton && (
              <button 
                onClick={handleAddField}
                className="inline-flex items-center text-xs lg:text-sm text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500 transition-colors"
              >
                <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                <span className="hidden sm:inline text-blue-600 dark:text-blue-400 font-medium">{folder.addButtonText || 'Add'}</span>
              </button>
            )}
            <button
              onClick={handleToggleExpansion}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 lg:p-4 bg-white dark:bg-gray-800">
          {filteredFields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={contactData[field.key]}
              onChange={onFieldChange}
              onOpenCountrySelector={onOpenCountrySelector}
              onFieldEditStart={onFieldEditStart}
              onFieldEditCancel={onFieldEditCancel}
              onFieldError={onFieldError}
              onFieldErrorClear={onFieldErrorClear}
              isEditing={editingFields?.has(field.key) || false}
              hasError={fieldErrors?.has(field.key) || false}
              errorMessage={fieldErrors?.get(field.key) || null}
            />
          ))}
        </div>
      )}

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={isAddFieldModalOpen}
        onClose={handleCloseAddFieldModal}
        onAddField={handleNewFieldCreated}
        folderName={folder.name}
        existingFields={filteredFields}
      />
    </div>
  );
};

export default FolderRenderer; 