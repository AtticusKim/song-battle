import { NextResponse } from 'next/server';
import { getSongsData } from '@/lib/kv-storage';

/**
 * API Route to get songs
 * Returns songs from Vercel KV storage, or falls back to seed data
 *
 * Usage: GET /api/songs
 */
export async function GET() {
  try {
    const data = await getSongsData();

    return NextResponse.json({
      success: true,
      songs: data.songs,
      lastUpdated: data.lastUpdated,
      source: 'kv',
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
