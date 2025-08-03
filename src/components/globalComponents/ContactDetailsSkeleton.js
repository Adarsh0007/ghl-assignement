import React from 'react';

const ContactDetailsSkeleton = () => {
  return (
    <div className="min-h-screen lg:h-full bg-gray-50 dark:bg-gray-900">
      <div className="min-h-screen lg:h-full">
        <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-y-auto min-h-screen lg:h-full mx-2 lg:mx-0">
          {/* Header Skeleton */}
          <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Contact Summary Skeleton */}
          <div className="p-4 lg:p-6 pb-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            
            {/* Owner and Followers Skeleton */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="flex space-x-1">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="px-4 lg:px-6 pt-3 lg:pt-4">
            <div className="flex space-x-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg">
              <div className="flex-1 py-2 px-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto animate-pulse"></div>
              </div>
              <div className="flex-1 py-2 px-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
              </div>
              <div className="flex-1 py-2 px-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Search Skeleton */}
          <div className="px-4 lg:px-6 pt-3 lg:pt-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Contact Fields Skeleton */}
          <div className="p-4 lg:p-6">
            {/* Folder 1 */}
            <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 lg:p-4 bg-white dark:bg-gray-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Folder 2 */}
            <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-28 animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 lg:p-4 bg-white dark:bg-gray-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Folder 3 */}
            <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 lg:p-4 bg-white dark:bg-gray-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-56 animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsSkeleton; 