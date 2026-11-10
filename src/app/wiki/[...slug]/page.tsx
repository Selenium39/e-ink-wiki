import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Sidebar from "@/components/Sidebar";
import LicenseFooter from "@/components/LicenseFooter";
import Figure from "@/components/Figure";
import { getAllPages, getPageBySlug } from "@/lib/content";

/** 正文可用的 MDX 组件（截图必须带出处，见 Figure 注释） */
const mdxComponents = { Figure };

interface Props {
  // catch-all 路由：/wiki/kindle/jailbreak → slug: ["kindle", "jailbreak"]
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  // content 路径天然是多段：kindle/jailbreak → ["kindle", "jailbreak"]
  return getAllPages().map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug.join("/"));
  if (!page) return {};
  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
}

export default async function WikiPage({ params }: Props) {
  const { slug } = await params;
  const page = getPageBySlug(slug.join("/"));
  if (!page) notFound();

  const { frontmatter: fm, content } = page;

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <Sidebar />
      <article className="prose prose-neutral dark:prose-invert min-w-0 flex-1">
        <h1>{fm.title}</h1>
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
        <LicenseFooter fm={fm} />
      </article>
    </div>
  );
}
