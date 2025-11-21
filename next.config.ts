import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = 'dousel-immo';

const nextConfig: NextConfig = {
  // Configuration pour GitHub Pages (seulement si déployé via GitHub Actions)
  ...(isGitHubPages && {
    output: 'export',
    basePath: `/${repositoryName}`,
    assetPrefix: `/${repositoryName}/`,
    trailingSlash: true,
  }),
  images: {
    ...(isGitHubPages && { unoptimized: true }),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.mapbox.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "blyanhulvwpdfpezlaji.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
