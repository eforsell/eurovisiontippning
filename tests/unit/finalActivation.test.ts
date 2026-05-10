import { describe, it, expect } from 'vitest';

// Simulating the logic that determines if the final ranking tab is active
const isFinalRankingActive = (semi1Completed: boolean, semi2Completed: boolean) => {
  return semi1Completed && semi2Completed;
};

describe('Final Ranking Activation Logic', () => {
  it('should be active when both semifinals are completed', () => {
    expect(isFinalRankingActive(true, true)).toBe(true);
  });

  it('should be inactive when only semi1 is completed', () => {
    expect(isFinalRankingActive(true, false)).toBe(false);
  });

  it('should be inactive when only semi2 is completed', () => {
    expect(isFinalRankingActive(false, true)).toBe(false);
  });

  it('should be inactive when neither semifinal is completed', () => {
    expect(isFinalRankingActive(false, false)).toBe(false);
  });
});
