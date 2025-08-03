import React, { useCallback, useMemo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { VirtualizedList, CustomButton } from './index.js';
import PropTypes from 'prop-types';

/**
 * Notes Virtualized List Component
 * A specialized component for rendering notes with infinite scrolling
 * 
 * @param {Object} props - Component props
 * @param {Array} props.notes - Array of note objects
 * @param {Function} props.onEditNote - Function to handle note editing
 * @param {Function} props.onDeleteNote - Function to handle note deletion
 * @param {Function} props.onSaveEdit - Function to handle saving edited note
 * @param {string} props.editingNoteId - ID of the note currently being edited
 * @param {string} props.editContent - Content of the note being edited
 * @param {Function} props.setEditContent - Function to update edit content
 * @param {Function} props.setEditingNoteId - Function to set editing note ID
 * @param {Function} props.formatTimestamp - Function to format timestamps
 * @param {boolean} props.hasNextPage - Whether there are more notes to load
 * @param {boolean} props.isNextPageLoading - Whether the next page is loading
 * @param {Function} props.loadNextPage - Function to load the next page
 * @param {number} props.height - Height of the list container
 * @param {number} props.itemHeight - Height of each note item
 * @param {string} props.className - Additional CSS classes
 */
const NotesVirtualizedList = ({
  notes = [],
  onEditNote,
  onDeleteNote,
  onSaveEdit,
  editingNoteId,
  editContent,
  setEditContent,
  setEditingNoteId,
  formatTimestamp,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  height = 400,
  itemHeight = 160,
  className = '',
  ...restProps
}) => {
  
  // Handle key press for saving edits
  const handleKeyPress = useCallback((e, saveFunction) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveFunction();
    }
  }, []);

  // Render individual note item
  const renderNoteItem = useCallback((note, index) => {
    const isEditing = editingNoteId === note.id;

    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, onSaveEdit)}
                  className="w-full p-2 border border-yellow-300 dark:border-yellow-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={4}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <CustomButton
                    onClick={() => setEditingNoteId(null)}
                    text="Cancel"
                    variant="secondary"
                    size="sm"
                    className="px-2 py-1 text-xs"
                  />
                  <CustomButton
                    onClick={onSaveEdit}
                    disabled={!editContent.trim()}
                    text="Save"
                    variant="primary"
                    size="sm"
                    className="px-2 py-1 text-xs font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp ? formatTimestamp(note.timestamp) : 'Just now'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <CustomButton
                      onClick={() => onEditNote(note.id, note.content)}
                      variant="none"
                      size="sm"
                      icon={Edit3}
                      aria-label="Edit note"
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      iconClassName="w-3 h-3"
                    />
                    <CustomButton
                      onClick={() => onDeleteNote(note.id)}
                      variant="none"
                      size="sm"
                      icon={Trash2}
                      aria-label="Delete note"
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      iconClassName="w-3 h-3"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    editingNoteId,
    editContent,
    setEditContent,
    setEditingNoteId,
    onEditNote,
    onDeleteNote,
    onSaveEdit,
    handleKeyPress,
    formatTimestamp
  ]);

  // Custom loading component for notes
  const NotesLoadingComponent = useMemo(() => (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
        <span className="text-sm text-gray-500">Loading notes...</span>
      </div>
    </div>
  ), []);

  // Custom empty component for notes
  const NotesEmptyComponent = useMemo(() => (
    <div className="text-center py-8">
      <div className="text-gray-300 dark:text-gray-600 mb-2">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No notes yet. Click "Add" to create your first note.
      </p>
    </div>
  ), []);

  return (
    <VirtualizedList
      items={notes}
      renderItem={renderNoteItem}
      itemHeight={itemHeight}
      height={height}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={loadNextPage}
      loadingComponent={NotesLoadingComponent}
      emptyComponent={NotesEmptyComponent}
      className={`notes-virtualized-list space-y-4 ${className}`}
      listProps={{
        ...restProps.listProps,
        className: "notes-list-container"
      }}
      {...restProps}
    />
  );
};

NotesVirtualizedList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  })).isRequired,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onSaveEdit: PropTypes.func.isRequired,
  editingNoteId: PropTypes.string,
  editContent: PropTypes.string,
  setEditContent: PropTypes.func.isRequired,
  setEditingNoteId: PropTypes.func.isRequired,
  formatTimestamp: PropTypes.func,
  hasNextPage: PropTypes.bool,
  isNextPageLoading: PropTypes.bool,
  loadNextPage: PropTypes.func,
  height: PropTypes.number,
  itemHeight: PropTypes.number,
  className: PropTypes.string
};

export default NotesVirtualizedList; 