import type { WikiFrontmatter } from "@/lib/content";

/**
 * 页脚许可声明——合规义务的落点，每篇必带。
 * 翻译篇（type 缺省 "translated"）：BY 署名原作者 + 原文链接，
 *   SA 声明本翻译同样以 CC BY-NC-SA 3.0 发布。
 * 原创篇（type: "original"）：署名创作者，同样以 CC BY-NC-SA 3.0 发布。
 */
export default function LicenseFooter({ fm }: { fm: WikiFrontmatter }) {
  const linkCls =
    "underline decoration-dotted underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200";

  return (
    <footer className="mt-12 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      {fm.type === "original" ? (
        <p>
          本文为 E-ink Wiki 原创内容{fm.author ? `，作者 ${fm.author}` : ""}，以{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            CC BY-NC-SA 3.0
          </a>{" "}
          许可发布。
        </p>
      ) : (
        <p>
          本文译自{" "}
          <a
            href={fm.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            MobileRead Wiki
            {fm.original_title ? `《${fm.original_title}》` : " 页面"}
          </a>
          {fm.original_author ? `，原作者 ${fm.original_author}` : ""}
          {fm.translated_at ? `，翻译于 ${fm.translated_at}` : ""}。原文与本翻译均以{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            CC BY-NC-SA 3.0
          </a>{" "}
          许可发布。
        </p>
      )}
    </footer>
  );
}
