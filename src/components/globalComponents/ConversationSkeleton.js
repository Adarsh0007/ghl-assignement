import React from 'react';

const ConversationSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Conversation Header Skeleton */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Conversation Content Skeleton */}
      <div className="flex-1 p-4 space-y-4">
        {/* Conversation 1 - Received Message */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation 2 - Sent Message with Buttons */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3 flex-row-reverse space-x-reverse">
            <div className="flex-1 min-w-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                {/* Subject Line */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-600 relative">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48 animate-pulse"></div>
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
                
                {/* Email Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
                
                {/* Message Content */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6 animate-pulse"></div>
                </div>
                
                {/* Buttons */}
                <div className="flex space-x-2 mt-4">
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation 3 - Received Message */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation 4 - Sent Message */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3 flex-row-reverse space-x-reverse">
            <div className="flex-1 min-w-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                {/* Subject Line */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-600 relative">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-36 animate-pulse"></div>
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
                
                {/* Email Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-28 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12 animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
                
                {/* Message Content */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input Skeleton */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSkeleton; 