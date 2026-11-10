import Link from "next/link";
import { getSidebarSections } from "@/lib/content";

export default function Home() {
  const sections = getSidebarSections();
  return (
    <div className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <h1>电纸书中文 Wiki</h1>
      <p>
        电纸书设备的中文知识库：Kindle / Kobo
        越狱、固件、词典制作、阅读软件配置、电子书格式等深度教程。
        内容双轨——精选译自{" "}
        <a
          href="https://wiki.mobileread.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          MobileRead Wiki
        </a>{" "}
        等英文社区，并逐步收录本站原创（中文排版、中文词典制作等英文社区缺失的主题）。
      </p>
      <p className="text-sm">
        翻译内容署名原作者、原创内容署名作者，均以{" "}
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
