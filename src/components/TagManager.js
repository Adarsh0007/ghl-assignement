import React, { useState, useRef, useEffect, useCallback, Suspense, useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import { CustomButton } from './globalComponents/index.js';

// Lazy load FormField
const FormField = React.lazy(() => import('./globalComponents/FormField.js'));

// Button fallback component
const ButtonFallback = ({ children, iconClassName, textClassName, ...props }) => (
  <button {...props}>
    {children}
  </button>
);

const TagManager = ({ contactTags = [], onTagsChange }) => {
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Common tag suggestions
  const commonTags = useMemo(() => [
    'VIP', 'Important', 'Follow Up', 'Lead', 'Customer', 'Prospect', 
    'Hot Lead', 'Cold Lead', 'Qualified', 'Unqualified', 'Decision Maker',
    'Influencer', 'Budget Holder', 'Technical Contact', 'Business Contact'
  ], []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (newTag.trim()) {
      const filtered = commonTags.filter(tag => 
        tag.toLowerCase().includes(newTag.toLowerCase()) &&
        !contactTags.includes(tag)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newTag, contactTags, commonTags]);

  const handleCreateNewTag = useCallback(() => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !contactTags.includes(trimmedTag)) {
      const updatedTags = [...contactTags, trimmedTag];
      onTagsChange(updatedTags);
      setNewTag('');
      setShowAddTag(false);
      setShowSuggestions(false);
    }
  }, [newTag, contactTags, onTagsChange]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    const updatedTags = contactTags.filter(tag => tag !== tagToRemove);
    onTagsChange(updatedTags);
  }, [contactTags, onTagsChange]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setNewTag(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCreateNewTag();
    } else if (event.key === 'Escape') {
      setShowAddTag(false);
      setNewTag('');
      setShowSuggestions(false);
    }
  }, [handleCreateNewTag]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </h3>
      </div>
      
      {/* Existing Tags */}
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {contactTags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="truncate max-w-[120px] sm:max-w-[150px] lg:max-w-[200px]">{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors flex-shrink-0"
              title="Remove tag"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {/* Add Tag Button */}
        {!showAddTag && (
          <Suspense fallback={<ButtonFallback onClick={() => { setShowAddTag(true); setTimeout(() => inputRef.current?.focus(), 100); }} className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-1.5 rounded-full text-sm transition-colors border border-gray-200 dark:border-gray-600"><Plus className="w-3 h-3" /><span className="text-blue-600 dark:text-blue-400 font-medium">Add Tag</span></ButtonFallback>}>
            <CustomButton
              onClick={() => {
                setShowAddTag(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              variant="none"
              size="sm"
              icon={Plus}
              text="Add Tag"
              className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-gray-600"
            />
          </Suspense>
        )}
      </div>

      {/* Add Tag Input */}
      {showAddTag && (
        <div className="relative">
          <div className="flex items-center space-x-2">
            <Suspense fallback={<input
              id="tag-input"
              ref={inputRef}
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type tag name..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />}>
              <FormField
                type="text"
                name="newTag"
                value={newTag}
                onChange={(value) => setNewTag(value)}
                placeholder="Type tag name..."
                className="flex-1 mb-0"
                inputClassName="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                onKeyDown={handleKeyPress}
                ref={inputRef}
              />
            </Suspense>
            <Suspense fallback={<ButtonFallback onClick={handleCreateNewTag} disabled={!newTag.trim()} className="px-3 py-1.5 text-sm bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Add</ButtonFallback>}>
              <CustomButton
                onClick={handleCreateNewTag}
                disabled={!newTag.trim()}
                variant="primary"
                size="sm"
                text="Add"
                className="px-3 py-1.5 text-sm"
              />
            </Suspense>
            <Suspense fallback={<ButtonFallback onClick={() => { setShowAddTag(false); setNewTag(''); setShowSuggestions(false); }} className="px-3 py-1.5 text-sm bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">Cancel</ButtonFallback>}>
              <CustomButton
                onClick={() => {
                  setShowAddTag(false);
                  setNewTag('');
                  setShowSuggestions(false);
                }}
                variant="outline"
                size="sm"
                text="Cancel"
                className="px-3 py-1.5 text-sm"
              />
            </Suspense>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagManager; 