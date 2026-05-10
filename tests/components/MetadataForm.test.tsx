import { render, screen, fireEvent } from '@testing-library/react';
import { MetadataForm } from '../../src/components/Admin/MetadataForm';
import { describe, it, expect, vi } from 'vitest';

describe('MetadataForm', () => {
  const mockSave = vi.fn();
  const defaultYear = {
    id: '1',
    year: 2026,
    location: 'Stockholm',
    semi1_start: '2026-05-12T19:00:00Z',
    semi2_start: '2026-05-14T19:00:00Z',
    final_start: '2026-05-16T19:00:00Z',
    semi1_progression_target: 10,
    semi2_progression_target: 10,
    primary_color: '#000000',
    secondary_color: '#ffffff',
    logo_url: '/logo.png'
  };

  it('renders correctly with initial data', () => {
    render(<MetadataForm initialData={defaultYear} onSave={mockSave} currentProgressed={{ semi1: 0, semi2: 0 }} />);
    
    expect(screen.getByLabelText(/location/i)).toHaveValue('Stockholm');
    expect(screen.getByLabelText(/semi-final 1 target/i)).toHaveValue(10);
  });

  it('prevents reducing progression target below current progressed count', async () => {
    render(<MetadataForm initialData={defaultYear} onSave={mockSave} currentProgressed={{ semi1: 8, semi2: 0 }} />);
    
    const targetInput = screen.getByLabelText(/semi-final 1 target/i);
    fireEvent.change(targetInput, { target: { value: '7' } });
    
    const submitButton = screen.getByRole('button', { name: /save metadata/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Cannot reduce target below current progressed count/i)).toBeInTheDocument();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('allows saving when data is valid', async () => {
    render(<MetadataForm initialData={defaultYear} onSave={mockSave} currentProgressed={{ semi1: 5, semi2: 0 }} />);
    
    const targetInput = screen.getByLabelText(/semi-final 1 target/i);
    fireEvent.change(targetInput, { target: { value: '10' } });
    
    const submitButton = screen.getByRole('button', { name: /save metadata/i });
    fireEvent.click(submitButton);

    expect(mockSave).toHaveBeenCalled();
  });
});
