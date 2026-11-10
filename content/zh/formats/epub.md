---
title: "EPUB 格式详解"
original_title: "EPub"
source_url: https://wiki.mobileread.com/wiki/EPub
original_author: MobileRead Wiki 贡献者（DaleDe 主笔，Dgatwood、Bookmedia123 等）
translated_at: 2026-11-10
order: 1
description: EPUB 电子书格式深度解析：OCF 容器、OPF 包装与 OPS 内容三大组成标准，mimetype 与 container.xml 的约定，DRM 与字体混淆，各平台阅读器及制作、编辑、转换、校验工具盘点，外加 iBooks/ADE/Nook/Kobo 的 CSS 兼容技巧。
---

> 本文译自 MobileRead Wiki 的《EPub》页面，原文最后修订于 2021-06-04。
> 原文中的论坛帖链接与外部站点链接按原样保留，仅作为出处与入口引用，本站不镜像论坛内容。
> EPUB 规范版本迭代较快（EPUB 2/3/3.2/3.3），本文反映原文修订时点的状态。

**ePub** 是一种开放格式，由国际数字出版论坛（IDPF，International Digital Publishing Forum）下属的 Open eBook Forum 定义。它基于 XHTML 与 XML，可选搭配 CSS 样式表。其前身是 [OEB（Open eBook）](https://wiki.mobileread.com/wiki/Open_eBook)标准。规范可在 IDPF 网站查阅。本页讲的是 ePub 2.01 版，第 3 版请见 [ePub 3](https://wiki.mobileread.com/wiki/EPub_3)，另见[固定版式 ePub](https://wiki.mobileread.com/wiki/Fixed_layout_ePub)。

## 定义

引自 IDPF 网站：

".epub 是一种用于可重排（reflowable）电子书与出版物的 XML 格式的文件扩展名。.epub 由三项开放标准组成——开放出版结构（OPS）、开放包装格式（OPF）与开放容器格式（OCF），均由 IDPF 制定。.epub 让出版者只需制作并分发一个数字出版物文件，也让消费者在阅读未加密的可重排电子书及其他出版物时，获得软件/硬件之间的互操作性。1999 年最初发布的《Open eBook Publication Structure》（[OEB](https://wiki.mobileread.com/wiki/OEB)）是 OPS 的前身。"

## 用法

ePub 的设计意图是同时充当**源文件格式**和**最终用户格式**。因此，各文件被收进一个容器，方便传播与使用。这个容器通常是一个 zip 文件，只是扩展名改成了 .epub。它有特殊的构建要求：必须把一个未压缩的 mimetype 文件作为容器内的第一个条目，其余数据则应当压缩存放。ePub 阅读器应当能直接读取压缩格式的内容。

**MIME 类型**：Multipurpose Internet Mail Extensions（RFC 2045）。"MIME media types"（MIME 媒体类型）为指定对象的内容类型提供了一套标准方法。

## 规范

[IDPF 规范页面](http://www.idpf.org/)上有本格式的各项规范，尤其要看的 2.01 版 OPS、OPF 规范和 1.01 版 OCF 规范。那些资料性文档（informational documents）对理解标准的设计意图与内容也相当有用。注意：idpf.org 的参考资料如今只是该站点的存档，现行官网是 https://www.w3.org/publishing/ 。

### OCF（开放容器格式）

OCF 全称 Open Container Format（开放容器格式）。一个典型的 OCF 是一个 zip 文件，大致长这样：

```text
 mimetype
 META-INF/
   container.xml
   [manifest.xml]
   [metadata.xml]
   [signatures.xml]
   [encryption.xml]
   [rights.xml]
 OEBPS/
   Great Expectations.opf
   cover.html
   chapters/
      chapter01.html
      chapter02.html
      … other HTML files for the remaining chapters …
   images/
      cover.jpg
```

#### mimetype 文件

ZIP 容器中的**第一个**文件必须是一个 ASCII 文件名为 mimetype 的文件，内容是该 ZIP 容器的 MIME 类型（即 application/epub+zip，一个 **20 字符的 ASCII 字符串**；无填充、无 CR/LF、无空白字符、不能改变大小写）。该文件不得压缩、不得加密，其 ZIP 头部也不得有额外字段（extra field）。这样设计的用意，是让 Unix 的 file 命令这类程序不用解压就能识别文件内容。用 Zip 实现的方法是：先单独把 mimetype 打成 zip 包，之后再往里添加其余文件。

#### container.xml

container.xml 是一个必需文件，文件名也固定不可改。它必须位于 META-INF 文件夹内；其余文件夹都是可选的，名字随用户自定。container.xml 文件给出 OPF 文件的文件名和位置。

### OPF（开放包装格式）

开放包装格式（[OPF](https://wiki.mobileread.com/wiki/OPF)，Open Packaging Format）规范定义了一套机制，把 OPS 出版物的各个组成部分绑在一起，并为电子出版物提供额外的结构与语义。

具体来说，OPF：

- 描述并引用电子出版物的全部组成部分（如标记文件、图像、导航结构）；
- 提供出版物级[元数据](https://wiki.mobileread.com/wiki/Metadata)，应当采用 Dublin Core 格式的数据，ePub 元数据的具体能力见 [Metadata 页的 ePUB metadata 一节](https://wiki.mobileread.com/wiki/Metadata#ePUB_metadata)；
- 指定出版物的线性阅读顺序；
- 在使用了 OPS 不支持的扩展时提供回退（fallback）信息；
- 提供一套声明式目录（[NCX](https://wiki.mobileread.com/wiki/NCX)）的指定机制；
- 可以指向嵌入字体等其他可选元素。

一个示例：

```xml
 <package version="2.0" xmlns="http://www.idpf.org/2007/opf"
         unique-identifier="BookId">
     <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:opf="http://www.idpf.org/2007/opf">
           <dc:title>Alice in Wonderland</dc:title>
           <dc:language>en</dc:language>
           <dc:identifier id="BookId" opf:scheme="ISBN">
            123456789X
           </dc:identifier>
           <dc:creator opf:role="aut">Lewis Carroll</dc:creator>
           <dc:description>
               The story of a little girl who travels to a new world by walking
               through a looking glass.
           </dc:description>
     </metadata>
     <manifest>
        <item id="intro" href="introduction.html"
                media-type="application/xhtml+xml" />
        <item id="c1" href="chapter-1.html"
                media-type="application/xhtml+xml" />
        <item id="c2" href="chapter-2.html"
                media-type="application/xhtml+xml" />
        <item id="toc" href="contents.xml"
                media-type="application/xhtml+xml" />
        <item id="oview" href="arch.png"
                media-type="image/png" />
     </manifest>
     <spine toc="ncx">
        <itemref idref="intro" />
        <itemref idref="toc" />
        <itemref idref="c1" />
        <itemref idref="c2" />
        <itemref idref="oview" linear="no" />
     </spine>
 </package>
```

#### 必需元素

- 标题（title）永远必需。
- 作者（creator）若已知则必需。支持 file-as 属性以提供标准化的姓名顺序；也可选用 role 属性（见上面的示例）。
- 语言（language）元素。
- 唯一标识符（可取 [此处所列](https://idpf.github.io/epub-registries/identifiers/)的 DOI、ISBN、JDCN 或 UUID）。
- 日期（date）不是必需但鼓励填写，可用 event 属性细化该日期的用途。

#### 唯一标识符（Unique ID）

唯一 ID 是 OPF 中的必需元素。这里给出一种获取方式——点开这个网站它就会给你一个 ID：http://www.famkruithof.net/uuid/uuidgen 。另有属性 scheme 用来标识来源或授权机构（见上面的示例）。还有一个 UUID 生成站点：https://www.uuidgenerator.net/

使用 UUID 时，identifier 那一行应该长这样：

```xml
<dc:identifier opf:scheme="uuid">50f9f8b1-8a81-4dd5-b104-0766188d7d2c</dc:identifier>
```

### OPS（开放出版结构）

开放出版结构（OPS，Open Publication Structure）规范描述了表示电子出版物内容的标准。

具体来说：

- 该规范旨在给内容提供方（如出版商、作者及其他拥有待展示内容的人）和出版工具提供方一套最小且通用的准则，确保电子内容在各类阅读系统（Reading System）上的保真度、准确性、可访问性与呈现质量。
- 该规范力求反映既有的内容格式标准。
- 该规范的目标是定义一种标准的内容描述方式，供电子书从业者（出版商、代理、作者等）使用，使内容可以交付给多种阅读系统，并尽量保证各阅读系统间呈现效果的一致性。

ePub 3 标准对 OPS 作了重大修改，它现在的名字是 [The Content Documents（内容文档）](https://wiki.mobileread.com/wiki/EPub_3#The_Content_Documents)。

#### XHTML

[XHTML](https://wiki.mobileread.com/wiki/XHTML) 是预定义的 XML，因此文档应以这一行开头：

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
```

其中 encoding 一项定义书里使用的[字符集](https://wiki.mobileread.com/wiki/Characters)，默认为 Unicode UTF-8；UTF-16 也必须被支持，但不必所有字形都在字体集中出现。

符合规范的 OPS 文档必须支持下列 XHTML 构造。

| XHTML 1.1 模块名 | 元素（非规范） | 说明 |
| --- | --- | --- |
| Structure | body, head, html, title | body 的默认渲染等同于设置了 CSS 属性 page-break-before: right（在单页阅读系统上表现为"总是开新页"），但可被适当的样式表声明覆盖。 |
| Text | abbr, acronym, address, blockquote, br, cite, code, dfn, div, em, h1, h2, h3, h4, h5, h6, kbd, p, pre, q, samp, span, strong, var | 可选属性 cite 可用于 blockquote、q、del 和 ins，为元素内容提供 URI 引用。无论该资源是否列在 manifest 中，阅读系统都不必处理或使用被引用的 URI 资源。 |
| Hypertext | a | 阅读系统可以使用或渲染 manifest 之外引用的 URI 物理资源（即不属于出版物组成部分的资源），但没有义务这么做。 |
| List | dl, dt, dd, ol, ul, li | |
| Object | object, param | object 元素是通用对象嵌入的首选方法。当添加的对象其数据媒体类型不在 OPS 核心媒体类型（Core Media Type）列表之内，或通过 classid 属性引用了某种对象实现时，object 元素必须为该对象指定回退信息，例如另一个 object、一个 img 元素或描述性文字。 |
| Presentation | b, big, hr, i, small, sub, sup, tt | b（粗体）是 strong 的默认渲染，i（斜体）是 em（强调）的默认渲染。 |
| Edit | del, ins | |
| Bidirectional Text | bdo | |
| [Table](https://wiki.mobileread.com/wiki/Table) | caption, col, colgroup, table, tbody, td, tfoot, th, thead, tr | 基本的 XHTML 表格元素包括 caption、table、th、tr、td。 |
| Image | img | 行内元素 img 应只用于引用 OPS 核心媒体类型为 [GIF](https://wiki.mobileread.com/wiki/GIF)（http://www.w3.org/Graphics/GIF/spec-gif89a.txt）、[PNG](https://wiki.mobileread.com/wiki/PNG)（RFC 2083）、[JPG](https://wiki.mobileread.com/wiki/JPG)/JFIF（http://www.w3.org/Graphics/JPEG）或 [SVG](https://wiki.mobileread.com/wiki/SVG)（http://www.w3.org/TR/SVG11/）的图像。必需的 URI 属性 src 用来引用图像资源，该资源必须列在 manifest 中。必需的 alt 属性应包含对图像简短而有信息量的文字描述；阅读系统可以把它作为显示图像的替代或补充。当 img 的 src 引用了非 OPS 核心媒体类型且 manifest 中找不到可行回退时，这段文字也是可接受的回退。 |
| Client-Side Image Map | area, map | |
| Meta-Information | meta | |
| Style Sheet | style | style 元素的 type 属性是必需的，取值必须是 text/css 或已废弃的 text/x-oeb1-css。 |
| Style Attribute（已废弃） | style 属性 | |
| Link | link | link 元素允许指定与其他文档的多种关系。阅读系统必须识别通过 href 属性与关联的 rel 属性指定的外部样式表引用（rel="stylesheet" 与 rel="alternate stylesheet" 两种取值）。 |
| Base | base | ePUB 文件的根（root）是容器内文件层级的顶端。 |

### DRM（数字版权管理）

ePUB 标准不认可任何特定的 [DRM](/zh/wiki/formats/drm/)（数字版权管理）方案，但为其留出了实现空间。当前最流行的 DRM 方案是 [Adobe Digital Editions](https://wiki.mobileread.com/wiki/Adobe_Digital_Editions) 自产自用的那一套，[Overdrive](https://wiki.mobileread.com/wiki/Overdrive) 已将它授权用于图书馆业务，许多其他出版商也在用。DRM 施加在 ePub 容器内部的各个文件上。其他 DRM 系统还包括：[Barnes and Noble](https://wiki.mobileread.com/wiki/Barnes_and_Noble) 的一个分支方案（由 Adobe DRM 服务器支持），以及 Apple 的 [FairPlay DRM](https://wiki.mobileread.com/wiki/FairPlay_DRM) 方案（用在运行 [iBooks](https://wiki.mobileread.com/wiki/IBooks) 的 [iPad](https://wiki.mobileread.com/wiki/IPad) 和 [iPhone](https://wiki.mobileread.com/wiki/IPhone) 设备上）。

也可以对 ePub 文件内嵌的[字体](https://wiki.mobileread.com/wiki/Fonts)直接施加 DRM，此外还存在混淆（obfuscation）内嵌字体文件的方案。标准定义了一种混淆方法，但 Adobe 另行定义了一种略有差异的方法，而且后者目前占主导。混淆字体使用 XOR（异或）技术打乱内嵌字体集，令其无法被单独提取出来使用。这么做是为了满足字体设计师提出的版权要求。

DRM 有一个配合图书馆外借使用的权限文件（rights 文件），示例如下：

```text
 \META-INF\right.xml
```

```xml
 <permissions>
  <display>
   <until>2015-08-01T22:00:00Z</until>
  </display>
  <play>
   <until>2015-08-01T22:00:00Z</until>
  </play>
 </permissions>
```

### 与其他标准的关系

**与 NVDL 的关系**

本规范使用 NVDL 语言（见 http://standards.iso.org/ittf/PubliclyAvailableStandards/c038615_ISO_IEC_19757-4_2006(E).zip ）作为一种手段，来无歧义地定义本规范所用各种模式（schema）之间的交互。NVDL 支持多种 XML 模式语言之间的交互与校验，OPS 的规范性 NVDL 定义见其附录 A。

本规范并不要求使用 NVDL 工具来校验 OPS 文档，尽管此类工具确实存在且可用于校验。

**与 XHTML 和 DTBook 的关系**

本规范认识到现有软件工具、存量数据、出版实践与市场状况的重要性，因此把部分 XHTML 1.1 文档类型模块和 [DTBook](https://wiki.mobileread.com/wiki/DTBook) 纳入了"首选词汇集"（Preferred Vocabularies）。这一思路让内容提供方可以继续利用现有的 XHTML 与 DTBook 内容、工具和经验。

为了减轻阅读系统实现者的负担（他们面对的设备可能有功耗和显示方面的限制），首选词汇集并没有收入 XHTML 1.1 的全部元素和属性。此外，从 XHTML 1.1 规范中挑选模块时，也刻意与 XHTML 的当前发展方向保持一致。

凡在 XHTML 1.1 中已废弃的构造，在本规范中要么废弃、要么干脆不收录；多数这类情形都提供了基于 CSS 的等价物。对于 XHTML 之外的新的呈现功能，也通过样式表构造来实现。

**与 CSS 的关系**

本规范定义了一套基于 CSS 2 的样式语言（见 http://www.w3.org/TR/CSS2/ ）。样式表 MIME 类型 text/x-oeb1-css 已废弃，改用 text/css。注意并非 CSS 2 的全部都被支持，另有一些带 oeb- 前缀的扩展（oeb-page-head、oeb-page-foot、oeb-column-number），不过许多 ePub 阅读器本来也不支持这些特性。

**与 XML 的关系**

OPS 基于 [XML](https://wiki.mobileread.com/wiki/XML)，是因为它足够通用和简单，也因为 XML 文档很可能良好地适应未来的技术与用途。XML 还为文档语法定义了明确的规则，这降低了实现者的成本，减少了系统间的不兼容。此外，XML 是可扩展的：它不绑定于任何特定的文档类型或元素类型集合，支持国际化，并鼓励能更直接表示文档内部各部分的标记方式，使文档便于自动排版和其他计算机处理。

- 阅读系统必须是 XML 1.1 所定义的 XML 处理器。所有 OPS 内容文档都必须是符合各自模式的有效 XML 文档。

**与 XML 命名空间的关系**

阅读系统必须按照 XML 命名空间建议书（http://www.w3.org/TR/xml-names11/ ）处理 XML 命名空间，例如：

```xml
 xmlns:ops="http://www.idpf.org/2007/ops"
```

**与 Dublin Core 的关系**

[Dublin Core](https://wiki.mobileread.com/wiki/Dublin_Core) 是 ePub 文档中所有[元数据](https://wiki.mobileread.com/wiki/Metadata)的既定标准。只有 id、title 和 language 是必需的，但鼓励填写其他条目；作者（author）若已知当然应该填写。

## 阅读器

### 软件

- [Adobe Digital Editions](https://wiki.mobileread.com/wiki/Adobe_Digital_Editions)——既能读带 Adobe DRM 的 ePUB 电子书，也能读无 DRM 的。
- [AlReader](https://wiki.mobileread.com/wiki/AlReader)——还支持许多其他格式，用于 Windows Mobile、Pocket PC 产品以及 Windows。
- [AZARDI](https://wiki.mobileread.com/wiki/AZARDI)——读取 ePUB 并校验其规范性。
- [Bookworm](https://wiki.mobileread.com/wiki/Bookworm)。
- [Calibre](https://wiki.mobileread.com/wiki/Calibre)——[Windows](https://wiki.mobileread.com/wiki/Windows)、MacOS X 和 [Linux](https://wiki.mobileread.com/wiki/Linux)。
- [Cool Reader](https://wiki.mobileread.com/wiki/Cool_Reader)——Windows、Linux 和 [Android](https://wiki.mobileread.com/wiki/Android)。
- [EPUBReader](https://wiki.mobileread.com/wiki/EPUBReader)——Firefox 扩展，Firefox 能跑的地方都能用。
- [Freda](https://wiki.mobileread.com/wiki/Freda)——Windows 8/RT、Windows Phone 7/8、Windows Mobile 2003、5.x、6.x，还能读 TXT 和 FB2。
- [FBReader](https://wiki.mobileread.com/wiki/FBReader)——Windows、Linux 等。
- [OpenBerg Lector](https://wiki.mobileread.com/wiki/OpenBerg_Lector)——浏览器插件。
- [Stanza](https://wiki.mobileread.com/wiki/Stanza)——Windows、MacOS X 和 iPhone。
- [i2Reader](http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=322680924&mt=8)——iPhone。
- [ZuluReader](https://wiki.mobileread.com/wiki/ZuluReader)——在 Windows Mobile 的 PocketPC 或 Smartphone 上读 ePUB 和 [RTF](https://wiki.mobileread.com/wiki/RTF)。
- [QuickReader](https://wiki.mobileread.com/wiki/QuickReader)——iPhone、iPod Touch 和 iPad，覆盖全部 [iOS](https://wiki.mobileread.com/wiki/IOS)。
- [MegaReader](http://www.megareader.net)——iPhone、iPod Touch 和 iPad。
- [txtr eBook Reader](http://txtr.com/install/)——Android、iPhone、iPod Touch 和 iPad。
- [Reader](https://github.com/Yetangitu/owncloud-apps/tree/master/files_reader) 是一款多格式电子书阅读器，跑在 [Nexctcloud](https://nextcloud.com/)（原文如此）和 [Owncloud](https://owncloud.com) 个人云服务器上；除 EPUB 外还支持 CBR 和 CBZ。

### 硬件

- [Apple iPad](https://wiki.mobileread.com/wiki/IPad)——只支持无 DRM 的 EPUB。
- [Sony Reader PRS-700](https://wiki.mobileread.com/wiki/PRS700)——Sony 阅读器还支持 Adobe ADEPT（DRM）技术（EPUB/PDF）。
- [Sony Reader PRS-505](https://wiki.mobileread.com/wiki/PRS505)——除其他改进外，V1.1（2008 年 7 月）固件更新为 505 增加了 ePub 支持。
- [Sony Reader PRS-500](https://wiki.mobileread.com/wiki/PRS500)——除其他改进外，2009 年 11 月的 PRS-500 固件更新为 500 增加了 ePub 支持。
- [PRS600](https://wiki.mobileread.com/wiki/PRS600) 和 [PRS300](https://wiki.mobileread.com/wiki/PRS300)——使用 ADE。
- [Hanlin V3](https://wiki.mobileread.com/wiki/Hanlin_V3) 及其全部克隆机（[Bebook](https://wiki.mobileread.com/wiki/Bebook)、[EZ Reader](https://wiki.mobileread.com/wiki/EZ_Reader) 等，完整名单见[这里](https://wiki.mobileread.com/wiki/Hanlin_V3#Dealers_and_OEM_customers)）——无 DRM；2009 年 8 月发布的新固件采用了支持 DRM 的 [ADE](https://wiki.mobileread.com/wiki/ADE) 软件。
- [Hanlin V5](https://wiki.mobileread.com/wiki/Hanlin_V5) 及其全部克隆机——使用 ADE。
- [JetBook](https://wiki.mobileread.com/wiki/JetBook)——最新固件使用 ADE，另见 [JetBook Lite](https://wiki.mobileread.com/wiki/JetBook_Lite)。
- [Bookeen Cybook Opus](https://wiki.mobileread.com/wiki/Bookeen_Cybook_Opus)——通过 ADE 完整支持。
- [Netronix](https://wiki.mobileread.com/wiki/Netronix) 的 [EB-600](https://wiki.mobileread.com/wiki/EB-600) 及其全部克隆机——最新版本带 ADE，购买前先确认。
- [Hanvon WiseReader N516](https://wiki.mobileread.com/wiki/N516)——还支持 PDF。
- [Onyx Boox](https://wiki.mobileread.com/wiki/Boox60)——还支持 fb2 和 PDF。
- [Barnes&Noble NOOK](https://wiki.mobileread.com/wiki/Nook)——支持 ePub 和 PDF。
- [Chapters/Indigo Kobo](https://wiki.mobileread.com/wiki/Kobo)——支持 ePub 和 PDF。
- [BK6000](https://wiki.mobileread.com/wiki/BK6000)——无 DRM EPUB、FB2、HTML、PDF（另有重排模式）。

## ePub 制作与处理软件

### 制作工具

这类工具可以创建（导出）ePub 文件。所谓编辑，就是修改源文件后重新生成一个新的 ePub。

- [Adobe InDesign](http://www.adobe.com/products/indesign/)
- [Apple Pages](http://www.apple.com/iwork/pages/)——可导出 ePub 文件。Apple Pages '09 文字处理器是 [iWork](https://wiki.mobileread.com/wiki/IWork) '09 套件的一部分，仅限 Mac OS X；必须先装上最新软件更新才能启用 ePub 导出。
- [Atlantis Word Processor](http://www.atlantiswordprocessor.com/en/help/index.php?page=html/ebook.htm)——可将任意 TXT/RTF/DOC/DOCX 文档转成 ePub，支持多级目录、字体嵌入和批量转换。
- [DAISY Pipeline](https://wiki.mobileread.com/wiki/DAISY_Pipeline)——制作与检查工具。
- [eCub](https://wiki.mobileread.com/wiki/ECub)——简单易用的 EPUB 与 MobiPocket 电子书制作器。
- [ePubSTAR](http://www.by-smart.com/epubstar/epubstar_en.html)——从 Word、TXT、CHM 转换到 ePub 2 或 ePub 3。
- [EPubPack](https://wiki.mobileread.com/wiki/EPubPack)——一个非常专门的工具：从一个已具备 ePub 结构的文件夹构建 ePub，也可用来重新打包你解压过的 ePub。
- [ePUB Tools](http://code.google.com/p/epub-tools/)——一组用于创建和检查 ePUB 的开源工具。
- [ePub Zip for Mac OS X](http://www.mobileread.com/forums/showthread.php?t=55681)——在 Mac OS X 上把文件夹拖拽进来即生成 ePub 文件。
- [EScape](https://wiki.mobileread.com/wiki/EScape)——Open Office（[ODT](https://wiki.mobileread.com/wiki/ODT)）的附加组件，非商业用途。
- [Jutoh](http://www.jutoh.com)——廉价的所见即所得电子书编辑器，支持 Windows、Mac OS X、Linux、FreeBSD 和 Solaris x86。
- [OpenBerg Rector](http://openberg.sourceforge.net/?page_id=54)。
- [Writer2ePub](https://wiki.mobileread.com/wiki/Writer2ePub)——Open Office Writer 的宏，可直接保存 ePUB 文件。
- [Scrivener](http://www.literatureandlatte.com/scrivener.php)——写作工具，带可配置的 ePUB 导出器。最初仅 Mac OS X，现在也支持 Windows，Linux 版为 beta。
- [RoboHelp](https://wiki.mobileread.com/wiki/RoboHelp)——Adobe 出品，用于 Windows。
- [Moopato eBook Writer](http://moopato.com)——面向无干扰写作的电子书写作软件，支持用 markdown 写作，可构建 ePub 2 和 [MOBI](/zh/wiki/formats/mobi/)；有 Windows 和 MacOS X 版。

另见：[ePub programming](https://wiki.mobileread.com/wiki/EPub_programming)。

### 编辑工具

以下工具可以打开并编辑现有的 ePub 文件，也可以当作制作工具用。

- [Kotobee](https://wiki.mobileread.com/wiki/Kotobee)——获奖的电子书创作软件，可编辑、制作出色的互动电子书并发布。
- [Sigil](https://wiki.mobileread.com/wiki/Sigil)——直接修改或创建 ePUB 文件的编辑器（文字处理器）。
- [Calibre](https://wiki.mobileread.com/wiki/Calibre)——用于管理和转换电子书，但自带一个相当好且在不断改进的编辑器。
- [Atova.com](http://www.altova.com/xmlspy/epub-editor.html)——商业工具，有免费试用。
- [IGP Digital Publisher](https://wiki.mobileread.com/wiki/IGP_Digital_Publisher)——用于 Windows。
- [BlueGriffon](https://wiki.mobileread.com/wiki/BlueGriffon)——基于 BlueGriffon 网页编辑器的 [WYSIWYG](https://wiki.mobileread.com/wiki/WYSIWYG) EPUB 编辑器兼阅读器，支持 Windows、Mac 和 Linux，ePub 3 与 ePub 2 都能做。
- [Pubcoder.com](http://www.pubcoder.com/en/)——彼时处于免费 beta 阶段，面向 [ePub 3](https://wiki.mobileread.com/wiki/EPub_3) 和 [KF8](https://wiki.mobileread.com/wiki/KF8)，针对 [iBooks](https://wiki.mobileread.com/wiki/IBooks)、[Readium](https://wiki.mobileread.com/wiki/Readium)、[Kobo](https://wiki.mobileread.com/wiki/Kobo) 和 [Kindle](https://wiki.mobileread.com/wiki/Kindle) 优化。
- [Tweak EPUB](https://wiki.mobileread.com/wiki/Tweak_EPUB)——一个能看进 ePub 内部、允许你用外部编辑器修改其中部分内容的工具。
- [EPub Optimizer](https://wiki.mobileread.com/wiki/EPub_Optimizer)——优化 ePub 文件中的图像，并从内嵌字体中移除未使用的字形以缩小体积。
- [Chapters](http://www.twobytesoftware.com)——在 Mac 上打开、创建和编辑 ePub 文档。
- [EPub Metadata Editor](https://wiki.mobileread.com/wiki/EPub_Metadata_Editor)——查看和编辑[元数据](https://wiki.mobileread.com/wiki/Metadata)。

另见：[ePub programming](https://wiki.mobileread.com/wiki/EPub_programming)。

### 转换工具

- [Calibre](https://wiki.mobileread.com/wiki/Calibre)——点击工具栏上的"锤子"图标，把默认输出格式设为 EPUB。
- [ePuper](http://www.epuber.de/)——德国免费软件，把报纸的网络版转成 ePUB。
- [eBook Converter](http://www.ebook-tool.com/ebook-converter.htm)——PDF 转 ePUB、ePUB 转 PDF、ePUB 转 Mobi、Mobi 转 ePUB 等。
- [在 Feedbooks.com 上传转换成 ePUB](http://www.feedbooks.com)——不必点"publish"按钮，编辑好文本直接下载 ePub 预览即可。
- [Python converter](http://www.mobileread.com/forums/showthread.php?p=78356)——由 MishaS 发布，其最新版 [oeb2epub](http://bazaar.launchpad.net/%7Emishas/%2Bjunk/ebook-tools/download/mss%40mawhrin.net-20080321200811-yba03okmnf49sycn/oeb2epub-20071117163354-w7j1br3qofyzd48a-2/oeb2epub) 在[他的站点](https://code.launchpad.net/~mishas/+junk/ebook-tools)。
- [Stanza](https://wiki.mobileread.com/wiki/Stanza)——PC 和 Mac 上的转换器，转换前通常会剥掉格式。
- [Web2FB2](http://web2fb2.net/)——一个把 URL 转换成 FB2 和 ePUB 格式的网站。
- [Comics2Reader](http://www.mmsoft.info)——把一组图像转成 Epub 文件及其他多种文件格式的软件。
- [Wikipedia4epub](http://rampa.sk/static/wikipedia4epub.html)——下载维基百科条目并生成 ePUB 的工具。
- [EPUB to Kindle converter](http://epubkindle.com/)——把 EPUB 文件转换成 Amazon Kindle 格式的工具。
- [Word to ePub](http://hdvideoconverter-mac.com/convert-word-to-epub.html)——商业多功能软件，可在 PDF、DOC、DOCX、图像、HTML、ODT、RTF、TXT、ePub 等九种流行办公文件格式之间互转。
- [NEWSTOEBOOK.COM](http://newstoebook.com/)——网页工具，把 RSS/Atom 订阅源（含 GoogleReader 订阅）转成 ePUB 和 [MOBI](/zh/wiki/formats/mobi/) 格式的书。
- [Text2Epub for OS X](http://bluezbox.com/text2epub.html)——Mac OS X 商业应用，把纯文本文件转成 ePUB。
- [Online Epub to PDF](http://www.pdfaid.com/epub-to-pdf-conversion.aspx)——在线工具，把 epub 转成 pdf。
- [Pandoc](https://wiki.mobileread.com/wiki/Pandoc)——能把多种输入格式转成 ePub 2 或 3。

### 校验工具

- [在线 CSS 检查工具](http://jigsaw.w3.org/css-validator/#validate_by_upload)。
- [EpubCheck 工具](https://github.com/IDPF/epubcheck)（运行需要 Java 1.6 或以上，任何操作系统皆可）。
- [ePUB Validator](http://www.ebook-tool.com/epub-validator.htm)——EpubCheck 的图形前端。
- [Flightcrew](http://code.google.com/p/flightcrew/)——一个更好的 ePUB 检查工具，也已内置到 [Sigil](https://wiki.mobileread.com/wiki/Sigil) 中。
- [ePub check tool for Mac OS X](http://www.mobileread.com/forums/showthread.php?t=55576)——在 Mac OS X 上为 epubcheck 包一层拖拽操作的外壳。

### 实用工具

- Info [ZIP](https://wiki.mobileread.com/wiki/ZIP) 和 7zip 都能用来打包、解包归档；7zip 还能直接打开文件，无需改扩展名就能处理 .epub。
- [EPubHub](https://wiki.mobileread.com/wiki/EPubHub)——操作 ePUB 容器并直接修改其内容的工具。
- [ePUB Fixer](https://github.com/maforget/epubfixer)——快速修复 ePUB 文件的目录（TOC）及其他修改。
- [EPub Metadata Editor](https://wiki.mobileread.com/wiki/EPub_Metadata_Editor)——专用于 ePUB 文件。
- [MobileRead 论坛](http://www.mobileread.com/forums/showthread.php?t=175824)——ePub 版块的贡献者们时不时会添加专门的 ePub 工具。
- [Calibre](https://wiki.mobileread.com/wiki/Calibre)——可在 ePub 与其他格式之间互转。

## 通用技巧

- 把整本书的内容放进一个 XHTML 文件，也可以做出符合标准的电子书，但这个决定会拖累性能。整份文件需要一次性载入内存，所以为了最佳性能，常规开本的书应拆成多个文件——通常按章拆分。

- 一些移动设备处理不了大 ePUB 文件，原因一般是某个 XHTML 文件太大。如果能解包，可以把大的 XHTML 文件拆成多个文件。为了最佳性能，单个文件一般不应超过约 300K。

- ePub 文件格式通过 TOC [NCX](https://wiki.mobileread.com/wiki/NCX) 文件对目录（TOC）有正规支持，但目前并非所有阅读器应用都支持它。这一点在 [DTBook](https://wiki.mobileread.com/wiki/DTBook) 标准中有记载。

- 要让 Apple 的 iBooks 识别并使用封面图像，需要在 opf 文件里加入标识封面图像的元数据：`<meta name="cover" content="[cover image id]" />`，其中 [cover image id] 是封面图像在 OPF 文件 manifest 部分中的 id。

- 给你的 ePub 电子书做封面的技巧，见 [Ebook Covers](https://wiki.mobileread.com/wiki/Ebook_Covers)。

- 针对特定功能使用 ePub 的技巧，见 [example ePub](https://wiki.mobileread.com/wiki/Example_ePub)。

## HTML 技巧

- EPUB 基于 XHTML，所有标签必须严格配对闭合。[htmltidy](https://wiki.mobileread.com/wiki/Htmltidy) 查错很灵，[EpubCheck](https://wiki.mobileread.com/wiki/EpubCheck) 也一样。
- Adobe Digital Editions（[ADE](https://wiki.mobileread.com/wiki/ADE)）不支持包住图像标签的链接，除非链接位于段落之内。换言之，`<p><a href="..."><img ...></a></p>` 可以，单独的 `<a href="..."><img ...></a>` 不行。
- "正常"表格常常因为太宽而在阅读器里被截断。能转的话，把这类表格转成用 `<hr/>` 分隔的聪明一点的列表，见 [Tabular Reflow](https://wiki.mobileread.com/wiki/Tabular_Reflow)。
- 能少用表格就少用！很多 [CHM](https://wiki.mobileread.com/wiki/CHM) 类文件把整页内容放进一个大表格，那会招来一堆问题。
- 记住不是所有阅读器都有"后退"按钮能回到来处。如果你在做跳转到尾注（脚注）的链接，考虑加一个返回链接，把读者带回引用处所在页。

## CSS 技巧

### 通用

- 在常规分页规则下，页面第一个元素的 `margin-top` 一律按零处理，页面最后一个元素的 `margin-bottom` 一律按零处理。但如果你用 `page-break-before` 或 `page-break-after` 属性强制分页，第一个元素的顶边距是否归零就**由阅读器自行决定**了——ADE 在这种情况下会把顶边距归零，许多其他阅读器则不会。想要行为一致，要么拆成两个元素（一个带 `page-break-before`，一个带 `margin-top`），要么改用 `padding-top`。
- 调一调 CSS，把颜色清理干净。很多"彩色"会被渲染成浅灰色，最好的办法是把能改的统统改成黑色或白色。
- 不要把文字放进目标锚点（`<a id="...">`）里，有些阅读器会错误地把它们渲染成链接（加下划线、变蓝）。
- `<pre>` 代码块可能超出页面右边界。用 CSS 缩小其字号，或对行做 pre-wrap；实在不行，把代码块重排成 6pt 下 70 字符宽。
- 内嵌字体有多个 local 名称时，有些阅读器会闹脾气。
- 做首字下沉（drop cap）时，**不要**用 padding-bottom 设置垂直定位；padding 非零时很多阅读器会把垂直位置算错。改用 margin 来定首字下沉的垂直位置，兼容性似乎更好。
- 处理首字下沉时，正文和首字块都要显式把行高设为 1.2em（或更大）。有些阅读器给行高设了下限，有些字体固有行高不足 1.2em，这些阅读器可能替你把行高强拉到 1.2em，结果首字下沉的字符位置偏上或偏下。
- 要在支持自动连字符的阅读器里启用它，使用（至少）`hyphens`、`-epub-hyphens`、`-webkit-hyphens`、`-moz-hyphens` 和 `adobe-hyphenate` 这些 CSS 属性。前三个遵循与官方 CSS 3 `hyphens` 属性相同的规则；`adobe-hyphenate` 变体类似，但取值用 `explicit` 而非 `manual`。

CSS 的实用示例见 [CSS HowTo](https://wiki.mobileread.com/wiki/CSS_HowTo)。

### iBooks

- 在 iBooks 里，想让你的字体选择被如实采用，就给书加一个 `com.apple.ibooks.display-options.xml` 文件，细节见 [iBooks](https://wiki.mobileread.com/wiki/IBooks) 页面。
- iBooks 阅读器靠设置 `-webkit-line-box-contain: block glyphs replaced;` 来避免文字伸进页边（被裁掉）。如果你的首字下沉高出段落顶部，这可能引发意外行为。若首字下沉在 ADE 和浏览器里都正常、唯独在 iBooks 里出问题，试着给 `html` 标签的样式加上 `-webkit-line-box-contain: block inline replaced !important;`（[更详细的解释](http://www.mobileread.com/forums/showthread.php?p=3060183#post3060183)）。
- 不要在 SVG 里使用小数字号，否则 iBooks 可能把文字严重错位。
- 如果对 SVG `<text>` 元素使用矩阵变换（matrix transform），不要在该 `<text>` 元素里放多个 `<tspan>` 元素。硬要这么做的话，你常会看到第二个 `<tspan>` 的部分内容叠在第一个 `<tspan>` 的内容上面。正确做法是为第二个 `<tspan>` 另建一个 `<text>` 元素。
- 近期版本的 iBooks 中，Apple 在其内部样式表的全局选择器（universal selector）里加了 `-webkit-font-smoothing`。因此，如果你要在 CSS 的任何地方覆盖这个属性，就**必须**同样通过全局选择器（例如 `* { ... }`）来做；否则会出现诡异的毛病——覆盖不被子元素继承（比如斜体文字可能渲染得比其余文字更深）。为将来保险起见，`font-smooth` 和 `text-rendering` 大概也应该照此办理。
- 截至上次检查，iBooks 似乎不支持 `epub:switch` 标签。

### ADE

- [ADE](https://wiki.mobileread.com/wiki/ADE) 只要 [CSS](https://wiki.mobileread.com/wiki/CSS) 文件里有任何错误，就可能整个忽略该文件。务必让它通过 CSS 检查，尤其要排查只在 ADE 应用里才出现的问题。CSS 文件含有它看不懂的特性（CSS2 之后的）时，ADE 也会整个忽略。为了避免样式尽失，永远把 @media 和 @page 规则放进单独的 CSS 文件，这样 ADE 忽略整份文件时不会殃及其他 CSS；IE 专属的 filter 属性同理。
- [ADE](https://wiki.mobileread.com/wiki/ADE) 和基于 ADE 的 Nook 不支持 `font-variant: small-caps`。变通办法：改用一款单独的小型大写字母字体——其小写字形直接被换成了小型大写字形。
- 如果你正是靠这种"单独的小型大写字母字体"（而非带 `smcp` OpenType 特性的普通字体）来绕开上述 ADE 缺陷，那么不仅请求该字体的 CSS 样式要加 `font-variant: small-caps`，样式的 `@font` 声明里也要加。忘了加在 `@font` 声明里的话，有些阅读器（尤其是 Sony Reader）会退回到下一个带 `smcp` 特性或单独小型大写变体的字体。
- [ADE](https://wiki.mobileread.com/wiki/ADE) 和基于 ADE 的 Nook 不支持 `:before` 伪元素搭配 `content:` 属性（除非近期已修复）。
- 别指望 CSS 优先级（precedence）算得对。基于 Adobe Digital Editions 的阅读器有时不把选择器中的类（class）视为比外围元素更高的优先级。举例来说，在合规的阅读器和浏览器里，若 `div.preface div.section p + p` 上有一条规则，`p.classname` 上那条相反的规则应当胜出——因为元素自身选择器上的类，优先级永远高于**任意**数量的外围元素。但在 ADE 里优先级计算是坏的，`div.preface div.section p + p` 那条规则反而拿到了优先权。
- 在某些基于 Adobe Digital Editions 的 iOS 阅读器上（在 Sony Reader 和 Bluefire 上见过），若带首字下沉的段落恰好位于屏幕顶部（横屏模式下常见），首字可能被切掉顶。原因是这些阅读器把段落边距折叠进页面边距（无视段内首字元素自己的边距），同时又裁掉超出页面边距的内容。修法：把这些段落的顶边距换成 padding（padding 不会被折叠进边距）。
- [ADE](https://wiki.mobileread.com/wiki/ADE) 把非链接锚点（如 `<a id="foo">...</a>`）当链接对待，加下划线、按链接样式渲染。别把任何内容放进这种目标锚点里。
- [ADE](https://wiki.mobileread.com/wiki/ADE) 不喜欢某些自闭合标签（如 `<a id="foo"/>`），会把标签当作一直延伸到文件末尾。
- [ADE](https://wiki.mobileread.com/wiki/ADE) 常在元素边界处错误换行——哪怕那里根本没有空白。因此，只包住单词一部分的标签可能导致意外行为。麻烦的是，ADE 似乎也无视 `white-space: nowrap`。用 `<nobr>` 也许能绕过这个换行问题，但未经测试，而且很可能违反 EPUB 规范。
- [ADE](https://wiki.mobileread.com/wiki/ADE) 忽略 `<hr>` 元素上的 `text-align` CSS 属性。想让特定宽度的水平线居中，就从 100% 里减去线宽，除以二，把结果设为左边距。
- [ADE](https://wiki.mobileread.com/wiki/ADE) 可能错误地断开跨越多页的长段落。实验来看，这个问题只出现在超过约 1024 字符的段落里。
- [ADE](https://wiki.mobileread.com/wiki/ADE) 处理不好居中或右对齐内容里 `<br>` 标签之后那一行中的特殊字符。如果紧跟 `<br>` 的行以开括号、开花括号或开方括号开头，ADE 会缩进这一行。绕过办法：要么在每行开头加一个不换行空格，要么不用 `<br>` 标签。
- 尽管这在技术上符合（有缺陷的）EPUB 2 规范，[ADE](https://wiki.mobileread.com/wiki/ADE) 把 `margin:auto` 当作 `margin:0`。这让块级元素的居中成了麻烦事。变通方案见[这里](http://www.mobileread.com/forums/archive/index.php/t-161097.html)和[这里](http://www.mobileread.com/forums/showpost.php?p=1013062&postcount=18)。
- 浮动内容装不进一页时，[ADE](https://wiki.mobileread.com/wiki/ADE) 会把浮动内容裁剪到页面边界。某些情况下，这还可能导致浮动元素之后那个文本块的首行（通过 `clear` 属性生效）消失。
- 旧版 [ADE](https://wiki.mobileread.com/wiki/ADE) 支持一个非标准的自动连字符 CSS 属性 `adobe-hyphenate`，取值为 `auto`、`explicit` 或 `none`，而非标准的 CSS `hyphens` 属性。

### nook

除上面列出的 ADE 怪癖之外：

- Nook 不喜欢居中标题标签（`h1`、`h2` 等）。需要居中内容时请用 `div`。
- 嵌套的块级和 inline-block 元素在某些阅读器上问题多多。尤其是 iOS 上的 Nook，在绘制 inline-block 元素内部任何块级元素的内容时，似乎会把（inline-block 元素的）边距当零处理。因此，做首字下沉时，如果你在意 iOS 版 Nook 的支持，就**绝不**要用嵌套块级元素来定位。
- 有些阅读器在块级元素高度以 em 计算时会算错，iOS 上的 Nook 尤其容易把盒子算小，导致首字下沉与正文重叠。为首字下沉设置 CSS height 属性时，先在正经浏览器（如 WebKit 或 Firefox）里找出行为正确的最小值与最大值，再取该范围中间附近的值。该缺陷已上报 B&N。
- iOS 版 Nook 在关闭"出版商默认样式"（publisher defaults）后，白色文字会变黑——即便背景就是黑的。该缺陷已上报 B&N。
- iOS 版 Nook 里，行距可由用户调整。可惜 Nook 不会把新行距乘上 CSS 里指定的 line-height 系数，于是首字下沉只在最小行距档位下是对的。无解。该缺陷已上报 B&N。
- Nook 的"非出版商默认样式"模式判断是否应用某个字体，似乎只看紧邻的外围标签有没有指定字体，无视更上层元素的字体。（要么就是它给每个元素都指定了默认字体设置；我不确定是哪种。）这在你用 `<span>` 技巧兼容早期 iBooks 时会出问题，例如：

```xml
<!-- This is styled -->
<p class="styledwithfont">Foo</p>

<!-- This is not -->
<p class="styledwithfont"><span>Foo</span></p>
```

- 按上面那样多套一层 span，再配合段落上的透明字体，就能做出"出版商默认样式模式下不可见、Nook 默认字体模式下现身"的文字。
- 由于这种行为，若你在非出版商默认样式模式下必须为一段文字覆盖用户选定的字体，就必须在紧邻的外围元素上动手——也就是在段落层面，以及这些段落里可能包含的任何标签上，再各来一遍——特异性（specificity）能多高就多高，肯定不能只靠单个元素名的那种特异性。

### Kobo

- 在 Kobo 阅读器上（至少 iOS 版如此），若把 body 标签的左右边距设为零，你会在第 1 页上看到第 2 页的一部分，以此类推，而且无法翻到本章最后一页。

### Apabi Reader

- 在 Apabi Reader 里，白色透明边框会变成黑色。

### Stanza

- iOS 版 Stanza 忽略 `text-align: center`，但能正确尊重 `text-align: center !important`。如果居中对你的内容样式至关重要，永远加上 `!important`。（iOS 版 Stanza 自 2013 年 8 月起似乎已停止维护。）

## 教程

- [an epub tutorial](http://sites.google.com/site/spontaneousderivation/an-epub-tutorial)——位于 sites.google。
- [creating-an-epub-document](http://www.epubbooks.com/blog/183/creating-an-epub-document)——epubBooks.com。
- [creating-epub-files.html](http://www.snee.com/bobdc.blog/2008/03/creating-epub-files.html)——bobdc 博客。
- [ePUB Format Construction Guide](http://www.hxa.name/articles/content/epub-guide_hxa7241_2007.html)——含 [ADE](https://wiki.mobileread.com/wiki/Adobe_Digital_Editions)（Adobe Digital Editions）限制的信息，来自 hxa。
- [threepress.org 的 epub-tutorial-on-ibm-developerworks](http://blog.threepress.org/2008/12/01/epub-tutorial-on-ibm-developerworks/)
- [jedisaber 的 .epub 电子书教程](http://jedisaber.com/eBooks/)——ePub 电子书资源。
- [MobileRead 分步指南](http://www.mobileread.com/forums/showthread.php?t=43230)——在论坛。
- [Simple ePub Tutorial](http://www.mobileread.com/forums/showthread.php?t=130390)——在论坛。
- [Tutorial on ePUB format](http://www.web-books.com/Publishing/epub.htm)
- [ePublicans ePub Better PracticesGuide](http://thinkubator.ccsp.sfu.ca/wikis/epubguide/ToC)
- [讲解 OPF 文件 guide 部分的文章](http://epubsecrets.com/where-do-you-start-an-epub-and-what-is-the-guide-section-of-the-opf-file.php)

## ePub 3

这里是 EPUB 第 3 版的一些快速链接。本 wiki 另有一页更详细的介绍。

- [ePub 3](https://wiki.mobileread.com/wiki/EPub_3) 规范链接：http://idpf.org/epub/30
- http://code.google.com/p/epub-revision/
- [新闻公告](http://idpf.org/news/epub-3-specification-public-draft-released)

这套规范由 [HTML5](https://wiki.mobileread.com/wiki/HTML5)、[CSS](https://wiki.mobileread.com/wiki/CSS)、[SVG](https://wiki.mobileread.com/wiki/SVG)、[图像](https://wiki.mobileread.com/wiki/Images)、多媒体支持、[MathML](https://wiki.mobileread.com/wiki/MathML)、[SMIL](https://wiki.mobileread.com/wiki/SMIL) 等组成。

## 更多信息

- http://epubzone.org/ 是 IDPF 的 ePub 专题站。
- [ePub Tutorial](https://wiki.mobileread.com/wiki/EPub_Tutorial)——ePub 制作入门。
- [CSS HowTo](https://wiki.mobileread.com/wiki/CSS_HowTo)——CSS 使用技巧。
- [OPS 2.0 最终版规范](http://www.openebook.org/2007/ops/OPS_2.0_final_spec.html)
- [OPS 2.0.1 规范](http://idpf.org/epub/20/spec/OPS_2.0.1_draft.htm)——关于 OPS。
- [OPF 2.0 最终版规范](http://www.openebook.org/2007/opf/OPF_2.0_final_spec.html)——元数据要求在这里。
- http://idpf.org/epub/201
- ePUB 还有一些与标准 ePUB 不兼容的衍生版本，包括 [mpub](https://wiki.mobileread.com/wiki/Mpub)（面向一切移动设备的 mobile epub）和[固定版式 ePub](https://wiki.mobileread.com/wiki/Fixed_layout_ePub)。
- [EPub Reader Test](https://wiki.mobileread.com/wiki/EPub_Reader_Test) 是专门测试各 ePub 阅读器、弄清它们支持哪些特性的页面。
- [ePub construction guide](http://www.hxa.name/articles/content/epub-guide_hxa7241_2007.html)——含 Adobe 扩展。
- [eBook Conversion Services](https://wiki.mobileread.com/wiki/EBook_Conversion_Services)——提供 ePub 转换服务的商业公司。
