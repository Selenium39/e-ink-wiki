import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出：产物在 out/，部署为纯静态站（参考 iloveepub）
  // ⚠️ output: "export" 下 headers()/redirects()/rewrites() 会静默失效
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  // nginx 目录形态友好：/wiki/kindle/xxx/ 命中目录 index.html
  trailingSlash: true,
};

export default nextConfig;
