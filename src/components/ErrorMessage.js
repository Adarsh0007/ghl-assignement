import React, { Suspense } from 'react';
import { AlertCircle, X } from 'lucide-react';

// Lazy load CustomButton
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));

const ErrorMessage = ({ 
  error, 
  onClose, 
  title = 'Error', 
  variant = 'error',
  showIcon = true,
  className = '' 
}) => {
  if (!error) return null;

  const variants = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900'
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: 'text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900'
    }
  };

  const styles = variants[variant] || variants.error;

  return (
    <div className={`rounded-md p-4 border ${styles.bg} ${styles.border} ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className={`flex-shrink-0 ${styles.iconBg} rounded-full p-1 mr-3`}>
            <AlertCircle className={`h-4 w-4 ${styles.icon}`} />
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.text} mb-1`}>
              {title}
            </h3>
          )}
          
          <div className={`text-sm ${styles.text}`}>
            {typeof error === 'string' ? error : error.message || 'An error occurred'}
          </div>
          
          {error.details && (
            <div className={`text-xs mt-2 ${styles.text} opacity-75`}>
              {error.details}
            </div>
          )}
        </div>
        
        {onClose && (
          <div className="flex-shrink-0 ml-3">
            <Suspense fallback={<button onClick={onClose} className={`inline-flex ${styles.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current rounded`}><X className="h-4 w-4" /></button>}>
              <CustomButton
                onClick={onClose}
                icon={X}
                variant="none"
                size="sm"
                className={`inline-flex ${styles.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current rounded`}
                iconClassName="h-4 w-4"
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 