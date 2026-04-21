import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native Node addon. Telling Next to keep it external
  // prevents Turbopack / webpack from trying to bundle the .node binary.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
