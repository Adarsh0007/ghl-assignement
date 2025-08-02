import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { X, Plus } from 'lucide-react';
import { TagService } from '../services/tagService.js';

const TagManager = ({ contactTags = [], onTagsChange }) => {
  const [availableTags, setAvailableTags] = useState([]);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load available tags on component mount
  useEffect(() => {
    const tags = TagService.initializeDefaultTags();
    setAvailableTags(tags);
  }, []);

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

  // Memoized filtered suggestions to prevent unnecessary re-computation
  const filteredSuggestions = useMemo(() => {
    if (newTag.trim()) {
      return availableTags.filter(tag => 
        tag.toLowerCase().includes(newTag.toLowerCase()) && 
        !contactTags.includes(tag)
      );
    }
    return [];
  }, [newTag, availableTags, contactTags]);

  // Update show suggestions based on filtered suggestions
  useEffect(() => {
    setShowSuggestions(filteredSuggestions.length > 0);
  }, [filteredSuggestions]);

  const handleAddTag = useCallback((tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !contactTags.includes(trimmedTag)) {
      const newContactTags = [...contactTags, trimmedTag];
      onTagsChange(newContactTags);
      
      // Add to available tags if it's a new tag
      if (!availableTags.includes(trimmedTag)) {
        const newAvailableTags = TagService.addTag(trimmedTag);
        setAvailableTags(newAvailableTags);
      }
    }
    setNewTag('');
    setShowAddTag(false);
    setShowSuggestions(false);
  }, [contactTags, availableTags, onTagsChange]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    const newContactTags = contactTags.filter(tag => tag !== tagToRemove);
    onTagsChange(newContactTags);
  }, [contactTags, onTagsChange]);

  const handleSuggestionClick = useCallback((suggestion) => {
    handleAddTag(suggestion);
  }, [handleAddTag]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        handleSuggestionClick(filteredSuggestions[0]);
      } else {
        handleAddTag(newTag);
      }
    } else if (e.key === 'Escape') {
      setShowAddTag(false);
      setNewTag('');
      setShowSuggestions(false);
    }
  }, [filteredSuggestions, handleSuggestionClick, handleAddTag, newTag]);

  const handleCreateNewTag = useCallback(() => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      handleAddTag(newTag);
    }
  }, [newTag, availableTags, handleAddTag]);

  return (
    <div className="space-y-3">
      <label htmlFor="tag-input" className="block text-sm font-medium text-gray-500 dark:text-gray-400">
        Tags
      </label>
      
      {/* Existing Tags */}
      <div className="flex flex-wrap gap-2">
        {contactTags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
          >
            <span>{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
              title="Remove tag"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {/* Add Tag Button */}
        {!showAddTag && (
          <button
            onClick={() => {
              setShowAddTag(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Tag</span>
          </button>
        )}
      </div>

      {/* Add Tag Input */}
      {showAddTag && (
        <div className="relative">
          <div className="flex items-center space-x-2">
            <input
              id="tag-input"
              ref={inputRef}
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type tag name..."
              className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={handleCreateNewTag}
              disabled={!newTag.trim()}
              className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddTag(false);
                setNewTag('');
                setShowSuggestions(false);
              }}
              className="px-3 py-1 text-sm bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
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