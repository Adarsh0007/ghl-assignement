import React, { useState, useCallback, useMemo } from 'react';
import { X, Search, Check, Users } from 'lucide-react';
import { FollowerService } from '../services/followerService.js';

const FollowerSelector = ({ 
  isOpen, 
  onClose, 
  onFollowersSelect, 
  currentFollowers = [],
  contactName 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFollowers, setSelectedFollowers] = useState(new Set(currentFollowers));

  // Filter followers based on search query
  const filteredFollowers = useMemo(() => {
    return FollowerService.searchFollowers(searchQuery);
  }, [searchQuery]);

  // Handle follower selection/deselection
  const handleFollowerToggle = useCallback((followerName) => {
    setSelectedFollowers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(followerName)) {
        newSet.delete(followerName);
      } else {
        newSet.add(followerName);
      }
      return newSet;
    });
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    if (onFollowersSelect) {
      onFollowersSelect(Array.from(selectedFollowers));
    }
    onClose();
  }, [selectedFollowers, onFollowersSelect, onClose]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setSelectedFollowers(new Set(currentFollowers));
    onClose();
  }, [currentFollowers, onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    setSelectedFollowers(new Set(filteredFollowers.map(f => f.name)));
  }, [filteredFollowers]);

  // Handle deselect all
  const handleDeselectAll = useCallback(() => {
    setSelectedFollowers(new Set());
  }, []);

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
              Select Followers
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose followers for {contactName}
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
              type="text"
              placeholder="Search followers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedFollowers.size} selected
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-xs px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Followers List - Scrollable Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredFollowers.length > 0 ? (
            <div className="p-2">
              {filteredFollowers.map((follower) => (
                <label
                  key={follower.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFollowers.has(follower.name)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      checked={selectedFollowers.has(follower.name)}
                      onChange={() => handleFollowerToggle(follower.name)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {follower.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {follower.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {follower.email}
                        </p>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          {follower.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedFollowers.has(follower.name) && (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </label>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No followers found matching "{searchQuery}"
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
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Followers ({selectedFollowers.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowerSelector; 