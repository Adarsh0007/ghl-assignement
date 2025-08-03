import React, { Suspense } from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { CustomButton } from './globalComponents/index.js';

// Fallback button component for loading state
const ButtonFallback = ({ children, iconClassName, textClassName, ...props }) => (
  <button {...props}>
    {children}
  </button>
);

const Header = React.memo(({
  title,
  showNavigation,
  currentContactIndex = 1,
  totalContacts = 356,
  onNavigate,
  onBack
}) => {
  const { isDark, toggleTheme } = useTheme();

  const handlePrevClick = () => {
    if (currentContactIndex > 1) {
      onNavigate('prev');
    }
  };

  const handleNextClick = () => {
    if (currentContactIndex < totalContacts) {
      onNavigate('next');
    }
  };

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const isFirstContact = currentContactIndex <= 1;
  const isLastContact = currentContactIndex >= totalContacts;

  return (
    <header 
      className="bg-white dark:bg-gray-800 px-6 pt-4"
      role="banner"
      aria-label="Contact details navigation header"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Suspense fallback={<ButtonFallback onClick={onBack} aria-label="Go back to previous page" title="Go back to previous page"><ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" aria-hidden="true" /></ButtonFallback>}>
            <CustomButton
              onClick={onBack}
              onKeyDown={(e) => handleKeyDown(e, onBack)}
              variant="none"
              size="md"
              icon={ArrowLeft}
              aria-label="Go back to previous page"
              title="Go back to previous page"
              className="p-2"
            />
          </Suspense>
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
              <span 
                className="font-medium"
                aria-label={`Contact ${currentContactIndex} of ${totalContacts}`}
                role="status"
                aria-live="polite"
              >
                {currentContactIndex} of {totalContacts}
              </span>
              <Suspense fallback={<ButtonFallback onClick={handlePrevClick} disabled={isFirstContact} className={`p-1 rounded ${isFirstContact ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}><span className="text-lg font-semibold">&lt;</span></ButtonFallback>}>
                <CustomButton
                  onClick={handlePrevClick}
                  onKeyDown={(e) => handleKeyDown(e, handlePrevClick)}
                  disabled={isFirstContact}
                  variant="none"
                  size="sm"
                  text="<"
                  aria-label={isFirstContact ? 'First contact - cannot go back' : `Go to previous contact (${currentContactIndex - 1} of ${totalContacts})`}
                  aria-disabled={isFirstContact}
                  title={isFirstContact ? 'First contact' : 'Previous contact'}
                  className="p-1 text-lg font-semibold"
                />
              </Suspense>
              <Suspense fallback={<ButtonFallback onClick={handleNextClick} disabled={isLastContact} className={`p-1 rounded ${isLastContact ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}><span className="text-lg font-semibold">&gt;</span></ButtonFallback>}>
                <CustomButton
                  onClick={handleNextClick}
                  onKeyDown={(e) => handleKeyDown(e, handleNextClick)}
                  disabled={isLastContact}
                  variant="none"
                  size="sm"
                  text=">"
                  aria-label={isLastContact ? 'Last contact - cannot go forward' : `Go to next contact (${currentContactIndex + 1} of ${totalContacts})`}
                  aria-disabled={isLastContact}
                  title={isLastContact ? 'Last contact' : 'Next contact'}
                  className="p-1 text-lg font-semibold"
                />
              </Suspense>
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <Suspense fallback={<ButtonFallback onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800" aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={isDark} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>{isDark ? <Sun className="w-5 h-5 text-yellow-400" aria-hidden="true" /> : <Moon className="w-5 h-5 text-gray-600" aria-hidden="true" />}</ButtonFallback>}>
            <CustomButton
              onClick={toggleTheme}
              onKeyDown={(e) => handleKeyDown(e, toggleTheme)}
              variant="none"
              size="md"
              icon={isDark ? Sun : Moon}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDark}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2"
            />
          </Suspense>
        </nav>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header; 