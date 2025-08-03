import React, { useState, useCallback } from 'react';
import ContactDetails from './ContactDetails.js';
import Conversation from './Conversation.js';
import Notes from './Notes.js';

const ContactDetailsWithSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('contact'); // 'contact', 'conversation', 'notes'

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleViewChange = useCallback((view) => {
    setActiveView(view);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => handleViewChange('contact')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeView === 'contact'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Contact
        </button>
        <button
          onClick={() => handleViewChange('conversation')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeView === 'conversation'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Conversation
        </button>
        <button
          onClick={() => handleViewChange('notes')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeView === 'notes'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Notes
        </button>
      </div>

      {/* Contact Details - Full width on mobile, 30% on desktop */}
      <div className={`${
        activeView === 'contact' ? 'block' : 'hidden'
      } lg:block lg:w-[30%] flex flex-col`}>
        <div className="h-full overflow-y-auto">
          <ContactDetails />
        </div>
      </div>

      {/* Conversation - Full width on mobile, 50% on desktop */}
      <div className={`${
        activeView === 'conversation' ? 'block' : 'hidden'
      } lg:block lg:w-[50%] flex flex-col lg:border-l border-gray-200 dark:border-gray-700`}>
        <div className="h-full overflow-y-auto">
          <Conversation contactId="1" contactName="Olivia John" />
        </div>
      </div>

      {/* Notes - Full width on mobile, 20% on desktop */}
      <div className={`${
        activeView === 'notes' ? 'block' : 'hidden'
      } lg:block lg:w-[20%] flex flex-col lg:border-l border-gray-200 dark:border-gray-700`}>
        <div className="h-full overflow-y-auto">
          <Notes contactId="1" contactName="Olivia John" />
        </div>
      </div>

      {/* Desktop Sidebar Toggle Button (when closed) */}
      {!isSidebarOpen && (
        <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={handleToggleSidebar}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactDetailsWithSidebar; 