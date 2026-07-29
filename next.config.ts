import type { NextConfig } from "next";

const nextConfig = {
  rewrites: async () => [
    {
      source: '/api/proxy/:path*',
      destination: 'http://localhost:8000/api/v1/:path*',
    },
  ],
};

