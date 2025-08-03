import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Plus, X } from 'lucide-react';
import { ConversationService } from '../services/conversationService.js';

// Lazy load components
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));
const NotesSkeleton = React.lazy(() => import('./globalComponents/NotesSkeleton.js'));
const NotesVirtualizedList = React.lazy(() => import('./globalComponents/NotesVirtualizedList.js'));

// Loading fallback for CustomButton
const ButtonFallback = ({ children, ...props }) => (
  <button 
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
    {...props}
  >
    {children}
  </button>
);

const Notes = ({ contactId, contactName, contactData = {}, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  // Infinite loading states
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allNotes, setAllNotes] = useState([]);

  // Load initial notes data when contact changes
  useEffect(() => {
    const loadInitialNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1);
        setAllNotes([]);
        
        const data = await ConversationService.getNotes(contactId, contactName, contactData);
        setAllNotes(data);
        setNotes(data.slice(0, 20)); // Load first 20 notes initially
        setHasNextPage(data.length > 20);
      } catch (err) {
        console.error('Error loading notes:', err);
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    if (contactId) {
      loadInitialNotes();
    }
  }, [contactId, contactName, contactData]);

  // Load next page of notes
  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading || !hasNextPage) return;
    
    setIsNextPageLoading(true);
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const nextPage = currentPage + 1;
      const pageSize = 20;
      const startIndex = (nextPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      const newNotes = allNotes.slice(startIndex, endIndex);
      
      if (newNotes.length > 0) {
        setNotes(prev => [...prev, ...newNotes]);
        setCurrentPage(nextPage);
        setHasNextPage(endIndex < allNotes.length);
      } else {
        setHasNextPage(false);
      }
    } catch (error) {
      console.error('Error loading next page:', error);
    } finally {
      setIsNextPageLoading(false);
    }
  }, [isNextPageLoading, hasNextPage, currentPage, allNotes]);

  const formatTimestamp = useCallback((timestamp) => {
    // Ensure timestamp is a valid Date object
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }, []);

  const handleAddNote = useCallback(async () => {
    if (newNote.trim()) {
      console.log('🔄 Adding new note for contact:', contactId, 'Content:', newNote.trim());
      try {
        const result = await ConversationService.addNote(contactId, {
          content: newNote.trim(),
          author: "Current User",
          conversationId: null
        });
        
        if (result.success) {
          console.log('✅ Note added successfully:', result.data);
          // Convert timestamp to Date object
          const noteWithDate = {
            ...result.data,
            timestamp: new Date(result.data.timestamp)
          };
          setNotes(prev => [noteWithDate, ...prev]);
          setAllNotes(prev => [noteWithDate, ...prev]);
          setNewNote('');
          setIsAddingNote(false);
        } else {
          console.error('❌ Failed to add note:', result.error);
        }
      } catch (error) {
        console.error('❌ Error adding note:', error);
      }
    }
  }, [newNote, contactId]);

  const handleEditNote = useCallback((noteId, content) => {
    console.log('🔄 Starting edit for note:', noteId, 'Current content:', content);
    setEditingNoteId(noteId);
    setEditContent(content);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (editContent.trim() && editingNoteId) {
      console.log('🔄 Saving edited note:', editingNoteId, 'New content:', editContent.trim());
      try {
        const result = await ConversationService.updateNote(contactId, editingNoteId, editContent.trim());
        
        if (result.success) {
          console.log('✅ Note updated successfully:', result.data);
          const updatedNote = {
            ...result.data,
            timestamp: new Date(result.data.timestamp)
          };
          
          setNotes(prev => prev.map(note => 
            note.id === editingNoteId ? updatedNote : note
          ));
          setAllNotes(prev => prev.map(note => 
            note.id === editingNoteId ? updatedNote : note
          ));
          setEditingNoteId(null);
          setEditContent('');
        } else {
          console.error('❌ Failed to update note:', result.error);
        }
      } catch (error) {
        console.error('❌ Error updating note:', error);
      }
    }
  }, [editContent, editingNoteId, contactId]);

  const handleDeleteNote = useCallback(async (noteId) => {
    console.log('🔄 Deleting note:', noteId);
    try {
      const result = await ConversationService.deleteNote(contactId, noteId);
      
      if (result.success) {
        console.log('✅ Note deleted successfully');
        setNotes(prev => prev.filter(note => note.id !== noteId));
        setAllNotes(prev => prev.filter(note => note.id !== noteId));
      } else {
        console.error('❌ Failed to delete note:', result.error);
      }
    } catch (error) {
      console.error('❌ Error deleting note:', error);
    }
  }, [contactId]);

  const handleKeyPress = useCallback((e, action) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      action();
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notes
        </h2>
        <div className="flex items-center space-x-2">
          <Suspense fallback={<ButtonFallback onClick={() => setIsAddingNote(true)} className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" aria-label="Add new note"><Plus className="w-4 h-4" /><span className="text-gray-500 dark:text-gray-400 font-medium">Add</span></ButtonFallback>}>
            <CustomButton
              onClick={() => setIsAddingNote(true)}
              variant="none"
              size="md"
              icon={Plus}
              text="Add"
              aria-label="Add new note"
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              iconClassName="w-4 h-4"
              textClassName="text-gray-500 dark:text-gray-400 font-medium"
            />
          </Suspense>
          <Suspense fallback={<ButtonFallback onClick={onClose} className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" aria-label="Close notes panel"><X className="w-4 h-4" /></ButtonFallback>}>
            <CustomButton
              onClick={onClose}
              variant="none"
              size="sm"
              icon={X}
              aria-label="Close notes panel"
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            />
          </Suspense>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4 space-y-4">
        {/* Loading State */}
        {loading && (
          <Suspense fallback={<div>Loading notes...</div>}>
            <NotesSkeleton />
          </Suspense>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 dark:text-red-500 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Add Note Form */}
        {!loading && !error && isAddingNote && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-start space-x-2">
              <div className="flex-1">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddNote)}
                  placeholder="Type your note here..."
                  className="w-full p-3 border border-yellow-300 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  rows={4}
                  autoFocus
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Just now
                  </span>
                  <div className="flex space-x-2">
                    <Suspense fallback={<ButtonFallback onClick={() => setIsAddingNote(false)} className="px-3 py-1 text-sm bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">Cancel</ButtonFallback>}>
                      <CustomButton
                        onClick={() => setIsAddingNote(false)}
                        variant="outline"
                        size="sm"
                        text="Cancel"
                        className="px-3 py-1 text-sm"
                      />
                    </Suspense>
                    <Suspense fallback={<ButtonFallback onClick={handleAddNote} disabled={!newNote.trim()} className="px-3 py-1 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Save</ButtonFallback>}>
                      <CustomButton
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        variant="primary"
                        size="sm"
                        text="Save"
                        className="px-3 py-1 text-sm font-medium"
                      />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Virtualized Notes List */}
        {!loading && !error && (
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<NotesSkeleton />}>
                             <NotesVirtualizedList
                 notes={notes}
                 onEditNote={handleEditNote}
                 onDeleteNote={handleDeleteNote}
                 onSaveEdit={handleSaveEdit}
                 editingNoteId={editingNoteId}
                 editContent={editContent}
                 setEditContent={setEditContent}
                 setEditingNoteId={setEditingNoteId}
                 formatTimestamp={formatTimestamp}
                 hasNextPage={hasNextPage}
                 isNextPageLoading={isNextPageLoading}
                 loadNextPage={loadNextPage}
                 height={400}
                 itemHeight={160}
                 className="notes-container"
               />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes; 