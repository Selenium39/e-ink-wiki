import type { Metadata } from "next";
import HomeView from "@/components/HomeView";
import { homeMetadata } from "@/lib/seo";

export const metadata: Metadata = homeMetadata("en");

export default function Home() {
  return <HomeView lang="en" />;
}
