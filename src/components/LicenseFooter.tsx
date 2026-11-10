import type { WikiFrontmatter } from "@/lib/content";

/**
 * CC BY-NC-SA 3.0 署名页脚——合规义务的落点，每篇翻译页必带。
 * BY：署名原作者（original_author 缺失时构建期已警告，此处兜底提示）。
 * SA：声明本翻译同样以 CC BY-NC-SA 3.0 发布。
 */
export default function LicenseFooter({ fm }: { fm: WikiFrontmatter }) {
  return (
    <footer className="mt-12 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      {fm.source_url ? (
        <p>
          本文译自{" "}
          <a
            href={fm.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200"
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
            className="underline decoration-dotted underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            CC BY-NC-SA 3.0
          </a>{" "}
          许可发布。
        </p>
      ) : (
        <p>本页面为原创内容，以 CC BY-NC-SA 3.0 许可发布。</p>
      )}
    </footer>
  );
}
