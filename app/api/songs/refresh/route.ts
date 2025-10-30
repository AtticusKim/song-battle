import { NextResponse } from 'next/server';
import { fetchTop500Songs } from '@/lib/spotify';
import fs from 'fs/promises';
import path from 'path';

/**
 * API Route to refresh songs from Spotify
 * Call this endpoint weekly to update the Top 500 songs
 *
 * Usage: POST /api/songs/refresh
 */
export async function POST() {
  try {
    console.log('Fetching Top 500 songs from Spotify...');

    // Fetch songs from Spotify
    const songs = await fetchTop500Songs();

    console.log(`Fetched ${songs.length} songs from Spotify`);

    // Save to a JSON file for caching
    const dataPath = path.join(process.cwd(), 'data', 'songs.json');

    // Ensure data directory exists
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

    // Write songs to file with timestamp
    const data = {
      lastUpdated: new Date().toISOString(),
      songs: songs,
    };

    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));

    console.log(`Saved ${songs.length} songs to ${dataPath}`);

    return NextResponse.json({
      success: true,
      message: `Successfully fetched and cached ${songs.length} songs`,
      lastUpdated: data.lastUpdated,
      songCount: songs.length,
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
    const dataPath = path.join(process.cwd(), 'data', 'songs.json');

    try {
      const fileContent = await fs.readFile(dataPath, 'utf-8');
      const data = JSON.parse(fileContent);

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
