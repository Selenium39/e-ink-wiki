import Link from "next/link";
import Script from "next/script";
import { GithubMark } from "@/components/GithubMark";
import { LogoMark } from "@/components/LogoMark";
import Analytics from "@/components/Analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getAllPages } from "@/lib/content";
import {
  familyHref,
  LOCALES,
  localePrefix,
  SITE_NAME,
  ui,
  type Locale,
} from "@/lib/i18n";

const footerLinkCls =
  "underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200";

/**
 * 全站骨架：header（品牌 / Inkme / GitHub / 语言切换器）+ main + footer + 统计。
 * 三种语言各有一个 root layout（<html lang> 不同），共用本组件。
 * 页脚有一行家族链接（Inkme / News / Games / Nav / Wiki）；
 * header 的 Inkme 链接与页脚第一项同一地址。
 */
export default function SiteShell({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  const t = ui[lang];
  const familyLinks = [
    { href: familyHref("inkme"), label: t.familyInkme },
    { href: familyHref("news"), label: t.familyNews },
    { href: familyHref("games"), label: t.familyGames },
    { href: familyHref("nav"), label: t.familyNavLink },
    { href: familyHref("wiki"), label: t.familyWiki },
  ];
  const slugMap = Object.fromEntries(
    LOCALES.map((l) => [l, getAllPages(l).map((p) => p.slug)]),
  ) as Record<Locale, string[]>;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <Link
            href={`${localePrefix(lang)}/`}
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <LogoMark className="size-7" />
            {SITE_NAME}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {/* 普通导航链接回主站（非商业 CTA，保持 wiki 非商业性质） */}
            <a
              href={familyHref("inkme")}
              className="hidden text-neutral-600 hover:text-neutral-900 sm:block dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {t.familyInkme}
            </a>
            <a
              href="https://github.com/Selenium39/e-ink-wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              <GithubMark className="size-4" />
              <span className="hidden sm:inline">{t.navGitHub}</span>
            </a>
            <LanguageSwitcher currentLang={lang} slugMap={slugMap} />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <nav aria-label={t.familyNav} className="mb-2">
          {familyLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 && " · "}
              <a href={link.href} className={footerLinkCls}>
                {link.label}
              </a>
            </span>
          ))}
        </nav>
        {SITE_NAME} · {t.footerLicense} · {t.footerNoAds} ·{" "}
        <a
          href="https://github.com/Selenium39/e-ink-wiki"
          target="_blank"
          rel="noopener noreferrer"
          className={footerLinkCls}
        >
          {t.footerSource}
        </a>
      </footer>
      {/* 自托管 umami 统计（无 cookie，主站同款） */}
      <Script
        src="https://umami.selenium39.me/script.js"
        data-website-id="1d1fb9fa-b17e-4b56-8f34-bcf9b89143e4"
        strategy="afterInteractive"
      />
      <Analytics />
    </>
  );
}
