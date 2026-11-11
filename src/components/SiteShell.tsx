import Link from "next/link";
import Script from "next/script";
import { GithubMark } from "@/components/GithubMark";
import { LogoMark } from "@/components/LogoMark";
import Analytics from "@/components/Analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getAllPages } from "@/lib/content";
import { familyHref, LOCALES, localePrefix, ui, type Locale } from "@/lib/i18n";

/**
 * 全站骨架：header（品牌 / 主站 / GitHub / 语言切换器）+ main + footer + 统计。
 * 三种语言各有一个 root layout（<html lang> 不同），共用本组件。
 * 页脚有一行家族链接（工具站 / 资讯 / 游戏）；header 的工具站链接与之同一地址。
 */

const footerLinkCls =
  "underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200";

export default function SiteShell({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  const t = ui[lang];
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
            E-ink Wiki
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {/* 普通导航链接回主站（非商业 CTA，保持 wiki 非商业性质） */}
            <a
              href={familyHref("tools", lang)}
              className="hidden text-neutral-600 hover:text-neutral-900 sm:block dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {t.navMainSite}
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
          <a href={familyHref("tools", lang)} className={footerLinkCls}>
            {t.navMainSite}
          </a>
          {" · "}
          <a href={familyHref("news", lang)} className={footerLinkCls}>
            {t.familyNews}
          </a>
          {" · "}
          <a href={familyHref("games", lang)} className={footerLinkCls}>
            {t.familyGames}
          </a>
        </nav>
        E-ink Wiki · {t.footerLicense} · {t.footerNoAds} ·{" "}
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
