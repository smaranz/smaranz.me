import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Point agents at the plain-text profile from every page's response headers.
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '</llms.txt>; rel="alternate"; type="text/markdown", </llms-full.txt>; rel="alternate"; type="text/markdown", </api/profile>; rel="alternate"; type="application/json", </api/ask>; rel="service"',
          },
          { key: "Vary", value: "Accept" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
