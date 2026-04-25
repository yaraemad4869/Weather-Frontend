import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-center">
        <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700 dark:text-red-400">{message || 'An error occurred'}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;