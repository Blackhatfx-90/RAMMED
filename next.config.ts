import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for better Netlify compatibility
  trailingSlash: true,
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
  },
};

export default nextConfig;
