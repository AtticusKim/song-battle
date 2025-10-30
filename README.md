# 🎵 Song Battle - ELO Music Ranking Platform

A retro arcade-themed web platform where users vote on head-to-head song matchups, creating a dynamic global leaderboard powered by ELO ratings.

![Song Battle](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### MVP Features (Current)
- **🎮 Retro Arcade Theme** - 80s space arcade aesthetic with neon colors and CRT effects
- **⚔️ Head-to-Head Battles** - Vote on two songs at a time
- **📊 ELO Rating System** - Mathematically sound ranking algorithm
- **🏆 Global Leaderboard** - Real-time rankings based on battle results
- **🎵 Real Spotify Data** - Fetches Top 500 songs from Spotify charts with real album art
- **🔄 Weekly Updates** - Songs refresh automatically from Spotify every 7 days
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **🎨 Smooth Animations** - Powered by Framer Motion

### Upcoming Features
- Backend API with PostgreSQL database
- User accounts and voting history
- Genre-specific leaderboards
- Song detail pages
- Social sharing

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd song_ranking
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The app works out of the box with 500 mock songs! To use real Spotify data:

5. Set up Spotify API (see [SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md) for detailed guide):
```bash
# Copy the example file
cp .env.local.example .env.local

# Add your Spotify credentials to .env.local
# Get credentials from: https://developer.spotify.com/dashboard
```

6. Fetch real songs from Spotify:
```bash
npm run refresh-songs
```

Your songs will now come from Spotify's Top 500 charts and update weekly!

## 🎮 How to Use

1. **Start a Battle** - Click "Start Battle" from the homepage
2. **Listen & Compare** - Play the 30-second preview for each song (optional)
3. **Vote** - Click the "VOTE" button under your preferred song
4. **Watch Rankings Update** - See ELO ratings change in real-time
5. **View Leaderboard** - Check out the top-ranked songs

## 🏗️ Project Structure

```
song_ranking/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── battle/            # Battle page
│   ├── leaderboard/       # Leaderboard page
│   ├── globals.css        # Global styles with arcade theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── AudioPreview.tsx   # Audio player component
│   ├── BattleCard.tsx     # Individual battle card
│   ├── BattleScreen.tsx   # Battle flow manager
│   ├── Navigation.tsx     # Header navigation
│   └── RankBadge.tsx      # ELO/Rank display badge
├── lib/                   # Utility functions
│   ├── elo.ts            # ELO rating calculations
│   └── mockData.ts       # Mock song data for development
├── types/                 # TypeScript type definitions
│   └── index.ts          # App-wide types
├── tailwind.config.ts     # Tailwind configuration with arcade theme
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## 🎨 Design System

### Color Palette

The app uses a retro space arcade theme with neon colors:

- **Deep Space Black** (`#0a0a0f`) - Main background
- **Neon Purple** (`#b026ff`) - Primary accent
- **Electric Pink** (`#ff00ff`) - Secondary accent
- **Cyan Glow** (`#00ffff`) - Tertiary accent
- **Neon Green** (`#39ff14`) - Positive changes
- **Hot Pink** (`#ff006e`) - Negative changes

### Typography

- **Press Start 2P** - Pixel/arcade style headers
- **Orbitron** - Futuristic body text
- **Space Mono** - Monospace for stats

### Visual Effects

- CRT scanline overlay
- Neon glow effects
- Starfield background
- Grid perspective effects
- Smooth animations

## 🧮 ELO Rating System

The platform uses the standard ELO rating formula:

- **Initial Rating:** 1500 for all songs
- **K-Factor:** 32 (determines rating volatility)
- **Formula:**
  - Expected Score = 1 / (1 + 10^((Rating_B - Rating_A) / 400))
  - New Rating = Old Rating + K × (Actual Score - Expected Score)

**Key Points:**
- Beating a higher-rated song gains more points
- Losing to a lower-rated song loses more points
- The system naturally balances over time

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **CountUp.js** - Number animations

### Future Backend (Planned)
- **Node.js/Express** - API server
- **PostgreSQL** - Primary database
- **Redis** - Caching layer
- **Spotify API** - Song data and previews

## 📝 API Routes

### Implemented
```
POST /api/songs/refresh         - Fetch Top 500 songs from Spotify
GET  /api/songs/refresh         - Check last refresh time and if refresh is needed
```

### To Be Implemented
```
GET  /api/songs/battle          - Get random song pair
POST /api/songs/vote            - Submit vote
GET  /api/leaderboard           - Get ranked songs
GET  /api/songs/:id             - Get song details
GET  /api/stats                 - Get platform statistics
```

## 🗄️ Database Schema (Planned)

### Songs Table
- id, spotify_id, title, artist, album
- elo_rating, total_battles, wins, losses
- preview_url, album_art_url
- genre, release_date, spotify_popularity

### Votes Table
- id, winner_song_id, loser_song_id
- user_id (optional), ip_address, created_at

## 🔧 Configuration

### Tailwind Custom Theme

The project includes a custom Tailwind configuration with:
- Custom color palette
- Arcade font stack
- Neon glow shadows
- Custom animations (neon-pulse, victory-flash, float)

### Environment Variables

See `.env.example` for all available configuration options.

## 📦 Scripts

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm start              # Start production server
npm run lint           # Run ESLint
npm run refresh-songs  # Fetch latest Top 500 from Spotify (requires dev server running)
```

## 🎯 Roadmap

### Phase 1: MVP (Completed ✅)
- ✅ Retro arcade UI theme
- ✅ Battle interface with animations
- ✅ ELO rating system
- ✅ Leaderboard
- ✅ Mock data for development
- ✅ Spotify API integration
- ✅ Real Top 500 songs with album art
- ✅ Weekly song refresh system

### Phase 2: Backend Integration (Next)
- [ ] PostgreSQL database setup
- [ ] REST API implementation
- [ ] Vote persistence
- [ ] User analytics

### Phase 3: Enhanced Features
- [ ] User accounts and authentication
- [ ] Voting history
- [ ] Song detail pages
- [ ] Genre filters
- [ ] Search functionality
- [ ] Social sharing

### Phase 4: Advanced Features
- [ ] Genre-specific leaderboards
- [ ] Daily challenges
- [ ] Achievement system
- [ ] Mobile app
- [ ] Sound effects
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- ELO rating system inspired by chess rankings
- Retro arcade design inspired by 80s space games (Galaga, Tron)
- Music data powered by Spotify API
- Built with modern web technologies

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ and lots of neon glow**
