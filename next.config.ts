import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    BASE_API_URL: 'http://localhost:8082/api/'
  }
};

export default nextConfig;
