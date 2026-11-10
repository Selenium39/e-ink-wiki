import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * 内容管线：content/ 下的 markdown 即 wiki 页面。
 *
 * frontmatter 契约（LicenseFooter 依赖，缺失会在构建时警告）：
 *   title            页面标题（中文）
 *   original_title   原文标题
 *   source_url       原文地址 https://wiki.mobileread.com/wiki/...
 *   original_author  原作者（CC BY 署名义务，必填）
 *   translated_at    翻译日期 YYYY-MM-DD
 *   order            同目录内排序（可选）
 *   description      摘要（可选，首页/SEO 用）
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
  return walk(CONTENT_DIR)
    .map((rel) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, rel), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: rel.replace(/\.(md|mdx)$/, ""),
        section: rel.split("/")[0],
        frontmatter: data as WikiFrontmatter,
        content,
      };
    })
    .sort(
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
