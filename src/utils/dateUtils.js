/**
 * Converts a timestamp to a relative time string (e.g., "1 min ago", "1 hour ago")
 * @param {string|Date} timestamp - The timestamp to convert
 * @returns {string} - The relative time string
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  const now = new Date();
  const date = new Date(timestamp);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // If the date is in the future, return "Just now"
  if (diffInSeconds < 0) {
    return 'Just now';
  }
  
  // Less than 1 minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
  }
  
  // Less than 1 day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than 1 week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Less than 1 month (30 days)
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  // Less than 1 year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  
  // More than 1 year
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

/**
 * Formats a timestamp to a readable date string
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - The formatted date string
 */
export const getFormattedDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  const date = new Date(timestamp);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isYesterday) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

/**
 * Gets the appropriate time display based on how recent the timestamp is
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - The appropriate time display
 */
export const getSmartTimeDisplay = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  const now = new Date();
  const date = new Date(timestamp);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // If less than 24 hours, use relative time
  if (diffInSeconds < 86400) {
    return getRelativeTime(timestamp);
  }
  
  // Otherwise, use formatted date
  return getFormattedDate(timestamp);
}; 