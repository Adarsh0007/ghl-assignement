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
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden max-w-2xl mx-auto"
      role="tablist"
      aria-label="Contact information tabs"
    >
      <div className="flex">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex-1 relative">
            <Suspense fallback={
              <button 
                id={`tab-${tab.id}`} 
                role="tab" 
                aria-selected={activeTab === tab.id} 
                aria-controls={`panel-${tab.id}`} 
                tabIndex={activeTab === tab.id ? 0 : -1} 
                onClick={() => handleTabClick(tab.id)} 
                onKeyDown={(e) => handleKeyDown(e, tab.id)} 
                className={`w-full py-3 px-4 font-medium text-sm transition-all duration-300 ease-in-out focus:outline-none relative ${
                  activeTab === tab.id 
                    ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-400 dark:border-gray-300 shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-2 border-transparent'
                }`} 
                style={activeTab === tab.id ? { backgroundColor: 'rgb(249 250 251)' } : {}}
                aria-label={`${tab.label} tab`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {tab.icon && (
                    <span className={`transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'text-gray-700 dark:text-gray-200 transform scale-110' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {tab.icon}
                    </span>
                  )}
                  <span className="font-medium">{tab.label}</span>
                </div>
              </button>
            }>
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
                className={`w-full py-3 px-4 font-medium text-sm transition-all duration-300 ease-in-out focus:outline-none relative ${
                  activeTab === tab.id
                    ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-400 dark:border-gray-300 shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-2 border-transparent'
                }`}
                style={activeTab === tab.id ? { backgroundColor: 'rgb(249 250 251)' } : {}}
                aria-label={`${tab.label} tab`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {tab.icon && (
                    <span className={`transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'text-gray-700 dark:text-gray-200 transform scale-110'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {tab.icon}
                    </span>
                  )}
                  <span className="font-medium">{tab.label}</span>
                </div>
              </CustomButton>
            </Suspense>
            
            {/* Active tab indicator - enhanced glow effect */}
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gray-300/30 dark:bg-gray-500/30 pointer-events-none rounded-t-lg"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Bottom border for active tab */}
      <div className="relative">
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 opacity-40"></div>
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs; 