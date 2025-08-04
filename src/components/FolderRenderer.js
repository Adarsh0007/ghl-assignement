import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';

// Lazy load components
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));
const FieldRenderer = React.lazy(() => import('./FieldRenderer.js'));
const AddFieldModal = React.lazy(() => import('./AddFieldModal.js'));
const ComponentLoadingFallback = React.lazy(() => import('./globalComponents/ComponentLoadingFallback.js'));

// Button fallback component
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

  // Filter fields based on search term
  const filteredFields = useMemo(() => {
    if (!searchTerm.trim()) return folder.fields || [];
    
    return (folder.fields || []).filter(field => {
      const searchLower = searchTerm.toLowerCase();
      return (
        field.label?.toLowerCase().includes(searchLower) ||
        field.key?.toLowerCase().includes(searchLower) ||
        field.description?.toLowerCase().includes(searchLower) ||
        String(contactData[field.key] || '').toLowerCase().includes(searchLower)
      );
    });
  }, [folder.fields, searchTerm, contactData]);

  const handleToggleExpansion = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleAddField = useCallback(() => {
    setIsAddFieldModalOpen(true);
  }, []);

  const handleCloseAddFieldModal = useCallback(() => {
    setIsAddFieldModalOpen(false);
  }, []);

  const handleNewFieldCreated = useCallback((newField) => {
    onAddField(folder.name, newField);
    setIsAddFieldModalOpen(false);
  }, [onAddField, folder.name]);

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
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label={folder.addButtonText || 'Add'}
                  title={folder.addButtonText || 'Add'}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-gray-500 dark:text-gray-400 font-medium">{folder.addButtonText || 'Add'}</span>
                </ButtonFallback>
              }>
                <CustomButton
                  onClick={handleAddField}
                  variant="none"
                  size="md"
                  icon={Plus}
                  text={folder.addButtonText || 'Add'}
                  aria-label={folder.addButtonText || 'Add'}
                  title={folder.addButtonText || 'Add'}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  iconClassName="w-4 h-4"
                  textClassName="text-gray-500 dark:text-gray-400 font-medium"
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
                isEditing={editingFields && editingFields.has(field.key)}
                hasError={fieldErrors && fieldErrors.has(field.key)}
                errorMessage={fieldErrors && fieldErrors.get(field.key)}
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