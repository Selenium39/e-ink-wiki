import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Sidebar from "@/components/Sidebar";
import LicenseFooter from "@/components/LicenseFooter";
import Figure from "@/components/Figure";
import JsonLd from "@/components/JsonLd";
import { getPageBySlug } from "@/lib/content";
import { HTML_LANG, type Locale } from "@/lib/i18n";
import {
  absoluteUrl,
  languageAlternates,
  openGraphFor,
  pagePath,
  SITE_URL,
} from "@/lib/seo";

/** 正文可用的 MDX 组件（截图必须带出处，见 Figure 注释） */
const mdxComponents = { Figure };

/** wiki 页面共用视图：侧边栏 + 文章 + 按语言渲染的许可页脚 */
export async function WikiPageView({
  lang,
  slug,
}: {
  lang: Locale;
  slug: string[];
}) {
  const joined = slug.join("/");
  const page = getPageBySlug(lang, joined);
  if (!page) notFound();

  const { frontmatter: fm, content } = page;
  const path = pagePath(lang, page.slug);

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: fm.title,
              description: fm.description,
              inLanguage: HTML_LANG[lang],
              mainEntityOfPage: absoluteUrl(path),
              url: absoluteUrl(path),
              image: absoluteUrl("/og.png"),
              dateModified: fm.translated_at,
              isBasedOn: fm.source_url,
              license: "https://creativecommons.org/licenses/by-nc-sa/3.0/",
              author: fm.author
                ? { "@type": "Organization", name: fm.author }
                : undefined,
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "E-ink Wiki",
                  item: absoluteUrl(pagePath(lang)),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: fm.title,
                  item: absoluteUrl(path),
                },
              ],
            },
          ],
        }}
      />
      <Sidebar lang={lang} />
      <article className="prose prose-neutral dark:prose-invert min-w-0 flex-1">
        <h1>{fm.title}</h1>
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
        <LicenseFooter fm={fm} lang={lang} />
      </article>
    </div>
  );
}

export function wikiMetadata(
  lang: Locale,
  slug: string[],
): Metadata {
  const page = getPageBySlug(lang, slug.join("/"));
  if (!page) return {};
  const path = pagePath(lang, page.slug);
  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description ?? page.frontmatter.title,
    alternates: languageAlternates(lang, page.slug),
    openGraph: openGraphFor(lang, path, "article"),
  };
}
