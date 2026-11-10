# E-ink Wiki

电纸书中文 Wiki —— [wiki.e-ink.me](https://wiki.e-ink.me)

电纸书设备的中文知识库：Kindle / Kobo 越狱与救砖、固件与系统底层、词典制作、
阅读软件配置、电子书格式。内容双轨——精选翻译
[MobileRead Wiki](https://wiki.mobileread.com/) 的深度教程，并收录本站原创
（中文排版、中文词典制作等英文社区缺失的主题）。
这类资料在中文世界长期空白，本站补上它。E-ink.me 主站的内容纵深板块。

## 你能在这里读到什么

| 分类 | 内容 |
| --- | --- |
| Kindle | 5.x 软件越狱（PW2 / PW3 / KT2 / KT3 / KV / KOA）· Touch 越狱、救砖与备份 · 越狱包清单（25 个扩展）· 系统架构与底层访问 · 开发指南（工具链与自制包） |
| Kobo | Touch 破解入门 · WiFi 破解入门 · eReader 常见问题（16 问） |
| 词典 | 电纸书词典制作总览 |
| 阅读软件 | KOReader 简介 |
| 电子书格式 | EPUB 格式详解 · MOBI 格式详解 · 电子书 DRM 概览 |

全部内容公开可访问：无登录墙，无广告。

## 内容从哪来

翻译篇译自 MobileRead Wiki，原文以
[CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) 许可发布。
相应地，本站的译文同样以该许可开放：

- **署名（BY）**：每个页面底部标注原作者（依原文修订历史整理）与原文地址
- **非商业（NC）**：全站不挂广告，不放付费转化入口
- **相同方式共享（SA）**：你可以自由转载、修改本站译文，前提是保持署名、
  非商业、并以相同许可发布

边界：只翻译 wiki 页面，不搬运 MobileRead 论坛帖子（论坛内容无开放许可）。

## 许可

| 部分 | 许可 |
| --- | --- |
| `content/` 下的译文 | [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)（继承原文） |
| 网站代码（`src/`、配置等） | [MIT](./LICENSE) |

两者相互独立：使用译文遵守 CC BY-NC-SA 3.0，使用代码遵守 MIT。

## 参与贡献

- **纠错 / 改进译文**：提
  [issue](https://github.com/Selenium39/e-ink-wiki/issues)
  或直接 PR 修改 `content/` 下对应文件
- **建议新篇目**：提 issue 并附原文页面链接（限 MobileRead Wiki）；
  也欢迎原创篇目（中文排版、中文字体、中文词典等 MobileRead 没有的主题）
- frontmatter 契约见 `src/lib/content.ts` 顶部注释——翻译篇
  （`type: "translated"`，缺省）与原创篇（`type: "original"`）各有一套
  必填字段，缺署名或来源非法时构建直接失败，这是刻意的（CC 署名义务是红线）

## 本地开发

```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build  # 静态导出，产物在 out/
```

Next.js 16（`output: "export"`）+ Tailwind CSS 4 + markdown 内容管线
（gray-matter + next-mdx-remote），部署为纯静态站。
