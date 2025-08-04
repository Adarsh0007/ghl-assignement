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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden max-w-2xl mx-auto w-full sticky top-0 z-10 flex-shrink-0">
        <div className="flex">
          <div className="flex-1 relative">
            <Suspense fallback={
              <button className="w-full py-3 px-4 font-medium text-sm transition-all duration-300 ease-in-out focus:outline-none relative bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-2 border-transparent">
              Contact
            </button>
            }>
              <CustomButton
                onClick={() => handleViewChange('contact')}
                text="Contact"
                variant="none"
                size="md"
                className="w-full py-3 px-4 font-medium text-sm transition-all duration-300 ease-in-out focus:outline-none relative bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-2 border-transparent"
              />
            </Suspense>
            
            {/* Active tab indicator - enhanced glow effect */}
            {activeView === 'contact' && (
              <div className="absolute inset-0 bg-gray-300/30 dark:bg-gray-500/30 pointer-events-none rounded-t-lg"></div>
            )}
          </div>
          
          <div className="flex-1 relative">
            <Suspense fallback={
              <button className="w-full py-3 px-4 font-medium text-sm transition-all duration-300 ease-in-out focus:outline-none relative bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-2 border-transparent">
              Conversation
            </button>
            }>
              <CustomButton
                onClick={() => handleViewChange('conversation')}
                text="Conversation"
                variant="none"
                size="md"
                className="w-full py-3 px-4 font-medium text-sm transition-all duration-300 ease-in-out focus:outline-none relative bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-2 border-transparent"
              />
            </Suspense>
            
            {/* Active tab indicator - enhanced glow effect */}
            {activeView === 'conversation' && (
              <div className="absolute inset-0 bg-gray-300/30 dark:bg-gray-500/30 pointer-events-none rounded-t-lg"></div>
            )}
          </div>
          
          <div className="flex-1 relative">
            <Suspense fallback={
              <button className="w-full py-3 px-4 font-medium text-sm transition-all duration-300 ease-in-out focus:outline-none relative bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-2 border-transparent">
              Notes
            </button>
            }>
              <CustomButton
                onClick={() => handleViewChange('notes')}
                text="Notes"
                variant="none"
                size="md"
                className="w-full py-3 px-4 font-medium text-sm transition-all duration-300 ease-in-out focus:outline-none relative bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-2 border-transparent"
              />
            </Suspense>
            
            {/* Active tab indicator - enhanced glow effect */}
            {activeView === 'notes' && (
              <div className="absolute inset-0 bg-gray-300/30 dark:bg-gray-500/30 pointer-events-none rounded-t-lg"></div>
            )}
          </div>
        </div>
        
        {/* Bottom border for active tab */}
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 opacity-40"></div>
        </div>
      </div>

      {/* Contact Details - Full width on mobile, 30% on desktop */}
      <div className={`${
        activeView === 'contact' ? 'block' : 'hidden'
      } lg:block lg:w-[30%] flex flex-col h-full lg:min-h-screen`}>
        <div className="flex-1 overflow-y-auto h-full">
          <Suspense fallback={<ComponentLoadingFallback componentName="Contact Details" size="lg" />}>
            <ContactDetails onContactChange={handleContactChange} />
          </Suspense>
        </div>
      </div>

      {/* Conversation - Full width on mobile, 50% on desktop, or 70% when notes are hidden */}
      <div className={`${
        activeView === 'conversation' ? 'block' : 'hidden'
      } lg:block lg:flex-1 flex flex-col lg:border-l border-gray-200 dark:border-gray-700 h-full lg:min-h-screen`}>
        <div className="flex-1 overflow-y-auto h-full">
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
      } h-full lg:min-h-screen`}>
        <div className="flex-1 overflow-y-auto h-full">
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