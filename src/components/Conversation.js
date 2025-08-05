import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Send, Star, MoreVertical, ChevronDown, Expand, Paperclip, Zap, Reply } from 'lucide-react';
import { CustomButton, ComponentLoadingFallback, ConversationSkeleton, FormField } from './globalComponents';
import { getSmartTimeDisplay } from '../utils';
import { useToast } from '../context/ToastContext';

// Button fallback component
const ButtonFallback = ({ children, iconClassName, textClassName, ...props }) => (
  <button {...props}>
    {children}
  </button>
);

const Conversation = ({ contactId, contactName = "Olivia John", contactData = {}, onToggleNotes, showNotes }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [starRatings, setStarRatings] = useState({});
  
  // Toast hook
  const { showSuccess, showInfo } = useToast();

  // Handle star rating toggle
  const handleStarRating = useCallback((messageId) => {
    console.log('Star rating clicked for message:', messageId);
    setStarRatings(prev => {
      const newRatings = {
        ...prev,
        [messageId]: !prev[messageId]
      };
      console.log('New star ratings:', newRatings);
      // Save to localStorage after state update
      setTimeout(() => {
        if (contactId && (typeof contactId === 'string' || typeof contactId === 'number')) {
          try {
            localStorage.setItem(`conversation_ratings_${contactId}`, JSON.stringify(newRatings));
          } catch (error) {
            console.error('Error saving star ratings:', error);
          }
        }
      }, 0);
      return newRatings;
    });
  }, [contactId]);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      // Add message to conversation
      const newMessage = {
        id: Date.now(),
        from: "Me",
        to: contactName,
        content: message,
        direction: "sent",
        timestamp: new Date().toISOString(),
        hasButtons: false
      };
      
      setConversations(prev => {
        if (prev.length === 0) {
          // If no conversations exist, create a new one
          return [{
            id: 1,
            unreadCount: 0,
            messages: [newMessage]
          }];
        }
        
        // Add message to the first conversation
        return prev.map((conv, index) => 
          index === 0 
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        );
      });
      
      setMessage('');
    }
  }, [message, contactName]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleExpandMessage = useCallback((messageId) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const handleButtonClick = useCallback((buttonText) => {
    console.log(`Button clicked: ${buttonText}`);
    
    // Show toast notifications for specific buttons
    if (buttonText === 'Reply') {
      showSuccess(`Reply action initiated for message`, 3000);
      console.log(`Reply button clicked - Toast notification shown`);
    } else if (buttonText === 'Track Your Order') {
      showInfo(`Order tracking initiated. Redirecting to tracking page...`, 4000);
      console.log(`Track Your Order button clicked - Toast notification shown`);
    } else {
      // For any other buttons, show a generic info toast
      showInfo(`${buttonText} action completed`, 3000);
      console.log(`${buttonText} button clicked - Toast notification shown`);
    }
    
    // Handle button actions
  }, [showSuccess, showInfo]);

  // Handle attachment button click
  const handleAttachmentClick = useCallback(() => {
    showInfo(`File attachment dialog opened`, 3000);
    console.log(`Attachment button clicked - Toast notification shown`);
    // Handle attachment functionality
  }, [showInfo]);

  // Handle quick actions button click
  const handleQuickActionsClick = useCallback(() => {
    showInfo(`Quick actions menu opened`, 3000);
    console.log(`Quick actions button clicked - Toast notification shown`);
    // Handle quick actions functionality
  }, [showInfo]);

  // Handle expand/collapse button click
  const handleExpandClick = useCallback(() => {
    showInfo(`Message input expanded`, 3000);
    console.log(`Expand button clicked - Toast notification shown`);
    // Handle expand/collapse functionality
  }, [showInfo]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!contactId || (typeof contactId !== 'string' && typeof contactId !== 'number')) {
      setConversations([{
        id: 1,
        unreadCount: 0,
        messages: []
      }]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch conversation data from JSON file
      const response = await fetch('/data/conversation.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allConversations = await response.json();
      
      // Find conversations for the current contact
      const contactConversations = allConversations.find(
        contact => contact.contactId === contactId
      );
      
      if (!contactConversations) {
        // If no conversations found for this contact, create empty conversation
        setConversations([{
          id: 1,
          unreadCount: 0,
          messages: []
        }]);
        return;
      }
      
      setConversations(contactConversations.conversations);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations. Please try again later.');
      
      // Fallback to empty conversation
      setConversations([{
        id: 1,
        unreadCount: 0,
        messages: []
      }]);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  // Load star ratings from localStorage
  const loadStarRatings = useCallback(() => {
    if (!contactId || (typeof contactId !== 'string' && typeof contactId !== 'number')) {
      setStarRatings({});
      return;
    }

    try {
      const storedRatings = localStorage.getItem(`conversation_ratings_${contactId}`);
      if (storedRatings) {
        setStarRatings(JSON.parse(storedRatings));
      }
    } catch (error) {
      console.error('Error loading star ratings:', error);
    }
  }, [contactId]);

  useEffect(() => {
    // Ensure contactId is a valid value before proceeding
    if (contactId && (typeof contactId === 'string' || typeof contactId === 'number')) {
      loadConversations();
      loadStarRatings();
    } else {
      // Set default state when contactId is invalid
      setConversations([{
        id: 1,
        unreadCount: 0,
        messages: []
      }]);
      setStarRatings({});
      setLoading(false);
    }
  }, [contactId, loadConversations, loadStarRatings]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 dark:bg-blue-900 rounded-full">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.22-1.22L3.8 16A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Conversation</span>
          </div>
        </div>
        {!showNotes && (
          <Suspense fallback={<ButtonFallback onClick={onToggleNotes} className="px-3 py-1.5 text-sm font-medium bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">Show Notes</ButtonFallback>}>
            <CustomButton
              onClick={onToggleNotes}
              variant="none"
              size="md"
              text="Show Notes"
              className="px-3 py-1.5 text-sm font-medium"
            />
          </Suspense>
        )}
      </div>

      {/* Conversation Threads */}
      <div className="flex-1 p-4 pb-16 space-y-4 overflow-y-auto">
        {loading && (
          <Suspense fallback={<ComponentLoadingFallback componentName="Conversation Skeleton" size="lg" />}>
            <ConversationSkeleton />
          </Suspense>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No conversations found for this contact.
              </div>
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.id} className="space-y-3">
                  {/* Messages */}
                  {conversation.messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className={`flex items-start space-x-3 ${msg.isSmall ? 'ml-4' : ''} ${
                        msg.direction === 'sent' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        {/* Avatar - Only for received messages */}
                        {msg.direction !== 'sent' && (
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {msg.from && msg.from.charAt(0)}
                          </div>
                        )}
                        
                        <div className={`flex-1 min-w-0 ${
                          msg.direction === 'sent' 
                            ? 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' 
                            : 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700'
                        }`}>
                          
                          {/* Sent Message Layout */}
                          {msg.direction === 'sent' && (
                            <>
                              {/* Subject Line */}
                              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-600 relative">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2">
                                 {msg.subject}
                                </h3>
                                <Suspense fallback={<ButtonFallback onClick={() => handleExpandMessage(msg.id)} className="p-1 text-gray-400 hover:text-blue-500 transition-colors" aria-label={expandedMessages.has(msg.id) ? "Collapse message" : "Expand message"}><Expand className={`w-4 h-4 transition-transform ${expandedMessages.has(msg.id) ? 'rotate-180' : ''}`} /></ButtonFallback>}>
                                  <CustomButton
                                    onClick={() => handleExpandMessage(msg.id)}
                                    variant="none"
                                    size="sm"
                                    icon={Expand}
                                    aria-label={expandedMessages.has(msg.id) ? "Collapse message" : "Expand message"}
                                    className={`p-1 ${expandedMessages.has(msg.id) ? 'rotate-180' : ''}`}
                                  />
                                </Suspense>
                                {/* Unread count positioned on the bottom border */}
                                {msg.unreadCount > 0 && (
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                                      {msg.unreadCount}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Email Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  {/* Avatar for recipient (contact) in sent messages */}
                                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {msg.to && msg.to.charAt(0)}
                                  </div>
                                  <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {msg?.to}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      To: {msg.from || 'Unknown'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                    {getSmartTimeDisplay(msg.timestamp)}
                                  </div>
                                  <button
                                    onClick={() => handleStarRating(msg.id)}
                                    className={`p-1 transition-all duration-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      starRatings[msg.id] 
                                        ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                                        : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400'
                                    }`}
                                    aria-label={starRatings[msg.id] ? "Unstar message" : "Star message"}
                                    title={starRatings[msg.id] ? "Unstar message" : "Star message"}
                                  >
                                    <Star className={`w-4 h-4 ${starRatings[msg.id] ? 'fill-current' : ''}`} />
                                  </button>
                                  <Suspense fallback={<ButtonFallback className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" aria-label="More options"><MoreVertical className="w-4 h-4" /></ButtonFallback>}>
                                    <CustomButton
                                      variant="none"
                                      size="sm"
                                      icon={MoreVertical}
                                      aria-label="More options"
                                      className="p-1"
                                    />
                                  </Suspense>
                                </div>
                              </div>
                              
                              {/* Email Body */}
                              <div className="mb-4 text-left">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                  Hey {msg.to ? msg.to.split(' ')[0] : 'there'},
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  You Order has reached.
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                  Your Urban Wellness LLP order has arrived in your city. Click the button below to track your order in real-time. Arriving on Tuesday, November 19th.
                                </p>
                              </div>
                            </>
                          )}
                          
                          {/* Received Message Layout */}
                          {msg.direction !== 'sent' && (
                            <>
                              <p className={`text-sm text-gray-700 dark:text-gray-300 text-left ${msg.isSmall ? 'text-xs' : ''}`}>
                                {msg.content}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {getSmartTimeDisplay(msg.timestamp)}
                                </span>
                                <button
                                  onClick={() => handleStarRating(msg.id)}
                                  className={`p-1 transition-all duration-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    starRatings[msg.id] 
                                      ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                                      : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400'
                                  }`}
                                  aria-label={starRatings[msg.id] ? "Unstar message" : "Star message"}
                                  title={starRatings[msg.id] ? "Unstar message" : "Star message"}
                                >
                                  <Star className={`w-4 h-4 ${starRatings[msg.id] ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </>
                          )}
                          
                          {/* Expanded content for sent messages */}
                          {msg.direction === 'sent' && expandedMessages.has(msg.id) && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Message Details</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">ID: {msg.id}</span>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  <div><strong>From:</strong> {msg.from}</div>
                                  <div><strong>To:</strong> {msg.to}</div>
                                  <div><strong>Sent:</strong> {msg.timestamp}</div>
                                  <div><strong>Direction:</strong> {msg.direction}</div>
                                </div>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    <strong>Full Message:</strong>
                                  </div>
                                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                    {msg.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Action Buttons - Only for sent messages with buttons */}
                          {msg.direction === 'sent' && msg.hasButtons && (
                            <div className="flex space-x-2 mt-3 justify-start">
                              {msg.buttons.map((button, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleButtonClick(button.text)}
                                  className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                    button.type === 'primary'
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                  }`}
                                >
                                  {button.text === 'Reply' && <Reply className="w-3 h-3" />}
                                  <span>{button.text}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExpandClick}
            className="p-2 icon-theme-secondary btn-focus btn-interactive"
            aria-label="Expand message input"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex-1 relative">
            <Suspense fallback={<input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />}>
              <FormField
                type="text"
                name="message"
                value={message}
                onChange={(value) => setMessage(value)}
                placeholder="Type your message..."
                className="mb-0"
                inputClassName="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                onKeyPress={handleKeyPress}
              />
            </Suspense>
          </div>
          <Suspense fallback={<ButtonFallback onClick={handleSendMessage} disabled={!message.trim()} className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message"><Send className="w-4 h-4" /></ButtonFallback>}>
            <CustomButton
              onClick={handleSendMessage}
              disabled={!message.trim()}
              variant="none"
              size="sm"
              icon={Send}
              aria-label="Send message"
              className="p-2"
            />
          </Suspense>
          <Suspense fallback={<ButtonFallback onClick={handleAttachmentClick} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" aria-label="Attach file"><Paperclip className="w-4 h-4" /></ButtonFallback>}>
            <CustomButton
              onClick={handleAttachmentClick}
              variant="none"
              size="sm"
              icon={Paperclip}
              aria-label="Attach file"
              className="p-2"
            />
          </Suspense>
          <Suspense fallback={<ButtonFallback onClick={handleQuickActionsClick} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" aria-label="Quick actions"><Zap className="w-4 h-4" /></ButtonFallback>}>
            <CustomButton
              onClick={handleQuickActionsClick}
              variant="none"
              size="sm"
              icon={Zap}
              aria-label="Quick actions"
              className="p-2"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Conversation;