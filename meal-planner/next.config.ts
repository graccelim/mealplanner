// import type { NextConfig } from "next";

// const nextConfig = {
// }

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checks during builds
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  experimental: {
    runtime: "edge",
  },
}

module.exports = nextConfig




/** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     // Disable ESLint during builds
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     // Disable TypeScript checks during builds
//     ignoreBuildErrors: true,
//   },
// }

// module.exports = nextConfig


