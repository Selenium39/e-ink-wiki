# public/images —— 原文截图

翻译正文时保留原文截图，按页面分目录存放，不混放：

```
public/images/<分类>/<页面>/<序号>-<描述>.png
例：public/images/kindle/jailbreak/01-update-your-kindle-menu.png
```

静态导出会把 `public/` 原样拷进 `out/`，所以正文里用**绝对路径**引用：

```mdx
<Figure
  src="/images/kindle/jailbreak/01-update-your-kindle-menu.png"
  alt="Kindle 设置菜单中的 Update Your Kindle 选项"
  caption="图 1：设置菜单里的 Update Your Kindle"
  source="https://wiki.mobileread.com/wiki/5_x_Jailbreak"
/>
```

## 硬性约定

- **每张图必须带 `source`**：原文页面或原图文件页的地址。`Figure` 会把它渲染成图注里的
  "出处"，这是 CC BY-NC-SA 的署名义务，也是区分"翻译"与"洗稿"的证据链
- **不热链**：把原图下载到本地再引用，源站可能防盗链、改文件名或挂掉
- **`caption` 写内容**，不要写"截图"两个字；它同时给读屏和搜索用
- **压到宽 1200px 以内**再放进来，电纸书教程的截图原图往往偏大
- 图注语言跟正文一致（中文），图片里的英文不需要逐字翻译，用 `caption` 说明就行
