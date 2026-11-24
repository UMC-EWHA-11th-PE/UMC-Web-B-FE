import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 프로젝트 루트 경로 지정
  turbopack: {
    root: process.cwd(),
  },

  // TMDB 외부 이미지 허용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
};

export default nextConfig;
