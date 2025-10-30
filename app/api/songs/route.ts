import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API Route to get songs
 * Returns cached Spotify songs or mock data as fallback
 *
 * Usage: GET /api/songs
 */
export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'songs.json');

    // Check if cached songs exist
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(fileContent);

      return NextResponse.json({
        success: true,
        songs: data.songs,
        lastUpdated: data.lastUpdated,
        source: 'spotify',
      });
    }

    // Fall back to error message if no data
    return NextResponse.json(
      {
        success: false,
        error: 'No songs data found. Please run POST /api/songs/refresh to fetch songs from Spotify.',
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error loading songs:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
