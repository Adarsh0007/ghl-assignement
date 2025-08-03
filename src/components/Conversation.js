import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Star, Reply, MoreVertical, Send, Paperclip, Zap, Expand } from 'lucide-react';
import { ConversationService } from '../services/conversationService.js';

const Conversation = ({ contactId, contactName = "Olivia John", contactData = {}, onToggleNotes, showNotes }) => {
  const [message, setMessage] = useState('');
  const [isTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState(new Set());

  // Load conversations data when contact changes
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ConversationService.getConversations(contactId, contactName, contactData);
        setConversations(data);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    if (contactId) {
      loadConversations();
    }
  }, [contactId, contactName, contactData]);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      // In a real app, this would send the message via API
      console.log('Sending message:', message);
      setMessage('');
    }
  }, [message]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleButtonClick = useCallback((buttonText) => {
    console.log('Button clicked:', buttonText);
    // Handle different button actions
    if (buttonText === 'Track Your Order') {
      // Open tracking modal or navigate to tracking page
      console.log('Opening order tracking...');
    } else if (buttonText === 'Reply') {
      // Focus on message input or open reply modal
      console.log('Opening reply...');
    }
  }, []);

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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Conversation Main Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 dark:bg-blue-900 rounded-full">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.22-1.22L3.8 16A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Conversation</span>
        </div>
        {!showNotes && (
          <button
            onClick={onToggleNotes}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Show Notes
          </button>
        )}
      </div>

      {/* Conversation Threads */}
      <div className="flex-1 p-4 space-y-4">
        {loading && <p>Loading conversations...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && conversations.map((conversation) => (
          <div key={conversation.id} className="space-y-3">
            {/* Conversation Header - Only show if there are sent messages */}
            {conversation.messages.some(msg => msg.direction === 'sent') && (
              <div className="flex items-center justify-between">
                {conversation.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            )}

            {/* Messages */}
            {conversation.messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div className={`flex items-start space-x-3 ${msg.isSmall ? 'ml-4' : ''} ${
                  msg.direction === 'sent' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar - Only for received messages */}
                  {msg.direction !== 'sent' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {msg.from.charAt(0)}
                    </div>
                  )}
                  <div className={`flex-1 min-w-0 ${
                    msg.direction === 'sent' 
                      ? 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' 
                      : 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700'
                  }`}>
                    {/* Email-style layout for sent messages */}
                    {msg.direction === 'sent' && (
                      <>
                        {/* Subject Line */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-600 relative">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2">
                           {msg.subject}
                          </h3>
                          <button
                            onClick={() => handleExpandMessage(msg.id)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                            aria-label={expandedMessages.has(msg.id) ? "Collapse message" : "Expand message"}
                          >
                            <Expand className={`w-4 h-4 transition-transform ${
                              expandedMessages.has(msg.id) ? 'rotate-180' : ''
                            }`} />
                          </button>
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
                            {msg.direction === 'sent' && (
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {msg.to.charAt(0)}
                              </div>
                            )}
                            {msg.direction !== 'sent' && (
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {msg.from.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {msg.from}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                To: {msg.direction === 'sent' ? (msg.to === 'Me' ? 'Me' : msg.to) : msg.to}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {msg.timestamp}
                            </span>
                            <button
                              className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                              aria-label="Star message"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                              aria-label="Reply to message"
                            >
                              <Reply className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              aria-label="More options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Email Body */}
                        <div className="mb-4 text-left">
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            Hey {msg.to.split(' ')[0]},
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            You Order has reached.
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            Your Urban Wellness LLP order has arrived in your city, Click the button below to track your order in real-time. Arriving on Tuesday, November 19th.
                          </p>
                          <button 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium bg-transparent border-none p-0 cursor-pointer"
                          >
                            Track Your Order
                          </button>
                        </div>
                        
                        {/* Action Button */}
                        <div className="flex justify-start">
                          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                            <Reply className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </>
                    )}
                    
                    {/* Regular message content for received messages */}
                    {msg.direction !== 'sent' && (
                      <p className={`text-sm text-gray-700 dark:text-gray-300 text-left ${msg.isSmall ? 'text-xs' : ''}`}>
                        {msg.content}
                      </p>
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
                    
                    {/* Timestamp for received messages */}
                    {msg.direction !== 'sent' && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {msg.hasButtons && (
                      <div className={`flex space-x-2 mt-3 ${
                        msg.direction === 'sent' ? 'justify-start' : ''
                      }`}>
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
                            {button.icon && <button.icon className="w-3 h-3" />}
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
        ))}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {contactName} is typing
            </span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Attach file"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Quick actions"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;