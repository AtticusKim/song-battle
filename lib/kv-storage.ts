import { kv } from '@vercel/kv';
import { Song } from '@/types';
import fs from 'fs';
import path from 'path';

const SONGS_KEY = 'songs:data';

export interface SongsData {
  lastUpdated: string;
  songs: Song[];
}

/**
 * Get songs from KV storage, fallback to seed data if not found
 */
export async function getSongsData(): Promise<SongsData> {
  try {
    // Try to get from KV first
    const kvData = await kv.get<SongsData>(SONGS_KEY);

    if (kvData && kvData.songs && kvData.songs.length > 0) {
      console.log(`Loaded ${kvData.songs.length} songs from KV storage`);
      return kvData;
    }

    // Fall back to seed data
    console.log('No data in KV, loading seed data');
    const seedDataPath = path.join(process.cwd(), 'lib', 'seed-songs.json');

    if (fs.existsSync(seedDataPath)) {
      const seedFileContent = fs.readFileSync(seedDataPath, 'utf-8');
      const seedData: SongsData = JSON.parse(seedFileContent);

      // Save seed data to KV for future use
      await saveSongsData(seedData);
      console.log(`Initialized KV with ${seedData.songs.length} seed songs`);

      return seedData;
    }

    // If even seed data is missing, throw error
    throw new Error('No songs data available');
  } catch (error) {
    console.error('Error getting songs data:', error);
    throw error;
  }
}

/**
 * Save songs to KV storage
 */
export async function saveSongsData(data: SongsData): Promise<void> {
  try {
    await kv.set(SONGS_KEY, data);
    console.log(`Saved ${data.songs.length} songs to KV storage`);
  } catch (error) {
    console.error('Error saving songs data:', error);
    throw error;
  }
}

/**
 * Update a single song in KV storage
 */
export async function updateSong(songId: string, updates: Partial<Song>): Promise<Song | null> {
  try {
    const data = await getSongsData();
    const songIndex = data.songs.findIndex(s => s.id === songId);

    if (songIndex === -1) {
      return null;
    }

    data.songs[songIndex] = {
      ...data.songs[songIndex],
      ...updates,
    };

    data.lastUpdated = new Date().toISOString();
    await saveSongsData(data);

    return data.songs[songIndex];
  } catch (error) {
    console.error('Error updating song:', error);
    throw error;
  }
}
