import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressionManager } from '../../src/components/Admin/ProgressionManager';

describe('ProgressionManager De-progression', () => {
  const mockEntries = [
    { id: '1', year_id: '1', artist: 'A', country: 'A', song_title: 'A', start_position: 1, starting_contest: 'semi1' as const, youtube_id: null },
    { id: '2', year_id: '1', artist: 'B', country: 'B', song_title: 'B', start_position: 2, starting_contest: 'semi1' as const, youtube_id: null }
  ];
  
  it('allows deselecting a previously progressed entry', () => {
    const mockSave = vi.fn();
    render(
      <ProgressionManager 
        contest="semi1"
        entries={mockEntries} 
        targetCount={1} 
        initialProgressedIds={['1']} 
        onSave={mockSave} 
      />
    );
    
    // Uncheck entry 1
    fireEvent.click(screen.getAllByText('A')[0]);
    
    // State should update, rendering the save button disabled because 0/1 are selected
    expect(screen.getByRole('button', { name: /Save Progression/i })).toBeDisabled();
    
    // Check entry 2 to make it valid again
    fireEvent.click(screen.getAllByText('B')[0]);
    
    const saveButton = screen.getByRole('button', { name: /Save Progression/i });
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);
    
    expect(mockSave).toHaveBeenCalledWith(['2']); // Entry 1 was de-progressed
  });
});
