import React, { useState, useCallback } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { OwnerService } from '../services/ownerService.js';
import { FollowerService } from '../services/followerService.js';
import TagManager from './TagManager.js';
import OwnerSelector from './OwnerSelector.js';
import FollowerSelector from './FollowerSelector.js';

const ContactSummary = ({
  contact,
  showProfile,
  showOwner,
  showFollowers,
  showTags,
  onTagsChange,
  onCall,
  onOwnerChange,
  onFollowersChange
}) => {
  const [isOwnerSelectorOpen, setIsOwnerSelectorOpen] = useState(false);
  const [isFollowerSelectorOpen, setIsFollowerSelectorOpen] = useState(false);

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleOwnerClick = useCallback(() => {
    setIsOwnerSelectorOpen(true);
  }, []);

  const handleOwnerSelect = useCallback((newOwner) => {
    if (onOwnerChange) {
      onOwnerChange(newOwner);
    }
    setIsOwnerSelectorOpen(false);
  }, [onOwnerChange]);

  const handleCloseOwnerSelector = useCallback(() => {
    setIsOwnerSelectorOpen(false);
  }, []);

  const handleFollowersClick = useCallback(() => {
    setIsFollowerSelectorOpen(true);
  }, []);

  const handleFollowersSelect = useCallback((newFollowers) => {
    if (onFollowersChange) {
      onFollowersChange(newFollowers);
    }
    setIsFollowerSelectorOpen(false);
  }, [onFollowersChange]);

  const handleCloseFollowerSelector = useCallback(() => {
    setIsFollowerSelectorOpen(false);
  }, []);

  const getOwnerInitials = useCallback((ownerName) => {
    return OwnerService.getOwnerInitials(ownerName);
  }, []);

  const getFollowerInitials = useCallback((followerName) => {
    return FollowerService.getFollowerInitials(followerName);
  }, []);

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <section 
      className="card p-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      aria-labelledby="contact-name"
      aria-label="Contact summary information"
    >
      <div className="flex items-start space-x-4">
        {showProfile && (
          <div className="flex-shrink-0">
            <div 
              className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-lg"
              aria-label={`Profile avatar for ${contact.firstName} ${contact.lastName}`}
              role="img"
            >
              {getInitials(contact.firstName, contact.lastName)}
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 
                id="contact-name"
                className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {contact.firstName} {contact.lastName}
              </h2>
              
              <div className="space-y-3">
                {/* Owner and Followers in a row */}
                <div className="grid grid-cols-2 gap-4">
                  {showOwner && (
                    <div>
                      <label 
                        id="owner-label"
                        className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                      >
                        Owner
                      </label>
                      <button 
                        onClick={handleOwnerClick}
                        onKeyDown={(e) => handleKeyDown(e, handleOwnerClick)}
                        className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        aria-labelledby="owner-label"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        title={`Change owner (currently ${contact.owner})`}
                      >
                        <div 
                          className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs"
                          aria-hidden="true"
                        >
                          {getOwnerInitials(contact.owner)}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{contact.owner}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                  
                  {showFollowers && (
                    <div>
                      <label 
                        id="followers-label"
                        className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                      >
                        Followers
                      </label>
                      <button 
                        onClick={handleFollowersClick}
                        onKeyDown={(e) => handleKeyDown(e, handleFollowersClick)}
                        className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        aria-labelledby="followers-label"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        title={`Manage followers (${contact.followers.length} current)`}
                      >
                        <div className="flex -space-x-1" aria-hidden="true">
                          {contact.followers.slice(0, 3).map((follower, index) => (
                            <div
                              key={index}
                              className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-800"
                              title={follower}
                            >
                              {getFollowerInitials(follower)}
                            </div>
                          ))}
                          {contact.followers.length > 3 && (
                            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-800">
                              +{contact.followers.length - 3}
                            </div>
                          )}
                          {contact.followers.length === 0 && (
                            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-800">
                              +
                            </div>
                          )}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {contact.followers.length > 0 
                            ? `${contact.followers.length} follower${contact.followers.length !== 1 ? 's' : ''}`
                            : 'Add followers'
                          }
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
                
                {showTags && (
                  <div>
                    <TagManager 
                      contactTags={contact.tags || []} 
                      onTagsChange={onTagsChange}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Call Button */}
            {contact.phone && (
              <div className="flex-shrink-0 ml-4">
                <button
                  onClick={onCall}
                  onKeyDown={(e) => handleKeyDown(e, onCall)}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label={`Call ${contact.firstName} ${contact.lastName} at ${contact.phone}`}
                  title={`Call ${contact.firstName} ${contact.lastName}`}
                >
                  <Phone className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Owner Selector Modal */}
      <OwnerSelector
        isOpen={isOwnerSelectorOpen}
        onClose={handleCloseOwnerSelector}
        onOwnerSelect={handleOwnerSelect}
        currentOwner={contact.owner}
        contactName={`${contact.firstName} ${contact.lastName}`}
      />

      {/* Follower Selector Modal */}
      <FollowerSelector
        isOpen={isFollowerSelectorOpen}
        onClose={handleCloseFollowerSelector}
        onFollowersSelect={handleFollowersSelect}
        currentFollowers={contact.followers || []}
        contactName={`${contact.firstName} ${contact.lastName}`}
      />
    </section>
  );
};

export default ContactSummary; 