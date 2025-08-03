import React, { useState, useCallback, Suspense } from 'react';

// Lazy load all child components
const ContactDetails = React.lazy(() => import('./ContactDetails.js'));
const Conversation = React.lazy(() => import('./Conversation.js'));
const Notes = React.lazy(() => import('./Notes.js'));

// Lazy load the generic loading fallback
const ComponentLoadingFallback = React.lazy(() => import('./globalComponents/ComponentLoadingFallback.js'));
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));

const ContactDetailsWithSidebar = () => {
  const [activeView, setActiveView] = useState('contact'); // 'contact', 'conversation', 'notes'
  const [currentContactData, setCurrentContactData] = useState(null);
  const [showNotes, setShowNotes] = useState(true); // Show notes by default on desktop

  const handleViewChange = useCallback((view) => {
    setActiveView(view);
  }, []);

  const handleContactChange = useCallback((contactData) => {
    setCurrentContactData(contactData);
  }, []);

  const handleToggleNotes = useCallback(() => {
    setShowNotes(prev => !prev);
  }, []);

  const handleCloseNotes = useCallback(() => {
    setShowNotes(false);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <Suspense fallback={<button className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeView === 'contact' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>Contact</button>}>
          <CustomButton
            onClick={() => handleViewChange('contact')}
            text="Contact"
            variant="none"
            size="md"
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === 'contact'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          />
        </Suspense>
        <Suspense fallback={<button className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeView === 'conversation' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>Conversation</button>}>
          <CustomButton
            onClick={() => handleViewChange('conversation')}
            text="Conversation"
            variant="none"
            size="md"
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === 'conversation'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          />
        </Suspense>
        <Suspense fallback={<button className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeView === 'notes' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>Notes</button>}>
          <CustomButton
            onClick={() => handleViewChange('notes')}
            text="Notes"
            variant="none"
            size="md"
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === 'notes'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          />
        </Suspense>
      </div>

      {/* Contact Details - Full width on mobile, 30% on desktop */}
      <div className={`${
        activeView === 'contact' ? 'block' : 'hidden'
      } lg:block lg:w-[30%] flex flex-col lg:h-screen`}>
        <div className="flex-1 overflow-y-auto lg:h-full">
          <Suspense fallback={<ComponentLoadingFallback componentName="Contact Details" size="lg" />}>
            <ContactDetails onContactChange={handleContactChange} />
          </Suspense>
        </div>
      </div>

      {/* Conversation - Full width on mobile, 50% on desktop, or 70% when notes are hidden */}
      <div className={`${
        activeView === 'conversation' ? 'block' : 'hidden'
      } lg:block lg:flex-1 flex flex-col lg:border-l border-gray-200 dark:border-gray-700 lg:h-screen`}>
        <div className="flex-1 overflow-y-auto lg:h-full">
          <Suspense fallback={<ComponentLoadingFallback componentName="Conversation" size="lg" />}>
            <Conversation 
              contactId={currentContactData?.id || 1} 
              contactName={currentContactData ? `${currentContactData.firstName} ${currentContactData.lastName}` : "Olivia John"}
              contactData={currentContactData || {}}
              onToggleNotes={handleToggleNotes}
              showNotes={showNotes}
            />
          </Suspense>
        </div>
      </div>

      {/* Notes - Full width on mobile, 20% on desktop */}
      <div className={`${
        activeView === 'notes' ? 'block' : 'hidden'
      } lg:block lg:w-[20%] flex flex-col lg:border-l border-gray-200 dark:border-gray-700 ${
        !showNotes ? 'lg:hidden' : ''
      } lg:h-screen`}>
        <div className="flex-1 overflow-y-auto lg:h-full">
          <Suspense fallback={<ComponentLoadingFallback componentName="Notes" size="lg" />}>
            <Notes 
              contactId={currentContactData?.id || 1} 
              contactName={currentContactData ? `${currentContactData.firstName} ${currentContactData.lastName}` : "Olivia John"}
              contactData={currentContactData || {}}
              onClose={handleCloseNotes}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsWithSidebar; 