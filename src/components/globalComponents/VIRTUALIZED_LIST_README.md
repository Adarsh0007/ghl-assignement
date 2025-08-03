# Virtualized List Components

This directory contains reusable virtualized list components built with `react-window` and `react-window-infinite-loader` for efficient rendering of large datasets with infinite scrolling.

## Components

### 1. VirtualizedList (Generic)
A generic virtualized list component that can be used for any type of data with custom item rendering.

### 2. NotesVirtualizedList (Specialized)
A specialized component for rendering notes with built-in edit/delete functionality.

### 3. VirtualizedListDemo (Demo)
A demo component showing how to use both virtualized list components.

## Installation

The required dependencies are already installed:
```bash
npm install react-window react-window-infinite-loader
```

## Usage

### Generic VirtualizedList

```jsx
import { VirtualizedList } from './globalComponents';

const MyComponent = () => {
  const [items, setItems] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading) return;
    
    setIsNextPageLoading(true);
    
    // Fetch data from API
    const newItems = await fetchItems(page);
    setItems(prev => [...prev, ...newItems]);
    
    setIsNextPageLoading(false);
  }, [isNextPageLoading]);

  const renderItem = useCallback((item) => (
    <div className="p-4 border rounded">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  ), []);

  return (
    <VirtualizedList
      items={items}
      renderItem={renderItem}
      itemHeight={100}
      height={400}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={loadNextPage}
    />
  );
};
```

### NotesVirtualizedList

```jsx
import { NotesVirtualizedList } from './globalComponents';

const NotesComponent = () => {
  const [notes, setNotes] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading) return;
    
    setIsNextPageLoading(true);
    
    // Fetch notes from API
    const newNotes = await fetchNotes(page);
    setNotes(prev => [...prev, ...newNotes]);
    
    setIsNextPageLoading(false);
  }, [isNextPageLoading]);

  const handleEditNote = useCallback((noteId, content) => {
    // Handle note editing
    console.log('Edit note:', noteId, content);
  }, []);

  const handleDeleteNote = useCallback((noteId) => {
    // Handle note deletion
    console.log('Delete note:', noteId);
  }, []);

  const handleSaveEdit = useCallback(() => {
    // Handle saving edited note
    console.log('Save edit');
  }, []);

  return (
    <NotesVirtualizedList
      notes={notes}
      onEditNote={handleEditNote}
      onDeleteNote={handleDeleteNote}
      onSaveEdit={handleSaveEdit}
      setEditContent={setEditContent}
      setEditingNoteId={setEditingNoteId}
      formatTimestamp={formatTimestamp}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={loadNextPage}
      height={400}
      itemHeight={120}
    />
  );
};
```

## Props

### VirtualizedList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array | `[]` | Array of items to render |
| `renderItem` | Function | Required | Function to render each item |
| `itemHeight` | Number | `100` | Height of each item in pixels |
| `height` | Number | `400` | Total height of the list container |
| `width` | Number/String | `'100%'` | Width of the list container |
| `hasNextPage` | Boolean | `false` | Whether there are more items to load |
| `isNextPageLoading` | Boolean | `false` | Whether the next page is loading |
| `loadNextPage` | Function | - | Function to load the next page |
| `loadingComponent` | React.Component | - | Custom loading component |
| `emptyComponent` | React.Component | - | Custom empty state component |
| `className` | String | `''` | Additional CSS classes |
| `listProps` | Object | `{}` | Additional props for react-window List |

### NotesVirtualizedList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `notes` | Array | `[]` | Array of note objects |
| `onEditNote` | Function | Required | Function to handle note editing |
| `onDeleteNote` | Function | Required | Function to handle note deletion |
| `onSaveEdit` | Function | Required | Function to handle saving edited note |
| `editingNoteId` | String | - | ID of the note currently being edited |
| `editContent` | String | - | Content of the note being edited |
| `setEditContent` | Function | Required | Function to update edit content |
| `setEditingNoteId` | Function | Required | Function to set editing note ID |
| `formatTimestamp` | Function | - | Function to format timestamps |
| `hasNextPage` | Boolean | `false` | Whether there are more notes to load |
| `isNextPageLoading` | Boolean | `false` | Whether the next page is loading |
| `loadNextPage` | Function | - | Function to load the next page |
| `height` | Number | `400` | Height of the list container |
| `itemHeight` | Number | `120` | Height of each note item |
| `className` | String | `''` | Additional CSS classes |

## Features

### ✅ Infinite Scrolling
- Automatically loads more data when scrolling near the bottom
- Configurable threshold for when to start loading
- Prevents duplicate loading requests

### ✅ Performance Optimization
- Only renders visible items using react-window
- Efficient memory usage for large datasets
- Smooth scrolling performance

### ✅ Customizable
- Custom item rendering functions
- Custom loading and empty state components
- Flexible styling and theming

### ✅ Accessibility
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly

### ✅ Error Handling
- Graceful handling of loading states
- Error boundaries for failed renders
- Fallback components for edge cases

## Best Practices

### 1. Memoize Callbacks
```jsx
const renderItem = useCallback((item) => (
  <MyItemComponent item={item} />
), []);
```

### 2. Stable Item Heights
For best performance, use fixed item heights. If variable heights are needed, consider using `VariableSizeList` from react-window.

### 3. Efficient Data Loading
```jsx
const loadNextPage = useCallback(async () => {
  if (isNextPageLoading) return; // Prevent duplicate requests
  
  setIsNextPageLoading(true);
  try {
    const newData = await fetchData(page);
    setItems(prev => [...prev, ...newData]);
  } catch (error) {
    console.error('Failed to load data:', error);
  } finally {
    setIsNextPageLoading(false);
  }
}, [isNextPageLoading, page]);
```

### 4. Proper State Management
```jsx
const [items, setItems] = useState([]);
const [hasNextPage, setHasNextPage] = useState(true);
const [isNextPageLoading, setIsNextPageLoading] = useState(false);
```

## Examples

See `VirtualizedListDemo.js` for complete working examples of both components.

## Performance Tips

1. **Use React.memo** for item components to prevent unnecessary re-renders
2. **Optimize renderItem function** to avoid creating new objects on every render
3. **Set appropriate itemHeight** based on your actual content
4. **Use debouncing** for search/filter operations
5. **Implement proper error boundaries** around virtualized lists

## Browser Support

- Modern browsers with ES6+ support
- React 16.8+ (for hooks)
- react-window 1.8+
- react-window-infinite-loader 1.0+ 