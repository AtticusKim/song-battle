'use client';

import { useState } from 'react';

export default function ResetSongsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/songs/reset', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to reset songs');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-deep-space/80 backdrop-blur-xl border border-neon-purple/30 rounded-xl p-8">
        <h1 className="font-arcade text-2xl text-neon-purple text-glow-purple mb-6 text-center">
          RESET SONGS DATA
        </h1>

        <p className="font-space text-sm text-dimmed-gray mb-8 text-center">
          This will clear Vercel KV storage and reload all 500 songs from data/songs.json
        </p>

        <div className="text-center mb-6">
          <button
            onClick={handleReset}
            disabled={loading}
            className="btn-arcade px-8 py-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'RESETTING...' : 'RESET TO 500 SONGS'}
          </button>
        </div>

        {result && (
          <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-4">
            <div className="font-mono text-sm text-neon-green mb-2">
              ✓ Success!
            </div>
            <div className="font-mono text-xs text-star-white">
              <div>Songs loaded: {result.songCount}</div>
              <div>Last updated: {result.lastUpdated}</div>
              <div className="mt-2">{result.message}</div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-hot-pink/10 border border-hot-pink/30 rounded-lg p-4">
            <div className="font-mono text-sm text-hot-pink mb-2">
              ✗ Error
            </div>
            <div className="font-mono text-xs text-star-white">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
