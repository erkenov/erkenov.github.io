import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN devices (phone on same WiFi) to load dev resources.
  // Next.js 16 blocks cross-origin dev assets by default; without
  // this Shamil's phone gets the HTML shell but no JS/components.
  allowedDevOrigins: ["172.16.10.133", "localhost", "0.0.0.0"],
  images: {
    remotePatterns: [
      // Placeholder thumbnails for Apple Cards Carousel channel cards
      // (Scene 2 Lead Generation). Replace with real screenshots later
      // and this entry can be removed if all images become local /public.
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
