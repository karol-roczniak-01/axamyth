import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "mellow-squirrel-616.convex.cloud"
      }
    ]
  }
};

export default nextConfig;
