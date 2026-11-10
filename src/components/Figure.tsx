/**
 * 原文截图组件：图注 + 出处，用于翻译正文里保留的截图。
 *
 * 约定（详见 public/images/README.md）：
 *   图片放 public/images/<分类>/<页面>/<序号>-<描述>.png
 *   正文以绝对路径引用：<Figure src="/images/kindle/jailbreak/01-update-menu.png" ... />
 *
 * `source` 是必填 prop，刻意不做默认值：CC BY-NC-SA 的 BY 义务要求每张图
 * 标明来自哪个原文页面/文件页，漏了就渲染不出来，逼着翻译时当场补上。
 */
export interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  /** 原文页面或原图文件页的地址 */
  source: string;
  /** 出处链接文案，默认按原文页面处理 */
  sourceLabel?: string;
}

export default function Figure({
  src,
  alt,
  caption,
  source,
  sourceLabel = "MobileRead Wiki 原文",
}: FigureProps) {
  return (
    <figure className="not-prose my-6">
      {/* 静态导出（output: "export"）没有图片优化服务，直接用 img */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800"
      />
      <figcaption className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        {caption ? (
          <span className="text-neutral-700 dark:text-neutral-300">{caption}</span>
        ) : null}
        {caption ? " · " : null}
        <span>出处：</span>
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          {sourceLabel}
        </a>
      </figcaption>
    </figure>
  );
}
