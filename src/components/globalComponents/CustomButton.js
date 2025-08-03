import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';

/**
 * CustomButton Component
 * A comprehensive button component with theme support, accessibility, and all project capabilities
 */
const CustomButton = forwardRef(({
  // Content props
  children,
  icon: Icon,
  iconPosition = 'left',
  text,
  
  // Styling props
  variant = 'primary', // primary, secondary, success, warning, danger, outline
  size = 'md', // sm, md, lg
  className = '',
  fullWidth = false,
  
  // Interactive props
  disabled = false,
  loading = false,
  interactive = true,
  
  // Event handlers
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  
  // Accessibility props
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-pressed': ariaPressed,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHaspopup,
  'aria-controls': ariaControls,
  'aria-live': ariaLive,
  role,
  tabIndex,
  
  // HTML button props
  type = 'button',
  form,
  name,
  value,
  
  // Custom props
  title,
  dataTestId,
  iconClassName,
  textClassName,
  
  // Spread any other props
  ...restProps
}, ref) => {
  
  // Generate CSS classes based on props
  const getButtonClasses = () => {
    // Base classes
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-md',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'focus:outline-none',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:pointer-events-none'
    ];

    // Size classes
    const sizeClasses = {
      sm: ['px-2', 'py-1', 'text-xs'],
      md: ['px-3', 'py-2', 'text-sm'],
      lg: ['px-4', 'py-2', 'text-base']
    };

    // Variant classes - Updated to have no border by default
    const variantClasses = {
      primary: [
        'bg-blue-600',
        'dark:bg-blue-500',
        'text-white',
        'hover:bg-blue-700',
        'dark:hover:bg-blue-600',
        'active:bg-blue-800',
        'dark:active:bg-blue-700'
      ],
      secondary: [
        'bg-gray-600',
        'dark:bg-gray-500',
        'text-white',
        'hover:bg-gray-700',
        'dark:hover:bg-gray-600',
        'active:bg-gray-800',
        'dark:active:bg-gray-700'
      ],
      success: [
        'bg-green-600',
        'dark:bg-green-500',
        'text-white',
        'hover:bg-green-700',
        'dark:hover:bg-green-600',
        'active:bg-green-800',
        'dark:active:bg-green-700'
      ],
      warning: [
        'bg-yellow-600',
        'dark:bg-yellow-500',
        'text-white',
        'hover:bg-yellow-700',
        'dark:hover:bg-yellow-600',
        'active:bg-yellow-800',
        'dark:active:bg-yellow-700'
      ],
      danger: [
        'bg-red-600',
        'dark:bg-red-500',
        'text-white',
        'hover:bg-red-700',
        'dark:hover:bg-red-600',
        'active:bg-red-800',
        'dark:active:bg-red-700'
      ],
      outline: [
        'bg-transparent',
        'text-gray-700',
        'dark:text-gray-300',
        'hover:bg-gray-50',
        'dark:hover:bg-gray-700',
        'active:bg-gray-100',
        'dark:active:bg-gray-600'
      ],
      // New no-border variant (default)
      none: [
        'bg-transparent',
        'text-gray-700',
        'dark:text-gray-300',
        'hover:bg-gray-50',
        'dark:hover:bg-gray-700',
        'active:bg-gray-100',
        'dark:active:bg-gray-600'
      ]
    };

    // Interactive classes
    const interactiveClasses = interactive ? [
      'cursor-pointer',
      'hover:scale-105',
      'active:scale-95'
    ] : [];

    // Width classes
    const widthClasses = fullWidth ? ['w-full'] : [];

    // Loading classes
    const loadingClasses = loading ? ['opacity-75', 'cursor-wait'] : [];

    return [
      ...baseClasses,
      ...sizeClasses[size],
      ...variantClasses[variant],
      ...interactiveClasses,
      ...widthClasses,
      ...loadingClasses,
      className
    ].filter(Boolean).join(' ');
  };

  // Generate icon classes
  const getIconClasses = () => {
    const iconSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return [
      iconSizeClasses[size],
      'transition-colors',
      'duration-200'
    ].join(' ');
  };

  // Handle click with loading state
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(event);
    }
  };

  // Handle key down for accessibility
  const handleKeyDown = (event) => {
    if (disabled || loading) {
      return;
    }

    // Handle Enter and Space keys
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  // Render icon
  const renderIcon = () => {
    if (!Icon) return null;

    const iconClasses = iconClassName || getIconClasses();
    
    return (
      <Icon 
        className={iconClasses}
        aria-hidden="true"
      />
    );
  };

  // Render content
  const renderContent = () => {
    const content = children || text;
    
    if (!content && !Icon) {
      return null;
    }

    if (Icon && content) {
      const iconElement = renderIcon();
      const contentElement = (
        <span className={`ml-2 first:ml-0 ${textClassName || ''}`}>
          {content}
        </span>
      );

      return iconPosition === 'left' ? (
        <>
          {iconElement}
          {contentElement}
        </>
      ) : (
        <>
          {contentElement}
          {iconElement}
        </>
      );
    }

    return Icon ? renderIcon() : content;
  };

  // Build accessibility attributes
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-pressed': ariaPressed,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHaspopup,
    'aria-controls': ariaControls,
    'aria-live': ariaLive,
    'aria-disabled': disabled || loading,
    role: role || (ariaPressed !== undefined ? 'button' : undefined),
    tabIndex: disabled || loading ? -1 : tabIndex || 0
  };

  // Remove undefined values
  Object.keys(accessibilityProps).forEach(key => {
    if (accessibilityProps[key] === undefined) {
      delete accessibilityProps[key];
    }
  });

  // Filter out custom props that shouldn't be passed to DOM
  const {
    iconClassName: _iconClassName,
    textClassName: _textClassName,
    ...domProps
  } = restProps;

  return (
    <button
      ref={ref}
      type={type}
      className={getButtonClasses()}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      title={title}
      data-testid={dataTestId}
      form={form}
      name={name}
      value={value}
      {...accessibilityProps}
      {...domProps}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {renderContent()}
    </button>
  );
});

// PropTypes for type checking
CustomButton.propTypes = {
  // Content
  children: PropTypes.node,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  text: PropTypes.string,
  
  // Styling
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'none']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  iconClassName: PropTypes.string,
  textClassName: PropTypes.string,
  
  // Interactive
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  interactive: PropTypes.bool,
  
  // Event handlers
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  
  // Accessibility
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
  'aria-pressed': PropTypes.bool,
  'aria-expanded': PropTypes.bool,
  'aria-haspopup': PropTypes.string,
  'aria-controls': PropTypes.string,
  'aria-live': PropTypes.string,
  role: PropTypes.string,
  tabIndex: PropTypes.number,
  
  // HTML button props
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  form: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  
  // Custom props
  title: PropTypes.string,
  dataTestId: PropTypes.string
};

// Default props
CustomButton.defaultProps = {
  variant: 'none', // Changed to none by default (no border)
  size: 'md',
  iconPosition: 'left',
  type: 'button',
  interactive: true,
  disabled: false,
  loading: false,
  fullWidth: false
};

// Display name for debugging
CustomButton.displayName = 'CustomButton';

// Memoize for performance
export default memo(CustomButton); 