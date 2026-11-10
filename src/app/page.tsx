import Link from "next/link";
import { getSidebarSections } from "@/lib/content";

export default function Home() {
  const sections = getSidebarSections();
  return (
    <div className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <h1>电纸书中文教程库</h1>
      <p>
        这里收录 Kindle、Kobo 等电纸书设备的越狱、固件、词典制作、阅读软件配置等教程，
        由英文社区（主要为{" "}
        <a
          href="https://wiki.mobileread.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          MobileRead Wiki
        </a>
        ）精选翻译而来，中文世界独一份的深度内容。
      </p>
      <p className="text-sm">
        所有翻译内容署名原作者，并以{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-NC-SA 3.0
        </a>{" "}
        许可开放；本站不设广告。
      </p>

      <h2>分类目录</h2>
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.name}
            className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <h3 className="mb-2 font-semibold">{section.name}</h3>
            <ul className="space-y-1 text-sm">
              {section.pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/wiki/${page.slug}`}
                    className="text-neutral-600 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
