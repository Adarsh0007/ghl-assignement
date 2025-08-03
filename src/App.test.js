import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.js';

test('renders loading state initially', () => {
  render(<App />);
  expect(screen.getByText('Loading contact details...')).toBeInTheDocument();
});

test('app renders without crashing', () => {
  render(<App />);
  // Just verify the app renders without throwing any errors
  expect(screen.getByText('Loading contact details...')).toBeInTheDocument();
});
