"use client";

/**
 * umami 路由追踪：站内导航是 next/link 客户端路由（不整页加载），
 * script.js 的自动 pageview 只记首次进入，这里在 pathname 变化时补记。
 * track() 无参调用会自动带上当前 URL 与标题。
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    umami?: { track: (...args: unknown[]) => void };
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // script.js 异步加载，路由首次切换时可能尚未就绪，umami 不存在则跳过
    window.umami?.track();
  }, [pathname]);

  return null;
}
