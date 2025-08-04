import React, { Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load the main component
const ContactDetailsWithSidebar = React.lazy(() => import('./components/ContactDetailsWithSidebar'));

// Lazy load the generic loading fallback
const ComponentLoadingFallback = React.lazy(() => import('./components/globalComponents/ComponentLoadingFallback'));

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="App min-h-screen overflow-hidden pb-8">
          <Suspense fallback={
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <Suspense fallback={
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Loading application...</p>
                </div>
              }>
                <ComponentLoadingFallback 
                  componentName="Application" 
                  size="xl" 
                  className="h-screen bg-gray-50 dark:bg-gray-900"
                />
              </Suspense>
            </div>
          }>
            <ContactDetailsWithSidebar />
          </Suspense>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App; 