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
    // Check if KV is available (skip in development if no credentials)
    const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

    if (hasKV) {
      try {
        // Try to get from KV first
        const kvData = await kv.get<SongsData>(SONGS_KEY);

        if (kvData && kvData.songs && kvData.songs.length > 0) {
          console.log(`Loaded ${kvData.songs.length} songs from KV storage`);
          return kvData;
        }
      } catch (kvError) {
        console.log('KV not available, using local file');
      }
    } else {
      console.log('KV credentials not found, using local file');
    }

    // Fall back to local file data
    console.log('Loading data from local file');
    const seedDataPath = path.join(process.cwd(), 'data', 'songs.json');

    if (fs.existsSync(seedDataPath)) {
      const seedFileContent = fs.readFileSync(seedDataPath, 'utf-8');
      const seedData: SongsData = JSON.parse(seedFileContent);

      // Try to save to KV for future use if available
      if (hasKV) {
        try {
          await saveSongsData(seedData);
          console.log(`Initialized KV with ${seedData.songs.length} songs`);
        } catch {
          console.log('Could not save to KV, continuing with local file');
        }
      }

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
  const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

  if (!hasKV) {
    console.log('KV not available, skipping save (data persists in local file)');
    return;
  }

  try {
    await kv.set(SONGS_KEY, data);
    console.log(`Saved ${data.songs.length} songs to KV storage`);
  } catch (error) {
    console.error('Error saving songs data:', error);
    // Don't throw - gracefully degrade to file-based storage
    console.log('Continuing without KV persistence');
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

    // Save to KV if available
    await saveSongsData(data);

    // Also save to local file to persist changes during development
    const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    if (!hasKV) {
      const filePath = path.join(process.cwd(), 'data', 'songs.json');
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Saved changes to local file');
    }

    return data.songs[songIndex];
  } catch (error) {
    console.error('Error updating song:', error);
    throw error;
  }
}
