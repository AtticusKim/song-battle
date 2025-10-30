import SpotifyWebApi from 'spotify-web-api-node';
import { Song } from '@/types';

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Cache for access token
let tokenExpirationTime = 0;

/**
 * Get or refresh Spotify access token
 */
async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid
  if (tokenExpirationTime > now) {
    return spotifyApi.getAccessToken()!;
  }

  // Get new token
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body.access_token);

  // Set expiration time (expires_in is in seconds)
  tokenExpirationTime = now + (data.body.expires_in * 1000) - 60000; // 1 min buffer

  return data.body.access_token;
}

/**
 * Fetch Top 500 songs from Spotify
 * Uses top tracks from popular artists to ensure real, well-known songs
 */
export async function fetchTop500Songs(): Promise<Song[]> {
  await getAccessToken();

  const songs: Song[] = [];
  const seenTrackIds = new Set<string>();
  const MIN_POPULARITY = 60; // Only songs with popularity >= 60

  try {
    // Get top tracks from very popular artists (this ensures real popular songs)
    const popularArtistIds = [
      '06HL4z0CvFAxyc27GXpf02', // Taylor Swift
      '1Xyo4u8uXC1ZmMpatF05PJ', // The Weeknd
      '3TVXtAsR1Inumwj472S9r4', // Drake
      '66CXWjxzNUsdJxJ2JdwvnR', // Ariana Grande
      '6qqNVTkY8uBg9cP3Jd7DAH', // Billie Eilish
      '0hCNtLu0JehylgoiP8L4Gh', // Nicki Minaj
      '6eUKZXaKkcviH0Ku9w2n3V', // Ed Sheeran
      '1McMsnEElThX1knmY4oliG', // Olivia Rodrigo
      '7dGJo4pcD2V6oG8kP0tJRR', // Eminem
      '5K4W6rqBFWDnAN6FQUkS6x', // Kanye West
      '0du5cEVh5yTK9QJze8zA0C', // Bruno Mars
      '04gDigrS5kc9YWfZHwBETP', // Maroon 5
      '6M2wZ9GZgrQXHCFfjv46we', // Dua Lipa
      '0C8ZW7ezQVs4URX5aX7Kqx', // Selena Gomez
      '5pKCCKE2ajJHZ9KAiaK11H', // Rihanna
      '3WrFJ7ztbogyGnTHbHJFl2', // The Beatles
      '4gzpq5DPGxSnKTe4SA8HAU', // Coldplay
      '6vWDO969PvNqNYHIOW5v0m', // Beyoncé
      '7tYKF4w9nC0nq9CsPZTHyP', // SZA
      '3Nrfpe0tUJi4K4DXYWgMUX', // BTS
      '4kYSro6naA4h99UJvo89HB', // Cardi B
      '1anyVhU62p31KFi8MEzkbf', // Bad Bunny
      '5f7VJjfbwm532GiveGC0ZK', // Lil Baby
      '4O15NlyKLIASxsJ0PrXPfz', // Lil Nas X
      '181bsRPaVXVlUKXrxwZfHK', // Megan Thee Stallion
      '5YGY8feqx7naU7z4HrwZM6', // Miley Cyrus
      '5cj0lLjcoR7YOSnhnX0Po5', // Doja Cat
      '5H4yInM5zmHqpKIoMNAx4r', // Lorde
      '3qm84nBOXUEQ2vnTfUTTFC', // Guns N' Roses
      '3AA28KZvwAUcZuOKwyblJQ', // Gorillaz
      '6KImCVD70vtIoJWnq6nGn3', // Harry Styles
      '12Chz98pHFMPJEknJQMWvI', // Muse
      '2wY79sveU1sp5g7SokKOiI', // Sam Smith
      '7CajNmpbOovFoOoasH2HaY', // Calvin Harris
      '1vCWHaC5f2uS3yhpwWbIA6', // Avicii
      '6S2OmqARrzebs0tKUEyXyp', // Daft Punk
      '5K4W6rqBFWDnAN6FQUkS6x', // Kanye West
      '0L8ExT028jH3ddEcZwqJJ5', // Red Hot Chili Peppers
      '5INjqkS1o8h1imAzPqGZBb', // Tame Impala
      '69GGBxA162lTqCwzJG5jLp', // The Chainsmokers
      '1anyVhU62p31KFi8MEzkbf', // Bad Bunny
    ];

    for (const artistId of popularArtistIds) {
      if (songs.length >= 500) break;

      try {
        const topTracks = await spotifyApi.getArtistTopTracks(artistId, 'US');

        for (const track of topTracks.body.tracks) {
          if (songs.length >= 500) break;
          if (seenTrackIds.has(track.id)) continue;
          if (track.popularity < MIN_POPULARITY) continue; // Skip unpopular songs

          seenTrackIds.add(track.id);
          songs.push(convertSpotifyTrackToSong(track, songs.length + 1));
        }
      } catch (error) {
        console.warn(`Error fetching tracks for artist ${artistId}:`, error);
      }
    }

    // If we still need more songs, search for popular tracks by genre
    if (songs.length < 500) {
      const popularGenres = ['pop', 'hip hop', 'rock', 'electronic', 'r&b'];

      for (const genre of popularGenres) {
        if (songs.length >= 500) break;

        const searchResults = await spotifyApi.searchTracks(
          `genre:${genre}`,
          { limit: 50 }
        );

        for (const track of searchResults.body.tracks?.items || []) {
          if (songs.length >= 500) break;
          if (seenTrackIds.has(track.id)) continue;
          if (track.popularity < MIN_POPULARITY) continue; // Skip unpopular songs

          seenTrackIds.add(track.id);
          songs.push(convertSpotifyTrackToSong(track, songs.length + 1));
        }
      }
    }

    // If we still don't have 500, get top tracks from popular artists
    if (songs.length < 500) {
      const popularArtistIds = [
        '06HL4z0CvFAxyc27GXpf02', // Taylor Swift
        '1Xyo4u8uXC1ZmMpatF05PJ', // The Weeknd
        '3TVXtAsR1Inumwj472S9r4', // Drake
        '66CXWjxzNUsdJxJ2JdwvnR', // Ariana Grande
        '6qqNVTkY8uBg9cP3Jd7DAH', // Billie Eilish
        '0hCNtLu0JehylgoiP8L4Gh', // Nicki Minaj
      ];

      for (const artistId of popularArtistIds) {
        if (songs.length >= 500) break;

        const topTracks = await spotifyApi.getArtistTopTracks(artistId, 'US');

        for (const track of topTracks.body.tracks) {
          if (songs.length >= 500) break;
          if (seenTrackIds.has(track.id)) continue;

          seenTrackIds.add(track.id);
          songs.push(convertSpotifyTrackToSong(track, songs.length + 1));
        }
      }
    }

    return songs.slice(0, 500);
  } catch (error) {
    console.error('Error fetching songs from Spotify:', error);
    throw error;
  }
}

/**
 * Convert Spotify track to our Song type
 */
function convertSpotifyTrackToSong(
  track: SpotifyApi.TrackObjectFull,
  index: number
): Song {
  return {
    id: String(index),
    spotifyId: track.id,
    spotifyUri: track.uri,
    title: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    album: track.album.name,
    releaseDate: track.album.release_date,
    duration: track.duration_ms,
    genre: [], // Spotify doesn't provide genre on tracks directly
    eloRating: 1500, // Initial ELO rating
    totalBattles: 0,
    wins: 0,
    losses: 0,
    previewUrl: track.preview_url || '',
    albumArtUrl: track.album.images[0]?.url || '',
    spotifyPopularity: track.popularity,
    currentRank: index,
  };
}

/**
 * Get track details by Spotify ID
 */
export async function getTrackById(spotifyId: string): Promise<Song | null> {
  try {
    await getAccessToken();
    const track = await spotifyApi.getTrack(spotifyId);
    return convertSpotifyTrackToSong(track.body, 0);
  } catch (error) {
    console.error(`Error fetching track ${spotifyId}:`, error);
    return null;
  }
}
