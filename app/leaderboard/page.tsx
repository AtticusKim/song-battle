'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Song } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LeaderboardPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch songs from API
  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch('/api/songs');
        const data = await response.json();

        if (data.success && data.songs) {
          // Sort by ELO rating (descending) and take top 100
          const sortedSongs = [...data.songs]
            .sort((a, b) => b.eloRating - a.eloRating)
            .slice(0, 100);
          setSongs(sortedSongs);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="font-arcade text-neon-purple text-xl mb-4">Loading leaderboard...</div>
            <div className="text-dimmed-gray">Fetching rankings</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-arcade text-3xl sm:text-4xl md:text-5xl text-neon-purple text-glow-purple mb-4">
              LEADERBOARD
            </h1>
            <p className="font-space text-sm sm:text-base text-dimmed-gray">
              Top songs ranked by ELO rating
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative group">
              <div className="text-center p-5 rounded-xl bg-deep-space/80 backdrop-blur-xl border border-cyan-glow/30 transition-all duration-300 hover:scale-105 hover:border-cyan-glow/60 hover:shadow-elevation-high hover:-translate-y-1">
                <div className="font-mono text-xl sm:text-2xl text-cyan-glow text-glow-cyan mb-2">
                  {songs.length}
                </div>
                <div className="font-space text-xs text-star-white/60 uppercase tracking-wider">
                  Total Songs
                </div>
              </div>
              <div className="absolute inset-0 bg-cyan-glow/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
            <div className="relative group">
              <div className="text-center p-5 rounded-xl bg-deep-space/80 backdrop-blur-xl border border-electric-pink/30 transition-all duration-300 hover:scale-105 hover:border-electric-pink/60 hover:shadow-elevation-high hover:-translate-y-1">
                <div className="font-mono text-xl sm:text-2xl text-electric-pink text-glow-pink mb-2">
                  {songs[0]?.eloRating || 0}
                </div>
                <div className="font-space text-xs text-star-white/60 uppercase tracking-wider">
                  Top ELO
                </div>
              </div>
              <div className="absolute inset-0 bg-electric-pink/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
            <div className="relative group">
              <div className="text-center p-5 rounded-xl bg-deep-space/80 backdrop-blur-xl border border-neon-green/30 transition-all duration-300 hover:scale-105 hover:border-neon-green/60 hover:shadow-elevation-high hover:-translate-y-1">
                <div className="font-mono text-xl sm:text-2xl text-neon-green text-glow-green mb-2">
                  {songs.reduce((acc, s) => acc + s.totalBattles, 0)}
                </div>
                <div className="font-space text-xs text-star-white/60 uppercase tracking-wider">
                  Total Votes
                </div>
              </div>
              <div className="absolute inset-0 bg-neon-green/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-2">
            {songs.map((song, index) => {
              const winPercentage = Math.round((song.wins / song.totalBattles) * 100);

              return (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`
                    relative bg-deep-space/80 backdrop-blur-xl rounded-lg p-4 transition-all duration-300 group
                    ${index < 3 ? 'border-2 border-neon-purple/60 shadow-elevation-medium' : 'border border-neon-purple/30'}
                    hover:shadow-elevation-high hover:border-electric-pink/60 hover:scale-[1.01] hover:-translate-y-0.5
                  `}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-2 sm:col-span-1">
                      <div className={`
                        font-arcade text-base sm:text-xl text-center
                        ${index === 0 ? 'text-neon-green text-glow-green' : ''}
                        ${index === 1 ? 'text-cyan-glow text-glow-cyan' : ''}
                        ${index === 2 ? 'text-electric-pink text-glow-pink' : ''}
                        ${index > 2 ? 'text-dimmed-gray' : ''}
                      `}>
                        #{index + 1}
                      </div>
                    </div>

                    {/* Album Art */}
                    <div className="col-span-2 sm:col-span-1">
                      <div className={`
                        relative w-12 h-12 rounded-lg border-2 flex-shrink-0 transition-all overflow-hidden shadow-lg
                        ${index < 3 ? 'border-neon-purple/70 shadow-neon-purple/30' : 'border-neon-purple/40'}
                        group-hover:border-electric-pink/80 group-hover:shadow-elevation-medium group-hover:scale-110
                      `}>
                        {song.albumArtUrl ? (
                          <Image
                            src={song.albumArtUrl}
                            alt={`${song.title} album art`}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl opacity-50 bg-dimmed-gray/10">
                            ♪
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Song Info */}
                    <div className="col-span-8 sm:col-span-5 min-w-0">
                      <div className="font-space text-sm sm:text-base text-star-white truncate">
                        {song.title}
                      </div>
                      <div className="font-space text-xs sm:text-sm text-dimmed-gray truncate">
                        {song.artist}
                      </div>
                    </div>

                    {/* Stats - Hidden on mobile */}
                    <div className="hidden sm:block sm:col-span-2 text-center">
                      <div className="inline-block px-3 py-1.5 rounded-lg bg-cyan-glow/10 border border-cyan-glow/40 backdrop-blur-sm transition-all group-hover:border-electric-pink/60 group-hover:bg-electric-pink/10">
                        <div className="font-mono text-sm text-cyan-glow group-hover:text-electric-pink transition-colors">
                          {song.eloRating}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block md:col-span-2 text-center">
                      <div className="font-mono text-sm text-dimmed-gray">
                        {song.totalBattles} battles
                      </div>
                      <div className={`
                        font-mono text-xs mt-1
                        ${winPercentage >= 60 ? 'text-neon-green' : ''}
                        ${winPercentage < 60 && winPercentage >= 50 ? 'text-cyan-glow' : ''}
                        ${winPercentage < 50 ? 'text-hot-pink' : ''}
                      `}>
                        {winPercentage}% wins
                      </div>
                    </div>

                    {/* Genre */}
                    <div className="hidden lg:block lg:col-span-1 text-center">
                      <span className="inline-block px-3 py-1.5 bg-neon-purple/15 backdrop-blur-sm border border-neon-purple/50 rounded-lg text-xs font-mono text-neon-purple transition-all group-hover:bg-electric-pink/15 group-hover:border-electric-pink/60 group-hover:text-electric-pink">
                        {song.genre[0]}
                      </span>
                    </div>
                  </div>
                  {/* Glow effect behind top 3 rows */}
                  {index < 3 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-electric-pink/10 to-cyan-glow/10 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Load More (for future implementation) */}
          <div className="text-center mt-8">
            <div className="font-space text-sm text-dimmed-gray">
              Showing top {songs.length} songs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
