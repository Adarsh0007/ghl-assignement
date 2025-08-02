import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, RefreshCw, Database } from 'lucide-react';
import { ApiService } from '../services/api.js';

const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cacheStats, setCacheStats] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [renderCounts, setRenderCounts] = useState({});

  const toggleVisibility = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  const refreshStats = useCallback(() => {
    const stats = ApiService.getCacheStats();
    setCacheStats(stats);
  }, []);

  // Note: incrementRenderCount is available for future use in tracking component renders
  // const incrementRenderCount = useCallback((componentName) => {
  //   setRenderCounts(prev => ({
  //     ...prev,
  //     [componentName]: (prev[componentName] || 0) + 1
  //   }));
  // }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors z-50"
        title="Performance Monitor"
      >
        <BarChart3 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Monitor
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={refreshStats}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Refresh Stats"
            >
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={toggleVisibility}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cache Statistics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Database className="w-4 h-4 mr-1" />
            Cache Statistics
          </h4>
          {cacheStats ? (
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div>Total Entries: {cacheStats.totalEntries}</div>
              <div>Cache Size: {cacheStats.totalSize} bytes</div>
              <div>Hit Rate: {cacheStats.hitRate?.toFixed(2) || 'N/A'}%</div>
              <div>Expired Entries: {cacheStats.expiredEntries}</div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-500">No cache data available</div>
          )}
        </div>

        {/* Render Counts */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Component Render Counts
          </h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            {Object.entries(renderCounts).map(([component, count]) => (
              <div key={component} className="flex justify-between">
                <span>{component}:</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
            {Object.keys(renderCounts).length === 0 && (
              <div className="text-gray-500 dark:text-gray-500">No render data available</div>
            )}
          </div>
        </div>

        {/* Performance Tips */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performance Tips
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>✅ Using useMemo for expensive computations</div>
            <div>✅ Using useCallback for event handlers</div>
            <div>✅ Caching API responses</div>
            <div>✅ Optimized re-renders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 