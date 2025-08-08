const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },

  basePath: "/dashboard",
  output: process.env.NEXT_STANDALONE !== "false" ? "standalone" : undefined,
  pageExtensions: ["page.tsx", "page.ts"],
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["isomorphic-lib", "backend-lib"],
  eslint: {
    // already performed in CI, redundant
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  images: {
    domains: ["*"],
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh',
  },
  async headers() {
    return [
      {
        // Apply CORS headers to /dashboard/public path
        source: "/public/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/journeys",
        permanent: false,
      },
      {
        source: "/",
        destination: "/dashboard",
        basePath: false,
        permanent: false,
      },
    ];
  },
  experimental: {
    instrumentationHook: true,
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};

console.log("nextConfig", nextConfig);
module.exports = nextConfig;
