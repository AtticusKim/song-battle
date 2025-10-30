'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import BattleScreen from '@/components/BattleScreen';
import { Song } from '@/types';

// Function to get random battle pair from songs array
function getRandomBattlePair(songs: Song[]): { song1: Song; song2: Song } {
  const randomType = Math.random();

  if (randomType < 0.7 && songs.length > 1) {
    // Rating-based matching (70% of the time)
    const firstSong = songs[Math.floor(Math.random() * songs.length)];
    const eligibleOpponents = songs.filter(
      song =>
        song.id !== firstSong.id &&
        Math.abs(song.eloRating - firstSong.eloRating) <= 200
    );

    if (eligibleOpponents.length > 0) {
      const secondSong = eligibleOpponents[Math.floor(Math.random() * eligibleOpponents.length)];
      return { song1: firstSong, song2: secondSong };
    }
  }

  // Fallback to random matching
  const shuffled = [...songs].sort(() => Math.random() - 0.5);
  return { song1: shuffled[0], song2: shuffled[1] };
}

export default function BattlePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [battlePair, setBattlePair] = useState<{ song1: Song; song2: Song } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch songs from API on mount
  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch('/api/songs');
        const data = await response.json();

        if (data.success && data.songs) {
          setSongs(data.songs);
          setBattlePair(getRandomBattlePair(data.songs));
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  const handleLoadNext = () => {
    if (songs.length === 0) return null;
    const newPair = getRandomBattlePair(songs);
    setBattlePair(newPair);
    return newPair;
  };

  const handleVoteComplete = async (winnerId: string, loserId: string) => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winnerId, loserId }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Vote recorded successfully:', {
          winner: data.winner.title,
          loser: data.loser.title,
          eloChanges: data.eloChanges,
        });

        // Update the songs state with the new data
        setSongs(prevSongs => {
          return prevSongs.map(song => {
            if (song.id === winnerId) return data.winner;
            if (song.id === loserId) return data.loser;
            return song;
          });
        });
      } else {
        console.error('Failed to record vote:', data.error);
      }
    } catch (error) {
      console.error('Error recording vote:', error);
    }
  };

  if (loading || !battlePair) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="font-arcade text-neon-purple text-xl mb-4">Loading songs...</div>
            <div className="text-dimmed-gray">Preparing battle arena</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <BattleScreen
        initialSong1={battlePair.song1}
        initialSong2={battlePair.song2}
        onLoadNext={handleLoadNext}
        onVoteComplete={handleVoteComplete}
      />
    </div>
  );
}
