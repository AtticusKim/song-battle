import type { Metadata } from 'next'
import { Press_Start_2P, Orbitron, Space_Mono } from 'next/font/google'
import './globals.css'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-arcade',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vote for Your Favorite Song!',
  description: 'Vote on head-to-head music battles and shape the global rankings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${orbitron.variable} ${spaceMono.variable}`}>
      <body>
        <div className="content-layer">
          {children}
        </div>
      </body>
    </html>
  )
}
