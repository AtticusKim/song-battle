'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RankBadgeProps {
  rank: number;
  elo: number;
  showChange?: boolean;
  rankChange?: number;
  eloChange?: number;
  animated?: boolean;
}

export default function RankBadge({
  rank,
  elo,
  showChange = false,
  rankChange = 0,
  eloChange = 0,
  animated = true,
}: RankBadgeProps) {
  const [displayElo, setDisplayElo] = useState(elo);

  useEffect(() => {
    if (showChange && animated) {
      // Animate ELO change
      const start = elo - eloChange;
      const duration = 1000; // 1 second
      const steps = 60;
      const increment = eloChange / steps;
      let current = 0;

      const timer = setInterval(() => {
        current++;
        if (current >= steps) {
          setDisplayElo(elo);
          clearInterval(timer);
        } else {
          setDisplayElo(Math.round(start + increment * current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayElo(elo);
    }
  }, [elo, eloChange, showChange, animated]);

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-neon-green text-glow-green';
    if (change < 0) return 'text-hot-pink text-glow-pink';
    return 'text-dimmed-gray';
  };

  return (
    <motion.div
      initial={false}
      animate={showChange ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5 }}
      className="inline-block"
    >
      <div className="badge-arcade px-4 py-2 relative">
        <div className="flex items-center gap-3 font-mono text-sm">
          <div className="flex items-center gap-1">
            <span className="text-xs text-dimmed-gray">#</span>
            <span className="text-lg">{rank}</span>
          </div>
          <div className="w-px h-6 bg-cyan-glow/30" />
          <div className="flex items-center gap-1">
            <span className="text-lg">{displayElo}</span>
            <span className="text-xs text-dimmed-gray">ELO</span>
          </div>
        </div>

        {/* Change Indicators */}
        {showChange && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className="flex items-center gap-2 font-mono text-xs">
              {eloChange !== 0 && (
                <span className={getChangeColor(eloChange)}>
                  {eloChange > 0 ? '↑' : '↓'} {Math.abs(eloChange)} ELO
                </span>
              )}
              {rankChange !== 0 && (
                <span className={getChangeColor(rankChange)}>
                  {rankChange > 0 ? '↑' : '↓'} {Math.abs(rankChange)} pos
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Status Text Below */}
      {showChange && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-2"
        >
          <span className="font-space text-xs text-dimmed-gray">
            {rankChange === 0 && `Stayed at #${rank}`}
            {rankChange > 0 && `Moved up to #${rank}!`}
            {rankChange < 0 && `Dropped to #${rank}`}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
