---
title: KOReader 简介
original_title: "KOReader"
source_url: https://wiki.mobileread.com/wiki/KOReader
original_author: MobileRead Wiki 贡献者（DaleDe 等）
translated_at: 2026-11-10
order: 1
description: KOReader 是面向 Kindle、Kobo、PocketBook、Android 等 Linux 电纸书设备的文档查看器，支持 PDF、EPUB、DjVu 等十余种格式，内置 StarDict 词典、扫描页 OCR 查词、Calibre 无线连接、云同步与进度同步等功能。
---

> 本文译自 MobileRead Wiki 的《KOReader》页面，原文最后修订于 2023-02-19。
> 原文中的论坛帖与外部链接按原样保留，仅作为出处引用，本站不镜像论坛内容。
> KOReader 迭代很快，功能与安装方式请以官方文档为准，本文仅反映原文修订时点的状态。

KOReader 是一款面向基于 [Linux](https://wiki.mobileread.com/wiki/Linux) 的 [E Ink](https://wiki.mobileread.com/wiki/E_Ink) 设备的文档查看器。目前提供了 [Kindle](https://wiki.mobileread.com/wiki/Kindle)、[Kobo](https://wiki.mobileread.com/wiki/Kobo)、[PocketBook](https://wiki.mobileread.com/wiki/PocketBook) 和 [Android](https://wiki.mobileread.com/wiki/Android) 设备的版本。

## 概述

要安装 KOReader，你需要先给设备[越狱](/wiki/kindle/jailbreak/)，安装一个启动器（launcher），然后再安装阅读器本体。装好之后，你既可以继续使用原来的原厂软件，也可以使用新的 KOReader。对 Kobo 而言这些工作已经替你做好——社区制作了一个特殊的固件版本，可以从 MobileRead 下载。

## 功能特性

- **支持平台**：[Kindle Touch](https://wiki.mobileread.com/wiki/Kindle_Touch)、[Kindle Paperwhite](https://wiki.mobileread.com/wiki/Kindle_paperwhite)、[Kobo Glo](https://wiki.mobileread.com/wiki/Kobo_Glo)、[Kobo Touch](https://wiki.mobileread.com/wiki/Kobo_Touch)、[Kobo Mini](https://wiki.mobileread.com/wiki/Kobo_Mini)、[Kobo Aura](https://wiki.mobileread.com/wiki/Aura)、[Kobo Aura HD](https://wiki.mobileread.com/wiki/Aura_HD)、[Boeye](https://wiki.mobileread.com/wiki/Boeye) 阅读器
- **支持格式**：[PDF](https://wiki.mobileread.com/wiki/PDF)、[DjVu](https://wiki.mobileread.com/wiki/DjVu)、[XPS](https://wiki.mobileread.com/wiki/XPS)、[CBZ](https://wiki.mobileread.com/wiki/CBZ)、[FB2](https://wiki.mobileread.com/wiki/FB2)、[TXT](https://wiki.mobileread.com/wiki/TXT)、[HTML](https://wiki.mobileread.com/wiki/HTML)、[RTF](https://wiki.mobileread.com/wiki/RTF)、[CHM](https://wiki.mobileread.com/wiki/CHM)、[EPUB](https://wiki.mobileread.com/wiki/EPUB)、[DOC](https://wiki.mobileread.com/wiki/DOC)、[MOBI](https://wiki.mobileread.com/wiki/MOBI) 以及 [ZIP](https://wiki.mobileread.com/wiki/ZIP) 文件
- 基于 StarDict 的[词典](https://wiki.mobileread.com/wiki/Dictionary)支持
- 扫描页内查词——KOReader 内置 [OCR](https://wiki.mobileread.com/wiki/OCR) 引擎，能识别扫描版 PDF/DjVu 页面里的文字；要在扫描页中使用 OCR，需要先为文档的语言安装 tesseract 训练数据
- [Calibre](https://wiki.mobileread.com/wiki/Calibre) 无线连接
- 借助 [k2pdfopt](https://wiki.mobileread.com/wiki/k2pdfopt) 对复杂 PDF 进行重排（reflow）
- 支持旋转屏幕，进入横屏模式
- 笔记可保存并导出为文件，或导出到 [Evernote](https://wiki.mobileread.com/wiki/Evernote)
- 自定义 .ttf 字体与 StarDict 词典
- [云存储](https://wiki.mobileread.com/wiki/Cloud)（Dropbox、FTP）与同步
- 内容来源：[Wikipedia](https://wiki.mobileread.com/wiki/Wikipedia_mobile_access)、[OPDS](https://wiki.mobileread.com/wiki/OPDS) 和 [Goodreads](https://wiki.mobileread.com/wiki/Goodreads)
- 阅读进度同步
- Zsync 传输
- 统计插件

## 更多信息

- [KOReader 官方 wiki](https://github.com/koreader/koreader/wiki)
- [KOReader 用户指南](https://github.com/koreader/koreader/wiki/KOReader-User-Guide)
- [MobileRead 论坛的 KOReader 版块](https://www.mobileread.com/forums/forumdisplay.php?f=276)
- [MobileRead 论坛上讨论 Kindle 版的帖子](https://www.mobileread.com/forums/showthread.php?t=209276)
- [MobileRead 论坛上讨论 Kobo 版的帖子](https://www.mobileread.com/forums/showthread.php?t=216960)
- 另见 [Plato](https://wiki.mobileread.com/wiki/Plato)——一个从 KOReader 衍生出来的项目
- 来自 the-ebook-reader.com 的教程：[一键在 Kobo 阅读器上安装 KOReader 与 Plato](https://blog.the-ebook-reader.com/2019/02/16/easily-install-koreader-and-plato-on-your-kobo-ereader-with-one-click/)
