import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * 内容管线：content/ 下的 markdown 即 wiki 页面。
 *
 * frontmatter 契约（LicenseFooter 依赖）：
 *   title            页面标题（中文）
 *   original_title   原文标题
 *   source_url       原文地址 https://wiki.mobileread.com/wiki/...
 *   original_author  原作者（CC BY 署名义务，必填）
 *   translated_at    翻译日期 YYYY-MM-DD
 *   order            同目录内排序（可选）
 *   description      摘要（可选，首页/SEO 用）
 *
 * title / original_author / source_url 缺失、或 source_url 不是 MobileRead Wiki 的地址时，
 * 构建直接失败（不是警告）——BY 署名与“只碰 wiki、不碰论坛”是合规红线，
 * 见 CLAUDE.md。错误会在一次构建中汇总列出所有不合格页面。
 */

export interface WikiFrontmatter {
  title: string;
  original_title?: string;
  source_url?: string;
  original_author?: string;
  translated_at?: string;
  order?: number;
  description?: string;
}

export interface WikiPage {
  slug: string; // 相对路径去掉扩展名，如 "kindle/jailbreak"
  section: string; // 一级目录名
  frontmatter: WikiFrontmatter;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

/** 唯一允许的原文来源域名（CC BY-NC-SA 3.0）；论坛 UGC 无开放许可，绝不能进来 */
const SOURCE_HOST = "wiki.mobileread.com";

/** CC BY 署名义务的必填字段 */
const REQUIRED_FIELDS = ["title", "original_author", "source_url"] as const;

function frontmatterErrors(rel: string, fm: WikiFrontmatter): string[] {
  const errors: string[] = [];
  const file = `content/${rel}`;

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

export function getAllPages(): WikiPage[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const errors: string[] = [];
  const pages = walk(CONTENT_DIR).map((rel) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, rel), "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as WikiFrontmatter;
    errors.push(...frontmatterErrors(rel, frontmatter));
    return {
      slug: rel.replace(/\.(md|mdx)$/, ""),
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

export function getPageBySlug(slug: string): WikiPage | undefined {
  return getAllPages().find((p) => p.slug === slug);
}

export interface SidebarSection {
  name: string;
  pages: { slug: string; title: string }[];
}

export function getSidebarSections(): SidebarSection[] {
  const sections = new Map<string, { slug: string; title: string }[]>();
  for (const page of getAllPages()) {
    if (!sections.has(page.section)) sections.set(page.section, []);
    sections.get(page.section)!.push({ slug: page.slug, title: page.frontmatter.title });
  }
  return [...sections.entries()].map(([name, pages]) => ({ name, pages }));
}
