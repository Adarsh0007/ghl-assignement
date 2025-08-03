import React from 'react';
import ContactDetailsWithSidebar from './components/ContactDetailsWithSidebar';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="App">
          <ContactDetailsWithSidebar />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App; 