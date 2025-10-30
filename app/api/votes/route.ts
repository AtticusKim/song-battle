import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Song } from '@/types';
import { calculateBattleResult } from '@/lib/elo';

interface VoteRequest {
  winnerId: string;
  loserId: string;
}

interface SongsData {
  lastUpdated: string;
  songs: Song[];
}

/**
 * POST /api/votes
 * Record a vote and update ELO ratings
 */
export async function POST(request: NextRequest) {
  try {
    const { winnerId, loserId }: VoteRequest = await request.json();

    if (!winnerId || !loserId) {
      return NextResponse.json(
        { success: false, error: 'winnerId and loserId are required' },
        { status: 400 }
      );
    }

    if (winnerId === loserId) {
      return NextResponse.json(
        { success: false, error: 'winnerId and loserId must be different' },
        { status: 400 }
      );
    }

    // Load songs data
    const dataPath = path.join(process.cwd(), 'data', 'songs.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data: SongsData = JSON.parse(fileContent);

    // Find winner and loser songs
    const winnerIndex = data.songs.findIndex(s => s.id === winnerId);
    const loserIndex = data.songs.findIndex(s => s.id === loserId);

    if (winnerIndex === -1 || loserIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Song not found' },
        { status: 404 }
      );
    }

    const winner = data.songs[winnerIndex];
    const loser = data.songs[loserIndex];

    // Calculate ELO changes
    const eloResult = calculateBattleResult(winner.eloRating, loser.eloRating);

    // Update winner stats
    data.songs[winnerIndex] = {
      ...winner,
      eloRating: winner.eloRating + eloResult.winnerChange,
      totalBattles: winner.totalBattles + 1,
      wins: winner.wins + 1,
    };

    // Update loser stats
    data.songs[loserIndex] = {
      ...loser,
      eloRating: loser.eloRating + eloResult.loserChange,
      totalBattles: loser.totalBattles + 1,
      losses: loser.losses + 1,
    };

    // Recalculate ranks based on ELO
    data.songs.sort((a, b) => b.eloRating - a.eloRating);
    data.songs = data.songs.map((song, index) => ({
      ...song,
      currentRank: index + 1,
    }));

    // Update lastUpdated timestamp
    data.lastUpdated = new Date().toISOString();

    // Save updated data back to file
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));

    // Return the updated songs
    const updatedWinner = data.songs.find(s => s.id === winnerId);
    const updatedLoser = data.songs.find(s => s.id === loserId);

    return NextResponse.json({
      success: true,
      winner: updatedWinner,
      loser: updatedLoser,
      eloChanges: {
        winner: eloResult.winnerChange,
        loser: eloResult.loserChange,
      },
      message: 'Vote recorded successfully',
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/votes
 * Get total vote count
 */
export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'songs.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data: SongsData = JSON.parse(fileContent);

    const totalVotes = data.songs.reduce((sum, song) => sum + song.totalBattles, 0);
    const totalSongs = data.songs.length;
    const avgBattlesPerSong = Math.round(totalVotes / totalSongs);

    return NextResponse.json({
      success: true,
      totalVotes,
      totalSongs,
      avgBattlesPerSong,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    console.error('Error getting vote stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
