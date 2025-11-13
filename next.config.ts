import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
};

export default withNextIntl(nextConfig);
