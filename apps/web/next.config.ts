import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@repo/db", "prisma"],
};

export default nextConfig;
