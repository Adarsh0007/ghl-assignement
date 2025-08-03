import React, { useState, useCallback, useEffect } from 'react';
import { VirtualizedList, NotesVirtualizedList } from './index.js';

/**
 * Demo component showing how to use VirtualizedList and NotesVirtualizedList
 * This component demonstrates infinite loading with mock data
 */
const VirtualizedListDemo = () => {
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasNextNotesPage, setHasNextNotesPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [isNextNotesPageLoading, setIsNextNotesPageLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [notesPage, setNotesPage] = useState(1);

  // Mock data generator for generic items
  const generateMockItems = useCallback((pageNum, pageSize = 20) => {
    const startIndex = (pageNum - 1) * pageSize;
    return Array.from({ length: pageSize }, (_, index) => ({
      id: `item-${startIndex + index + 1}`,
      title: `Item ${startIndex + index + 1}`,
      description: `This is the description for item ${startIndex + index + 1}. It contains some sample text to demonstrate the virtualized list functionality.`,
      timestamp: Date.now() - Math.random() * 1000000000
    }));
  }, []);

  // Mock data generator for notes
  const generateMockNotes = useCallback((pageNum, pageSize = 10) => {
    const startIndex = (pageNum - 1) * pageSize;
    return Array.from({ length: pageSize }, (_, index) => ({
      id: `note-${startIndex + index + 1}`,
      content: `This is note ${startIndex + index + 1}. It contains some sample content to demonstrate the virtualized notes list. The note can be quite long and contain multiple sentences to show how the virtualization handles different content lengths.`,
      timestamp: Date.now() - Math.random() * 1000000000
    }));
  }, []);

  // Load next page of generic items
  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading) return;
    
    setIsNextPageLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItems = generateMockItems(page + 1);
    setItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    
    // Stop loading after 5 pages (100 items)
    if (page >= 5) {
      setHasNextPage(false);
    }
    
    setIsNextPageLoading(false);
  }, [page, isNextPageLoading, generateMockItems]);

  // Load next page of notes
  const loadNextNotesPage = useCallback(async () => {
    if (isNextNotesPageLoading) return;
    
    setIsNextNotesPageLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newNotes = generateMockNotes(notesPage + 1);
    setNotes(prev => [...prev, ...newNotes]);
    setNotesPage(prev => prev + 1);
    
    // Stop loading after 3 pages (30 notes)
    if (notesPage >= 3) {
      setHasNextNotesPage(false);
    }
    
    setIsNextNotesPageLoading(false);
  }, [notesPage, isNextNotesPageLoading, generateMockNotes]);

  // Initialize with first page of data
  useEffect(() => {
    setItems(generateMockItems(1));
    setNotes(generateMockNotes(1));
  }, [generateMockItems, generateMockNotes]);

  // Render generic item
  const renderItem = useCallback((item) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {item.description}
      </p>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(item.timestamp).toLocaleString()}
      </span>
    </div>
  ), []);

  // Note handlers (mock implementations)
  const handleEditNote = useCallback((noteId, content) => {
    console.log('Edit note:', noteId, content);
  }, []);

  const handleDeleteNote = useCallback((noteId) => {
    console.log('Delete note:', noteId);
  }, []);

  const handleSaveEdit = useCallback(() => {
    console.log('Save edit');
  }, []);

  const setEditContent = useCallback((content) => {
    console.log('Set edit content:', content);
  }, []);

  const setEditingNoteId = useCallback((noteId) => {
    console.log('Set editing note ID:', noteId);
  }, []);

  const formatTimestamp = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Virtualized List Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Demonstrating infinite scrolling with react-window
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generic VirtualizedList Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Generic VirtualizedList
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Scroll to load more items automatically
          </p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <VirtualizedList
              items={items}
              renderItem={renderItem}
              itemHeight={120}
              height={400}
              hasNextPage={hasNextPage}
              isNextPageLoading={isNextPageLoading}
              loadNextPage={loadNextPage}
              className="bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <div className="text-sm text-gray-500">
            Loaded {items.length} items • {hasNextPage ? 'More available' : 'All items loaded'}
          </div>
        </div>

        {/* Notes VirtualizedList Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notes VirtualizedList
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Specialized component for notes with edit/delete functionality
          </p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <NotesVirtualizedList
              notes={notes}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onSaveEdit={handleSaveEdit}
              setEditContent={setEditContent}
              setEditingNoteId={setEditingNoteId}
              formatTimestamp={formatTimestamp}
              hasNextPage={hasNextNotesPage}
              isNextPageLoading={isNextNotesPageLoading}
              loadNextPage={loadNextNotesPage}
              height={400}
              itemHeight={140}
              className="bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <div className="text-sm text-gray-500">
            Loaded {notes.length} notes • {hasNextNotesPage ? 'More available' : 'All notes loaded'}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How to Use
        </h3>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p><strong>Generic VirtualizedList:</strong> Use for any type of data with custom renderItem function</p>
          <p><strong>NotesVirtualizedList:</strong> Specialized component for notes with built-in edit/delete functionality</p>
          <p><strong>Infinite Loading:</strong> Automatically loads more data when scrolling near the bottom</p>
          <p><strong>Performance:</strong> Only renders visible items, perfect for large datasets</p>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedListDemo; 