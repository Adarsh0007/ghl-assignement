import React, { useCallback, memo, Suspense } from 'react';

// Lazy load CustomButton
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));

const Tabs = memo(({ tabs, activeTab, onTabChange }) => {
  const handleTabClick = useCallback((tabId) => {
    onTabChange(tabId);
  }, [onTabChange]);

  const handleKeyDown = useCallback((event, tabId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tabId);
    }
  }, [handleTabClick]);

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t border-gray-200 dark:border-gray-700 rounded-t-lg shadow-sm"
      role="tablist"
      aria-label="Contact information tabs"
    >
      <div className="flex">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex-1 relative">
            <Suspense fallback={<button id={`tab-${tab.id}`} role="tab" aria-selected={activeTab === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => handleTabClick(tab.id)} onKeyDown={(e) => handleKeyDown(e, tab.id)} className={`w-full py-2.5 px-4 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 relative ${activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`} aria-label={`${tab.label} tab`}><div className="flex items-center justify-center space-x-2">{tab.icon && (<span className={`transition-colors ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{tab.icon}</span>)}<span>{tab.label}</span></div></button>}>
              <CustomButton
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                variant="none"
                size="md"
                className={`w-full py-2.5 px-4 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 relative ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label={`${tab.label} tab`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {tab.icon && (
                    <span className={`transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {tab.icon}
                    </span>
                  )}
                  <span>{tab.label}</span>
                </div>
              </CustomButton>
            </Suspense>
            
            {/* Separator between tabs */}
            {index < tabs.length - 1 && (
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-px h-6 bg-gray-200 dark:bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs; 