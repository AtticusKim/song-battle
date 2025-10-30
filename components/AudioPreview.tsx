'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPreviewProps {
  previewUrl: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

export default function AudioPreview({
  previewUrl,
  autoPlay = false,
  onPlay,
  onPause,
}: AudioPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 30);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      audio.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  if (!previewUrl) {
    return (
      <div className="text-center py-4">
        <p className="font-space text-xs text-dimmed-gray">
          Preview not available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <audio ref={audioRef} src={previewUrl} preload="metadata" />

      {/* Play Button */}
      <button
        onClick={togglePlay}
        className="w-full flex items-center justify-center gap-2 font-space text-sm text-cyan-glow hover:text-electric-pink transition-colors py-2 border border-cyan-glow hover:border-electric-pink rounded-lg group"
      >
        <span className="text-lg">{isPlaying ? '⏸' : '▶'}</span>
        <span className="uppercase tracking-wider">
          {isPlaying ? 'Pause' : 'Play'} Preview
        </span>
      </button>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-void-black border border-cyan-glow/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-glow to-electric-pink shadow-neon-cyan transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs text-dimmed-gray">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
