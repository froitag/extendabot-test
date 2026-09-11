import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.web.extendabot.brainchimps.com",
        "*.proxy.daytona.brainchimps.com",
      ],
    },
  },
};

export default nextConfig;
