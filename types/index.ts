export interface Song {
  id: string;
  spotifyId: string;
  spotifyUri: string;
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  duration: number;
  genre: string[];
  eloRating: number;
  totalBattles: number;
  wins: number;
  losses: number;
  previewUrl: string | null;
  albumArtUrl: string;
  spotifyPopularity: number;
  currentRank?: number;
}

export interface BattleResult {
  winner: Song;
  loser: Song;
  winnerEloChange: number;
  loserEloChange: number;
  winnerOldRank: number;
  winnerNewRank: number;
  loserOldRank: number;
  loserNewRank: number;
}

export interface LeaderboardEntry {
  rank: number;
  song: Song;
  winPercentage: number;
}

export interface Vote {
  id: string;
  winnerId: string;
  loserId: string;
  userId?: string;
  ipAddress: string;
  createdAt: Date;
}

export interface Stats {
  totalSongs: number;
  totalVotes: number;
  activeVoters: number;
  votesToday: number;
}

export interface BattlePair {
  song1: Song;
  song2: Song;
}
