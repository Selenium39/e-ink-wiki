import type { Metadata } from "next";
import { getAllPages } from "@/lib/content";
import { WikiPageView, wikiMetadata } from "@/components/WikiPageView";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getAllPages("zh").map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return wikiMetadata("zh", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <WikiPageView lang="zh" slug={slug} />;
}
