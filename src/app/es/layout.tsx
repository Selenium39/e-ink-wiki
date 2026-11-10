import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { HTML_LANG } from "@/lib/i18n";
import "@/app/globals.css";

/** 西语：URL 前缀 /es/ */
export const metadata: Metadata = {
  title: {
    default: "E-ink Wiki — Wiki de libros electrónicos",
    template: "%s — E-ink Wiki",
  },
  description:
    "Wiki de libros electrónicos: jailbreak y configuración de lectores Kindle / Kobo / BOOX, guías de formatos EPUB / MOBI / DRM, creación de diccionarios y software de lectura. Traducciones seleccionadas de MobileRead Wiki y artículos originales.",
};

export default function EsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={HTML_LANG.es}>
      <body className="min-h-screen antialiased">
        <SiteShell lang="es">{children}</SiteShell>
      </body>
    </html>
  );
}
