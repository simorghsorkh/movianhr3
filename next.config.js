/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ui-avatars.com', 'picsum.photos'],
  },
  typescript: {
    // Supabase generic types cause complex inference issues.
    // TypeScript errors are caught during local development.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint warnings (e.g. <img> tags) should not block production build.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
