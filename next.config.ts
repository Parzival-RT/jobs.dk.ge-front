import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "recruting.dkcapital.ge",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "v.dk.ge",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
