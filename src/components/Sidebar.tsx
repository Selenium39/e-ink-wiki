import Link from "next/link";
import { getSidebarSections } from "@/lib/content";

const SECTION_LABELS: Record<string, string> = {
  kindle: "Kindle",
  kobo: "Kobo",
};

export default function Sidebar() {
  const sections = getSidebarSections();
  return (
    <nav aria-label="目录" className="w-full shrink-0 md:w-60">
      <div className="sticky top-16 space-y-6 text-sm">
        {sections.map((section) => (
          <div key={section.name}>
            <h3 className="mb-2 font-semibold text-neutral-500 dark:text-neutral-400">
              {SECTION_LABELS[section.name] ?? section.name}
            </h3>
            <ul className="space-y-1">
              {section.pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/wiki/${page.slug}`}
                    className="block rounded px-2 py-1 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
