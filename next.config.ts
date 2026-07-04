import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/categories/europe",
        destination: "/categories/international",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
