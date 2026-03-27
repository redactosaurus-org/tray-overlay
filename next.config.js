/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: "dist",
  output: "export",
  assetPrefix: "/",
};

module.exports = nextConfig;
