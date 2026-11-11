import type { WikiFrontmatter } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/**
 * 页脚许可声明——合规义务的落点，每篇必带，按页面语言渲染。
 * 翻译篇（type 缺省 "translated"）：BY 署名原作者 + 原文链接，
 *   SA 声明本翻译同样以 CC BY-NC-SA 3.0 发布。
 *   英文是润色改编，页脚写 Adapted and updated，不写 Translated。
 * 原创篇（type: "original"）：署名创作者，同样以 CC BY-NC-SA 3.0 发布。
 */
export default function LicenseFooter({
  fm,
  lang,
}: {
  fm: WikiFrontmatter;
  lang: Locale;
}) {
  const linkCls =
    "underline decoration-dotted underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200";
  const cc = (text: string) => (
    <a
      href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
      target="_blank"
      rel="noopener noreferrer"
      className={linkCls}
    >
      {text}
    </a>
  );

  return (
    <footer className="mt-12 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      {fm.type === "original" ? (
        <p>
          {lang === "zh" && (
            <>
              本文为 E-ink Wiki 原创内容{fm.author ? `，作者 ${fm.author}` : ""}，以{" "}
              {cc("CC BY-NC-SA 3.0")} 许可发布。
            </>
          )}
          {lang === "en" && (
            <>
              This article is original content by E-ink Wiki
              {fm.author ? `, written by ${fm.author}` : ""}, published under{" "}
              {cc("CC BY-NC-SA 3.0")}.
            </>
          )}
          {lang === "es" && (
            <>
              Este artículo es contenido original de E-ink Wiki
              {fm.author ? `, escrito por ${fm.author}` : ""}, publicado bajo{" "}
              {cc("CC BY-NC-SA 3.0")}.
            </>
          )}
        </p>
      ) : (
        <p>
          {lang === "zh" && (
            <>
              本文译自{" "}
              <a href={fm.source_url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                MobileRead Wiki
                {fm.original_title ? `《${fm.original_title}》` : " 页面"}
              </a>
              {fm.original_author ? `，原作者 ${fm.original_author}` : ""}
              {fm.translated_at ? `，翻译于 ${fm.translated_at}` : ""}。原文与本翻译均以{" "}
              {cc("CC BY-NC-SA 3.0")} 许可发布。
            </>
          )}
          {lang === "en" && (
            <>
              Adapted and updated from{" "}
              <a href={fm.source_url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                MobileRead Wiki
                {fm.original_title ? ` “${fm.original_title}”` : ""}
              </a>
              {fm.original_author ? `, original by ${fm.original_author}` : ""}
              {fm.translated_at ? `, this edition dated ${fm.translated_at}` : ""}.
              Wording and structure are revised, and outdated limits are marked in the
              article. Both the original and this edition are published under{" "}
              {cc("CC BY-NC-SA 3.0")}.
            </>
          )}
          {lang === "es" && (
            <>
              Traducido de{" "}
              <a href={fm.source_url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                MobileRead Wiki
                {fm.original_title ? ` «${fm.original_title}»` : ""}
              </a>
              {fm.original_author ? `, original de ${fm.original_author}` : ""}
              {fm.translated_at ? `, traducido el ${fm.translated_at}` : ""}. Tanto el
              original como esta traducción se publican bajo {cc("CC BY-NC-SA 3.0")}.
            </>
          )}
        </p>
      )}
    </footer>
  );
}
