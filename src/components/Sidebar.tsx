import Link from "next/link";
import {
  getCrossLanguageIndex,
  getSidebarSections,
  type CrossLanguageEntry,
} from "@/lib/content";
import { LOCALE_NAME, localePrefix, ui, type Locale } from "@/lib/i18n";

const SECTION_LABELS: Record<string, string> = {
  kindle: "Kindle",
  kobo: "Kobo",
};

/**
 * 侧边栏：本语言实际存在的页面为内链；其余篇目归入
 * "译自 MobileRead Wiki（原文）"外链卡片组（链原文，并给出已有完整版的语言），
 * 保证三语目录信息量一致而非各语言子集。
 */
export default function Sidebar({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const prefix = localePrefix(lang);
  const sections = getSidebarSections(lang);
  const localSlugs = new Set(sections.flatMap((s) => s.pages.map((p) => p.slug)));
  const externals = getCrossLanguageIndex().filter((e) => !localSlugs.has(e.slug));

  const otherLangsOf = (e: CrossLanguageEntry) =>
    (Object.keys(e.available) as Locale[])
      .filter((l) => l !== lang)
      .map((l) => LOCALE_NAME[l]);

  return (
    <nav aria-label={t.sidebarNav} className="w-full shrink-0 md:w-60">
      <div className="sticky top-16 space-y-6 text-sm">
        {sections.map((section) => (
          <div key={section.name}>
            <h3 className="mb-2 font-semibold text-neutral-500 dark:text-neutral-400">
              {SECTION_LABELS[section.name] ?? section.name}
            </h3>
            <ul className="space-y-1">
              {section.pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`${prefix}/wiki/${page.slug}/`}
                    className="block rounded px-2 py-1 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {externals.length > 0 && (
          <div>
            <h3 className="mb-2 font-semibold text-neutral-500 dark:text-neutral-400">
              {t.fromMobileRead}
            </h3>
            <ul className="space-y-1">
              {externals.map((entry) => (
                <li key={entry.slug} className="px-2 py-1">
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 underline decoration-dotted underline-offset-2 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    {entry.displayTitle}
                  </a>
                  <span className="ml-1 text-xs text-neutral-400">
                    {otherLangsOf(entry).length > 0 &&
                      `· ${otherLangsOf(entry).map((l) => t.availableIn(l)).join(" · ")}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
