import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { HTML_LANG } from "@/lib/i18n";
import { rootMetadata, siteViewport } from "@/lib/seo";
import "@/app/globals.css";

/** 默认语言 en：URL 无前缀（/ 与 /wiki/...） */
export const metadata: Metadata = rootMetadata("en");
export const viewport = siteViewport;

export default function EnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={HTML_LANG.en}>
      <body className="min-h-screen antialiased">
        <SiteShell lang="en">{children}</SiteShell>
      </body>
    </html>
  );
}
