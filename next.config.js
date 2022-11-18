/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

module.exports = {
  proxy: {
    "/api": "http://localhost:3001",
  },
};
