import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/i18n";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: "E-book wiki for devices, formats, and reading software.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#ffffff",
    lang: "en",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
