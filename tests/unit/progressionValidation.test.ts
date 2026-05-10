import { describe, it, expect } from 'vitest';
import { useProgressionValidation } from '../../src/hooks/useProgressionValidation';
import { renderHook } from '@testing-library/react';

describe('useProgressionValidation', () => {
  it('returns valid true when selected count matches target exactly', () => {
    const { result } = renderHook(() => useProgressionValidation(10, 10));
    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('returns valid false and an error when selected count is less than target', () => {
    const { result } = renderHook(() => useProgressionValidation(10, 9));
    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBe('Please select exactly 10 entries to progress. You have selected 9.');
  });

  it('returns valid false and an error when selected count is greater than target', () => {
    const { result } = renderHook(() => useProgressionValidation(10, 11));
    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBe('Please select exactly 10 entries to progress. You have selected 11.');
  });
});
