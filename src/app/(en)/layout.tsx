import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { HTML_LANG } from "@/lib/i18n";
import "@/app/globals.css";

/** 默认语言 en：URL 无前缀（/ 与 /wiki/...） */
export const metadata: Metadata = {
  title: {
    default: "E-ink Wiki — E-book Wiki",
    template: "%s — E-ink Wiki",
  },
  description:
    "E-book wiki: jailbreak & configure Kindle / Kobo / BOOX readers, EPUB / MOBI / DRM format guides, dictionary making, and reading software — curated translations from MobileRead Wiki plus original articles.",
};

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
