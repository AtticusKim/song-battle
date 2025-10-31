'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { Song } from '@/types';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalVotes: 0,
    votesToday: 0,
    activeVoters: 234, // Mock value for now
  });
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch songs
        const songsResponse = await fetch('/api/songs');
        const songsData = await songsResponse.json();

        // Fetch vote stats
        const votesResponse = await fetch('/api/votes');
        const votesData = await votesResponse.json();

        if (songsData.success && votesData.success) {
          // Get top 10 songs
          const sortedSongs = [...songsData.songs]
            .sort((a, b) => b.eloRating - a.eloRating)
            .slice(0, 10);

          setTopSongs(sortedSongs);
          setStats({
            totalSongs: votesData.totalSongs,
            totalVotes: votesData.totalVotes,
            votesToday: Math.floor(Math.random() * 1000) + 500, // Mock value
            activeVoters: Math.floor(Math.random() * 100) + 50, // Mock value
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-12 grid-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Animated Title */}
          <div className="space-y-4">
            <h1 className="font-arcade text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neon-purple text-glow-purple animate-neon-pulse">
              ♪ SONG BATTLE ♪
            </h1>
            <div className="font-arcade text-xl sm:text-2xl md:text-3xl text-cyan-glow text-glow-cyan">
              LEADERBOARD
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-4">
            <h2 className="font-space text-2xl sm:text-3xl md:text-4xl text-star-white">
              WHICH SONG REIGNS SUPREME?
            </h2>
            <p className="font-space text-base sm:text-lg text-dimmed-gray max-w-2xl mx-auto">
              Vote on head-to-head music battles. Every vote shapes the global rankings.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href="/battle"
              className="inline-block relative overflow-hidden text-xs sm:text-sm md:text-base px-10 py-5 rounded-xl font-arcade text-star-white uppercase tracking-wider
                bg-gradient-to-r from-neon-purple via-electric-pink to-neon-purple border-2 border-electric-pink/60
                shadow-elevation-high hover:shadow-neon-purple-intense transition-all duration-300
                hover:scale-105 hover:-translate-y-1 active:scale-100
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
            >
              <span className="relative">START BATTLE &gt;&gt;</span>
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-8 pt-8">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 glass-card border-2 border-neon-purple/50 rounded-xl animate-float hover-glow-purple transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
                <span className="text-3xl">♪</span>
              </div>
              <div className="absolute inset-0 bg-neon-purple/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-4xl sm:text-6xl vs-text">VS</div>
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 glass-card border-2 border-electric-pink/50 rounded-xl animate-float hover-glow-pink transition-all duration-300 group-hover:scale-110 flex items-center justify-center" style={{ animationDelay: '1s' }}>
                <span className="text-3xl">♫</span>
              </div>
              <div className="absolute inset-0 bg-electric-pink/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-neon-purple/30 glass-card">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center text-dimmed-gray">Loading stats...</div>
          ) : (
            <div className="space-y-4">
              {/* Total Votes - Full Width */}
              <div className="relative group">
                <div className="text-center p-6 rounded-xl bg-deep-space/80 backdrop-blur-xl border border-electric-pink/30 transition-all duration-300 hover:scale-[1.02] hover:border-electric-pink/60 hover:shadow-elevation-high hover:-translate-y-1">
                  <div className="font-mono text-3xl sm:text-4xl md:text-5xl text-electric-pink text-glow-pink mb-2">
                    {stats.totalVotes.toLocaleString()}
                  </div>
                  <div className="font-space text-sm sm:text-base text-star-white/60 uppercase tracking-wider">
                    Total Votes
                  </div>
                </div>
                <div className="absolute inset-0 bg-electric-pink/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>

              {/* Three Stats - Below */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="relative group">
                  <div className="text-center p-6 rounded-xl bg-deep-space/80 backdrop-blur-xl border border-cyan-glow/30 transition-all duration-300 hover:scale-105 hover:border-cyan-glow/60 hover:shadow-elevation-high hover:-translate-y-1">
                    <div className="font-mono text-2xl sm:text-3xl md:text-4xl text-cyan-glow text-glow-cyan mb-2">
                      {stats.totalSongs.toLocaleString()}
                    </div>
                    <div className="font-space text-xs sm:text-sm text-star-white/60 uppercase tracking-wider">
                      Number of Songs
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-cyan-glow/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
                <div className="relative group">
                  <div className="text-center p-6 rounded-xl bg-deep-space/80 backdrop-blur-xl border border-neon-green/30 transition-all duration-300 hover:scale-105 hover:border-neon-green/60 hover:shadow-elevation-high hover:-translate-y-1">
                    <div className="font-mono text-2xl sm:text-3xl md:text-4xl text-neon-green text-glow-green mb-2">
                      {stats.votesToday.toLocaleString()}
                    </div>
                    <div className="font-space text-xs sm:text-sm text-star-white/60 uppercase tracking-wider">
                      Today
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-neon-green/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
                <div className="relative group">
                  <div className="text-center p-6 rounded-xl bg-deep-space/80 backdrop-blur-xl border border-neon-purple/30 transition-all duration-300 hover:scale-105 hover:border-neon-purple/60 hover:shadow-elevation-high hover:-translate-y-1">
                    <div className="font-mono text-2xl sm:text-3xl md:text-4xl text-neon-purple text-glow-purple mb-2">
                      {stats.activeVoters}
                    </div>
                    <div className="font-space text-xs sm:text-sm text-star-white/60 uppercase tracking-wider">
                      Active
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-neon-purple/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Top 10 Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-arcade text-2xl sm:text-3xl text-center text-electric-pink text-glow-pink mb-12">
            TOP 10 RIGHT NOW
          </h2>
          {loading ? (
            <div className="text-center text-dimmed-gray">Loading leaderboard...</div>
          ) : (
            <div className="space-y-3">
              {topSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="relative group"
                >
                  <div className="bg-deep-space/80 backdrop-blur-xl border border-neon-purple/30 rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:border-electric-pink/50 hover:shadow-elevation-medium hover:-translate-y-0.5">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`font-arcade text-xl sm:text-2xl min-w-[3rem] transition-all duration-300 ${
                        index === 0 ? 'text-neon-green text-glow-green' :
                        index === 1 ? 'text-cyan-glow text-glow-cyan' :
                        index === 2 ? 'text-electric-pink text-glow-pink' :
                        'text-neon-purple text-glow-purple'
                      }`}>
                        #{index + 1}
                      </div>

                      {/* Album Art */}
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 glass-card border-2 border-neon-purple/50 rounded-lg flex-shrink-0 group-hover:border-electric-pink/80 transition-all duration-300 flex items-center justify-center overflow-hidden">
                          {song.albumArtUrl ? (
                            <img
                              src={song.albumArtUrl}
                              alt={`${song.title} album art`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl opacity-60">♪</span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-neon-purple/20 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-space text-sm sm:text-base text-star-white/95 truncate group-hover:text-electric-pink transition-colors">
                          {song.title}
                        </div>
                        <div className="font-space text-xs sm:text-sm text-dimmed-gray/80 truncate">
                          {song.artist}
                        </div>
                      </div>

                      {/* ELO */}
                      <div className="badge-arcade font-mono text-xs sm:text-sm group-hover:border-electric-pink/50 transition-all">
                        {song.eloRating}
                      </div>
                    </div>
                  </div>
                  {/* Glow effect behind card */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-electric-pink/10 blur-2xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/leaderboard"
              className="inline-block font-space text-sm uppercase tracking-wider text-star-white
                border-2 border-cyan-glow/60 hover:border-electric-pink/80
                bg-cyan-glow/10 hover:bg-electric-pink/10
                px-8 py-3 rounded-lg transition-all duration-300
                hover:shadow-elevation-medium hover:scale-105 hover:-translate-y-0.5"
            >
              View Full Leaderboard &gt;&gt;
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 border-t border-neon-purple/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-arcade text-2xl sm:text-3xl text-center text-neon-purple text-glow-purple mb-12">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 mx-auto glass-card border-2 border-cyan-glow/30 rounded-xl flex items-center justify-center group-hover:border-cyan-glow/60 transition-all duration-300 hover-glow-cyan group-hover:scale-110">
                  <span className="text-4xl">♪</span>
                </div>
                <div className="absolute inset-0 bg-cyan-glow/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-space text-lg text-cyan-glow text-glow-cyan">
                Listen to Two Songs
              </h3>
              <p className="font-space text-sm text-dimmed-gray/80 leading-relaxed">
                We'll present you with two songs to compare
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative group text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 mx-auto glass-card border-2 border-electric-pink/30 rounded-xl flex items-center justify-center group-hover:border-electric-pink/60 transition-all duration-300 hover-glow-pink group-hover:scale-110">
                  <span className="text-4xl">❤️</span>
                </div>
                <div className="absolute inset-0 bg-electric-pink/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-space text-lg text-electric-pink text-glow-pink">
                Pick Your Favorite
              </h3>
              <p className="font-space text-sm text-dimmed-gray/80 leading-relaxed">
                Vote for the song you prefer
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative group text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 mx-auto glass-card border-2 border-neon-green/30 rounded-xl flex items-center justify-center group-hover:border-neon-green/60 transition-all duration-300 group-hover:scale-110">
                  <span className="text-4xl">📈</span>
                </div>
                <div className="absolute inset-0 bg-neon-green/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-space text-lg text-neon-green text-glow-green">
                Watch Rankings Change
              </h3>
              <p className="font-space text-sm text-dimmed-gray/80 leading-relaxed">
                See the ELO ratings update in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neon-purple/30 py-8 px-4 mt-16 glass-card">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-space text-sm text-dimmed-gray/80">
            Powered by ELO Rating System • Built with Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
