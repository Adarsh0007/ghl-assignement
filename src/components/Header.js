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

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {showNavigation && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <button
                onClick={handlePrevClick}
                disabled={isFirstContact}
                className={`p-1 rounded transition-colors ${
                  isFirstContact
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title={isFirstContact ? 'First contact' : 'Previous contact'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                {currentContactIndex} of {totalContacts}
              </span>
              <button
                onClick={handleNextClick}
                disabled={isLastContact}
                className={`p-1 rounded transition-colors ${
                  isLastContact
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title={isLastContact ? 'Last contact' : 'Next contact'}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header; 