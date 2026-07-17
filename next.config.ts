import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Readable stack traces in production for debugging
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      // Vercel Blob — persisted dish images
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
