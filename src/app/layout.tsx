import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import "./globals.css";

/** GitHub mark（primer/octicons，MIT）——lucide 已移除品牌图标，内联使用 */
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: {
    default: "E-ink Wiki — 电子书 Wiki",
    template: "%s — E-ink Wiki",
  },
  description:
    "电子书 Wiki：Kindle / Kobo / BOOX 阅读器越狱与配置、EPUB / MOBI / DRM 格式详解、词典制作、KOReader 等阅读软件教程，精选翻译 MobileRead Wiki 并收录本站原创。",
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
              <a
                href="https://github.com/Selenium39/e-ink-wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <GithubMark className="size-4" />
                GitHub
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
          E-ink Wiki · 内容以 CC BY-NC-SA 3.0 开放（精选译自 MobileRead
          Wiki 及本站原创）· 本站不设广告 ·{" "}
          <a
            href="https://github.com/Selenium39/e-ink-wiki"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            网站开源
          </a>
        </footer>
      </body>
    </html>
  );
}
