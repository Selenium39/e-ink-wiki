import type { Metadata } from "next";
import HomeView from "@/components/HomeView";
import { homeMetadata } from "@/lib/seo";

export const metadata: Metadata = homeMetadata("es");

export default function Home() {
  return <HomeView lang="es" />;
}
