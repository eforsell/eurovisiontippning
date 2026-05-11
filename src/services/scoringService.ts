export const scoringService = {
  // 3p per correct qualifier
  calculateSemiPoints(
    predictedQualifiers: boolean[],
    actualQualifiers: boolean[],
    isCompleted: boolean = false,
  ): number {
    if (!isCompleted) return 0;
    let points = 0;
    for (let i = 0; i < predictedQualifiers.length; i++) {
      if (predictedQualifiers[i] && actualQualifiers[i]) {
        points += 3;
      }
    }
    return points;
  },

  getRankPoints(actualRank: number, totalEntries: number = 26): number {
    if (actualRank === 1) return 100;
    if (actualRank === 2) return 65;
    if (actualRank === 3) return 45;
    if (actualRank === 4) return 33;
    if (actualRank === 5) return 25;
    if (actualRank === 6) return 20;
    if (actualRank === 7) return 15;
    if (actualRank === 8) return 12;
    if (actualRank === 9) return 9;
    if (actualRank === 10) return 7;
    if (actualRank === 11) return 6;
    if (actualRank === totalEntries) return 30;
    return 5;
  },

  calculateFinalPoints(predictedRank: number, actualRank: number, totalEntries: number = 26): number {
    const rankPoints = this.getRankPoints(actualRank, totalEntries);
    const weight = 1 / (Math.abs(actualRank - predictedRank) + 1);
    return rankPoints * weight;
  },

  calculateTotalFinalPoints(
    predictions: { rank: number; entry_id: string }[],
    results: { final_rank: number; entry_id: string }[],
  ): number {
    let total = 0;
    const resultMap = new Map(results.map((r) => [r.entry_id, r.final_rank]));
    const totalEntries = results.length;

    for (const p of predictions) {
      const actual = resultMap.get(p.entry_id);
      if (actual !== undefined) {
        total += this.calculateFinalPoints(p.rank, actual, totalEntries);
      }
    }

    return total;
  },
};
