import React, { useCallback, useMemo, forwardRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import PropTypes from 'prop-types';

/**
 * Generic Virtualized List Component
 * A reusable component for rendering large lists with infinite scrolling
 */
const VirtualizedList = forwardRef(({
  items = [],
  renderItem,
  itemHeight = 100,
  height = 400,
  width = '100%',
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  loadingComponent,
  emptyComponent,
  className = '',
  listProps = {},
  ...restProps
}, ref) => {
  
  // Memoize the item count to prevent unnecessary re-renders
  const itemCount = useMemo(() => {
    return hasNextPage ? items.length + 1 : items.length;
  }, [items.length, hasNextPage]);

  // Check if an item is loaded
  const isItemLoaded = useCallback((index) => {
    return !hasNextPage || index < items.length;
  }, [hasNextPage, items.length]);

  // Handle loading more items
  const loadMoreItems = useCallback((startIndex, stopIndex) => {
    if (loadNextPage && !isNextPageLoading) {
      loadNextPage();
    }
    return Promise.resolve();
  }, [loadNextPage, isNextPageLoading]);

  // Render individual item
  const ItemRenderer = useCallback(({ index, style }) => {
    if (!isItemLoaded(index)) {
      // Show loading component for items that aren't loaded yet
      return (
        <div style={style} className="flex items-center justify-center p-4">
          {loadingComponent || (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          )}
        </div>
      );
    }

    const item = items[index];
    if (!item) {
      return null;
    }

    return (
      <div style={style} className="py-1">
        {renderItem(item, index)}
      </div>
    );
  }, [items, isItemLoaded, loadingComponent, renderItem]);

  // Show empty state if no items
  if (items.length === 0 && !hasNextPage) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height, width }}>
        {emptyComponent || (
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No items to display</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`virtualized-list ${className}`}
      style={{ height, width }}
      {...restProps}
    >
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
        threshold={5} // Start loading when 5 items from the end
      >
        {({ onItemsRendered, ref: infiniteLoaderRef }) => (
          <List
            ref={(listRef) => {
              // Forward ref to parent component
              if (ref) {
                ref.current = listRef;
              }
              // Set ref for infinite loader
              infiniteLoaderRef(listRef);
            }}
            height={height}
            itemCount={itemCount}
            itemSize={itemHeight}
            onItemsRendered={onItemsRendered}
            className="virtualized-list-container"
            {...listProps}
          >
            {ItemRenderer}
          </List>
        )}
      </InfiniteLoader>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

VirtualizedList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  itemHeight: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hasNextPage: PropTypes.bool,
  isNextPageLoading: PropTypes.bool,
  loadNextPage: PropTypes.func,
  loadingComponent: PropTypes.node,
  emptyComponent: PropTypes.node,
  className: PropTypes.string,
  listProps: PropTypes.object
};

export default VirtualizedList; 