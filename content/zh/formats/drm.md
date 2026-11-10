---
title: 电子书 DRM 概览
original_title: "DRM"
source_url: https://wiki.mobileread.com/wiki/DRM
original_author: MobileRead Wiki 贡献者（DaleDe 主笔，Mattcutts、Madliu 等）
translated_at: 2026-11-10
order: 3
description: 概览电子书 DRM（数字版权管理）的运作方式：PDF、ePub、Kindle 各格式的 DRM 方案，HDCP 与其他格式，图书馆借阅与字体保护中的应用，对 TTS 朗读的影响，以及移除 DRM 的法律边界。
---

> 本文译自 MobileRead Wiki 的《DRM》页面，原文最后修订于 2018-10-15。
> 原文中的外部链接按原样保留，仅作为出处与参考入口引用，本站不镜像其内容。
> 本文关于 DRM 的内容为知识性介绍，涉及移除工具的信息请读者自行判断，并遵守所在地区法律与平台服务条款。

DRM 即数字版权管理（Digital Rights Management），既是一种机制，也是一种理念。它通常旨在限制用户对特定文件所能执行的操作。

## 概览

应用于电子书的 DRM 通常是一段必须存在、阅读器才能打开电子书的代码。这段代码可能锁定到某台特定设备，也可能锁定到一组设备，还有些情况下锁定到用户。DRM 没有标准的实现方式。

