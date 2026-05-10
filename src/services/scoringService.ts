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

  // weighted rank distance formula (26 - |pred - actual|)
  calculateFinalPoints(predictedRank: number, actualRank: number): number {
    const maxPoints = 26;
    const distance = Math.abs(predictedRank - actualRank);
    return Math.max(0, maxPoints - distance);
  },

  calculateTotalFinalPoints(
    predictions: { rank: number; entry_id: string }[],
    results: { final_rank: number; entry_id: string }[],
  ): number {
    let total = 0;
    const resultMap = new Map(results.map((r) => [r.entry_id, r.final_rank]));

    for (const p of predictions) {
      const actual = resultMap.get(p.entry_id);
      if (actual !== undefined) {
        total += this.calculateFinalPoints(p.rank, actual);
      }
    }

    return total;
  },
};
