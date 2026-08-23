import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@repo/db",
    "prisma",
    "bullmq",
    "ioredis",
    "@repo/queue",
  ],
};

export default nextConfig;
