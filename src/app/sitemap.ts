import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/content";
import { LOCALES, type Locale } from "@/lib/i18n";
import { absoluteLanguages, absoluteUrl, pagePath } from "@/lib/seo";

export const dynamic = "force-static";

function entry(
  lang: Locale,
  slug: string | undefined,
  priority: number,
  lastModified?: string | Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(pagePath(lang, slug)),
    lastModified,
    changeFrequency: slug ? "monthly" : "weekly",
    priority,
    alternates: { languages: absoluteLanguages(slug) },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const items: MetadataRoute.Sitemap = [];

  for (const lang of LOCALES) {
    items.push(entry(lang, undefined, lang === "en" ? 1 : 0.8));
  }

  const slugs = new Set<string>();
  for (const lang of LOCALES) {
    for (const page of getAllPages(lang)) slugs.add(page.slug);
  }

  for (const slug of [...slugs].sort()) {
    for (const lang of LOCALES) {
      const page = getAllPages(lang).find((item) => item.slug === slug);
      if (!page) continue;
      items.push(
        entry(lang, slug, 0.7, page.frontmatter.translated_at),
      );
    }
  }

  return items;
}
