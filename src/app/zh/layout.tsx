import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { HTML_LANG } from "@/lib/i18n";
import { rootMetadata, siteViewport } from "@/lib/seo";
import "@/app/globals.css";

/** 中文：URL 前缀 /zh/ */
export const metadata: Metadata = rootMetadata("zh");
export const viewport = siteViewport;

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
