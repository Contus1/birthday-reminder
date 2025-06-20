import type { NextConfig } from "next";

const nextConfig: NextConfig = {
eslint: {
    // WARNING: this will ignore *all* lint errors at build-time
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
