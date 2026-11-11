/**
 * 站点语言定义与 UI 短文案字典。
 *
 * 结构约定（2026-11-10 三语 i18n 拍板）：
 * - 默认语言 **en** 无 URL 前缀：/ 与 /wiki/<slug>/
 * - 其他语言带前缀：/zh/... /es/...
 * - 内容目录按语言分仓：content/<lang>/<分类>/<页面>.md，同 slug 跨语言对齐
 * - 长文案（首页导语、许可页脚）就近在使用组件里按 lang 分支，
 *   这里只放短标签，避免碎片段字典
 */

export const LOCALES = ["en", "zh", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** <html lang> 值 */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  zh: "zh-Hans",
  es: "es",
};

/** 语言切换器里各语言的自称 */
export const LOCALE_NAME: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
};

/** 语言 URL 前缀：默认语言为空串，其余 "/<lang>" */
export function localePrefix(lang: Locale): string {
  return lang === DEFAULT_LOCALE ? "" : `/${lang}`;
}

/** 校验任意字符串为受支持语言 */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * 家族站点（不含 wiki 自身）。各站语言路径形状不同，不能套本站 localePrefix：
 * - e-ink.me：/en /zh /es，无尾斜杠（带斜杠会被 308 剥掉）
 * - news.e-ink.me：/en /zh，无尾斜杠；根路径是错误页，canonical 在 /en。没有西语，es 落到英文版
 * - games.e-ink.me：/en/ /zh/ /es/，保留尾斜杠
 * 不带 UTM，也不加 nofollow。
 */
export const familySites = {
  tools: {
    en: "https://e-ink.me/en",
    zh: "https://e-ink.me/zh",
    es: "https://e-ink.me/es",
  },
  news: {
    en: "https://news.e-ink.me/en",
    zh: "https://news.e-ink.me/zh",
    es: "https://news.e-ink.me/en",
  },
  games: {
    en: "https://games.e-ink.me/en/",
    zh: "https://games.e-ink.me/zh/",
    es: "https://games.e-ink.me/es/",
  },
} as const;

export type FamilySite = keyof typeof familySites;

export function familyHref(site: FamilySite, lang: Locale): string {
  return familySites[site][lang];
}

/** 短 UI 标签（涉及链接与长句的文案在使用组件内按 lang 分支） */
export const ui = {
  en: {
    navMainSite: "E-ink Tools",
    familyNews: "E-ink News",
    familyGames: "E-ink Games",
    familyNav: "E-ink family",
    navGitHub: "GitHub",
    sidebarNav: "Contents",
    fromMobileRead: "From MobileRead Wiki (original)",
    readOriginal: "Read original →",
    availableIn: (lang: string) => `Full version in ${lang}`,
    categories: "Browse by topic",
    footerLicense:
      "Content under CC BY-NC-SA 3.0 (updated adaptations of MobileRead Wiki and original articles)",
    footerNoAds: "No ads",
    footerSource: "Source code",
    notFoundTitle: "Page not found",
    notFoundText: "This page does not exist. It may be available in another language.",
    goHome: "Go to homepage",
  },
  zh: {
    navMainSite: "E-ink 工具站",
    familyNews: "E-ink 资讯",
    familyGames: "E-ink 游戏",
    familyNav: "E-ink 家族站点",
    navGitHub: "GitHub",
    sidebarNav: "目录",
    fromMobileRead: "译自 MobileRead Wiki（原文）",
    readOriginal: "读原文 →",
    availableIn: (lang: string) => `${lang}完整版`,
    categories: "分类目录",
    footerLicense:
      "内容以 CC BY-NC-SA 3.0 开放（精选译自 MobileRead Wiki 及本站原创）",
    footerNoAds: "本站不设广告",
    footerSource: "网站开源",
    notFoundTitle: "页面不存在",
    notFoundText: "这个页面不存在，可能提供了其他语言版本。",
    goHome: "返回首页",
  },
  es: {
    navMainSite: "Herramientas E-ink",
    familyNews: "Noticias E-ink",
    familyGames: "Juegos E-ink",
    familyNav: "Familia E-ink",
    navGitHub: "GitHub",
    sidebarNav: "Índice",
    fromMobileRead: "De MobileRead Wiki (original)",
    readOriginal: "Leer original →",
    availableIn: (lang: string) => `Versión completa en ${lang}`,
    categories: "Explorar por tema",
    footerLicense:
      "Contenido bajo CC BY-NC-SA 3.0 (traducciones seleccionadas de MobileRead Wiki y artículos originales)",
    footerNoAds: "Sin anuncios",
    footerSource: "Código fuente",
    notFoundTitle: "Página no encontrada",
    notFoundText: "Esta página no existe; puede estar disponible en otro idioma.",
    goHome: "Ir al inicio",
  },
} as const;

export type UITexts = (typeof ui)[Locale];
