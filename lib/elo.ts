/**
 * ELO Rating System Implementation
 * Based on standard ELO formula with K-factor of 32
 */

const K_FACTOR = 32;
const INITIAL_RATING = 1500;

/**
 * Calculate expected score for player A
 * @param ratingA - Current ELO rating of player A
 * @param ratingB - Current ELO rating of player B
 * @returns Expected score (0-1)
 */
export function calculateExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculate new ELO rating after a battle
 * @param currentRating - Current ELO rating
 * @param expectedScore - Expected score (0-1)
 * @param actualScore - Actual score (1 for win, 0 for loss)
 * @returns New ELO rating
 */
export function calculateNewRating(
  currentRating: number,
  expectedScore: number,
  actualScore: number
): number {
  return Math.round(currentRating + K_FACTOR * (actualScore - expectedScore));
}

/**
 * Calculate ELO changes for a battle result
 * @param winnerRating - Current rating of the winner
 * @param loserRating - Current rating of the loser
 * @returns Object containing new ratings and changes
 */
export function calculateBattleResult(winnerRating: number, loserRating: number) {
  const winnerExpected = calculateExpectedScore(winnerRating, loserRating);
  const loserExpected = calculateExpectedScore(loserRating, winnerRating);

  const newWinnerRating = calculateNewRating(winnerRating, winnerExpected, 1);
  const newLoserRating = calculateNewRating(loserRating, loserExpected, 0);

  return {
    newWinnerRating,
    newLoserRating,
    winnerChange: newWinnerRating - winnerRating,
    loserChange: newLoserRating - loserRating,
  };
}

export { K_FACTOR, INITIAL_RATING };
