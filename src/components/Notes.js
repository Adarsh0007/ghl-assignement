import React, { useState, useCallback } from 'react';
import { Plus, Edit3, Trash2, X } from 'lucide-react';

const Notes = ({ contactId, contactName }) => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: "Customer interested in premium package. Follow up next week.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      author: "John Doe"
    },
    {
      id: 2,
      content: "Discussed pricing options. Customer prefers monthly billing.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      author: "Jane Smith"
    },
    {
      id: 3,
      content: "Initial contact made. Customer has questions about features.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      author: "Mike Johnson"
    }
  ]);

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const formatTimestamp = useCallback((timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return timestamp.toLocaleDateString();
  }, []);

  const handleAddNote = useCallback(() => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote.trim(),
        timestamp: new Date(),
        author: "Current User"
      };
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      setIsAddingNote(false);
    }
  }, [newNote]);

  const handleEditNote = useCallback((noteId, content) => {
    setEditingNoteId(noteId);
    setEditContent(content);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editContent.trim()) {
      setNotes(prev => prev.map(note => 
        note.id === editingNoteId 
          ? { ...note, content: editContent.trim(), timestamp: new Date() }
          : note
      ));
      setEditingNoteId(null);
      setEditContent('');
    }
  }, [editContent, editingNoteId]);

  const handleDeleteNote = useCallback((noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  }, []);

  const handleKeyPress = useCallback((e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  }, []);

  const handleClose = useCallback(() => {
    // In a real app, this would close the notes panel
    console.log('Closing notes panel');
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notes
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingNote(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="Add new note"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close notes panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 p-4 space-y-4">
        {/* Add Note Form */}
        {isAddingNote && (
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
                    <button
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Existing Notes */}
        {notes.map((note) => (
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
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editContent.trim()}
                        className="px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors"
                      >
                        Save
                      </button>
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
                        <button
                          onClick={() => handleEditNote(note.id, note.content)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          aria-label="Edit note"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Delete note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {notes.length === 0 && !isAddingNote && (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
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