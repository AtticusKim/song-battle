import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import seedData from '@/lib/seed-songs.json';

/**
 * API Route to get songs
 * Returns cached Spotify songs, or falls back to seed data
 *
 * Usage: GET /api/songs
 */
export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'songs.json');

    // Check if cached songs exist (updated from Spotify)
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

    // Fall back to seed data if no cached data exists
    console.log('Using seed data - no cached songs found');
    return NextResponse.json({
      success: true,
      songs: seedData.songs,
      lastUpdated: seedData.lastUpdated,
      source: 'seed',
    });
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
