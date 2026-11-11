import type { Metadata, Viewport } from "next";
import { getPageBySlug } from "@/lib/content";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  localePrefix,
  type Locale,
} from "@/lib/i18n";

/** 正式域名。静态导出没有请求头，canonical / OG / sitemap 都写死在这里。 */
export const SITE_URL = "https://wiki.e-ink.me";

const DESCRIPTION: Record<Locale, string> = {
  en: "E-book wiki for Kindle, Kobo, and BOOX: jailbreaks and setup, EPUB, MOBI, and DRM, dictionaries, and KOReader. English pages are updated adaptations of MobileRead Wiki, plus original guides.",
  zh: "电子书 Wiki：Kindle / Kobo / BOOX 阅读器越狱与配置、EPUB / MOBI / DRM 格式详解、词典制作、KOReader 等阅读软件教程，精选翻译 MobileRead Wiki 并收录本站原创。",
  es: "Wiki de libros electrónicos: jailbreak y configuración de lectores Kindle / Kobo / BOOX, guías de formatos EPUB / MOBI / DRM, creación de diccionarios y software de lectura. Traducciones seleccionadas de MobileRead Wiki y artículos originales.",
};

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
  es: "es_ES",
};

const OG_ALT: Record<Locale, string> = {
  en: "E-ink Wiki, an e-book knowledge base",
  zh: "E-ink Wiki 电子书知识库",
  es: "E-ink Wiki, una base de conocimientos sobre libros electrónicos",
};

export const siteViewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/** 页面路径，带结尾斜线。首页是 / 或 /zh/。 */
export function pagePath(lang: Locale, slug?: string): string {
  const prefix = localePrefix(lang);
  if (!slug) return `${prefix}/`;
  return `${prefix}/wiki/${slug}/`;
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).href;
}

function languagesFor(slug?: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const lang of LOCALES) {
    if (slug && !getPageBySlug(lang, slug)) continue;
    languages[HTML_LANG[lang]] = pagePath(lang, slug);
  }
  const xDefault =
    !slug || getPageBySlug(DEFAULT_LOCALE, slug)
      ? pagePath(DEFAULT_LOCALE, slug)
      : pagePath(
          LOCALES.find((lang) => !slug || getPageBySlug(lang, slug)) ??
            DEFAULT_LOCALE,
          slug,
        );
  languages["x-default"] = xDefault;
  return languages;
}

/** canonical + hreflang。没有该语言正文的，不放进 alternates。 */
export function languageAlternates(
  lang: Locale,
  slug?: string,
): Metadata["alternates"] {
  return {
    canonical: pagePath(lang, slug),
    languages: languagesFor(slug),
  };
}

const ogImage = (lang: Locale) => [
  {
    url: "/og.png",
    width: 1200,
    height: 630,
    alt: OG_ALT[lang],
  },
];

/**
 * 子页如果只写 openGraph.url，Next 会把 layout 上的 images / siteName 盖掉。
 * 每页都带全套字段。
 */
export function openGraphFor(
  lang: Locale,
  pathname: string,
  type: "website" | "article",
): NonNullable<Metadata["openGraph"]> {
  return {
    type,
    siteName: "E-ink Wiki",
    url: pathname,
    locale: OG_LOCALE[lang],
    alternateLocale: LOCALES.filter((item) => item !== lang).map(
      (item) => OG_LOCALE[item],
    ),
    images: ogImage(lang),
  };
}

/** 三个 root layout 共用的站点级 metadata。不在这里写 canonical，避免子页继承首页地址。 */
export function rootMetadata(lang: Locale): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default:
        lang === "zh"
          ? "E-ink Wiki — 电子书 Wiki"
          : lang === "es"
            ? "E-ink Wiki — Wiki de libros electrónicos"
            : "E-ink Wiki — E-book Wiki",
      template: "%s — E-ink Wiki",
    },
    description: DESCRIPTION[lang],
    applicationName: "E-ink Wiki",
    authors: [{ name: "E-ink Wiki", url: SITE_URL }],
    creator: "E-ink Wiki",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: openGraphFor(lang, pagePath(lang), "website"),
    twitter: {
      card: "summary_large_image",
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function homeMetadata(lang: Locale): Metadata {
  return {
    alternates: languageAlternates(lang),
    openGraph: openGraphFor(lang, pagePath(lang), "website"),
  };
}

export function homeJsonLd(lang: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "E-ink Wiki",
        url: absoluteUrl(pagePath(lang)),
        description: DESCRIPTION[lang],
        inLanguage: LOCALES.map((item) => HTML_LANG[item]),
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "E-ink Wiki",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/icon-512.png"),
        },
        sameAs: ["https://github.com/Selenium39/e-ink-wiki"],
      },
    ],
  };
}

/** sitemap 用的绝对 hreflang 表 */
export function absoluteLanguages(slug?: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(languagesFor(slug)).map(([lang, pathname]) => [
      lang,
      absoluteUrl(pathname),
    ]),
  );
}

export { DESCRIPTION, OG_LOCALE };
