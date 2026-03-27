/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: "dist",
  output: "export", // static HTML export mode instead of server bundle
};

module.exports = nextConfig;
