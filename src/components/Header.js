import React from 'react';
import { ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';

const Header = ({
  title,
  showNavigation,
  currentContactIndex = 1,
  totalContacts = 356,
  onNavigate,
  onBack
}) => {
  const { isDark, toggleTheme } = useTheme();

  const isFirstContact = currentContactIndex <= 1;
  const isLastContact = currentContactIndex >= totalContacts;

  const handlePrevClick = () => {
    if (!isFirstContact && onNavigate) {
      onNavigate('prev');
    }
  };

  const handleNextClick = () => {
    if (!isLastContact && onNavigate) {
      onNavigate('next');
    }
  };

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <header 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
      role="banner"
      aria-label="Contact details navigation header"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            onKeyDown={(e) => handleKeyDown(e, onBack)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Go back to previous page"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white" id="page-title">
            {title}
          </h1>
        </div>
        
        <nav 
          className="flex items-center space-x-4"
          role="navigation"
          aria-label="Contact navigation and settings"
        >
          {showNavigation && (
            <div 
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
              role="group"
              aria-label="Contact navigation"
            >
              <button
                onClick={handlePrevClick}
                onKeyDown={(e) => handleKeyDown(e, handlePrevClick)}
                disabled={isFirstContact}
                className={`p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  isFirstContact
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                aria-label={isFirstContact ? 'First contact - cannot go back' : `Go to previous contact (${currentContactIndex - 1} of ${totalContacts})`}
                aria-disabled={isFirstContact}
                title={isFirstContact ? 'First contact' : 'Previous contact'}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span 
                className="px-2 font-medium"
                aria-label={`Contact ${currentContactIndex} of ${totalContacts}`}
                role="status"
                aria-live="polite"
              >
                {currentContactIndex} of {totalContacts}
              </span>
              <button
                onClick={handleNextClick}
                onKeyDown={(e) => handleKeyDown(e, handleNextClick)}
                disabled={isLastContact}
                className={`p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  isLastContact
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                aria-label={isLastContact ? 'Last contact - cannot go forward' : `Go to next contact (${currentContactIndex + 1} of ${totalContacts})`}
                aria-disabled={isLastContact}
                title={isLastContact ? 'Last contact' : 'Next contact'}
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            onKeyDown={(e) => handleKeyDown(e, toggleTheme)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={isDark}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 