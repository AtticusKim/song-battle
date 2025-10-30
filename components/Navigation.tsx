'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-space/60 backdrop-blur-xl border-b border-neon-purple/30 shadow-elevation-high transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="font-arcade text-neon-purple text-sm sm:text-base transition-all duration-300 hover:scale-105">
              <span className="text-glow-purple group-hover:text-electric-pink group-hover:text-glow-pink transition-colors duration-300">♪ SONG</span>
              <span className="text-cyan-glow text-glow-cyan ml-2 group-hover:animate-pulse">BATTLE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/battle"
              className="font-space text-sm uppercase tracking-wider text-star-white/90 hover:text-electric-pink transition-all duration-300 relative group"
            >
              <span className="group-hover:text-glow-pink">Battle</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-pink to-neon-purple group-hover:w-full transition-all duration-300 shadow-neon-pink"></span>
            </Link>
            <Link
              href="/leaderboard"
              className="font-space text-sm uppercase tracking-wider text-star-white/90 hover:text-cyan-glow transition-all duration-300 relative group"
            >
              <span className="group-hover:text-glow-cyan">Leaderboard</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-glow to-electric-blue group-hover:w-full transition-all duration-300 shadow-neon-cyan"></span>
            </Link>
            <Link
              href="/about"
              className="font-space text-sm uppercase tracking-wider text-star-white/90 hover:text-neon-green transition-all duration-300 relative group"
            >
              <span className="group-hover:text-glow-green">About</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-green to-cyan-glow group-hover:w-full transition-all duration-300 shadow-neon-green"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neon-purple hover:text-electric-pink transition-all duration-300 p-2 hover:bg-neon-purple/10 active:scale-95 rounded-lg border border-transparent hover:border-neon-purple/30 hover:shadow-neon-purple"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-neon-purple/30 mt-2 pt-4 animate-slide-down">
            <Link
              href="/battle"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-space text-sm uppercase tracking-wider text-star-white/90 hover:text-electric-pink hover:bg-electric-pink/10 transition-all duration-300 py-3 px-4 rounded-lg border border-transparent hover:border-electric-pink/30 active:scale-98 backdrop-blur-sm"
            >
              Battle
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-space text-sm uppercase tracking-wider text-star-white/90 hover:text-cyan-glow hover:bg-cyan-glow/10 transition-all duration-300 py-3 px-4 rounded-lg border border-transparent hover:border-cyan-glow/30 active:scale-98 backdrop-blur-sm"
            >
              Leaderboard
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-space text-sm uppercase tracking-wider text-star-white/90 hover:text-neon-green hover:bg-neon-green/10 transition-all duration-300 py-3 px-4 rounded-lg border border-transparent hover:border-neon-green/30 active:scale-98 backdrop-blur-sm"
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
