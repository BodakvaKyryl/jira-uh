import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
        port: "",
        pathname: "/v1/storage/buckets/**",
      },
    ],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 0,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Appwrite-Project",
            value: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
          },
          {
            key: "X-Appwrite-Key",
            value: process.env.NEXT_PUBLIC_APPWRITE_API_KEY || "",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
