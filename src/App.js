import React from 'react';
import ContactDetailsWithSidebar from './components/ContactDetailsWithSidebar.js';
import { ThemeProvider } from './context/ThemeContext.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="App" role="application" aria-label="Contact Details Application">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Skip to main content"
          >
            Skip to main content
          </a>

          <main id="main-content" role="main" aria-label="Contact details main content">
            <ContactDetailsWithSidebar />
          </main>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 