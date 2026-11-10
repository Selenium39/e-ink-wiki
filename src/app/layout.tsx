import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "E-ink Wiki — 电纸书中文教程库",
    template: "%s — E-ink Wiki",
  },
  description:
    "电纸书中文教程库：Kindle / Kobo 越狱、固件、词典制作、阅读器配置等教程，译自 MobileRead Wiki 等社区。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              E-ink Wiki
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {/* 普通导航链接回主站（非商业 CTA，保持 wiki 非商业性质） */}
              <a
                href="https://e-ink.me"
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                E-ink 工具站
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        {/* 自托管 umami 统计（无 cookie，主站同款） */}
        <Script
          src="https://umami.selenium39.me/script.js"
          data-website-id="1d1fb9fa-b17e-4b56-8f34-bcf9b89143e4"
          strategy="afterInteractive"
        />
        <Analytics />
        <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          E-ink Wiki · 教程内容译自 MobileRead Wiki（CC BY-NC-SA 3.0）· 本站不设广告
        </footer>
      </body>
    </html>
  );
}
