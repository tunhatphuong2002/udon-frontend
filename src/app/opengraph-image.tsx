import { ImageResponse } from 'next/og';

// Define image dimensions
export const size = {
  width: 1200,
  height: 630,
};

// Define content type
export const contentType = 'image/png';

// Route segment config
export const runtime = 'edge';

// OG Image generator function
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'white',
          background: 'linear-gradient(to bottom, #3182ce, #2c5282)',
          width: '100%',
          height: '100%',
          padding: 50,
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>Udon Frontend</div>
          <div style={{ fontSize: 40, fontWeight: 'normal', opacity: 0.8 }}>
            A modern web application
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
