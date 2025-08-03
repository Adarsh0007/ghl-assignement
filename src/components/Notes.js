import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import { ConversationService } from '../services/conversationService.js';

// Lazy load components
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));
const NotesSkeleton = React.lazy(() => import('./globalComponents/NotesSkeleton.js'));

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

  // Load notes data when contact changes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ConversationService.getNotes(contactId, contactName, contactData);
        setNotes(data);
      } catch (err) {
        console.error('Error loading notes:', err);
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    if (contactId) {
      loadNotes();
    }
  }, [contactId, contactName, contactData]);

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
    if (editContent.trim()) {
      console.log('🔄 Saving edit for note:', editingNoteId, 'New content:', editContent.trim());
      try {
        const result = await ConversationService.updateNote(contactId, editingNoteId, editContent.trim());
        
        if (result.success) {
          console.log('✅ Note updated successfully:', result.data);
          // Convert timestamp to Date object
          const updatedNote = {
            ...result.data,
            timestamp: new Date(result.data.timestamp)
          };
          setNotes(prev => prev.map(note => 
            note.id === editingNoteId 
              ? updatedNote
              : note
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
    console.log('🔄 Deleting note:', noteId, 'for contact:', contactId);
    try {
      const result = await ConversationService.deleteNote(contactId, noteId);
      
      if (result.success) {
        console.log('✅ Note deleted successfully');
        setNotes(prev => prev.filter(note => note.id !== noteId));
      } else {
        console.error('❌ Failed to delete note:', result.error);
      }
    } catch (error) {
      console.error('❌ Error deleting note:', error);
    }
  }, [contactId]);

  const handleKeyPress = useCallback((e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  }, []);

  const handleClose = useCallback(() => {
    console.log('Closing notes panel');
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notes
        </h2>
        <div className="flex items-center space-x-2">
          <Suspense fallback={<ButtonFallback onClick={() => setIsAddingNote(true)} className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" aria-label="Add new note"><Plus className="w-4 h-4" /><span className="text-blue-600 dark:text-blue-400 font-medium">Add</span></ButtonFallback>}>
            <CustomButton
              onClick={() => setIsAddingNote(true)}
              variant="none"
              size="md"
              icon={Plus}
              text="Add"
              aria-label="Add new note"
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium"
            />
          </Suspense>
          <Suspense fallback={<ButtonFallback onClick={handleClose} className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" aria-label="Close notes panel"><X className="w-4 h-4" /></ButtonFallback>}>
            <CustomButton
              onClick={handleClose}
              variant="none"
              size="sm"
              icon={X}
              aria-label="Close notes panel"
              className="p-1"
            />
          </Suspense>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 p-4 space-y-4">
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

        {/* Existing Notes */}
        {!loading && !error && notes.map((note) => (
          <div key={note.id} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleSaveEdit)}
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
                        onClick={handleSaveEdit}
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
                        {formatTimestamp(note.timestamp)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Suspense fallback={<ButtonFallback onClick={() => handleEditNote(note.id, note.content)} className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200" aria-label="Edit note"><Edit3 className="w-3 h-3" /></ButtonFallback>}>
                          <CustomButton
                            onClick={() => handleEditNote(note.id, note.content)}
                            variant="none"
                            size="sm"
                            icon={Edit3}
                            aria-label="Edit note"
                            className="p-1"
                          />
                        </Suspense>
                        <Suspense fallback={<ButtonFallback onClick={() => handleDeleteNote(note.id)} className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200" aria-label="Delete note"><Trash2 className="w-3 h-3" /></ButtonFallback>}>
                          <CustomButton
                            onClick={() => handleDeleteNote(note.id)}
                            variant="none"
                            size="sm"
                            icon={Trash2}
                            aria-label="Delete note"
                            className="p-1"
                          />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {!loading && !error && notes.length === 0 && !isAddingNote && (
          <div className="text-center py-8">
            <div className="text-gray-300 dark:text-gray-600 mb-2">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No notes yet. Click "Add" to create your first note.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes; 