DRM 的本意是保护电子书（以及电子音乐等其他电子媒体）的作者和出版商，使其免遭盗版等非法行为的侵害。一些反对者把它称为"数字限制管理"（Digital Restriction Management），认为它早已越出打击非法行为的边界，连合法且合理的使用也一并限制掉了。参见[版权](https://wiki.mobileread.com/wiki/Copyright)。

有些电子书格式并不支持 DRM；而即便某格式支持 DRM，该格式下也可能存在不受 DRM 控制的电子书。

一台阅读设备可能为它支持的各种格式配备多套 DRM 方案。某些格式——最典型的是 [MOBI](/zh/wiki/formats/mobi/)——对专用阅读设备（dedicated reading device）有一条限制：不允许它们的软件运行在支持其他带 DRM 格式的专用阅读设备上；不过那些更通用的、可以自行安装电子书阅读应用的设备，往往能同时装上 MOBI 阅读器和其他阅读程序。

DRM 方案通常由一台服务器来管理。当用户购买一本受 DRM 保护的电子书时，服务器会分配解密密钥；密钥可以基于阅读设备本身生成，也可以基于服务器已知的某个用户 ID。

## PDF 的 DRM

[PDF](https://wiki.mobileread.com/wiki/PDF) 格式由 Adobe 开发，Adobe 也是用 DRM 控制 PDF 文档访问的主导者。此外还有一些系统用密码保护（password protection）来控制 PDF 内容。

不过，市面上也存在用 DRM 移除工具解除 PDF DRM 的方案。

## ePub 的 DRM

[ePub](/zh/wiki/formats/epub/) 虽然是一个定义相当完善的行业标准，但标准里连"如何标识 DRM 内容"都没有规定，这个格式也就没有统一的 DRM 实现。实际在用的主要有三套系统。

其中两套由 Adobe 管理：[Adobe DRM](https://wiki.mobileread.com/wiki/Adobe_DRM) 服务器供 [Adobe Digital Editions](https://wiki.mobileread.com/wiki/Adobe_Digital_Editions) 使用——大多数专用电子书阅读器都用它；[Barnes and Noble](https://wiki.mobileread.com/wiki/Barnes_and_Noble) 的 nook 也用这套。第三套来自 Apple，通过他们的 iTunes 应用实现，详见 Apple 的 [FairPlay DRM](https://wiki.mobileread.com/wiki/FairPlay_DRM)。

对用户来说，真正的麻烦在于：当你的设备能运行不止一个阅读程序时，必须格外小心。现有这几套系统互相不认对方的存在，一旦遇上就可能行为异常——往往没有任何错误提示，只是显示一片空白。

让情况更复杂的是：ePub 的 DRM 通常只施加在容器内的一部分文件上。这会让一本电子书在阅读器里"看似能用"——有些东西显示正常，另一些却不正常。

最容易迷惑人的一种"部分加密"是：电子书里声明的内嵌字体被加密了，而其他元素没有。这在使用了版权字体时就会出现。另一种对用户干扰更小的做法是使用混淆字体（obfuscated fonts）：对内嵌字体集做异或（XOR）处理，把字体遮蔽起来，让人无法把它单独提取出来使用。这有时就能满足字体设计师提出的版权要求。

随着 [ePub 3](https://wiki.mobileread.com/wiki/EPUB_3) 上市，DRM 还会变得更复杂——这一版 ePub 支持[音频](https://wiki.mobileread.com/wiki/Audio)和[视频](https://wiki.mobileread.com/wiki/Video)媒体，它们各自还可以有自己的一套 DRM。

## Kindle 的 DRM

[Amazon Kindle](https://wiki.mobileread.com/wiki/Amazon_Kindle) 产品线有许多种互不相同的专有格式，它们全都支持同一套 DRM 体系。DRM 直接施加在容器格式 [AZW](https://wiki.mobileread.com/wiki/AZW) 上，而 AZW 基于 Palm [PDB](https://wiki.mobileread.com/wiki/PDB) 格式。它也是 [MOBI](/zh/wiki/formats/mobi/) 的基础——Amazon 收购了 Mobipocket，并把这套基本方案用在了自家所有格式上。如果抛开 DRM 差异不谈，MOBI 格式和 AZW 格式本质上是一样的。但内部原始数据的格式可能天差地别：例如 [AZW4](https://wiki.mobileread.com/wiki/AZW4) 装的是用 Amazon 容器包起来的 [PDF](https://wiki.mobileread.com/wiki/PDF) 内容，而 [KF8](https://wiki.mobileread.com/wiki/KF8) 装的是 [ePub](/zh/wiki/formats/epub/) 内容；[TPZ](https://wiki.mobileread.com/wiki/TPZ)（又称 [AZW1](https://wiki.mobileread.com/wiki/AZW1)）则是另一种 Amazon 格式，装的是 [OCR](https://wiki.mobileread.com/wiki/OCR) 扫描文件。除图书馆支持这一例外，Amazon 从未向任何其他公司授权使用他们的 DRM。

Amazon 为图书馆外借场景修改过 DRM 方案，让它支持到期失效。他们与美国的图书馆合作，在馆内提供图书的 AZW 版本。

随着收购 Mobipocket，Amazon 也继承了 MOBI 的 DRM 方案。对该格式的支持已于 2016 年 10 月 31 日终止。

（本站另译有《[Kindle 5.x 软件越狱](/zh/wiki/kindle/jailbreak/)》，可作 Kindle 设备相关的延伸阅读。）

## HDCP

高带宽数字内容保护（High-bandwidth Digital Content Protection，HDCP）是 Intel 公司开发的一项安全特性（也就是前文所说的 DRM）：要接收 HDCP 加密的数字信号，收发两端都必须使用经过 HDCP 认证的产品。它面向视频／音频内容，依靠 [HDMI](https://wiki.mobileread.com/wiki/HDMI) 握手（handshaking）工作。

其原理是用一个密钥加密数字信号，且发送端和接收端都必须通过该密钥的认证。2.2 版面向 4K 产品，主要出现在蓝光播放器和卫星／有线机顶盒这类 HDTV 设备上。

## ExpressPlay

[ExpressPlay](https://www.expressplay.com/) 自称是出自"DRM 发明者"之手、基于云的内容保护系统。它宣称支持 [iOS](https://wiki.mobileread.com/wiki/IOS)、[Android](https://wiki.mobileread.com/wiki/Android) 和 Silverlight 技术所维护的所有媒体格式与编码，覆盖手机、笔记本、游戏主机、联网电视和其他媒体消费设备上的多种设备。ExpressPlay 足够灵活，能支撑大多数主流服务——从直播流媒体和回看电视，到音乐订阅，乃至机上和车载娱乐。

## 其他格式

电子书、多媒体文件以及其他用途还有许多别的 DRM 方案。

Microsoft 为他们的电子书（[LIT](https://wiki.mobileread.com/wiki/LIT)）、音乐（[WMA](https://wiki.mobileread.com/wiki/WMA)）甚至[视频](https://wiki.mobileread.com/wiki/Video)文件都配有 DRM。Microsoft 的 WMDRM 可以像 Adobe 的方案那样对外授权，AIV、BBC iPlayer、Rhapsody、Nokia OVI 等许多在线数字商店都用它加密自己的数字媒体内容。

Sony 的 OpenMG 用于 Sony 名为 "Connect" 的在线音乐下载服务。

Apple 也有一套（或曾有一套）[FairPlay DRM](https://wiki.mobileread.com/wiki/FairPlay_DRM)，用于通过 iTunes 购买的电子书、音乐（[AAC](https://wiki.mobileread.com/wiki/AAC)）和视频文件。

其余大多数 DRM 方案只服务于格式所有者自家的格式。例如 [MOBI](/zh/wiki/formats/mobi/) 有自己的 DRM 方案，Kindle 也有自己的 DRM 方案（与 MOBI 的不同，尽管相似）。[Kobo](https://wiki.mobileread.com/wiki/Kobo) 的常规 ePub 图书用 [Adobe DRM](https://wiki.mobileread.com/wiki/Adobe_DRM)，但存放在它的 [kepub](https://wiki.mobileread.com/wiki/Kepub#DRM) 数据库里的书用的是一套内部方案（KDRM）。若干不太流行的格式也有各自专属的方案。

还有一个叫 CPRM 的标准——可刻录媒体拷贝保护（copy protection for recordable media）——用于 [SD 卡](https://wiki.mobileread.com/wiki/SD_card)上可能发行的部分电影和音乐，它们使用 SD 卡上的一块专用区域。支持 SD 卡的电子书阅读器多半不支持 CPRM，不过某些平板或许可以。

## 图书馆的应用

出借电子书的图书馆普遍使用 DRM。在这种场景下，DRM 向借阅者提供一份有时限的授权。图书馆清点自己购入的授权数量并据此控制外借，就像管理实体书一样——区别只是不需要"还书"，到期授权自动失效。更多信息参见 [Library DRM and Devices](https://wiki.mobileread.com/wiki/Library_DRM_and_Devices)。

目前支持限时外借的电子书格式包括 [PDF](https://wiki.mobileread.com/wiki/PDF)、[ePub](/zh/wiki/formats/epub/) 和 [AZW](https://wiki.mobileread.com/wiki/AZW)（以前是 [MOBI](/zh/wiki/formats/mobi/)，至少在美国已被 Amazon 换成了 AZW）。支持限时外借的[音频](https://wiki.mobileread.com/wiki/Audio)格式包括安全 WMA。图书馆的支持服务主要由 [Overdrive](https://wiki.mobileread.com/wiki/Overdrive) 提供。

支持图书馆外借的图书馆与电子书阅读设备清单，见 [EBook Lending Libraries](https://wiki.mobileread.com/wiki/EBook_Lending_Libraries)。

## 字体 DRM

许多[字体](https://wiki.mobileread.com/wiki/Fonts)拥有独立的版权。内嵌在电子书里的字体同样可以施加 DRM。有时电子书本身不用 DRM，字体却仍受保护。除了传统的 DRM，有些内嵌字体还会做混淆处理，防止字体被拿到电子书之外使用。

## 对 TTS 的影响

视力障碍读者常用 [TTS](https://wiki.mobileread.com/wiki/TTS)（Text To Speech，文本转语音）引擎把页面上的文字读给自己听。试图阅读非母语图书来学习语言的读者也会用到这一功能。然而 DRM 会影响 TTS 的使用，因为它可能阻止外部应用读取数据。更多信息见 [Daisy 出版物](http://www.daisy.org/publications/docs/soundproof/sound_proof_book.html)。值得注意的是，美国的残障人士法案为合法访问（包括破解 DRM）提供了法律依据，以允许读书——这一点有利于 TTS；但如果该电子书同时以[有声书](https://wiki.mobileread.com/wiki/Audio_book)形式销售，DRM 仍可能被用来禁用 TTS 功能。还要注意：这只适用于确实需要该功能的残障用户，并不是随意破解 DRM 的通行证。另见 [Read aloud](https://wiki.mobileread.com/wiki/Read_aloud)。

## 其他限制

DRM 还能阻止打印书中的哪怕一部分内容，也可以限制一本书能被阅读的次数。

## 移除 DRM

在一些国家，移除电子书的 DRM 是违法的。这与[版权](https://wiki.mobileread.com/wiki/Copyright)相关：未经许可复制或传播受版权保护的材料属于违法，仅在少数例外情形下可以，例如在另一部作品中引用某个段落。在美国，DMCA（《数字千年版权法案》，Digital Millennium Copyright Act）禁止移除 DRM。不过，"合理使用"（fair use）原则的支持者认为，移除 DRM 是让用户在自己购买的内容上实现合理使用的正当途径。通常，移除 DRM 的程序要求使用者输入当初施加 DRM 时所用 的正确 ID，因此这类程序并不能无差别地移除该格式下任何一本电子书的 DRM。分发或使用这类程序在你所在的国家可能是违法的。典型的移除目标包括 [LIT](https://wiki.mobileread.com/wiki/LIT)、[MOBI](/zh/wiki/formats/mobi/)、Adobe 版 [ePub](/zh/wiki/formats/epub/)、部分 Adobe [PDF](https://wiki.mobileread.com/wiki/PDF)、[eReader](https://wiki.mobileread.com/wiki/EReader) 以及 Barnes and Noble 版的 eReader 和 ePub。其他常见格式（例如 [LRX](https://wiki.mobileread.com/wiki/LRX)）目前没有已知的 DRM 移除方法。

违反 DMCA、提供 DRM 移除站点的链接，是违反 MobileRead 政策的行为。请不要在本 wiki 中放置此类链接。

## 另见

- [Choosing An Ebook Reader](https://wiki.mobileread.com/wiki/Choosing_An_Ebook_Reader)：其中有一段关于选购阅读器时如何考量 DRM 的讨论。
- [Digital Millennium Copyright Act（Wikipedia 条目）](http://en.wikipedia.org/wiki/DMCA)
- [Digital Rights Management（Wikipedia 条目）](http://en.wikipedia.org/wiki/Digital_Rights_Management)
- [美国法典第 17 编第 12 章](http://www.copyright.gov/title17/92chap12.html)：美国政府出版的 DMCA（与 DRM 相关部分）章节原文。
- [Free DRM test book](http://www.fictionwise.com/eBooks/eBook1764.htm?cache)：《八十天环游地球》（"Around the world in 80 days"），一本 [MOBI](/zh/wiki/formats/mobi/) 格式电子书，可在真正购书前用来测试你阅读器的 DRM 功能。（已不可用）
- [Adobe Content Server](http://www.adobe.com/products/content-server.html)：Adobe 最新的 DRM 引擎，允许出版商自行管理自己的 DRM。
