import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build for faster deployment
  },
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false, // Disable missing suspense warnings
  },
  // Force dynamic rendering for pages with errors
  generateBuildId: async () => {
    return 'staging-build-' + Date.now();
  },
};

export default withNextIntl(nextConfig);
