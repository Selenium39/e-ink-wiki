import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

/**
 * 内容管线：content/<lang>/<分类>/<页面>.md 即 wiki 页面（按语言分仓，
 * 同 slug 跨语言对齐；默认语言 en 无 URL 前缀，zh/es 带前缀）。
 *
 * frontmatter 契约（LicenseFooter 依赖），按 type 分两套：
 *
 * 翻译篇（type: "translated"，缺省值，向后兼容）：
 *   title            页面标题（目标语言）
 *   original_title   原文标题
 *   source_url       原文地址 https://wiki.mobileread.com/wiki/...
 *   original_author  原作者（CC BY 署名义务，必填）
 *   translated_at    翻译日期 YYYY-MM-DD
 *
 * 原创篇（type: "original"）：
 *   title            页面标题（目标语言）
 *   author           原创作者（必填——原创也要署名）
 *   原创篇不应出现 source_url（原创不是翻译，参考链接写进正文）
 *
 * 两种篇目通用：
 *   order            同目录内排序（可选）
 *   description      摘要（可选，首页/SEO 用）
 *
 * 校验失败时构建直接失败（不是警告）——翻译篇的 BY 署名与
 * “只碰 wiki、不碰论坛”是合规红线，见 CLAUDE.md。
 * 错误会汇总列出所有不合格页面。
 */

export type WikiPageType = "translated" | "original";

export interface WikiFrontmatter {
  type?: WikiPageType;
  title: string;
  original_title?: string;
  source_url?: string;
  original_author?: string;
  author?: string;
  translated_at?: string;
  order?: number;
  description?: string;
}

export interface WikiPage {
  slug: string; // 相对路径去掉扩展名，如 "kindle/jailbreak"
  lang: Locale; // 所属语言
  section: string; // 一级目录名
  frontmatter: WikiFrontmatter;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

/** 唯一允许的原文来源域名（CC BY-NC-SA 3.0）；论坛 UGC 无开放许可，绝不能进来 */
const SOURCE_HOST = "wiki.mobileread.com";

/** 翻译篇 CC BY 署名义务的必填字段（title 对两种篇目都必填，单独校验） */
const REQUIRED_FIELDS = ["original_author", "source_url"] as const;

function frontmatterErrors(rel: string, fm: WikiFrontmatter): string[] {
  const errors: string[] = [];
  const file = `content/${rel}`;
  const type = fm.type ?? "translated";

  if (type !== "translated" && type !== "original") {
    errors.push(
      `${file}: type 只能是 "translated" 或 "original"（当前 ${JSON.stringify(fm.type)}）`,
    );
    return errors;
  }

  if (!String(fm.title ?? "").trim()) {
    errors.push(`${file}: 缺少必填字段 title`);
  }

  if (type === "original") {
    // 原创篇：署名自己是义务，来源字段留给翻译篇
    if (!String(fm.author ?? "").trim()) {
      errors.push(`${file}: 原创篇（type: original）缺少必填字段 author`);
    }
    if (String(fm.source_url ?? "").trim()) {
      errors.push(
        `${file}: 原创篇不应有 source_url（原创不是翻译，参考资料请以普通链接写进正文）`,
      );
    }
    return errors;
  }

  // 翻译篇：BY 署名与来源域名校验是合规红线
  for (const field of REQUIRED_FIELDS) {
    if (!String(fm[field] ?? "").trim()) {
      errors.push(`${file}: 缺少必填字段 ${field}`);
    }
  }

  const sourceUrl = String(fm.source_url ?? "").trim();
  if (sourceUrl) {
    let url: URL | null = null;
    try {
      url = new URL(sourceUrl);
    } catch {
      errors.push(`${file}: source_url 不是合法 URL（${sourceUrl}）`);
    }
    if (url) {
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        errors.push(`${file}: source_url 必须是 https 地址（${sourceUrl}）`);
      } else if (url.hostname !== SOURCE_HOST) {
        errors.push(
          `${file}: source_url 必须来自 ${SOURCE_HOST}（当前 ${url.hostname}）——` +
            "只允许翻译 MobileRead Wiki，禁止搬运 mobileread.com/forums 的论坛帖",
        );
      }
    }
  }

  return errors;
}

function walk(dir: string, base = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...walk(path.join(dir, entry.name), rel));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(rel);
    }
  }
  return files;
}

/** 读取某语言全部页面；校验错误跨语言汇总后一次性抛出 */
export function getAllPages(lang: Locale = DEFAULT_LOCALE): WikiPage[] {
  const langDir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(langDir)) return [];

  const errors: string[] = [];
  const pages = walk(langDir).map((rel) => {
    const raw = fs.readFileSync(path.join(langDir, rel), "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as WikiFrontmatter;
    errors.push(...frontmatterErrors(`${lang}/${rel}`, frontmatter));
    return {
      slug: rel.replace(/\.(md|mdx)$/, ""),
      lang,
      section: rel.split("/")[0],
      frontmatter,
      content,
    };
  });

  if (errors.length > 0) {
    throw new Error(
      `内容 frontmatter 校验失败（${errors.length} 处问题），构建中止：\n` +
        errors.map((e) => `  - ${e}`).join("\n"),
    );
  }

  return pages.sort(
    (a, b) =>
      a.section.localeCompare(b.section) ||
      (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99) ||
      a.frontmatter.title.localeCompare(b.frontmatter.title, "zh-Hans"),
  );
}

export function getPageBySlug(
  lang: Locale,
  slug: string,
): WikiPage | undefined {
  return getAllPages(lang).find((p) => p.slug === slug);
}

export interface SidebarSection {
  name: string;
  pages: { slug: string; title: string }[];
}

/** 侧边栏：本语言实际存在的页面 */
export function getSidebarSections(lang: Locale): SidebarSection[] {
  const sections = new Map<string, { slug: string; title: string }[]>();
  for (const page of getAllPages(lang)) {
    if (!sections.has(page.section)) sections.set(page.section, []);
    sections.get(page.section)!.push({ slug: page.slug, title: page.frontmatter.title });
  }
  return [...sections.entries()].map(([name, pages]) => ({ name, pages }));
}

export interface CrossLanguageEntry {
  slug: string;
  section: string;
  /** 目录卡片标题：优先英文原题（跨语言最通用），原创篇退回 zh 标题 */
  displayTitle: string;
  sourceUrl?: string;
  /** 各语言是否有本页 */
  available: Partial<Record<Locale, boolean>>;
}

/**
 * 跨语言总索引（master list）：所有语言页面的并集。
 * 默认语言目录页用它补齐"本语言暂无、外链原文/其他语言版本"的卡片，
 * 保证三语目录的信息量一致，而不是各语言的子集。
 */
export function getCrossLanguageIndex(): CrossLanguageEntry[] {
  const map = new Map<string, CrossLanguageEntry>();
  const zhTitleBySlug = new Map<string, string>();

  for (const lang of LOCALES) {
    for (const page of getAllPages(lang)) {
      const existing = map.get(page.slug);
      if (existing) {
        existing.available[lang] = true;
        continue;
      }
      map.set(page.slug, {
        slug: page.slug,
        section: page.section,
        displayTitle: page.frontmatter.original_title ?? page.frontmatter.title,
        sourceUrl: page.frontmatter.source_url,
        available: { [lang]: true },
      });
    }
    if (lang === "zh") {
      for (const page of getAllPages(lang)) {
        zhTitleBySlug.set(page.slug, page.frontmatter.title);
      }
    }
  }

  return [...map.values()].sort((a, b) => a.section.localeCompare(b.section));
}
