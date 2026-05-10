import { useMemo } from 'react';

export const useProgressionValidation = (targetCount: number, selectedCount: number) => {
  return useMemo(() => {
    if (selectedCount !== targetCount) {
      return {
        isValid: false,
        error: `Please select exactly ${targetCount} entries to progress. You have selected ${selectedCount}.`
      };
    }
    return {
      isValid: true,
      error: null
    };
  }, [targetCount, selectedCount]);
};
