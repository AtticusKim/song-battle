import { NextResponse } from 'next/server';
import { fetchTop500Songs } from '@/lib/spotify';
import { getSongsData, saveSongsData } from '@/lib/kv-storage';

/**
 * API Route to refresh songs from Spotify
 * Automatically called weekly by Vercel Cron Job
 * Can also be manually triggered with proper authorization
 *
 * Usage: POST /api/songs/refresh
 */
export async function POST(request: Request) {
  try {
    // Verify authorization (Vercel Cron or manual with secret)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow Vercel Cron (has special header) or requests with correct secret
    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isManualWithSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;

    // In development, allow without auth for testing
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isDevelopment && !isVercelCron && !isManualWithSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Fetching Top 500 songs from Spotify...');

    // Fetch fresh songs from Spotify
    const newSongs = await fetchTop500Songs();

    console.log(`Fetched ${newSongs.length} songs from Spotify`);

    // Load existing songs from KV to preserve vote data
    let existingSongs: any[] = [];

    try {
      const existingData = await getSongsData();
      existingSongs = existingData.songs || [];
      console.log(`Found ${existingSongs.length} existing songs with vote data`);
    } catch {
      console.log('No existing songs found - this is a fresh start');
    }

    // Create a map of existing songs by Spotify ID for quick lookup
    const existingSongsMap = new Map(
      existingSongs.map(song => [song.spotifyId, song])
    );

    // Merge: Keep existing vote data for songs that already exist
    const mergedSongs = newSongs.map(newSong => {
      const existing = existingSongsMap.get(newSong.spotifyId);

      if (existing) {
        // Song exists - preserve vote data, update metadata
        return {
          ...newSong,
          id: existing.id, // Keep existing ID
          eloRating: existing.eloRating,
          totalBattles: existing.totalBattles,
          wins: existing.wins,
          losses: existing.losses,
          currentRank: existing.currentRank,
        };
      }

      // New song - use default values from Spotify
      return newSong;
    });

    console.log(`Merged songs: ${mergedSongs.length} total (preserved vote data for existing songs)`);

    // Save merged songs to KV with timestamp
    const data = {
      lastUpdated: new Date().toISOString(),
      songs: mergedSongs,
    };

    await saveSongsData(data);

    console.log(`Saved ${mergedSongs.length} songs to KV storage`);

    return NextResponse.json({
      success: true,
      message: `Successfully refreshed ${mergedSongs.length} songs (preserved existing vote data)`,
      lastUpdated: data.lastUpdated,
      songCount: mergedSongs.length,
    });
  } catch (error) {
    console.error('Error refreshing songs:', error);

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
 * GET endpoint to check last refresh time
 */
export async function GET() {
  try {
    try {
      const data = await getSongsData();

      return NextResponse.json({
        lastUpdated: data.lastUpdated,
        songCount: data.songs.length,
        needsRefresh: isRefreshNeeded(data.lastUpdated),
      });
    } catch {
      return NextResponse.json({
        lastUpdated: null,
        songCount: 0,
        needsRefresh: true,
        message: 'No cached songs found. Please run POST /api/songs/refresh',
      });
    }
  } catch (error) {
    console.error('Error checking refresh status:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Check if songs need to be refreshed (older than 7 days)
 */
function isRefreshNeeded(lastUpdated: string): boolean {
  const lastUpdate = new Date(lastUpdated);
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceUpdate > 7;
}
