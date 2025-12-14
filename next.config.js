/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
  },

  experimental: {
    esmExternals: "loose",
  },

  transpilePackages: [
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tooltip",
    "rc-trigger",
    "rc-align",
    "rc-motion",
    "rc-resize-observer",
  ],
};

module.exports = nextConfig;
