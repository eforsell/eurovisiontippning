import { describe, it, expect } from "vitest";
import { scoringService } from "../../src/services/scoringService";

describe("Scoring Service", () => {
  describe("calculateSemiPoints", () => {
    it("awards 3 points for each correct qualifier", () => {
      const predicted = [true, false, true, false];
      const actual = [true, true, false, false];
      // only index 0 is a match (true && true) -> 1 match * 3 points = 3 points
      expect(scoringService.calculateSemiPoints(predicted, actual)).toBe(3);
    });

    it("awards 0 points if no matches", () => {
      const predicted = [true, true];
      const actual = [false, false];
      expect(scoringService.calculateSemiPoints(predicted, actual)).toBe(0);
    });

    it("awards max points if all match", () => {
      const predicted = [true, true, true];
      const actual = [true, true, true];
      expect(scoringService.calculateSemiPoints(predicted, actual)).toBe(9);
    });
  });

  describe("calculateFinalPoints", () => {
    it("awards max points (26) for exact match", () => {
      expect(scoringService.calculateFinalPoints(1, 1)).toBe(26);
    });

    it("deducts points based on distance", () => {
      expect(scoringService.calculateFinalPoints(1, 3)).toBe(24); // 26 - 2
      expect(scoringService.calculateFinalPoints(26, 1)).toBe(1); // 26 - 25
    });

    it("does not award negative points", () => {
      // In practice max distance is 25, but just to be safe
      expect(scoringService.calculateFinalPoints(1, 100)).toBe(0);
    });
  });

  describe("calculateTotalFinalPoints", () => {
    it("aggregates points across all predictions", () => {
      const predictions = [
        { entry_id: "a", rank: 1 },
        { entry_id: "b", rank: 2 },
      ];
      const results = [
        { entry_id: "a", final_rank: 1 }, // 26 pts
        { entry_id: "b", final_rank: 3 }, // 25 pts (distance 1)
      ];

      expect(
        scoringService.calculateTotalFinalPoints(predictions, results),
      ).toBe(51);
    });
  });
});
