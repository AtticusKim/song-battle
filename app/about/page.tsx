import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-arcade text-3xl sm:text-4xl md:text-5xl text-neon-purple text-glow-purple mb-4">
              ABOUT
            </h1>
            <p className="font-space text-sm sm:text-base text-dimmed-gray">
              Song Battle Leaderboard
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* What is Song Battle */}
            <section className="bg-arcade-card border-arcade rounded-lg p-6">
              <h2 className="font-space text-xl sm:text-2xl text-cyan-glow text-glow-cyan mb-4">
                What is Song Battle?
              </h2>
              <p className="font-space text-sm sm:text-base text-dimmed-gray leading-relaxed mb-4">
                Song Battle is a web-based platform where users vote on head-to-head song matchups,
                creating a dynamic global leaderboard powered by ELO ratings. Users are presented with
                two songs at a time and choose their preference, with each vote affecting the songs'
                positions on a real-time global ranking.
              </p>
              <p className="font-space text-sm sm:text-base text-dimmed-gray leading-relaxed">
                Unlike traditional music rankings based on streams or sales, Song Battle creates a
                crowd-sourced, mathematically sound ranking based on direct comparative preferences
                from music enthusiasts like you.
              </p>
            </section>

            {/* How ELO Works */}
            <section className="bg-arcade-card border-arcade rounded-lg p-6">
              <h2 className="font-space text-xl sm:text-2xl text-electric-pink text-glow-pink mb-4">
                How ELO Rating Works
              </h2>
              <p className="font-space text-sm sm:text-base text-dimmed-gray leading-relaxed mb-4">
                The ELO rating system is a mathematical method originally designed for chess rankings.
                We've adapted it for music battles to create fair and meaningful rankings.
              </p>
              <div className="space-y-3 font-space text-sm text-dimmed-gray">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-glow text-glow-cyan">•</span>
                  <p><strong className="text-star-white">Initial Rating:</strong> All songs start at 1500 ELO</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-glow text-glow-cyan">•</span>
                  <p><strong className="text-star-white">Rating Changes:</strong> When a song wins, it gains ELO points; when it loses, it loses points</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-glow text-glow-cyan">•</span>
                  <p><strong className="text-star-white">Expected vs. Actual:</strong> The change depends on the expected outcome. Beating a higher-rated song gains more points than beating a lower-rated one</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-glow text-glow-cyan">•</span>
                  <p><strong className="text-star-white">K-Factor:</strong> We use a K-factor of 32, which determines how much ratings can change per battle</p>
                </div>
              </div>
            </section>

            {/* How to Use */}
            <section className="bg-arcade-card border-arcade rounded-lg p-6">
              <h2 className="font-space text-xl sm:text-2xl text-neon-green text-glow-green mb-4">
                How to Use Song Battle
              </h2>
              <div className="space-y-4 font-space text-sm sm:text-base text-dimmed-gray">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-neon-purple/20 border-2 border-neon-purple rounded flex items-center justify-center font-arcade text-xs text-neon-purple">
                    1
                  </div>
                  <div>
                    <h3 className="text-star-white font-semibold mb-1">Start a Battle</h3>
                    <p>Click "Start Battle" to be presented with two random songs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-glow/20 border-2 border-cyan-glow rounded flex items-center justify-center font-arcade text-xs text-cyan-glow">
                    2
                  </div>
                  <div>
                    <h3 className="text-star-white font-semibold mb-1">Listen & Compare</h3>
                    <p>Play the 30-second preview for each song (optional)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-electric-pink/20 border-2 border-electric-pink rounded flex items-center justify-center font-arcade text-xs text-electric-pink">
                    3
                  </div>
                  <div>
                    <h3 className="text-star-white font-semibold mb-1">Vote for Your Favorite</h3>
                    <p>Click the "VOTE" button under your preferred song</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-neon-green/20 border-2 border-neon-green rounded flex items-center justify-center font-arcade text-xs text-neon-green">
                    4
                  </div>
                  <div>
                    <h3 className="text-star-white font-semibold mb-1">Watch the Rankings Update</h3>
                    <p>See the ELO ratings change in real-time after each vote</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technology */}
            <section className="bg-arcade-card border-arcade rounded-lg p-6">
              <h2 className="font-space text-xl sm:text-2xl text-neon-purple text-glow-purple mb-4">
                Technology
              </h2>
              <p className="font-space text-sm sm:text-base text-dimmed-gray leading-relaxed mb-4">
                Song Battle is built with modern web technologies:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 font-space text-sm text-dimmed-gray">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-glow">▸</span>
                    <span><strong className="text-star-white">Next.js</strong> - React framework</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-glow">▸</span>
                    <span><strong className="text-star-white">TypeScript</strong> - Type safety</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-glow">▸</span>
                    <span><strong className="text-star-white">Tailwind CSS</strong> - Styling</span>
                  </div>
                </div>
                <div className="space-y-2 font-space text-sm text-dimmed-gray">
                  <div className="flex items-center gap-2">
                    <span className="text-electric-pink">▸</span>
                    <span><strong className="text-star-white">Framer Motion</strong> - Animations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-electric-pink">▸</span>
                    <span><strong className="text-star-white">Spotify API</strong> - Song data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-electric-pink">▸</span>
                    <span><strong className="text-star-white">ELO Algorithm</strong> - Rankings</span>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link
                href="/battle"
                className="inline-block btn-arcade text-sm px-8 py-4 rounded-lg"
              >
                START BATTLING &gt;&gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
