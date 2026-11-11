import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { HTML_LANG } from "@/lib/i18n";
import { rootMetadata, siteViewport } from "@/lib/seo";
import "@/app/globals.css";

/** 西语：URL 前缀 /es/ */
export const metadata: Metadata = rootMetadata("es");
export const viewport = siteViewport;

export default function EsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={HTML_LANG.es}>
      <body className="min-h-screen antialiased">
        <SiteShell lang="es">{children}</SiteShell>
      </body>
    </html>
  );
}
