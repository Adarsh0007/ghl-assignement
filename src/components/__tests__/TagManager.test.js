import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagManager from '../TagManager.js';

// Mock the TagService
jest.mock('../../services/tagService.js', () => ({
  TagService: {
    initializeDefaultTags: jest.fn().mockReturnValue(['Shared Contact', 'VIP', 'Important']),
    addTag: jest.fn().mockImplementation((tag) => {
      const tags = ['Shared Contact', 'VIP', 'Important'];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
      return tags;
    }),
    getTags: jest.fn().mockReturnValue(['Shared Contact', 'VIP', 'Important']),
  }
}));

describe('TagManager', () => {
  const mockOnTagsChange = jest.fn();

  beforeEach(() => {
    mockOnTagsChange.mockClear();
  });

  it('renders existing tags', () => {
    const contactTags = ['Shared Contact', 'VIP'];
    render(<TagManager contactTags={contactTags} onTagsChange={mockOnTagsChange} />);
    
    expect(screen.getByText('Shared Contact')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('shows add tag button when no tags are present', () => {
    render(<TagManager contactTags={[]} onTagsChange={mockOnTagsChange} />);
    
    expect(screen.getByText('Add Tag')).toBeInTheDocument();
  });

  it('opens add tag input when add button is clicked', () => {
    render(<TagManager contactTags={[]} onTagsChange={mockOnTagsChange} />);
    
    const addButton = screen.getByText('Add Tag');
    fireEvent.click(addButton);
    
    expect(screen.getByPlaceholderText('Type tag name...')).toBeInTheDocument();
  });

  it('calls onTagsChange when a tag is removed', () => {
    const contactTags = ['Shared Contact', 'VIP'];
    render(<TagManager contactTags={contactTags} onTagsChange={mockOnTagsChange} />);
    
    const removeButtons = screen.getAllByTitle('Remove tag');
    fireEvent.click(removeButtons[0]);
    
    expect(mockOnTagsChange).toHaveBeenCalledWith(['VIP']);
  });
}); 