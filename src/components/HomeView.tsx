import Link from "next/link";
import {
  getCrossLanguageIndex,
  getSidebarSections,
  type CrossLanguageEntry,
} from "@/lib/content";
import { LOCALE_NAME, localePrefix, ui, type Locale } from "@/lib/i18n";

/** 首页：三语各自导语 + 分类目录（本语言内链 + 原文外链卡片） */
export default function HomeView({ lang }: { lang: Locale }) {
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
    <div className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <h1>{lang === "zh" ? "电子书 Wiki" : lang === "es" ? "Wiki de libros electrónicos" : "E-book Wiki"}</h1>

      {lang === "zh" && (
        <p>
          电子书知识库：阅读设备（Kindle / Kobo / BOOX）的越狱与配置、
          电子书格式（EPUB / MOBI / DRM）、词典制作、阅读软件等深度教程。
          内容双轨——精选译自{" "}
          <a href="https://wiki.mobileread.com/" target="_blank" rel="noopener noreferrer">
            MobileRead Wiki
          </a>{" "}
          等英文社区，并逐步收录本站原创（BOOX 专题、中文排版、中文词典制作等英文社区缺失的主题）。
        </p>
      )}
      {lang === "en" && (
        <p>
          A knowledge base for e-books: jailbreaking and configuring reading devices
          (Kindle / Kobo / BOOX), e-book formats (EPUB / MOBI / DRM), dictionary
          making, and reading software. The English articles are updated adaptations of{" "}
          <a href="https://wiki.mobileread.com/" target="_blank" rel="noopener noreferrer">
            MobileRead Wiki
          </a>
          : rewritten, with stale firmware limits called out, not a mirror of the
          original pages. Original pieces cover what that wiki does not (BOOX, and
          over time CJK typography and Chinese dictionaries).
        </p>
      )}
      {lang === "es" && (
        <p>
          Una base de conocimientos sobre libros electrónicos: jailbreak y
          configuración de lectores (Kindle / Kobo / BOOX), formatos de
          e-book (EPUB / MOBI / DRM), creación de diccionarios y software de
          lectura. Traducciones seleccionadas de{" "}
          <a href="https://wiki.mobileread.com/" target="_blank" rel="noopener noreferrer">
            MobileRead Wiki
          </a>{" "}
          y artículos originales sobre temas que faltan en la comunidad en inglés.
        </p>
      )}

      <p className="text-sm">
        {lang === "zh" && <>翻译内容署名原作者、原创内容署名作者，均以{" "}</>}
        {lang === "en" && <>Adaptations credit the original authors, original pieces their authors — all under{" "}</>}
        {lang === "es" && <>Las traducciones citan a sus autores originales y los originales a sus autores; todo bajo{" "}</>}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-NC-SA 3.0
        </a>
        {lang === "zh" && <> 许可开放；本站不设广告。</>}
        {lang === "en" && <>; no ads.</>}
        {lang === "es" && <>; sin anuncios.</>}
      </p>

      <h2>{t.categories}</h2>
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.name}
            className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <h3 className="mb-2 font-semibold">{section.name}</h3>
            <ul className="space-y-1 text-sm">
              {section.pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`${prefix}/wiki/${page.slug}/`}
                    className="text-neutral-600 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {externals.length > 0 && (
          <div className="rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
            <h3 className="mb-2 font-semibold">{t.fromMobileRead}</h3>
            <ul className="space-y-1 text-sm">
              {externals.map((entry) => (
                <li key={entry.slug}>
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 underline decoration-dotted underline-offset-2 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
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
    </div>
  );
}
