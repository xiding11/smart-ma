const path = require("path");

// Set environment variables to fix SSR build issues
process.env.NEXT_PRIVATE_PREBUILD_PAGES = process.env.NEXT_PRIVATE_PREBUILD_PAGES || "false";
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },

  basePath: "/dashboard",
  output: process.env.NEXT_STANDALONE !== "false" ? "standalone" : undefined,
  pageExtensions: ["page.tsx", "page.ts"],
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["isomorphic-lib"],
  eslint: {
    // already performed in CI, redundant
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  images: {
    domains: ["*"],
  },
  // i18n: {
  //   locales: ['en', 'zh'],
  //   defaultLocale: 'zh',
  // },
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallbacks for Node.js modules that don't work in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        http2: false,
        child_process: false,
        dns: false,
        async_hooks: false,
        dgram: false,
        stream: false,
        util: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
        readline: false,
        worker_threads: false,
      };
      
      // Add externals to completely exclude backend-lib server modules from client bundle
      config.externals = config.externals || [];
      config.externals.push(function({ context, request }, callback) {
        // Exclude all backend-lib modules from client bundle except types
        if (request && request.startsWith('backend-lib/src/') && 
            !request.includes('/types') && 
            !request.includes('/constants')) {
          return callback(null, 'commonjs ' + request);
        }
        return callback();
      });
    }
    return config;
  },
};

console.log("nextConfig", nextConfig);
module.exports = nextConfig;
