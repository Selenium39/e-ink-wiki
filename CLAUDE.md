# e-ink-wiki 决策文档

## 定位

e-ink.me 主站的内容纵深板块，独立仓库、独立子域 **wiki.e-ink.me**。
精选翻译 MobileRead Wiki 的电纸书深度教程，填补中文社区空白，
权威性反哺主站品牌；变现不在此站（主站付费工具承接转化）。

选址拍板（2026-11-10）：e-ink.me 而非 iloveepub.com——
受众匹配（电纸书玩家）、老域名权重、AdSense 域级隔离、深度内容归深度站。

## 合规约束（最高优先级，不可协商）

内容来源与许可的完整调研结论见 e-ink 仓库记忆
`mobileread-chinese-mirror-evaluation`。要点：

1. **只碰 MobileRead Wiki**（CC BY-NC-SA 3.0，wiki.mobileread.com），
   **绝不搬运论坛帖子**（mobileread.com/forums，UGC 版权归发帖用户，无许可）
2. **BY 署名**：每篇 frontmatter 必填 `original_author` + `source_url`，
   页面底部自动渲染署名页脚（`src/components/LicenseFooter.tsx`）
3. **NC 非商业**：本站不挂任何广告；不放付费工具强推销 CTA；
   header 指向 e-ink.me 的普通导航链接是允许边界
4. **SA 相同方式共享**：翻译内容同以 CC BY-NC-SA 3.0 发布，
   公开可访问、无登录墙
5. **不做"洗稿不署名"**——洗稿等于放弃 CC 保护伞（从有条件合法降级为
   无授权侵权），而署名成本为零，已明确否决该方案

## 技术决策

- **不用第三方 wiki 框架**（MediaWiki/Wiki.js 等）：它们的核心能力
  （在线协作编辑、数据库、页面历史）本项目全不需要；版本历史=git，
  wiki 的形（目录树/侧边栏/署名页脚）用组件实现
- **Next.js 16 + output: "export" 静态导出**：与 e-ink.me / iloveepub 同栈；
  静态站最轻、天然公开（SA 友好）、部署可进 byos k3s
- **内容管线**：`content/<分类>/<页面>.md` + gray-matter frontmatter +
  next-mdx-remote 渲染；frontmatter 契约见 `src/lib/content.ts` 顶部注释
- **trailingSlash: true**：nginx 目录 index.html 形态
- `output: "export"` 下 headers()/redirects()/rewrites() 静默失效（iloveepub 同款坑）
- **路由必须用 `[...slug]` catch-all**：content 路径含 `/`（kindle/jailbreak），
  单段 `[slug]` 会生成 `kindle%2Fjailbreak`（URL 编码进文件名）；catch-all
  才能得到层级 URL `/wiki/kindle/jailbreak/`（2026-11-10 建骨架时踩过）

## 部署（待办）

- 域名 wiki.e-ink.me → CF → byos k3s ingress（或纯静态托管）
- ⚠️ CF zone 有"扩展名模板强制边缘缓存"规则，上线后给 wiki 子域配
  bypass/合理 TTL，更新内容后注意 purge（e-ink 主站同款坑）
- 全站无广告，无付费转化埋点需求

## 内容工作流（规划）

```
MediaWiki API 拉原文 → 人工选篇（常青教程优先，新闻时效类不进 wiki）
→ AI 翻译（可复用 e-ink 翻译管线/newapi 渠道）→ 人工校对（术语/步骤/截图）
→ 提交 content/ → CI build → 部署
```

选篇优先级：越狱/固件 > 词典制作 > KOReader 等阅读软件配置 > 格式知识。
