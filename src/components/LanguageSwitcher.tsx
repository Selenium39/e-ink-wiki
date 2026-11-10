"use client";

/**
 * 语言切换器。header 在 layout 里拿不到当前页面 slug，
 * 客户端用 usePathname 解析，再对照各语言 slug 清单算目标 URL：
 * 目标语言有同 slug 页面 → 对应文章；否则 → 该语言首页（静态导出下永不 404）。
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_NAME,
  localePrefix,
  type Locale,
} from "@/lib/i18n";

export default function LanguageSwitcher({
  currentLang,
  slugMap,
}: {
  currentLang: Locale;
  slugMap: Record<Locale, string[]>;
}) {
  const pathname = usePathname() ?? "/";

  // 解析当前 slug：去掉语言前缀与 /wiki/ 段（trailingSlash 形态）
  let rest = pathname;
  for (const locale of LOCALES) {
    const prefix = localePrefix(locale);
    if (prefix && (rest === prefix || rest.startsWith(`${prefix}/`))) {
      rest = rest.slice(prefix.length);
      break;
    }
  }
  const isWikiRoute = rest.startsWith("/wiki/");
  const slug = isWikiRoute
    ? rest.replace(/^\/wiki\//, "").replace(/\/$/, "")
    : "";

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-0.5 dark:border-neutral-800"
      role="group"
      aria-label="Language"
    >
      <span className="text-neutral-500 dark:text-neutral-400">
        {LOCALE_NAME[currentLang]}
      </span>
      {LOCALES.filter((l) => l !== currentLang).map((target) => {
        const hasArticle = isWikiRoute && slugMap[target].includes(slug);
        return (
          <Link
            key={target}
            href={
              hasArticle
                ? `${localePrefix(target)}/wiki/${slug}/`
                : `${localePrefix(target)}/`
            }
            hrefLang={target}
            className="text-neutral-600 underline decoration-dotted underline-offset-2 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {LOCALE_NAME[target]}
          </Link>
        );
      })}
    </div>
  );
}
