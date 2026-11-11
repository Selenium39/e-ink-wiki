# e-ink-wiki 决策文档

## 定位

e-ink.me 主站的内容纵深板块，独立仓库、独立子域 **wiki.e-ink.me**。
站点定位（2026-11-10 定）：**电子书 Wiki**（设备 + 格式 + 软件，
不止电纸书设备）。精选翻译 MobileRead Wiki 的电纸书深度教程，填补中文社区空白，
权威性反哺主站品牌；变现不在此站（主站付费工具承接转化）。

内容定位升级（2026-11-10）：**精选翻译 + 中文原创**双轨——
翻译篇之外逐步增加原创篇目（优先 MobileRead 没有的中文特有主题：
中文排版/字体、中文词典制作、新机型现状），管线按 frontmatter
`type: translated | original` 区分（契约见 `src/lib/content.ts` 顶部注释）。
原创篇同以 CC BY-NC-SA 3.0 发布。翻译篇的英文版不是重译，也不是把
MobileRead 原文原样搬上来：在署名和相同许可下做润色改编（重组结构、
改写表述、文首标明过时范围），英文读者留在本站。只写在论坛里、
不在 wiki 上的新越狱步骤仍然不收。西语篇维持译文。

选址拍板（2026-11-10）：e-ink.me 而非 iloveepub.com——
受众匹配（电纸书玩家）、老域名权重、AdSense 域级隔离、深度内容归深度站。

## 合规约束（最高优先级，不可协商）

内容来源与许可的完整调研结论见 e-ink 仓库记忆
`mobileread-chinese-mirror-evaluation`。要点：

1. **只碰 MobileRead Wiki**（CC BY-NC-SA 3.0，wiki.mobileread.com），
   **绝不搬运论坛帖子**（mobileread.com/forums，UGC 版权归发帖用户，无许可）
2. **BY 署名**：翻译篇 frontmatter 必填 `original_author` + `source_url`，
   原创篇必填 `author`（且不得有 `source_url`），
   页面底部自动渲染对应署名页脚（`src/components/LicenseFooter.tsx`）
3. **NC 非商业**：本站不挂任何广告；不放付费工具强推销 CTA；
   header 指向 e-ink.me 的普通导航链接是允许边界
4. **SA 相同方式共享**：翻译内容同以 CC BY-NC-SA 3.0 发布，
   公开可访问、无登录墙
5. **不做"洗稿不署名"**——洗稿等于放弃 CC 保护伞（从有条件合法降级为
   无授权侵权），而署名成本为零，已明确否决该方案

## 技术决策

- **三语 i18n（2026-11-10 拍板，依据 e-ink.me 访问数据：en 56.6% / zh 25.6% / es 5.3%）**：
  默认语言 **en 无 URL 前缀**（`/`、`/wiki/...`），zh/es 带前缀（`/zh/`、`/es/`）；
  内容按语言分仓 `content/<lang>/<分类>/<页面>.md`，**同 slug 跨语言对齐**；
  三组 root layout（`(en)` route group + `zh/` + `es/` 字面量目录，各自
  `<html lang>`），共用 `SiteShell`；语言切换器是客户端组件（layout 拿不到
  页面 slug，用 `usePathname` + 各语言 slug 清单算目标 URL，无对应页则落
  目标语言首页，静态导出下永不 404）
- **翻译篇的英文版是站内润色改编**（`content/en/`，frontmatter 仍用翻译篇
  契约：`original_author` + `source_url`）。不把英文读者外链到 MobileRead，
  也不做与原文逐段相同的镜像，更不造只有标题的薄页。过时步骤在文首写明
  适用的机型与固件；论坛帖里的新越狱流程不写入本站。某语言还没有对应页时，
  目录仍用 `getCrossLanguageIndex()` 的原文外链卡片补齐
- **frontmatter 无引号值含 `: ` 会让 YAML 解析失败**（js-yaml 报错不带文件名）——
  title/description 含冒号时必须加引号
