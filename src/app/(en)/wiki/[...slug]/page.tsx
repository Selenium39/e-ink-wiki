import type { Metadata } from "next";
import { getAllPages } from "@/lib/content";
import { WikiPageView, wikiMetadata } from "@/components/WikiPageView";

interface Props {
  // catch-all 路由：/wiki/kindle/jailbreak → slug: ["kindle", "jailbreak"]
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  // content 路径天然是多段：kindle/jailbreak → ["kindle", "jailbreak"]
  return getAllPages("en").map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return wikiMetadata("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <WikiPageView lang="en" slug={slug} />;
}
