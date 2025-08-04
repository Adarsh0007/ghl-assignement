import React, { useState, useEffect, useCallback, useMemo, Suspense, useRef } from 'react';
import { ApiService } from '../services/api.js';
import { FilterService } from '../services/filterService.js';

// Lazy load all child components
const Header = React.lazy(() => import('./Header.js'));
const ContactSummary = React.lazy(() => import('./ContactSummary.js'));
const Tabs = React.lazy(() => import('./Tabs.js'));
const Search = React.lazy(() => import('./Search.js'));
const FolderRenderer = React.lazy(() => import('./FolderRenderer.js'));
const FilterModal = React.lazy(() => import('./FilterModal.js'));
const CountrySelector = React.lazy(() => import('./CountrySelector.js'));
const ErrorMessage = React.lazy(() => import('./ErrorMessage.js'));
const ComponentLoadingFallback = React.lazy(() => import('./globalComponents/ComponentLoadingFallback.js'));
const ContactDetailsSkeleton = React.lazy(() => import('./globalComponents/ContactDetailsSkeleton.js'));
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));

// Dynamic import for services
const { DynamicFieldService } = await import('../services/dynamicFieldService.js');

const ContactDetails = ({ onContactChange }) => {
  const [layoutConfig, setLayoutConfig] = useState(null);
  const [contactFieldsConfig, setContactFieldsConfig] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all-fields');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(FilterService.getDefaultFilters());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const [countrySelectorData, setCountrySelectorData] = useState({
    selectedCountry: null,
    onCountrySelect: null,
    fieldKey: null
  });
  
  // Pagination and unsaved changes tracking - contact-specific
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingFields, setEditingFields] = useState(new Map()); // Map<contactId, Set<fieldKey>>
  const [fieldErrors, setFieldErrors] = useState(new Map()); // Map<contactId, Map<fieldKey, error>>
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  // Ref to track current editing state to prevent race conditions
  const editingFieldsRef = useRef(new Map());
  const currentContactIdRef = useRef(null);

  // All hooks must be called before any conditional returns
  
  // Keep ref in sync with state and handle contact changes
  useEffect(() => {
    if (contactData?.id) {
      currentContactIdRef.current = contactData.id;
      // Initialize ref with current state
      const currentEditingFields = editingFields.get(contactData.id) || new Set();
      editingFieldsRef.current.set(contactData.id, new Set(currentEditingFields));
    }
  }, [contactData?.id, editingFields]);
  
  // Notify parent component when contact data changes
  useEffect(() => {
    if (onContactChange && contactData) {
      onContactChange(contactData);
    }
  }, [contactData, onContactChange]);

  const handleFieldChange = useCallback(async (key, value) => {
    if (!contactData || !allContacts) return;
    
    try {
      const updatedData = { ...contactData, [key]: value };
      setContactData(updatedData);
      
      // Update the contact in the allContacts array
      const updatedContacts = [...allContacts];
      updatedContacts[currentContactIndex] = updatedData;
      setAllContacts(updatedContacts);
      
      // Save to backend with error handling
      await ApiService.saveContact(contactData.id, updatedData);
      
      // Clear unsaved changes flag after successful save
      setHasUnsavedChanges(false);
      
      // Update ref and state to remove the field from editing
      const currentEditingFields = editingFieldsRef.current.get(contactData.id) || new Set();
      currentEditingFields.delete(key);
      
      if (currentEditingFields.size === 0) {
        editingFieldsRef.current.delete(contactData.id);
      } else {
        editingFieldsRef.current.set(contactData.id, currentEditingFields);
      }
      
      setEditingFields(prev => {
        const newMap = new Map(prev);
        if (currentEditingFields.size === 0) {
          newMap.delete(contactData.id);
        } else {
          newMap.set(contactData.id, new Set(currentEditingFields));
        }
        return newMap;
      });
    } catch (error) {
      console.error('Error saving field:', error);
      // Revert the change if save failed
      setContactData(contactData);
      throw error; // Re-throw to let the field component handle it
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData, allContacts, currentContactIndex]);

  const handleTagsChange = useCallback(async (newTags) => {
    if (!contactData || !allContacts) return;
    
    try {
      const updatedData = { ...contactData, tags: newTags };
      setContactData(updatedData);
      
      // Update the contact in the allContacts array
      const updatedContacts = [...allContacts];
      updatedContacts[currentContactIndex] = updatedData;
      setAllContacts(updatedContacts);
      
      // Save to backend with error handling
      await ApiService.saveContact(contactData.id, updatedData);
    } catch (error) {
      console.error('Error saving tags:', error);
      // Revert the change if save failed
      setContactData(contactData);
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData, allContacts, currentContactIndex]);

  const handleOwnerChange = useCallback(async (newOwner) => {
    if (!contactData || !allContacts) return;
    
    try {
      const updatedData = { ...contactData, owner: newOwner };
      setContactData(updatedData);
      
      // Update the contact in the allContacts array
      const updatedContacts = [...allContacts];
      updatedContacts[currentContactIndex] = updatedData;
      setAllContacts(updatedContacts);
      
      // Save to backend with error handling
      await ApiService.saveContact(contactData.id, updatedData);
    } catch (error) {
      console.error('Error saving owner:', error);
      // Revert the change if save failed
      setContactData(contactData);
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData, allContacts, currentContactIndex]);

  const handleFollowersChange = useCallback(async (newFollowers) => {
    if (!contactData || !allContacts) return;
    
    try {
      const updatedData = { ...contactData, followers: newFollowers };
      setContactData(updatedData);
      
      // Update the contact in the allContacts array
      const updatedContacts = [...allContacts];
      updatedContacts[currentContactIndex] = updatedData;
      setAllContacts(updatedContacts);
      
      // Save to backend with error handling
      await ApiService.saveContact(contactData.id, updatedData);
    } catch (error) {
      console.error('Error saving followers:', error);
      // Revert the change if save failed
      setContactData(contactData);
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData, allContacts, currentContactIndex]);

  const handleAddField = useCallback(async (folderName, newField) => {
    if (!contactFieldsConfig) return;
    
    try {
      // Find the folder in the configuration
      const folderIndex = contactFieldsConfig.folders.findIndex(folder => folder.name === folderName);
      if (folderIndex === -1) return;

      // Create a copy of the configuration
      const updatedConfig = {
        ...contactFieldsConfig,
        folders: [...contactFieldsConfig.folders]
      };

      // Add the new field to the folder
      updatedConfig.folders[folderIndex] = {
        ...updatedConfig.folders[folderIndex],
        fields: [...updatedConfig.folders[folderIndex].fields, newField]
      };

      // Update the configuration
      setContactFieldsConfig(updatedConfig);

      // Add default value to contact data
      const defaultValue = DynamicFieldService.getDefaultValue(newField.type);
      const updatedData = { ...contactData, [newField.key]: defaultValue };
      setContactData(updatedData);

      // Update the contact in the allContacts array
      const updatedContacts = [...allContacts];
      updatedContacts[currentContactIndex] = updatedData;
      setAllContacts(updatedContacts);

      // Save the updated contact to backend
      await ApiService.saveContact(contactData.id, updatedData);

      // Note: In a real application, you would also save the updated configuration to backend
      console.log('New field added:', newField);
    } catch (error) {
      console.error('Error adding field:', error);
      // Revert changes if save failed
      setContactData(contactData);
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactFieldsConfig, contactData, allContacts, currentContactIndex]);

  const handleCall = useCallback(() => {
    if (contactData?.phone) {
      ApiService.makeCall(contactData.phone).catch(console.error);
    }
  }, [contactData?.phone]);

  const performNavigation = useCallback((direction) => {
    if (!allContacts || allContacts.length === 0) return;
    
    let newIndex = currentContactIndex;
    
    if (direction === 'prev') {
      newIndex = currentContactIndex > 0 ? currentContactIndex - 1 : allContacts.length - 1;
    } else if (direction === 'next') {
      newIndex = currentContactIndex < allContacts.length - 1 ? currentContactIndex + 1 : 0;
    }
    
    setCurrentContactIndex(newIndex);
    setContactData(allContacts[newIndex]);
    
    // Clear any pending navigation
    setPendingNavigation(null);
    setShowUnsavedChangesAlert(false);
    
    console.log(`Navigating ${direction} to contact ${newIndex + 1} of ${allContacts.length}`);
  }, [allContacts, currentContactIndex]);

  const handleNavigate = useCallback((direction) => {
    if (!allContacts || allContacts.length === 0) return;
    
    // Check for unsaved changes or errors for current contact only
    const currentContactFieldErrors = fieldErrors.get(contactData?.id) || new Map();
    
    if (hasUnsavedChanges || currentContactFieldErrors.size > 0) {
      setPendingNavigation(direction);
      setShowUnsavedChangesAlert(true);
      return;
    }
    
    // Proceed with navigation
    performNavigation(direction);
  }, [allContacts, hasUnsavedChanges, fieldErrors, contactData?.id, performNavigation]);

  const handleBack = useCallback(() => {
    console.log('Going back');
    // In a real app, this would navigate back to the contacts list
  }, []);

  const handleFilterClick = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  const handleCloseFilterModal = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    console.log('Applied filters:', newFilters);
  }, []);

  // Country selector handlers
  const handleOpenCountrySelector = useCallback((selectedCountry, onCountrySelect, fieldKey) => {
    setCountrySelectorData({
      selectedCountry,
      onCountrySelect,
      fieldKey
    });
    setIsCountrySelectorOpen(true);
  }, []);

  const handleCloseCountrySelector = useCallback(() => {
    setIsCountrySelectorOpen(false);
    setCountrySelectorData({
      selectedCountry: null,
      onCountrySelect: null,
      fieldKey: null
    });
  }, []);

  const handleCountrySelect = useCallback((country) => {
    if (countrySelectorData.onCountrySelect) {
      countrySelectorData.onCountrySelect(country);
    }
    handleCloseCountrySelector();
  }, [countrySelectorData, handleCloseCountrySelector]);

  // Field editing and error tracking - contact-specific
  const handleFieldEditStart = useCallback((fieldKey) => {
    if (!contactData?.id) return;
    
    // Update ref immediately for synchronous access
    const currentEditingFields = editingFieldsRef.current.get(contactData.id) || new Set();
    currentEditingFields.add(fieldKey);
    editingFieldsRef.current.set(contactData.id, currentEditingFields);
    currentContactIdRef.current = contactData.id;
    
    // Update state
    setEditingFields(prev => {
      const newMap = new Map(prev);
      const contactEditingFields = new Set(currentEditingFields);
      newMap.set(contactData.id, contactEditingFields);
      return newMap;
    });
    
    // Always set hasUnsavedChanges to true when starting to edit
    setHasUnsavedChanges(true);
  }, [contactData?.id]);

  const handleFieldEditCancel = useCallback((fieldKey) => {
    if (!contactData?.id) return;
    
    // Update ref immediately for synchronous access
    const currentEditingFields = editingFieldsRef.current.get(contactData.id) || new Set();
    currentEditingFields.delete(fieldKey);
    
    // Check if this contact still has any editing fields
    const hasRemainingEditingFields = currentEditingFields.size > 0;
    
    if (currentEditingFields.size === 0) {
      editingFieldsRef.current.delete(contactData.id);
    } else {
      editingFieldsRef.current.set(contactData.id, currentEditingFields);
    }
    
    // Update state
    setEditingFields(prev => {
      const newMap = new Map(prev);
      if (currentEditingFields.size === 0) {
        newMap.delete(contactData.id);
      } else {
        newMap.set(contactData.id, new Set(currentEditingFields));
      }
      return newMap;
    });
    
    // Update hasUnsavedChanges based on the current state
    setHasUnsavedChanges(hasRemainingEditingFields);
  }, [contactData?.id]);

  const handleFieldError = useCallback((fieldKey, error) => {
    if (!contactData?.id) return;
    
    setFieldErrors(prev => {
      const newMap = new Map(prev);
      const contactFieldErrors = newMap.get(contactData.id) || new Map();
      if (error) {
        contactFieldErrors.set(fieldKey, error);
      } else {
        contactFieldErrors.delete(fieldKey);
      }
      if (contactFieldErrors.size === 0) {
        newMap.delete(contactData.id);
      } else {
        newMap.set(contactData.id, contactFieldErrors);
      }
      return newMap;
    });
  }, [contactData?.id]);

  const handleFieldErrorClear = useCallback((fieldKey) => {
    if (!contactData?.id) return;
    
    setFieldErrors(prev => {
      const newMap = new Map(prev);
      const contactFieldErrors = newMap.get(contactData.id) || new Map();
      contactFieldErrors.delete(fieldKey);
      if (contactFieldErrors.size === 0) {
        newMap.delete(contactData.id);
      } else {
        newMap.set(contactData.id, contactFieldErrors);
      }
      return newMap;
    });
  }, [contactData?.id]);

  // Memoized filtered folders to prevent unnecessary re-computation
  const filteredFolders = useMemo(() => {
    if (!contactFieldsConfig?.folders || !contactData) return [];
    
    // First apply search term filtering
    let searchFilteredFolders = contactFieldsConfig.folders;
    if (searchTerm.trim()) {
      searchFilteredFolders = contactFieldsConfig.folders.map(folder => ({
        ...folder,
        fields: folder.fields.filter(field => {
          const fieldLabel = field.label.toLowerCase();
          const fieldValue = String(contactData[field.key] || '').toLowerCase();
          const searchLower = searchTerm.toLowerCase();
          return fieldLabel.includes(searchLower) || fieldValue.includes(searchLower);
        })
      })).filter(folder => folder.fields.length > 0);
    }
    
    // Then apply advanced filters
    return FilterService.filterFolders(searchFilteredFolders, filters, contactData);
  }, [contactFieldsConfig?.folders, contactData, searchTerm, filters]);



  // Handle unsaved changes alert - contact-specific
  const handleUnsavedChangesConfirm = useCallback(() => {
    // Clear unsaved changes and errors for current contact only
    setHasUnsavedChanges(false);
    setEditingFields(prev => {
      const newMap = new Map(prev);
      newMap.delete(contactData?.id);
      return newMap;
    });
    setFieldErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(contactData?.id);
      return newMap;
    });
    setShowUnsavedChangesAlert(false);
    
    // Proceed with pending navigation
    if (pendingNavigation) {
      performNavigation(pendingNavigation);
    }
  }, [pendingNavigation, performNavigation, contactData?.id]);

  const handleUnsavedChangesCancel = useCallback(() => {
    setShowUnsavedChangesAlert(false);
    setPendingNavigation(null);
  }, []);

  // Memoized section renderer to prevent unnecessary re-renders
  const renderSection = useCallback((section) => {
    switch (section.type) {
      case 'header':
        return (
          <Suspense fallback={<ComponentLoadingFallback componentName="Header" />}>
            <Header
              title={section.title || 'Contact Details'}
              showNavigation={section.showNavigation || false}
              currentContactIndex={currentContactIndex + 1}
              totalContacts={allContacts.length}
              onNavigate={handleNavigate}
              onBack={handleBack}
            />
          </Suspense>
        );
      
      case 'contact-summary':
        return (
          <div className="p-4 lg:p-6 pb-1">
            <Suspense fallback={<ComponentLoadingFallback componentName="Contact Summary" />}>
              <ContactSummary
                contact={contactData}
                showProfile={section.showProfile || false}
                showOwner={section.showOwner || false}
                showFollowers={section.showFollowers || false}
                showTags={section.showTags || false}
                onTagsChange={handleTagsChange}
                onCall={handleCall}
                onOwnerChange={handleOwnerChange}
                onFollowersChange={handleFollowersChange}
              />
            </Suspense>
          </div>
        );
      
      case 'tabs':
        return (
          <div className="px-4 lg:px-6 pt-3 lg:pt-4">
            <Suspense fallback={<ComponentLoadingFallback componentName="Tabs" />}>
              <Tabs
                tabs={section.tabs || []}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </Suspense>
          </div>
        );
      
      case 'search':
        return (
          <div className="px-4 lg:px-6 pt-3 lg:pt-4">
            <Suspense fallback={<ComponentLoadingFallback componentName="Search" />}>
              <Search
                placeholder={section.placeholder || 'Search Fields and Folders'}
                value={searchTerm}
                onChange={setSearchTerm}
                showFilter={section.showFilter || false}
                onFilterClick={handleFilterClick}
              />
            </Suspense>
          </div>
        );
      
      case 'contact-fields':
        if (activeTab === 'all-fields') {
          return (
            <div className="p-4 lg:p-6">
              {filteredFolders.length > 0 ? (
                <>
                  {FilterService.hasActiveFilters(filters) && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Filters Applied
                          </span>
                          <span className="text-xs text-blue-600 dark:text-blue-300">
                            Showing {filteredFolders.length} of {contactFieldsConfig?.folders?.length || 0} folders
                          </span>
                        </div>
                        <CustomButton
                          onClick={() => setFilters(FilterService.getDefaultFilters())}
                          text="Clear Filters"
                          variant="secondary"
                          size="sm"
                        />
                      </div>
                    </div>
                  )}
                  {filteredFolders.map((folder) => (
                    <Suspense key={folder.name} fallback={<ComponentLoadingFallback componentName="Folder" />}>
                      <FolderRenderer
                        folder={folder}
                        contactData={contactData}
                        onFieldChange={handleFieldChange}
                        searchTerm={searchTerm}
                        onAddField={handleAddField}
                        onOpenCountrySelector={handleOpenCountrySelector}
                        onFieldEditStart={handleFieldEditStart}
                        onFieldEditCancel={handleFieldEditCancel}
                        onFieldError={handleFieldError}
                        onFieldErrorClear={handleFieldErrorClear}
                        editingFields={editingFields.get(contactData?.id) || new Set()}
                        fieldErrors={fieldErrors.get(contactData?.id) || new Map()}
                      />
                    </Suspense>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm.trim() || FilterService.hasActiveFilters(filters)
                      ? 'No fields match your search or filter criteria'
                      : 'No fields available'}
                  </p>
                  {(searchTerm.trim() || FilterService.hasActiveFilters(filters)) && (
                    <Suspense fallback={<button className="mt-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">Clear search and filters</button>}>
                      <CustomButton
                        onClick={() => {
                          setSearchTerm('');
                          setFilters(FilterService.getDefaultFilters());
                        }}
                        text="Clear search and filters"
                        variant="secondary"
                        size="sm"
                        className="mt-2"
                      />
                    </Suspense>
                  )}
                </div>
              )}
            </div>
          );
        }
        return (
          <div className="p-4 lg:p-6">
            <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {activeTab === 'dnd' ? 'Do Not Disturb settings will appear here' : 'Actions will appear here'}
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contactData,
    activeTab,
    searchTerm,
    filteredFolders,
    filters,
    handleNavigate,
    handleCall,
    handleBack,
    handleTagsChange,
    handleFieldChange,
    handleFilterClick,
    handleAddField,
    handleOpenCountrySelector,
    setActiveTab,
    setSearchTerm,
    setFilters,
    handleOwnerChange,
    handleFollowersChange
  ]);

  // Memoized sections to prevent unnecessary re-renders
  const sections = useMemo(() => {
    if (!layoutConfig?.sections) return null;
    
    return layoutConfig.sections.map((section, index) => {
      const sectionKey = `${section.type}-${section.id || index}`;
      return (
        <div key={sectionKey}>
          {renderSection(section)}
        </div>
      );
    });
  }, [layoutConfig?.sections, renderSection]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get localStorage service
        const { localStorageService } = await import('../services/localStorageService.js');
        
        // Try to initialize data directly
        const initSuccess = await localStorageService.initializeData();
        
        if (!initSuccess) {
          throw new Error('Failed to initialize data from JSON files');
        }
        
        // Now fetch the data
        const layout = await ApiService.fetchLayoutConfig();
        const fields = await ApiService.fetchContactFieldsConfig();
        const contacts = await ApiService.fetchContactData();
        
        if (!layout || !fields || !contacts) {
          throw new Error('Failed to load one or more required data files');
        }
        
        setLayoutConfig(layout);
        setContactFieldsConfig(fields);
        setAllContacts(contacts);
        
        // Set the first contact as current
        if (contacts && contacts.length > 0) {
          setContactData(contacts[0]);
          setCurrentContactIndex(0);
        } else {
          throw new Error('No contact data found');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        // Re-throw error so ErrorBoundary can catch if not handled by state
        throw err;
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Suspense fallback={<ComponentLoadingFallback componentName="Contact Details Skeleton" size="lg" />}>
        <ContactDetailsSkeleton />
      </Suspense>
    );
  }

  if (error || !layoutConfig || !contactFieldsConfig || !contactData) {
    return (
      <div className="min-h-screen lg:h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorMessage 
            error={error || 'Failed to load contact data'} 
            title="Data Loading Error"
            variant="error"
            showIcon={true}
            className="mb-4"
          />
          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Troubleshooting Steps:
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Ensure all JSON files are in the correct location</li>
              <li>• Check that the server is running properly</li>
              <li>• Verify file permissions and accessibility</li>
              <li>• Clear browser cache and reload the page</li>
            </ul>
          </div>
          <div className="text-center space-y-2">
            <Suspense fallback={<button className="btn-primary">Retry</button>}>
              <CustomButton
                onClick={() => window.location.reload()} 
                text="Retry"
                variant="primary"
                size="md"
              />
            </Suspense>
            <Suspense fallback={<button className="btn-secondary ml-2">Clear Cache & Retry</button>}>
              <CustomButton
                onClick={() => {
                  const { localStorageService } = require('../services/localStorageService.js');
                  localStorageService.clearAllData();
                  window.location.reload();
                }}
                text="Clear Cache & Retry"
                variant="secondary"
                size="md"
                className="ml-2"
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-full bg-gray-50 dark:bg-gray-900">
      <div className="min-h-screen lg:h-full">
        <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-y-auto min-h-screen lg:h-full mx-2 lg:mx-0 scroll-smooth">
          {sections}
        </div>
      </div>
      <Suspense fallback={<ComponentLoadingFallback componentName="Filter Modal" size="md" />}>
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={handleCloseFilterModal}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      </Suspense>
      <Suspense fallback={<ComponentLoadingFallback componentName="Country Selector" size="md" />}>
        <CountrySelector
          selectedCountry={countrySelectorData.selectedCountry}
          onCountrySelect={handleCountrySelect}
          isOpen={isCountrySelectorOpen}
          onClose={handleCloseCountrySelector}
          disabled={false}
        />
      </Suspense>
      
      {/* Unsaved Changes Alert Modal */}
      {showUnsavedChangesAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Unsaved Changes
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have unsaved changes or validation errors.
                  </p>
                </div>
              </div>
              
              {/* Show editing fields */}
              {(editingFields.get(contactData?.id) || new Set()).size > 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Fields being edited:
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    {Array.from(editingFields.get(contactData?.id) || new Set()).map(fieldKey => (
                      <li key={fieldKey} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{fieldKey}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Show field errors */}
              {(fieldErrors.get(contactData?.id) || new Map()).size > 0 && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Fields with errors:
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {Array.from((fieldErrors.get(contactData?.id) || new Map()).entries()).map(([fieldKey, error]) => (
                      <li key={fieldKey} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>{fieldKey}: {error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex space-x-3 mt-6">
                <Suspense fallback={<button onClick={handleUnsavedChangesCancel} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Cancel</button>}>
                  <CustomButton
                    onClick={handleUnsavedChangesCancel}
                    text="Cancel"
                    variant="secondary"
                    size="md"
                    className="flex-1"
                  />
                </Suspense>
                <Suspense fallback={<button onClick={handleUnsavedChangesConfirm} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Discard Changes & Continue</button>}>
                  <CustomButton
                    onClick={handleUnsavedChangesConfirm}
                    text="Discard Changes & Continue"
                    variant="danger"
                    size="md"
                    className="flex-1"
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDetails; 