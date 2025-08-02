import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.js';
import { ThemeProvider } from './context/ThemeContext.js';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

test('renders loading state initially', () => {
  renderWithTheme(<App />);
  expect(screen.getByText('Loading contact details...')).toBeInTheDocument();
});
