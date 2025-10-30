'use client';

import { Song } from '@/types';
import AudioPreview from './AudioPreview';
import RankBadge from './RankBadge';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface BattleCardProps {
  song: Song;
  onVote: () => void;
  isWinner?: boolean;
  isLoser?: boolean;
  showResults?: boolean;
  eloChange?: number;
  rankChange?: number;
  disabled?: boolean;
}

// Generate a unique color gradient based on song title
function getAlbumPlaceholder(title: string, id: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 120) % 360;

  return `https://via.placeholder.com/400x400/${hue1.toString(16).padStart(6, '0').slice(0, 6)}/${hue2.toString(16).padStart(6, '0').slice(0, 6)}?text=${encodeURIComponent(title.split(' ')[0])}`;
}

export default function BattleCard({
  song,
  onVote,
  isWinner = false,
  isLoser = false,
  showResults = false,
  eloChange = 0,
  rankChange = 0,
  disabled = false,
}: BattleCardProps) {
  const cardClasses = `
    relative rounded-2xl p-6 sm:p-8 transition-all duration-500
    bg-deep-space/80 backdrop-blur-xl border
    ${isWinner ? 'border-neon-purple/70 shadow-elevation-high animate-victory-flash' : 'border-neon-purple/30'}
    ${isLoser ? 'opacity-60 border-dimmed-gray/30' : ''}
    ${!showResults && !disabled ? 'hover:border-electric-pink/50 hover:shadow-elevation-high hover:scale-[1.02] hover:-translate-y-1' : ''}
  `;

  // Use real album art if available, otherwise generate placeholder
  const albumImageUrl = song.albumArtUrl && song.albumArtUrl !== 'https://i.scdn.co/image/ab67616d0000b273...'
    ? song.albumArtUrl
    : getAlbumPlaceholder(song.title, song.id);

  return (
    <motion.div
      initial={false}
      animate={
        isWinner
          ? {
              scale: [1, 1.03, 1],
              rotate: [0, 0.5, -0.5, 0],
            }
          : isLoser
          ? {
              scale: [1, 0.97, 1],
            }
          : {}
      }
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={cardClasses}
    >
      {/* Background Glow Effect */}
      {isWinner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-electric-pink/20 to-cyan-glow/10 blur-3xl rounded-2xl -z-10"
        />
      )}

      {/* Winner Badge */}
      {showResults && isWinner && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="font-arcade text-xs px-6 py-2 bg-gradient-to-r from-neon-purple via-electric-pink to-neon-purple border-2 border-cyan-glow/50 rounded-full text-star-white shadow-elevation-high backdrop-blur-sm animate-pulse">
            ⚡ VICTORY ⚡
          </div>
        </motion.div>
      )}

      {/* Loser Badge */}
      {showResults && isLoser && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="font-space text-xs px-6 py-2 glass-card border border-dimmed-gray/50 rounded-full text-dimmed-gray/80">
            DEFEATED
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Album Art */}
        <div className="flex justify-center">
          <motion.div
            whileHover={!showResults && !disabled ? { scale: 1.05, rotate: 2 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <div className={`
              w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden relative
              border-2 transition-all duration-300 shadow-lg
              ${isWinner ? 'border-neon-purple/80 shadow-neon-purple-intense' : 'border-neon-purple/40 shadow-neon-purple/20'}
              ${!showResults && !disabled ? 'group-hover:border-electric-pink/70 group-hover:shadow-elevation-high' : ''}
            `}>
              <Image
                src={albumImageUrl}
                alt={`${song.title} by ${song.artist}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              {/* Overlay gradient on hover */}
              {!showResults && !disabled && (
                <div className="absolute inset-0 bg-gradient-to-t from-electric-pink/40 via-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </div>
            {/* Glow effect behind album art */}
            {isWinner && (
              <div className="absolute inset-0 bg-neon-purple/40 blur-2xl rounded-2xl -z-10 animate-neon-pulse" />
            )}
          </motion.div>
        </div>

        {/* Song Info */}
        <div className="text-center space-y-2">
          <h3 className="font-space text-lg sm:text-xl text-star-white/95 font-bold leading-tight">
            {song.title}
          </h3>
          <p className="font-space text-sm sm:text-base text-dimmed-gray/80">
            {song.artist}
          </p>
          <div className="flex items-center justify-center gap-2 font-mono text-xs text-dimmed-gray/60">
            <span className="px-2 py-1 glass-card border border-neon-purple/20 rounded-md">
              {new Date(song.releaseDate).getFullYear()}
            </span>
            <span>•</span>
            <span className="px-2 py-1 glass-card border border-cyan-glow/20 rounded-md">
              {song.genre[0]}
            </span>
          </div>
        </div>

        {/* Audio Preview */}
        {!showResults && (
          <div className="pt-2">
            <AudioPreview previewUrl={song.previewUrl} />
          </div>
        )}

        {/* Rank Badge - Only show after voting */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex justify-center pt-2"
          >
            <RankBadge
              rank={song.currentRank || 0}
              elo={song.eloRating + eloChange}
              showChange={showResults}
              rankChange={rankChange}
              eloChange={eloChange}
              animated={true}
            />
          </motion.div>
        )}

        {/* Vote Button */}
        {!showResults && (
          <div className="pt-4">
            <motion.button
              whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
              whileTap={!disabled ? { scale: 0.97 } : {}}
              onClick={onVote}
              disabled={disabled}
              className="relative w-full text-xs sm:text-sm py-4 rounded-xl overflow-hidden
                bg-gradient-to-r from-neon-purple via-electric-pink to-neon-purple
                border-2 border-electric-pink/50
                shadow-elevation-medium hover:shadow-elevation-high
                font-arcade text-star-white uppercase tracking-wider
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
            >
              <span className="relative flex items-center justify-center gap-2">
                <span className="text-cyan-glow">&gt;&gt;</span>
                <span>VOTE FOR THIS</span>
                <span className="text-cyan-glow">&lt;&lt;</span>
              </span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
