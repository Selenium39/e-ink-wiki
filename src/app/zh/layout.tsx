import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { HTML_LANG } from "@/lib/i18n";
import "@/app/globals.css";

/** 中文：URL 前缀 /zh/ */
export const metadata: Metadata = {
  title: {
    default: "E-ink Wiki — 电子书 Wiki",
    template: "%s — E-ink Wiki",
  },
  description:
    "电子书 Wiki：Kindle / Kobo / BOOX 阅读器越狱与配置、EPUB / MOBI / DRM 格式详解、词典制作、KOReader 等阅读软件教程，精选翻译 MobileRead Wiki 并收录本站原创。",
};

export default function ZhLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={HTML_LANG.zh}>
      <body className="min-h-screen antialiased">
        <SiteShell lang="zh">{children}</SiteShell>
      </body>
    </html>
  );
}
