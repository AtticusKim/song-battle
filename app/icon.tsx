import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <div
          style={{
            color: '#b026ff',
            fontSize: '10px',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Impact, fantasy, sans-serif',
            fontStyle: 'italic',
            letterSpacing: '0.3px',
            textShadow: '0.5px 0.5px 0px #ff00ff, -0.5px -0.5px 0px #00ffff',
            transform: 'skewY(-5deg) skewX(-3deg)',
          }}
        >
          SONG
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
