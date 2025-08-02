import React, { useState, useCallback, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { OwnerService } from '../services/ownerService.js';

const OwnerSelector = ({ 
  isOpen, 
  onClose, 
  onOwnerSelect, 
  currentOwner,
  contactName 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(currentOwner);

  // Filter owners based on search query
  const filteredOwners = useMemo(() => {
    return OwnerService.searchOwners(searchQuery);
  }, [searchQuery]);

  // Handle owner selection
  const handleOwnerSelect = useCallback((owner) => {
    setSelectedOwner(owner.name);
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    if (selectedOwner && onOwnerSelect) {
      onOwnerSelect(selectedOwner);
    }
    onClose();
  }, [selectedOwner, onOwnerSelect, onClose]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setSelectedOwner(currentOwner);
    onClose();
  }, [currentOwner, onClose]);

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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Owner
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose an owner for {contactName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="owner-search"
              type="text"
              placeholder="Search owners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Owner List - Scrollable Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredOwners.length > 0 ? (
            <div className="p-2">
              {filteredOwners.map((owner) => (
                <label
                  key={owner.id}
                  htmlFor={`owner-${owner.id}`}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedOwner === owner.name
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    <input
                      id={`owner-${owner.id}`}
                      type="radio"
                      name="owner"
                      value={owner.name}
                      checked={selectedOwner === owner.name}
                      onChange={() => handleOwnerSelect(owner)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {owner.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {owner.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {owner.email}
                      </p>
                    </div>
                  </div>

                  {selectedOwner === owner.name && (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </label>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No owners found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Footer - Always Visible */}
        <div className="flex space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedOwner}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Save Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerSelector; 