import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Don't bundle these on the server — use native Node.js require instead.
  // This prevents expensive re-compilation on every hot reload.
  serverExternalPackages: ['groq-sdk'],
};

export default nextConfig;
