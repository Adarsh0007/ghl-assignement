import React from 'react';

// Lazy load all global components
const CustomButton = React.lazy(() => import('./CustomButton.js'));
const ComponentLoadingFallback = React.lazy(() => import('./ComponentLoadingFallback.js'));
const Loading = React.lazy(() => import('./Loading.js'));
const ContactDetailsSkeleton = React.lazy(() => import('./ContactDetailsSkeleton.js'));
const ConversationSkeleton = React.lazy(() => import('./ConversationSkeleton.js'));
const NotesSkeleton = React.lazy(() => import('./NotesSkeleton.js'));
const FormField = React.lazy(() => import('./FormField.js'));

export { CustomButton, ComponentLoadingFallback, Loading, ContactDetailsSkeleton, ConversationSkeleton, NotesSkeleton, FormField }; 