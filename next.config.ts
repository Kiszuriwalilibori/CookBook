// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
                pathname: "/**",
            },
        ],
        formats: ["image/webp", "image/avif"], // Added for optimized image formats
    },
    compress: true, // Enabled compression (gzip/brotli)
    poweredByHeader: false, // Removed X-Powered-By header for security/performance
};

export default nextConfig;
