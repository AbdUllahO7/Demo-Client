import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Your original working settings
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 🚀 KEEP YOUR WORKING IMAGE CONFIG (this was working!)
  images: {
    unoptimized: true, // Keep this - it was working!
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 🚀 ADD: Safe performance optimizations that won't break images
  swcMinify: true, // Use SWC for faster builds
  
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // 🚀 ADD: Bundle optimization without touching images
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // 🚀 Split large bundles for better performance
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // 🚀 Separate Framer Motion (your 3,967ms issue)
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              chunks: 'all',
              priority: 30,
              enforce: true,
            },
            // 🚀 React libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react-vendor',
              chunks: 'all',
              priority: 25,
              enforce: true,
            },
            // 🚀 UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui-vendor',
              chunks: 'all',
              priority: 20,
              enforce: true,
            },
            // 🚀 Everything else
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },

  // 🚀 ADD: Enable compression
  compress: true,
  poweredByHeader: false,

  // 🚀 ADD: Cache static assets
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;