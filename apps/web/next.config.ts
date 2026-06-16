import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lighthouse Best-Practices audit: include source maps for first-party
  // JavaScript in production. Cost: a few extra KiB per chunk for the
  // .map files. Benefit: devtools + the `valid-source-maps` audit pass.
  productionBrowserSourceMaps: true,
  images: {
    // Allow Next/Image to optimize Pexels-sourced images if the host
    // app ever swaps the local hero back to a Pexels URL. The theme
    // itself serves hero.jpg from /public/ for the Lighthouse pass.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
};

export default nextConfig;
