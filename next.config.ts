import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
