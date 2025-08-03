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
      className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      aria-labelledby="contact-name"
      aria-label="Contact summary information"
    >
      <div className="flex flex-col space-y-4">
        {/* User Image and Name/Phone inline */}
        <div className="flex items-start space-x-4">
          {showProfile && (
            <div className="flex-shrink-0">
              <div 
                className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md"
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
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {contact.firstName} {contact.lastName}
                </h2>
              </div>
              
              {/* Call Button */}
              {contact.phone && (
                <div className="flex-shrink-0 ml-4">
                  <button
                    onClick={onCall}
                    onKeyDown={(e) => handleKeyDown(e, onCall)}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label={`Call ${contact.firstName} ${contact.lastName}`}
                    title={`Call ${contact.firstName} ${contact.lastName}`}
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Owner and Followers inline horizontally */}
        <div className="flex items-center gap-8 px-4">
          {showOwner && (
            <div className="min-w-0 flex-1">
              <label 
                id="owner-label"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
              >
                Owner
              </label>
              <button 
                onClick={handleOwnerClick}
                onKeyDown={(e) => handleKeyDown(e, handleOwnerClick)}
                className="inline-flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 px-3 py-2 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 justify-start border border-gray-200 dark:border-gray-600 w-full"
                aria-labelledby="owner-label"
                aria-haspopup="dialog"
                aria-expanded="false"
                title={`Change owner (currently ${contact.owner})`}
              >
                <div 
                  className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                  aria-hidden="true"
                >
                  {getOwnerInitials(contact.owner)}
                </div>
                <span className="text-gray-700 dark:text-gray-300 truncate">{contact.owner}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-auto" aria-hidden="true" />
              </button>
            </div>
          )}
          
          {showFollowers && (
            <div className="min-w-0 flex-1">
              <label 
                id="followers-label"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
              >
                Followers
              </label>
              <button 
                onClick={handleFollowersClick}
                onKeyDown={(e) => handleKeyDown(e, handleFollowersClick)}
                className="inline-flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 px-3 py-2 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 justify-start border border-gray-200 dark:border-gray-600 w-full"
                aria-labelledby="followers-label"
                aria-haspopup="dialog"
                aria-expanded="false"
                title={`Manage followers (${contact.followers.length} current)`}
              >
                <div className="flex -space-x-1 flex-shrink-0" aria-hidden="true">
                  {contact.followers.slice(0, 2).map((follower, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800"
                      title={follower}
                    >
                      {getFollowerInitials(follower)}
                    </div>
                  ))}
                  {contact.followers.length === 0 && (
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800">
                      +
                    </div>
                  )}
                </div>
                <span className="text-gray-700 dark:text-gray-300 truncate">
                  {contact.followers.length > 0 
                    ? `${contact.followers.length} follower${contact.followers.length !== 1 ? 's' : ''}`
                    : 'Add followers'
                  }
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-auto" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        
        {/* Tags in their own row */}
        {showTags && (
          <div className="px-4">
            <TagManager 
              contactTags={contact.tags || []} 
              onTagsChange={onTagsChange}
            />
          </div>
        )}
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
        currentFollowers={contact.followers}
        contactName={`${contact.firstName} ${contact.lastName}`}
      />
    </section>
  );
};

export default ContactSummary; 