import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-300" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-300" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-white dark:bg-gray-900 border-l-4 border-green-500 dark:border-green-400 shadow-lg dark:shadow-gray-900/50';
      case 'error':
        return 'bg-white dark:bg-gray-900 border-l-4 border-red-500 dark:border-red-400 shadow-lg dark:shadow-gray-900/50';
      case 'warning':
        return 'bg-white dark:bg-gray-900 border-l-4 border-yellow-500 dark:border-yellow-400 shadow-lg dark:shadow-gray-900/50';
      default:
        return 'bg-white dark:bg-gray-900 border-l-4 border-blue-500 dark:border-blue-400 shadow-lg dark:shadow-gray-900/50';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-gray-900 dark:text-gray-100';
      case 'error':
        return 'text-gray-900 dark:text-gray-100';
      case 'warning':
        return 'text-gray-900 dark:text-gray-100';
      default:
        return 'text-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out ${
        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-w-sm min-w-[320px] ${getBgColor()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className={`flex-1 text-sm font-medium ${getTextColor()}`}>
          {message}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 