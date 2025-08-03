import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({
  // Size variants
  size = 'md',
  // Loading types
  type = 'spinner',
  // Content
  message = 'Loading...',
  showMessage = true,
  // Styling
  className = '',
  messageClassName = '',
  spinnerClassName = '',
  // Layout
  fullScreen = false,
  centered = true,
  // Custom content
  children,
  // Theme
  theme = 'primary',
  // Animation
  animation = 'spin'
}) => {
  // Size configurations
  const sizeConfig = {
    xs: {
      spinner: 'h-3 w-3',
      text: 'text-xs',
      container: 'p-1',
      fullScreen: 'min-h-[100px]'
    },
    sm: {
      spinner: 'h-4 w-4',
      text: 'text-xs',
      container: 'p-2',
      fullScreen: 'min-h-[150px]'
    },
    md: {
      spinner: 'h-6 w-6',
      text: 'text-sm',
      container: 'p-3',
      fullScreen: 'min-h-[200px]'
    },
    lg: {
      spinner: 'h-8 w-8',
      text: 'text-sm',
      container: 'p-4',
      fullScreen: 'min-h-[250px]'
    },
    xl: {
      spinner: 'h-12 w-12',
      text: 'text-base',
      container: 'p-6',
      fullScreen: 'min-h-[300px]'
    }
  };

  // Theme configurations
  const themeConfig = {
    primary: {
      spinner: 'border-blue-600 dark:border-blue-400',
      text: 'text-gray-600 dark:text-gray-300'
    },
    secondary: {
      spinner: 'border-gray-600 dark:border-gray-400',
      text: 'text-gray-600 dark:text-gray-300'
    },
    success: {
      spinner: 'border-green-600 dark:border-green-400',
      text: 'text-green-600 dark:text-green-400'
    },
    warning: {
      spinner: 'border-yellow-600 dark:border-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400'
    },
    danger: {
      spinner: 'border-red-600 dark:border-red-400',
      text: 'text-red-600 dark:text-red-400'
    }
  };

  // Animation configurations
  const animationConfig = {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping'
  };

  const config = sizeConfig[size] || sizeConfig.md;
  const themeStyle = themeConfig[theme] || themeConfig.primary;
  const animationStyle = animationConfig[animation] || animationConfig.spin;

  // Render different loading types
  const renderLoadingContent = () => {
    switch (type) {
      case 'spinner':
        return (
          <div 
            className={`${config.spinner} ${animationStyle} rounded-full border-2 border-b-2 ${themeStyle.spinner} ${spinnerClassName}`}
            role="status"
            aria-label="Loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1" role="status" aria-label="Loading">
            <div className={`${config.spinner} ${animationStyle} bg-current ${themeStyle.spinner.replace('border-', 'bg-')} rounded-full`}></div>
            <div className={`${config.spinner} ${animationStyle} bg-current ${themeStyle.spinner.replace('border-', 'bg-')} rounded-full animation-delay-150`}></div>
            <div className={`${config.spinner} ${animationStyle} bg-current ${themeStyle.spinner.replace('border-', 'bg-')} rounded-full animation-delay-300`}></div>
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1" role="status" aria-label="Loading">
            <div className={`w-1 ${animationStyle} bg-current ${themeStyle.spinner.replace('border-', 'bg-')} rounded`}></div>
            <div className={`w-1 ${animationStyle} bg-current ${themeStyle.spinner.replace('border-', 'bg-')} rounded animation-delay-150`}></div>
            <div className={`w-1 ${animationStyle} bg-current ${themeStyle.spinner.replace('border-', 'bg-')} rounded animation-delay-300`}></div>
          </div>
        );
      
      case 'skeleton':
        return (
          <div className="space-y-2" role="status" aria-label="Loading">
            <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${animationStyle}`}></div>
            <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 ${animationStyle}`}></div>
            <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 ${animationStyle}`}></div>
          </div>
        );
      
      case 'custom':
        return children;
      
      default:
        return (
          <div 
            className={`${config.spinner} ${animationStyle} rounded-full border-2 border-b-2 ${themeStyle.spinner} ${spinnerClassName}`}
            role="status"
            aria-label="Loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        );
    }
  };

  // Container classes
  const containerClasses = [
    fullScreen ? 'min-h-screen' : config.fullScreen,
    centered ? 'flex items-center justify-center' : '',
    config.container,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {renderLoadingContent()}
        {showMessage && message && (
          <p className={`mt-2 ${config.text} ${themeStyle.text} ${messageClassName}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

Loading.propTypes = {
  // Size variants
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  // Loading types
  type: PropTypes.oneOf(['spinner', 'dots', 'bars', 'skeleton', 'custom']),
  
  // Content
  message: PropTypes.string,
  showMessage: PropTypes.bool,
  
  // Styling
  className: PropTypes.string,
  messageClassName: PropTypes.string,
  spinnerClassName: PropTypes.string,
  
  // Layout
  fullScreen: PropTypes.bool,
  centered: PropTypes.bool,
  
  // Custom content
  children: PropTypes.node,
  
  // Theme
  theme: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger']),
  
  // Animation
  animation: PropTypes.oneOf(['spin', 'pulse', 'bounce', 'ping'])
};

Loading.defaultProps = {
  size: 'md',
  type: 'spinner',
  message: 'Loading...',
  showMessage: true,
  className: '',
  messageClassName: '',
  spinnerClassName: '',
  fullScreen: false,
  centered: true,
  theme: 'primary',
  animation: 'spin'
};

export default Loading; 