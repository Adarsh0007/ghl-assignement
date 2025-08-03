import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';

// Lazy load child components
const FieldRenderer = React.lazy(() => import('./FieldRenderer.js'));
const AddFieldModal = React.lazy(() => import('./AddFieldModal.js'));

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
              <Suspense fallback={
                <ButtonFallback 
                  onClick={handleAddField}
                  className="inline-flex items-center text-xs lg:text-sm text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500 transition-colors"
                  aria-label={folder.addButtonText || 'Add'}
                  title={folder.addButtonText || 'Add'}
                >
                  <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                  <span className="hidden sm:inline text-blue-600 dark:text-blue-400 font-medium">{folder.addButtonText || 'Add'}</span>
                </ButtonFallback>
              }>
                <CustomButton
                  onClick={handleAddField}
                  variant="none"
                  size="sm"
                  icon={Plus}
                  text={folder.addButtonText || 'Add'}
                  aria-label={folder.addButtonText || 'Add'}
                  title={folder.addButtonText || 'Add'}
                  className="inline-flex items-center text-xs lg:text-sm"
                  iconClassName="text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500"
                  textClassName="text-blue-600 dark:text-blue-400 font-medium"
                />
              </Suspense>
            )}
            <Suspense fallback={
              <ButtonFallback
                onClick={handleToggleExpansion}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
                title={isExpanded ? "Collapse folder" : "Expand folder"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 dark:text-gray-400" />
                )}
              </ButtonFallback>
            }>
              <CustomButton
                onClick={handleToggleExpansion}
                variant="none"
                size="sm"
                icon={isExpanded ? ChevronUp : ChevronDown}
                aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
                title={isExpanded ? "Collapse folder" : "Expand folder"}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                iconClassName="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 dark:text-gray-400"
              />
            </Suspense>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 lg:p-4 bg-white dark:bg-gray-800">
          {filteredFields.map((field) => (
            <Suspense key={field.key} fallback={<ComponentLoadingFallback componentName="Field" />}>
              <FieldRenderer
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
            </Suspense>
          ))}
        </div>
      )}

      {/* Add Field Modal */}
      <Suspense fallback={<ComponentLoadingFallback componentName="Add Field Modal" />}>
        <AddFieldModal
          isOpen={isAddFieldModalOpen}
          onClose={handleCloseAddFieldModal}
          onAddField={handleNewFieldCreated}
          folderName={folder.name}
          existingFields={filteredFields}
        />
      </Suspense>
    </div>
  );
};

export default FolderRenderer; 