- **静态导出无 middleware/redirects**：默认语言只能靠"en 无前缀"的路由结构表达，
  不能做 Accept-Language 自动跳转（要做得靠 nginx/CF 层）

- **不用第三方 wiki 框架**（MediaWiki/Wiki.js 等）：它们的核心能力
  （在线协作编辑、数据库、页面历史）本项目全不需要；版本历史=git，
  wiki 的形（目录树/侧边栏/署名页脚）用组件实现
- **Next.js 16 + output: "export" 静态导出**：与 e-ink.me / iloveepub 同栈；
  静态站最轻、天然公开（SA 友好）、部署可进 byos k3s
- **内容管线**：`content/<lang>/<分类>/<页面>.md`（按语言分仓）+
  gray-matter frontmatter + next-mdx-remote 渲染；
  frontmatter 契约见 `src/lib/content.ts` 顶部注释
- **trailingSlash: true**：nginx 目录 index.html 形态
- `output: "export"` 下 headers()/redirects()/rewrites() 静默失效（iloveepub 同款坑）
- **路由必须用 `[...slug]` catch-all**：content 路径含 `/`（kindle/jailbreak），
  单段 `[slug]` 会生成 `kindle%2Fjailbreak`（URL 编码进文件名）；catch-all
  才能得到层级 URL `/wiki/kindle/jailbreak/`（2026-11-10 建骨架时踩过）

## 开发约定

- **每完成一个功能即提交并推送 `main`**：先确认 `tsc --noEmit`、`eslint .`、
  `next build` 均通过再 commit，主分支不放不可构建的提交

## 部署（2026-11-11 已上线：Cloudflare Pages）

- **CF Pages 直传，不走 byos k3s**（拍板 2026-11-11）：静态站 Pages 最省，
  顺带绕开 myus prod `readOnly: true` 冻结（Zeabur 2026-12 关停前禁写）；
  byos 里不建 wiki 服务
- **部署命令**（手动，token 只在环境变量，不入库）：
  `pnpm build && CLOUDFLARE_ACCOUNT_ID=cb724477e6943c782c1f69610c60b155 CLOUDFLARE_API_TOKEN=<token> npx wrangler pages deploy out --project-name=e-ink-wiki --branch=main`
  项目 `e-ink-wiki`，production_branch=main；GitHub Actions 自动部署
  （repo secret + push main 触发）是待办
- **域名**：wiki.e-ink.me CNAME → `e-ink-wiki.pages.dev`（proxied），
  与 games.e-ink.me 同模式；证书 Pages 自动签（CA google）
- **HTTP 头/缓存走 `public/_headers`**（构建复制进 out/）：output:"export" 下
  headers() 静默失效。CF Pages 多规则匹配同一路径时**拼接不覆盖**——
  `/*` 不能带 Cache-Control，否则与 `/_next/static/*` 的 immutable 拼出
  双 max-age（RFC 取第一个，immutable 失效）；HTML 靠 Pages 默认 ETag 协商
- ⚠️ CF zone 有"扩展名模板强制边缘缓存"规则（e-ink 主站踩过）——Pages
  缓存独立于 zone Cache Rules，但更新内容后如见旧内容，用 CF API purge
- 全站无广告，无付费转化埋点需求

## 内容工作流（规划）

```
MediaWiki API 拉原文 → 人工选篇（常青教程优先，新闻时效类不进 wiki）
→ AI 翻译（可复用 e-ink 翻译管线/newapi 渠道）→ 人工校对（术语/步骤/截图）
→ 提交 content/ → CI build → 部署
```

选篇优先级：越狱/固件 > 词典制作 > KOReader 等阅读软件配置 > 格式知识。

### 截图约定

原文截图下载到 `public/images/<分类>/<页面>/`（不热链），正文用 `<Figure>` 组件引用，
`source` 必填以渲染图注里的出处——细节见 `public/images/README.md`。
