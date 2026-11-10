# e-ink-wiki

电纸书中文教程库，目标域名 **wiki.e-ink.me**。

内容精选翻译自 [MobileRead Wiki](https://wiki.mobileread.com/)（CC BY-NC-SA 3.0），
覆盖 Kindle / Kobo 越狱、固件、词典制作、阅读器配置等电纸书深度教程。

## 技术栈

- Next.js 16（`output: "export"` 静态导出，参考 iloveepub 形态）
- Tailwind CSS 4 + typography 插件（正文排版）
- gray-matter + next-mdx-remote（markdown 内容管线）
- pnpm

不使用第三方 wiki 框架：无在线协作编辑需求，内容版本管理即 git，
wiki 的"形"（目录树/侧边栏/署名页脚）由组件实现。

## 内容管线

```
MediaWiki API 拉取原文 → 人工选篇 → AI 翻译 → 人工校对 → 提交 content/
```

- `content/<分类>/<页面>.md`，frontmatter 契约见 `src/lib/content.ts` 顶部注释
- `original_author` / `source_url` 必填——驱动每页底部的 CC BY-NC-SA 3.0 署名页脚

## 合规红线（见 CLAUDE.md）

1. **只翻译 wiki，不搬运论坛帖子**（论坛 UGC 无开放许可）
2. **BY**：每页署名原作者与原文地址
3. **NC**：wiki.e-ink.me 全站不挂广告、不放付费工具强转化 CTA（普通导航链接除外）
4. **SA**：翻译内容同以 CC BY-NC-SA 3.0 开放，不设登录墙

## 开发

```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build  # 产物在 out/
```
