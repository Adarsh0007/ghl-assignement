import React from 'react';
import ContactDetails from './components/ContactDetails.js';
import { ThemeProvider } from './context/ThemeContext.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import PerformanceMonitor from './components/PerformanceMonitor.js';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="App">
          <ContactDetails />
          <PerformanceMonitor />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 