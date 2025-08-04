import React, { Suspense } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';

// Lazy load components
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));
const FormField = React.lazy(() => import('./globalComponents/FormField.js'));

const Search = ({
  placeholder,
  value,
  onChange,
  showFilter,
  onFilterClick
}) => {
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
      role="search"
      aria-label="Search contacts and fields"
    >
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search contacts and fields
        </label>
        
        {/* Search Icon - Left side */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
          <SearchIcon 
            className="w-5 h-5 text-gray-400 dark:text-gray-500" 
            aria-hidden="true"
          />
        </div>
        
        <Suspense fallback={
          <input
            id="search-input"
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            aria-label="Search contacts and fields"
            aria-describedby="search-description"
            autoComplete="off"
            spellCheck="false"
          />
        }>
          <FormField
            id="search-input"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full"
            inputClassName="pl-10 pr-10 py-2 border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            aria-label="Search contacts and fields"
            aria-describedby="search-description"
            autoComplete="off"
            spellCheck="false"
          />
        </Suspense>
        
        {/* Filter Icon - Right side */}
        {showFilter && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <Suspense fallback={
              <button 
                onClick={onFilterClick} 
                onKeyDown={(e) => handleKeyDown(e, onFilterClick)} 
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" 
                aria-label="Open advanced filter options" 
                aria-haspopup="dialog" 
                aria-expanded="false" 
                title="Advanced filters"
              >
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              </button>
            }>
              <CustomButton
                onClick={onFilterClick}
                onKeyDown={(e) => handleKeyDown(e, onFilterClick)}
                icon={Filter}
                variant="none"
                size="sm"
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open advanced filter options"
                aria-haspopup="dialog"
                aria-expanded="false"
                title="Advanced filters"
                iconClassName="w-4 h-4 text-gray-500 dark:text-gray-400"
              />
            </Suspense>
          </div>
        )}
        
        <div id="search-description" className="sr-only">
          Search through contact information, field names, and values
        </div>
      </div>
    </div>
  );
};

export default Search; 