import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "standalone", // packages app for Docker
};

export default nextConfig;
