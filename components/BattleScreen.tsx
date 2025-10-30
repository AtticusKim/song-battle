'use client';

import { useState, useEffect } from 'react';
import { Song } from '@/types';
import BattleCard from './BattleCard';
import { calculateBattleResult } from '@/lib/elo';
import { motion, AnimatePresence } from 'framer-motion';

interface BattleScreenProps {
  initialSong1: Song;
  initialSong2: Song;
  onLoadNext: () => { song1: Song; song2: Song };
  onVoteComplete?: (winnerId: string, loserId: string) => void;
}

export default function BattleScreen({
  initialSong1,
  initialSong2,
  onLoadNext,
  onVoteComplete,
}: BattleScreenProps) {
  const [song1, setSong1] = useState(initialSong1);
  const [song2, setSong2] = useState(initialSong2);
  const [showResults, setShowResults] = useState(false);
  const [winner, setWinner] = useState<'song1' | 'song2' | null>(null);
  const [battleCount, setBattleCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(3);

  const [song1Changes, setSong1Changes] = useState({ elo: 0, rank: 0 });
  const [song2Changes, setSong2Changes] = useState({ elo: 0, rank: 0 });

  // Auto-advance countdown
  useEffect(() => {
    if (showResults && autoAdvanceTimer > 0) {
      const timer = setTimeout(() => {
        setAutoAdvanceTimer(autoAdvanceTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showResults && autoAdvanceTimer === 0) {
      loadNextBattle();
    }
  }, [showResults, autoAdvanceTimer]);

  const handleVote = async (votedSong: 'song1' | 'song2') => {
    setIsLoading(true);
    setWinner(votedSong);

    // Calculate ELO changes
    const winnerSong = votedSong === 'song1' ? song1 : song2;
    const loserSong = votedSong === 'song1' ? song2 : song1;

    const result = calculateBattleResult(winnerSong.eloRating, loserSong.eloRating);

    // Simulate rank changes (in a real app, this would come from the backend)
    const winnerRankChange = Math.random() < 0.5 ? Math.floor(Math.random() * 3) : 0;
    const loserRankChange = -Math.floor(Math.random() * 3);

    if (votedSong === 'song1') {
      setSong1Changes({ elo: result.winnerChange, rank: winnerRankChange });
      setSong2Changes({ elo: result.loserChange, rank: loserRankChange });
    } else {
      setSong2Changes({ elo: result.winnerChange, rank: winnerRankChange });
      setSong1Changes({ elo: result.loserChange, rank: loserRankChange });
    }

    // Call the vote complete callback
    onVoteComplete?.(winnerSong.id, loserSong.id);

    // Show results after a short delay
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      setAutoAdvanceTimer(3);
    }, 500);
  };

  const loadNextBattle = () => {
    const nextPair = onLoadNext();
    setSong1(nextPair.song1);
    setSong2(nextPair.song2);
    setShowResults(false);
    setWinner(null);
    setIsLoading(false);
    setSong1Changes({ elo: 0, rank: 0 });
    setSong2Changes({ elo: 0, rank: 0 });
    setBattleCount(battleCount + 1);
    setAutoAdvanceTimer(3);
  };

  const skipBattle = () => {
    loadNextBattle();
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="font-space text-sm text-dimmed-gray">
            Battle #{battleCount}
          </div>
          {!showResults && (
            <button
              onClick={skipBattle}
              className="font-space text-xs uppercase tracking-wider text-dimmed-gray hover:text-electric-pink border border-dimmed-gray hover:border-electric-pink px-4 py-2 rounded-lg transition-colors"
            >
              Skip Battle ⏭
            </button>
          )}
        </div>

        {/* VS Indicator */}
        {!showResults && (
          <div className="text-center mb-8">
            <div className="vs-text inline-block">VS</div>
          </div>
        )}

        {/* Results Header */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="font-arcade text-xl sm:text-2xl text-electric-pink text-glow-pink">
              YOU CHOSE: {winner === 'song1' ? song1.title.toUpperCase() : song2.title.toUpperCase()}
            </div>
          </motion.div>
        )}

        {/* Battle Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`song1-${song1.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <BattleCard
                song={song1}
                onVote={() => handleVote('song1')}
                isWinner={showResults && winner === 'song1'}
                isLoser={showResults && winner === 'song2'}
                showResults={showResults}
                eloChange={song1Changes.elo}
                rankChange={song1Changes.rank}
                disabled={isLoading || showResults}
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`song2-${song2.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <BattleCard
                song={song2}
                onVote={() => handleVote('song2')}
                isWinner={showResults && winner === 'song2'}
                isLoser={showResults && winner === 'song1'}
                showResults={showResults}
                eloChange={song2Changes.elo}
                rankChange={song2Changes.rank}
                disabled={isLoading || showResults}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Battle Button */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4"
          >
            <button
              onClick={loadNextBattle}
              className="btn-arcade text-sm px-8 py-4 rounded-lg"
            >
              NEXT BATTLE &gt;&gt;
            </button>
            <div className="font-mono text-sm text-dimmed-gray">
              Auto-continuing in {autoAdvanceTimer}s...
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center">
            <div className="font-space text-sm text-cyan-glow animate-pulse">
              Processing vote...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
