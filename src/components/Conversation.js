import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, Star, Reply, MoreVertical, Send, Paperclip, Zap } from 'lucide-react';

const Conversation = ({ contactId, contactName = "Olivia John" }) => {
  const [message, setMessage] = useState('');
  const [isTyping] = useState(false);

  // Mock conversation data - in a real app, this would come from API
  const conversations = useMemo(() => [
    {
      id: 1,
      title: "Set up a new time to follow up on the mail chain issue that we talked about the...",
      messages: [
        {
          id: 1,
          from: contactName,
          to: "Me",
          content: "Hey John, Your Order has reached. Your Urban Wellness LLP order has arrived in your city, Click the button below to track your order in real-time. Arriving on Tuesday, November 19th.",
          timestamp: "5 min ago",
          hasButtons: true,
          buttons: [
            { text: "Track Your Order", type: "primary" },
            { text: "Reply", type: "secondary", icon: Reply }
          ]
        },
        {
          id: 2,
          from: contactName,
          to: "Me",
          content: "Please let me know",
          timestamp: "11:44 AM",
          isSmall: true
        }
      ],
      unreadCount: 3
    },
    {
      id: 2,
      title: "Set up a new time to follow up on the mail chain issue that we talked about the...",
      messages: [
        {
          id: 3,
          from: contactName,
          to: "Me",
          content: "Hey John, Your Order has reached. Your Urban Wellness LLP order has arrived in your city, Click the button below to track your order in real-time. Arriving on Tuesday, November 19th.",
          timestamp: "5 min ago",
          hasButtons: true,
          buttons: [
            { text: "Track Your Order", type: "primary" },
            { text: "Reply", type: "secondary", icon: Reply }
          ]
        }
      ],
      unreadCount: 0
    }
  ], [contactName]);

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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversations
          </h2>
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Conversation Threads */}
      <div className="flex-1 p-4 space-y-4">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="space-y-3">
            {/* Conversation Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                  {conversation.title}
                </h3>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              {conversation.unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
            </div>

            {/* Messages */}
            {conversation.messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div className={`flex items-start space-x-3 ${msg.isSmall ? 'ml-4' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                    {msg.from.charAt(0)}
                  </div>
                  <div className={`flex-1 min-w-0 ${msg.isSmall ? 'bg-gray-100 dark:bg-gray-700 rounded-lg p-2' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {msg.from}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          to {msg.to}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
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
                    <p className={`text-sm text-gray-700 dark:text-gray-300 ${msg.isSmall ? 'text-xs' : ''}`}>
                      {msg.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {msg.hasButtons && (
                      <div className="flex space-x-2 mt-3">
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