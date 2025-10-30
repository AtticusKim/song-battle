# Song Battle Ranking Platform - Product Requirements

## Overview

A web-based platform where users vote on head-to-head song matchups to create a dynamic global leaderboard using ELO ratings.

---

## Core Features

### 1. Battle Interface

**Battle Screen Layout:**
- Side-by-side song cards (desktop) or stacked (mobile)
- Each card displays:
  - Album cover art (300x300px)
  - Song title and artist name
  - Current rank and ELO rating
  - Play preview button (30-second clip)
  - "Vote for This" button
- "Skip Battle" button at top

**Voting Flow:**
1. User clicks "Vote for This" on either song
2. Vote submitted to backend
3. ELO calculations processed
4. Show results with animated rating changes
5. Load next battle pair (auto-advance after 3s or click "Next Battle")

**Post-Vote Animation:**
- Winning card pulses/glows
- Losing card dims
- ELO and rank changes display with arrows (↑/↓)
- Color-coded changes: green for improvements, red for declines

### 2. ELO Rating System

**Configuration:**
- Initial rating: 1500 for all songs
- K-factor: 32
- Standard ELO formula

**Protection:**
- Rate limiting (100 votes per hour per IP)
- Minimum 10 votes before appearing on leaderboard

### 3. Global Leaderboard

**Display:**
- Top 100 songs by default
- Columns: Rank, Album Art, Song Title, Artist, ELO, Total Battles, Win %
- Real-time updates (max 5-minute delay)
- Pagination for browsing beyond top 100

**Filters (Future):**
- Genre
- Release year
- Minimum battles played

### 4. Song Database (Spotify Integration)

**Data Source:**
- Import from Spotify playlists (Top 50 Global, genre-specific charts)
- Pull top tracks from popular artists
- Weekly automated updates

**Song Metadata:**
- Spotify ID, URI, title, artist, album
- Release date, duration, genres
- Preview URL (30-second clip)
- Album art URL
- ELO rating, battles, wins/losses

---

## Matchmaking Algorithm

**Song Pairing Strategy:**
- 70%: Rating-based (±200 ELO points)
- 20%: Discovery matching (new songs vs. established)
- 10%: Random matching

**User History:**
- Avoid showing same song within 50 battles
- Track last 20 battles per session

---

## Visual Design - Retro Space Arcade Theme

### Color Palette

**Primary Colors:**
- Deep Space Black: `#0a0a0f`
- Neon Purple: `#b026ff`
- Electric Pink: `#ff00ff`
- Cyan Glow: `#00ffff`

**Accent Colors:**
- Neon Green: `#39ff14` (positive changes)
- Hot Pink: `#ff006e` (negative changes)
- Star White: `#ffffff` (text)
- Dimmed Gray: `#666666` (secondary text)

### Typography
- Primary: "Press Start 2P" (arcade headers)
- Secondary: "Orbitron" (body text, song titles)
- Monospace: "Space Mono" (stats, numbers)

### Visual Effects
- Neon glow on buttons and borders
- CRT scanline overlay (subtle)
- Tron-style grid background
- Floating particle effects
- Smooth animations (Framer Motion)

---

## Technical Stack

### Frontend
- Framework: Next.js 14+ (App Router)
- Styling: Tailwind CSS 4+
- Animation: Framer Motion
- State: React hooks
- Audio: HTML5 Audio API

### Backend
- Runtime: Node.js
- API: Next.js API routes
- Database: JSON file storage (data/songs.json)
- Spotify: spotify-web-api-node

### API Endpoints
```
GET  /api/songs              - Get all songs
POST /api/votes              - Submit vote
POST /api/songs/refresh      - Refresh from Spotify (admin)
```

---

## Data Models

### Song
```typescript
{
  id: string
  spotifyId: string
  spotifyUri: string
  title: string
  artist: string
  album: string
  releaseDate: string
  duration: number
  genre: string[]
  eloRating: number
  totalBattles: number
  wins: number
  losses: number
  previewUrl: string
  albumArtUrl: string
  spotifyPopularity: number
  currentRank: number
}
```

### Vote (in-memory)
```typescript
{
  winnerId: string
  loserId: string
  timestamp: Date
}
```

---

## Implementation Notes

### Homepage (app/page.tsx)
- Hero section with CTA to battle
- Stats bar (total songs, votes, active users)
- Top 10 preview
- "How It Works" section

### Battle Page (app/battle/page.tsx)
- Fetch songs from API
- Display battle pair
- Handle voting
- Update local state with new ELO ratings
- Load next pair

### Leaderboard Page (app/leaderboard/page.tsx)
- Fetch and display all songs sorted by ELO
- Show statistics
- Responsive table with animations

### Vote Processing (app/api/votes/route.ts)
- Calculate ELO changes
- Update song stats
- Save to JSON file
- Return updated songs

---

## Launch Goals

**MVP (First 30 Days):**
- 500+ songs in database
- 10,000+ total votes
- 100+ daily active users
- <3 second page load time

**Growth (3-6 Months):**
- 5,000+ songs
- 100,000+ total votes
- 1,000+ daily active users

---

## Future Enhancements

### Phase 2
- User accounts and login
- Personal voting history
- Achievement badges
- Genre-specific leaderboards
- Social sharing features

### Phase 3
- Mobile app (iOS/Android)
- User-driven song requests
- Playlist generation
- Advanced analytics
- Gamification (daily challenges, streaks)

---

## Open Questions

1. Initial song count: Start with 500 or 1,000 songs?
2. Spotify playlists: Which playlists to import first?
3. Update frequency: Daily or weekly Spotify refreshes?
4. Explicit content: Default filter on or off?

---

**Document Version:** 2.0
**Last Updated:** 2025-10-30
**Status:** Active Development
