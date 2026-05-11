import { describe, it, expect } from "vitest";
import { scoringService } from "../../src/services/scoringService";

describe("Scoring Service", () => {
  describe("calculateSemiPoints", () => {
    it("awards 3 points for each correct qualifier when completed", () => {
      const predicted = [true, false, true, false];
      const actual = [true, true, false, false];
      // only index 0 is a match (true && true) -> 1 match * 3 points = 3 points
      expect(scoringService.calculateSemiPoints(predicted, actual, true)).toBe(3);
    });

    it("awards 0 points if no matches when completed", () => {
      const predicted = [true, true];
      const actual = [false, false];
      expect(scoringService.calculateSemiPoints(predicted, actual, true)).toBe(0);
    });

    it("awards max points if all match when completed", () => {
      const predicted = [true, true, true];
      const actual = [true, true, true];
      expect(scoringService.calculateSemiPoints(predicted, actual, true)).toBe(9);
    });

    it("awards 0 points if semi is not completed", () => {
      const predicted = [true, true, true];
      const actual = [true, true, true];
      expect(scoringService.calculateSemiPoints(predicted, actual, false)).toBe(0);
    });
  });

  describe("calculateFinalPoints", () => {
    it("awards 100 points for exact match of rank 1", () => {
      expect(scoringService.calculateFinalPoints(1, 1)).toBe(100);
    });

    it("awards points based on distance", () => {
      // actual: 3 (45 pts), predicted: 1 -> distance 2. weight: 1 / 3. 45 / 3 = 15
      expect(scoringService.calculateFinalPoints(1, 3)).toBe(15);
      // actual: 1 (100 pts), predicted: 26 -> distance 25. weight: 1 / 26. 100 / 26 = 3.846
      expect(scoringService.calculateFinalPoints(26, 1)).toBeCloseTo(3.846, 3);
    });

    it("calculates lower ranks correctly", () => {
      expect(scoringService.calculateFinalPoints(10, 10)).toBe(7);
      // actual: 100 -> rank_points = 5, distance = 99 -> weight 1/100 -> 0.05
      expect(scoringService.calculateFinalPoints(1, 100, 26)).toBe(0.05);
    });
  });

  describe("calculateTotalFinalPoints", () => {
    it("aggregates points across all predictions", () => {
      const predictions = [
        { entry_id: "a", rank: 1 },
        { entry_id: "b", rank: 2 },
      ];
      const results = [
        { entry_id: "a", final_rank: 1 }, // 100 pts
        { entry_id: "b", final_rank: 3 }, // 45 / 2 = 22.5 pts
      ];

      expect(
        scoringService.calculateTotalFinalPoints(predictions, results),
      ).toBe(122.5);
    });
  });
});
