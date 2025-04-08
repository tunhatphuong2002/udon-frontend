import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',

  // Enable experimental features
  experimental: {
    // Support Turbopack for development
    turbo: {},
  },

  // Tell Next.js to use SWC even with a custom Babel config
  transpilePackages: ['next'],

  // Enable source maps for better debugging
  productionBrowserSourceMaps: true,
};

export default nextConfig;
