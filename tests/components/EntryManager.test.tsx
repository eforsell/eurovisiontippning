import { render, screen, fireEvent } from '@testing-library/react';
import { EntryManager } from '../../src/components/Admin/EntryManager';
import { describe, it, expect, vi } from 'vitest';
import { Database } from '../../src/types/database.types';

type Entry = Database['public']['Tables']['entries']['Row'];

describe('EntryManager', () => {
  const mockSave = vi.fn();
  const mockDelete = vi.fn();
  
  const mockEntries: Entry[] = [
    { id: '1', year_id: '1', artist: 'Artist A', country: 'Country A', song_title: 'Song A', start_position: 1, starting_contest: 'semi1', youtube_id: null },
    { id: '2', year_id: '1', artist: 'Artist B', country: 'Country B', song_title: 'Song B', start_position: 2, starting_contest: 'final', youtube_id: null }
  ];

  it('renders a list of entries', () => {
    render(<EntryManager entries={mockEntries} onSave={mockSave} onDelete={mockDelete} />);
    expect(screen.getByText('Country A')).toBeInTheDocument();
    expect(screen.getByText('Country B')).toBeInTheDocument();
  });

  it('displays the starting contest correctly', () => {
    render(<EntryManager entries={mockEntries} onSave={mockSave} onDelete={mockDelete} />);
    // Testing the display text of the dropdowns or badges
    expect(screen.getAllByDisplayValue('Semi-final 1').length).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue('Final').length).toBeGreaterThan(0);
  });

  it('calls onSave when adding a new entry', () => {
    render(<EntryManager entries={mockEntries} onSave={mockSave} onDelete={mockDelete} />);
    
    // Open add modal/form
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }));
    
    // Fill basic info
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'Country C' } });
    fireEvent.change(screen.getByLabelText(/artist/i), { target: { value: 'Artist C' } });
    fireEvent.change(screen.getByLabelText(/song/i), { target: { value: 'Song C' } });
    
    // Select starting contest
    fireEvent.change(screen.getByLabelText(/starting contest/i), { target: { value: 'semi2' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /save entry/i }));
    
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
      country: 'Country C',
      starting_contest: 'semi2'
    }));
  });
});
