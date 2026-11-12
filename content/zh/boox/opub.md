---
title: "OPUB：BOOX Picco 上的书籍文件"
type: original
author: e-ink.me
order: 2
description: "OPUB 是什么：BOOX Picco 上的书籍文件，以及 BOOX Tiles 怎样把书放进设备。"
---

> 本文为 E-ink Wiki 原创内容。设备与传书事实来自 [Picco 商品页](https://shop.boox.com/products/picco)（访问于 2026-11-12）以及文末列出的公开报道。BOOX 没有公布这一文件的格式规范。
> Picco 是新的产品线，传书步骤可能调整。动手之前请以 [booxtiles.com](https://booxtiles.com/) 和商品页的最新说明为准。

## OPUB 是什么

**OPUB** 是 **Picco** 上使用的书籍文件。Picco 是 BOOX Tiles 系列的第一台设备，3.97 英寸，卡片大小。它不是[入门总览](/zh/wiki/boox/overview/)里那些运行开放安卓的设备，也不运行 NeoReader。

安卓机型上，EPUB、MOBI 以及 NeoReader 支持的其他格式是按原文件打开的。Picco 不同。[商品页](https://shop.boox.com/products/picco)列出了一批文档格式——EPUB、MOBI、AZW3、AZW、AZW5、FB2 及其压缩包、TXT、PDB、PRC、RTF、HTML、XHTML、CHM——并写明：**只有通过 BOOX Tiles 应用或网页传进去，这些格式才算受支持**。把一本 EPUB 原样拷进存储卡，不是 BOOX 文档里的用法。

BOOX 没有公布格式规范，商品页也没有使用 OPUB 这个名字。公开报道用这个名字称呼设备上实际保存的文件，扩展名是 `.opub`。2026 年 10 月 6 日的一篇报道把它描述成由原书预先处理好的、可以重排的文件，图片也包括在内，而不是一叠页面图片（[Read with Pro](https://www.readwithpro.com/blog/boox-picco-ttf-opub-transfer)）。这和商品页一致：书放进设备之后，仍然可以改字体、间距和边距。

## 书怎么进 Picco

[BOOX Tiles](https://booxtiles.com/) 是传书用的应用。商品页写了三条路径：

1. **手机 App。** 安装 BOOX Tiles，扫描 Picco 上的二维码配对，再把文件送进去。手机和网页传书可以走同一 Wi-Fi；不在同一网络时走云端。
2. **网页。** 打开 booxtiles.com，登录后上传文件。
3. **USB 线。** 接上 Picco，打开 booxtiles.com，选择 USB 传输，再选中 BOOX TILE 文件夹。

同一篇 2026 年 10 月的报道看了导入窗口：USB 这一项标着免登录；Wi-Fi、云端、网页链接和手机 App 都要登录。云端这条路径会上传文件。报道还提到，当时的 USB 选文件夹只支持桌面版 Chromium 浏览器（Chrome、Edge 或 Opera）。

图片在商品页上另有清单（PNG、JPEG、WEBP、BMP、GIF），走同一套传输。字体是另一次传输，不属于这本书的文件。

## 本页不写什么

没有可以引用的公开规范，所以本页只写读者在 Picco 上会遇到的那一层：这个文件叫什么、哪台设备在用、BOOX Tiles 怎样把书放上去。文件内部的字节布局不在这里。

## 参考来源

- [BOOX Picco 商品页](https://shop.boox.com/products/picco)，访问于 2026-11-12
- [Introducing BOOX Picco](https://shop.boox.com/blogs/news/introducing-boox-picco)（BOOX，2026-09-28）
- [BOOX Tiles](https://booxtiles.com/)
- [BOOX Picco 传书笔记：EPUB 转 OPUB](https://www.readwithpro.com/blog/boox-picco-ttf-opub-transfer)（Read with Pro，2026-10-06）
