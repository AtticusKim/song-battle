import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';
import { SongsData } from '@/lib/kv-storage';

/**
 * API Route to reset songs data - clears KV and reloads from data/songs.json
 *
 * Usage: POST /api/songs/reset
 */
export async function POST() {
  try {
    console.log('Clearing KV storage...');

    // Delete existing data from KV
    await kv.del('songs:data');

    console.log('Loading fresh data from data/songs.json...');

    // Load the 500 songs from data/songs.json
    const dataPath = path.join(process.cwd(), 'data', 'songs.json');

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { success: false, error: 'data/songs.json not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const songsData: SongsData = JSON.parse(fileContent);

    console.log(`Loaded ${songsData.songs.length} songs from file`);

    // Save to KV
    await kv.set('songs:data', songsData);

    console.log(`Saved ${songsData.songs.length} songs to KV storage`);

    return NextResponse.json({
      success: true,
      message: `Successfully reset and loaded ${songsData.songs.length} songs`,
      songCount: songsData.songs.length,
      lastUpdated: songsData.lastUpdated,
    });
  } catch (error) {
    console.error('Error resetting songs:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
