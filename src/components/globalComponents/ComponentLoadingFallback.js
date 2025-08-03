import React from 'react';
import PropTypes from 'prop-types';

/**
 * Generic Component Loading Fallback
 * A reusable loading component for lazy-loaded components
 */
const ComponentLoadingFallback = ({ 
  componentName = 'Component',
  size = 'md',
  className = '',
  showText = true,
  textClassName = ''
}) => {
  // Size configurations
  const sizeConfig = {
    xs: {
      spinner: 'h-3 w-3',
      text: 'text-xs',
      container: 'p-1'
    },
    sm: {
      spinner: 'h-4 w-4',
      text: 'text-xs',
      container: 'p-2'
    },
    md: {
      spinner: 'h-6 w-6',
      text: 'text-sm',
      container: 'p-3'
    },
    lg: {
      spinner: 'h-8 w-8',
      text: 'text-sm',
      container: 'p-4'
    },
    xl: {
      spinner: 'h-12 w-12',
      text: 'text-base',
      container: 'p-6'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={`flex items-center justify-center ${config.container} ${className}`}>
      <div className="text-center">
        <div 
          className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-2 ${config.spinner}`}
          role="status"
          aria-label={`Loading ${componentName}`}
        >
          <span className="sr-only">Loading {componentName}...</span>
        </div>
        {showText && (
          <p className={`text-gray-600 dark:text-gray-300 ${config.text} ${textClassName}`}>
            Loading {componentName}...
          </p>
        )}
      </div>
    </div>
  );
};

// PropTypes for type checking
ComponentLoadingFallback.propTypes = {
  componentName: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  showText: PropTypes.bool,
  textClassName: PropTypes.string
};

// Default props
ComponentLoadingFallback.defaultProps = {
  componentName: 'Component',
  size: 'md',
  className: '',
  showText: true,
  textClassName: ''
};

export default ComponentLoadingFallback; 