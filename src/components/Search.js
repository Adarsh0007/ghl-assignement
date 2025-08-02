import React, { useCallback } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';

const Search = ({
  placeholder,
  value,
  onChange,
  showFilter,
  onFilterClick
}) => {
  const handleInputChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
      role="search"
      aria-label="Search contacts and fields"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <label htmlFor="search-input" className="sr-only">
            Search contacts and fields
          </label>
          <SearchIcon 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" 
            aria-hidden="true"
          />
          <input
            id="search-input"
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            aria-label="Search contacts and fields"
            aria-describedby="search-description"
            autoComplete="off"
            spellCheck="false"
          />
          <div id="search-description" className="sr-only">
            Search through contact information, field names, and values
          </div>
        </div>
        
        {showFilter && (
          <button
            onClick={onFilterClick}
            onKeyDown={(e) => handleKeyDown(e, onFilterClick)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Open advanced filter options"
            aria-haspopup="dialog"
            aria-expanded="false"
            title="Advanced filters"
          >
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search; 