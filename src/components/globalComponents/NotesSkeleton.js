import React from 'react';

const NotesSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Notes Header Skeleton */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Notes Content Skeleton */}
      <div className="flex-1 p-4 space-y-4">
        {/* Note 1 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Note 2 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6 animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Note 3 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Note 4 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-18 animate-pulse"></div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Note 5 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-22 animate-pulse"></div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Button Skeleton */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default NotesSkeleton; 