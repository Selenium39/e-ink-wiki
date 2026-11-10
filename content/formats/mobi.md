---
title: MOBI 格式详解
original_title: "MOBI"
source_url: https://wiki.mobileread.com/wiki/MOBI
original_author: MobileRead Wiki 贡献者（DaleDe、Pdurrant、Hex 等）
translated_at: 2026-11-10
order: 2
description: MOBI 是 MobiPocket Reader 与 Amazon Kindle 使用的电子书格式。本文完整翻译 MobileRead Wiki 的 MOBI 二进制格式规格：PalmDOC/MOBI/EXTH 头部字段表、索引记录、压缩算法、尾部条目、FLIS/FCIS/SRCS 等魔数记录，以及 DRM、制作工具与格式限制。
---

> 本文译自 MobileRead Wiki 的《MOBI》页面，原文最后修订于 2026-04-14。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处引用，本站不镜像论坛内容。
> 格式规格细节以原文与实际工具行为为准，本文反映原文修订时点的状态。

MOBI 是为 [MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader) 开发的格式的名称。它目前也被 Amazon 使用，只是换了一套略有不同的 [DRM](/wiki/formats/drm/) 方案，并被称为 [AZW](https://wiki.mobileread.com/wiki/AZW)。Amazon 用这个扩展名来命名 [KindleGen](https://wiki.mobileread.com/wiki/KindleGen) 生成的文件，尽管这些文件内部实际上同时包含 MOBI 格式（有时又称 KF7）和 [KF8](https://wiki.mobileread.com/wiki/KF8) 格式。

## Overview

MOBI 是 [MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader) 和 [Amazon Kindle](https://wiki.mobileread.com/wiki/Amazon_Kindle) 阅读器使用的格式。它的扩展名可以是 `.mobi`，也可以是 `.prc`，用户可以把扩展名改成这两种受认可的写法中的任意一种。无论使用哪种扩展名，文件都可能带 [DRM](/wiki/formats/drm/) 保护，也可能不带。之所以有 `.prc` 扩展名，是因为 [PalmOS](https://wiki.mobileread.com/wiki/PalmOS) 只支持 `.prc` 和 `.pdb` 两种[文件扩展名](https://wiki.mobileread.com/wiki/file_extension)。注意，[Mobipocket](https://wiki.mobileread.com/wiki/Mobipocket) 禁止将其 DRM 格式用在支持其他 DRM 格式的专用电子书阅读器上。MOBI 源文件基于 [OEB](https://wiki.mobileread.com/wiki/OEB)（Open eBook）标准。

## Description

MOBI 格式最初是对 [PalmDOC](https://wiki.mobileread.com/wiki/PalmDOC) 格式的扩展：在数据中加入了某些类似 [HTML](https://wiki.mobileread.com/wiki/HTML) 的标签（见 [EBook HTML](https://wiki.mobileread.com/wiki/EBook_HTML)）。许多 MOBI 格式文档至今仍在使用这种形式。不过，这种文件格式还有一个高压缩版本，以专有方式把数据压缩得更小。有一些第三方程序能读取原始 MOBI 格式的电子书，但能读取新压缩形式的第三方程序只有寥寥几个。高压缩模式使用的是一套 Huffman 编码方案，被称为 Huff/cdic 算法。Python 版的说明可以看 [Calibre](https://wiki.mobileread.com/wiki/Calibre) 项目中的 [huffcdic.py](https://github.com/kovidgoyal/calibre/blob/master/src/calibre/ebooks/mobi/huffcdic.py)。

格式不时会加入新特性，因此如果你用旧版本阅读器去读新文件，可能会出问题。目前源文件遵循 [Open eBook](https://wiki.mobileread.com/wiki/Open_eBook) 格式的规范。

**注意：[Amazon Kindle](https://wiki.mobileread.com/wiki/Amazon_Kindle) 使用的 [AZW](https://wiki.mobileread.com/wiki/AZW) 与 MOBI 是同一种格式，区别仅在于使用了不同的 [DRM](/wiki/formats/drm/) 方案。**[Amazon](https://wiki.mobileread.com/wiki/Amazon) 已收购 [MobiPocket](https://wiki.mobileread.com/wiki/Mobipocket)。下文的格式描述同时适用于这两种文件类型。

### Format

与 PalmDOC 一样，Mobipocket 文件格式采用标准的 [Palm Database Format](https://wiki.mobileread.com/wiki/PDB#Palm_Database_Format) 文件结构。该格式的头部包含数据库名（通常是书名，有时还带一部分作者名），最长 **31** 字节。这类文件由 Creator ID `MOBI` 和 Type `BOOK` 标识。

Mobipocket 官方有一些最低限度的文件格式说明，主要是关于书中文本所用的 [HTML](https://wiki.mobileread.com/wiki/HTML) 编码，见 [mobipocket.com 开发文档](http://web.archive.org/web/20160314093357/http://mobipocket.com/dev/article.asp?BaseFolder=prcgen&File=TagRef_OEB.htm)（官方页面已下线，此处为存档副本）。Mobi7 版本所用的 HTML 另见 [EBook HTML](https://wiki.mobileread.com/wiki/EBook_HTML)。

### PalmDOC Header

[Palm Database Format](https://wiki.mobileread.com/wiki/PDB#Palm_Database_Format) 文件的第一个记录包含了更多关于 Mobipocket 文件的信息。其前 16 字节与 PalmDOC 格式文件的前 16 字节几乎完全相同。

| offset | bytes | content | comments |
|---|---|---|---|
| 0 | 2 | Compression | 1 == 无压缩，2 = PalmDOC 压缩，17480 = HUFF/CDIC 压缩 |
| 2 | 2 | Unused | 恒为零 |
| 4 | 4 | text length | 整本书全部文本的未压缩长度 |
| 8 | 2 | record count | 存放本书文本所用的 PDB 记录数 |
| 10 | 2 | record size | 每条文本记录的最大尺寸，恒为 4096 |
| 12 | 4 | Current Position | 当前阅读位置，以未压缩文本中的偏移表示 |

与 Palm DOC 文件有两处差异：多了一种压缩类型（17480），并且 Current Position 字节被挪作了别的用途：

| offset | bytes | content | comments |
|---|---|---|---|
| 12 | 2 | Encryption Type | 0 == 无加密，1 = 旧版 Mobipocket 加密，2 = Mobipocket 加密 |
| 14 | 2 | Unknown | 通常为零 |

旧版 Mobipocket 加密方案只允许文件注册到一个 PID，而现行加密方案允许单个文件使用多个 PID。除非特别说明，本页的所有加密信息均指现行方案。

### MOBI Header

大多数 Mobipocket 文件在记录 0 中、紧跟上述 16 字节之后还有一个 MOBI 头；较新的格式在 MOBI 头之后还有 EXTH 头，它们都位于 PDB 文件格式的记录 0 内。

MOBI 头长度可变且没有官方文档。部分字段已被初步鉴定如下：

| offset | hex | bytes | content | comments |
|---|---|---|---|---|
| 16 | 0x10 | 4 | identifier | 字符 M O B I |
| 20 | 0x14 | 4 | header length | MOBI 头的长度，含前面这 4 字节 |
| 24 | 0x18 | 4 | Mobi type | 本文件所属的 Mobipocket 文件类型：2 = Mobipocket Book；3 = PalmDoc Book；4 = Audio；232 = mobipocket?（kindlegen 1.2 生成）；248 = KF8（kindlegen2 生成）；257 = News；258 = News_Feed；259 = News_Magazine；513 = PICS；514 = WORD；515 = XLS；516 = PPT；517 = TEXT；518 = HTML |
| 28 | 0x1c | 4 | text Encoding | 1252 = CP1252 (WinLatin1)；65001 = UTF-8 |
| 32 | 0x20 | 4 | Unique-ID | 某种唯一 ID 编号（随机？） |
| 36 | 0x24 | 4 | File version | 本文件使用的 Mobipocket 格式版本 |
| 40 | 0x28 | 4 | Ortographic index | 正字法元索引的节号。索引不可用时为 0xFFFFFFFF |
| 44 | 0x2c | 4 | Inflection index | 词形变化元索引的节号。索引不可用时为 0xFFFFFFFF |
| 48 | 0x30 | 4 | Index names | 索引不可用时为 0xFFFFFFFF |
| 52 | 0x34 | 4 | Index keys | 索引不可用时为 0xFFFFFFFF |
| 56 | 0x38 | 4 | Extra index 0 | extra 0 元索引的节号。索引不可用时为 0xFFFFFFFF |
| 60 | 0x3c | 4 | Extra index 1 | extra 1 元索引的节号。索引不可用时为 0xFFFFFFFF |
| 64 | 0x40 | 4 | Extra index 2 | extra 2 元索引的节号。索引不可用时为 0xFFFFFFFF |
| 68 | 0x44 | 4 | Extra index 3 | extra 3 元索引的节号。索引不可用时为 0xFFFFFFFF |
| 72 | 0x48 | 4 | Extra index 4 | extra 4 元索引的节号。索引不可用时为 0xFFFFFFFF |
| 76 | 0x4c | 4 | Extra index 5 | extra 5 元索引的节号。索引不可用时为 0xFFFFFFFF |
| 80 | 0x50 | 4 | First Non-book index? | 第一条不属于书籍正文的记录号（从 0 起算） |
| 84 | 0x54 | 4 | Full Name Offset | 书籍全名在记录 0 内的偏移（不是从文件开头算起） |
| 88 | 0x58 | 4 | Full Name Length | 书籍全名的字节长度 |
| 92 | 0x5c | 4 | Locale | 书籍区域设置代码。低字节为主语言，09 = 英语；下一字节为方言，08 = 英式，04 = 美式。因此美式英语是 1033，英式英语是 2057 |
| 96 | 0x60 | 4 | Input Language | 词典的输入语言 |
| 100 | 0x64 | 4 | Output Language | 词典的输出语言 |
| 104 | 0x68 | 4 | Min version | 读取本文件所需的最低 Mobipocket 版本 |
| 108 | 0x6c | 4 | First Image index | 第一条包含图片的记录号（从 0 起算）。图片记录应当连续 |
| 112 | 0x70 | 4 | Huffman Record Offset | 第一条 Huffman 压缩记录的记录号 |
| 116 | 0x74 | 4 | Huffman Record Count | Huffman 压缩记录的数量 |
| 120 | 0x78 | 4 | Huffman Table Offset | |
| 124 | 0x7c | 4 | Huffman Table Length | |
| 128 | 0x80 | 4 | EXTH flags | 位域。若 bit 6 (0x40) 被置位，则存在 EXTH 记录 |
| 132 | 0x84 | 32 | ? | 32 个未知字节（若 MOBI 头足够长） |
| 164 | 0xa4 | 4 | Unknown | 使用 0xFFFFFFFF |
| 168 | 0xa8 | 4 | DRM Offset | 带 DRM 的文件中 DRM 密钥信息的偏移。无 DRM 时为 0xFFFFFFFF |
| 172 | 0xac | 4 | DRM Count | DRM 信息中的条目数。无 DRM 时为 0xFFFFFFFF |
| 176 | 0xb0 | 4 | DRM Size | DRM 信息占用的字节数 |
| 180 | 0xb4 | 4 | DRM Flags | 与 DRM 信息相关的一些标志位 |
| 184 | 0xb8 | 8 | Unknown | 到 MOBI 头末尾的字节数，若 header length >= 228（从记录开头算是 244）则含后续内容。使用 0x0000000000000000 |
| 192 | 0xc0 | 2 | First content record number | 第一条文本记录的编号。通常为 1 |
| 194 | 0xc2 | 2 | Last content record number | 最后一条图片记录的编号；若不含图片则为最后一条文本记录的编号。包括 Image、DATP、HUFF、DRM |
| 196 | 0xc4 | 4 | Unknown | 使用 0x00000001 |
| 200 | 0xc8 | 4 | FCIS record number | |
| 204 | 0xcc | 4 | Unknown (FCIS record count?) | 使用 0x00000001 |
| 208 | 0xd0 | 4 | FLIS record number | |
| 212 | 0xd4 | 4 | Unknown (FLIS record count?) | 使用 0x00000001 |
| 216 | 0xd8 | 8 | Unknown | 使用 0x0000000000000000 |
| 224 | 0xe0 | 4 | Unknown | 使用 0xFFFFFFFF |
| 228 | 0xe4 | 4 | First Compilation data section count | 使用 0x00000000 |
| 232 | 0xe8 | 4 | Number of Compilation data sections | 使用 0xFFFFFFFF |
| 236 | 0xec | 4 | Unknown | 使用 0xFFFFFFFF |
| 240 | 0xf0 | 4 | Extra Record Data Flags | 一组二进制标志位，其中一些指示每条文本记录末尾的附加数据。仅当 header length 为 228 (0xE4) 或 232 (0xE8) 时，这组标志对 Mobipocket 格式版本 5 和 6（以及更高版本？）才似乎有效。bit 1 (0x1)：`<extra multibyte bytes><size>`；bit 2 (0x2)：`<TBS indexing description of this HTML record><size>`；bit 3 (0x4)：`<uncrossable breaks><size>`。置位 bit 2 (0x2) 会禁用 `<guide><reference type="start">` 功能 |
| 244 | 0xf4 | 4 | INDX Record Offset | （若不为 0xFFFFFFFF）由 ncx 文件生成的第一条 INDX 记录的记录号 |
| 248 | 0xf8 | 4 | Unknown | 0xFFFFFFFF。在新的 MOBI 文件中 MOBI 头长度为 256，跳过此处直达 EXTH 头 |
| 252 | 0xfb | 4 | Unknown | 0xFFFFFFFF。在新的 MOBI 文件中 MOBI 头长度为 256，跳过此处直达 EXTH 头 |
| 256 | 0x100 | 4 | Unknown | 0xFFFFFFFF。在新的 MOBI 文件中 MOBI 头长度为 256，跳过此处直达 EXTH 头 |
| 260 | 0x104 | 4 | Unknown | 0xFFFFFFFF。在新的 MOBI 文件中 MOBI 头长度为 256，跳过此处直达 EXTH 头 |
| 264 | 0x108 | 4 | Unknown | 0xFFFFFFFF。在新的 MOBI 文件中 MOBI 头长度为 256，跳过此处直达 EXTH 头 |
| 268 | 0x10b | 4 | Unknown | 0。在新的 MOBI 文件中 MOBI 头长度为 256，跳过此处直达 EXTH 头；MOBI 头长 256，加上来自 PalmDOC 头的 12 字节，所以此处的索引是 268 |

### EXTH Header

如果 MOBI 头表明存在 EXTH 头，那么 EXTH 头紧跟在 MOBI 头之后。由于 MOBI 头长度可变，EXTH 头在记录 0 中并不位于固定偏移。注意，若 MOBI 头中标注的 mobipocket 版本号小于等于 2（也许小于等于 3），某些阅读器会忽略 EXTH 头中的所有信息。

EXTH 头同样没有官方文档，因此下述内容部分属于推测。

| bytes | content | comments |
|---|---|---|
| 4 | identifier | 字符 E X T H |
| 4 | header length | EXTH 头的长度，含前面这 4 字节，但不含末尾的填充字节 |
| 4 | record Count | EXTH 头中的记录数。EXTH 头的其余部分由连续的 EXTH 记录组成，直到 EXTH 长度用尽 |
| | EXTH record start | 重复直到结束 |
| 4 | record type | EXTH 记录类型。只是一个标识记录所存内容的编号 |
| 4 | record length | EXTH 记录的长度 = L，含 type 与 length 字段本身的 8 字节 |
| L-8 | record data | 数据 |
| | EXTH record end | 重复直到结束 |
| p | padding | 用于把 EXTH 头填充到 4 字节倍数的空字节（若头长度已是 4 的倍数则无填充）。这部分填充不计入 EXTH 头长度 |

EXTH 记录类型有很多种。目前在 Mobipocket 文件中发现的开列如下，附可能的含义。希望随着更多信息浮出水面，这张表能逐步补全。

| record type | usual length | name | comments | opf meta tag |
|---|---|---|---|---|
| 1 | | drm_server_id | | |
| 2 | | drm_commerce_id | | |
| 3 | | drm_ebookbase_book_id | | |
| 100 | | author | | `<dc:Creator>` |
| 101 | | publisher | | `<dc:Publisher>` |
| 102 | | imprint | | `<Imprint>` |
| 103 | | description | | `<dc:Description>` |
| 104 | | isbn | | `<dc:Identifier scheme='ISBN'>` |
| 105 | | subject | 可能出现多次 | `<dc:Subject>` |
| 106 | | publishingdate | | `<dc:Date>` |
| 107 | | review | | `<Review>` |
| 108 | | contributor | | `<dc:Contributor>` |
| 109 | | rights | | `<dc:Rights>` |
| 110 | | subjectcode | | `<dc:Subject BASICCode="subjectcode">` |
| 111 | | type | | `<dc:Type>` |
| 112 | | source | | `<dc:Source>` |
| 113 | | asin | Kindle Paperwhite 会给没有这条记录的书打上"Personal"标签 | |
| 114 | | versionnumber | | |
| 115 | 4 | sample | 若书的内容只是全书的样章，值为 0x0001 | |
| 116 | | startreading | 首次打开文件时的打开位置（文件内 4 字节偏移） | |
| 117 | 3 | adult | Mobipocket Creator 在其界面上勾选了 *Adult only* 时会加入这条；内容为 "yes" | `<Adult>` |
| 118 | | retail price | 文本形式，例如 "4.99" | `<SRP>` |
| 119 | | retail price currency | 文本形式，例如 "USD" | `<SRP Currency="currency">` |
| 121 | 4 | KF8 BOUNDARY Offset | | |
| 122 | | fixed-layout | "true" | |
| 123 | | book-type | "comic" | |
| 124 | | orientation-lock | "none"、"portrait"、"landscape" | |
| 125 | 4 | count of resources | | |
| 126 | | original-resolution | "1072x1448" | |
| 127 | | zero-gutter | "true" | |
| 128 | | zero-margin | "true" | |
| 129 | | Metadata Resource URI | | |
| 131 | 4 | Unknown | | |
| 132 | | Unknown | "true" | |
| 200 | 3 | Dictionary short name | 文本形式 | `<DictionaryVeryShortName>` |
| 201 | 4 | coveroffset | 与 MOBI 头中的 first image 字段相加，即可找到包含封面图片的 PDB 记录 | `<EmbeddedCover>` |
| 202 | 4 | thumboffset | 与 MOBI 头中的 first image 字段相加，即可找到包含封面缩略图的 PDB 记录 | |
| 203 | | hasfakecover | | |
| 204 | 4 | Creator Software | 已知取值：1 = mobigen，2 = Mobipocket Creator，200 = kindlegen (Windows)，201 = kindlegen (Linux)，202 = kindlegen (Mac)。**警告：** Calibre 会伪造 creator 条目——普通电子书伪装成 Linux kindlegen 1.2 (201, 1, 2, 33307)，期刊类伪装成未公开的 Linux kindlegen 2.0 (201, 2, 0, 101) | |
| 205 | 4 | Creator Major Version | | |
| 206 | 4 | Creator Minor Version | | |
| 207 | 4 | Creator Build Number | | |
| 208 | | watermark | | |
| 209 | | tamper proof keys | Kindle（及 Android 应用）用它生成针对具体书籍的 PID | |
| 300 | | fontsignature | | |
| 401 | 1 | clippinglimit | 允许剪取的文本的整数百分比。通常为 10 | |
| 402 | | publisherlimit | | |
| 403 | | Unknown | | |
| 404 | 1 | ttsflag | 1 - 禁用文本转语音（Text to Speech）；0 - 启用文本转语音 | |
| 405 | 1 | Unknown (Rent/Borrow flag?) | 此字段为 1 似乎表明这是一本租赁的书 | |
| 406 | 8 | Rent/Borrow Expiration Date | 若从租赁书中移除此字段，书会显示已于 1969 年过期 | |
| 407 | 8 | Unknown | | |
| 450 | 4 | Unknown | | |
| 451 | 4 | Unknown | | |
| 452 | 4 | Unknown | | |
| 453 | 4 | Unknown | | |
| 501 | 4 | cdetype | PDOC - 个人文档（Personal Doc）；EBOK - 电子书；EBSP - 电子书样章 | |
| 502 | | lastupdatetime | | |
| 503 | | updatedtitle | | |
| 504 | | asin | 我在此记录中发现过一份 ASIN 的副本 | |
| 524 | | language | | `<dc:language>` |
| 525 | | writingmode | 我在此记录中发现过 horizontal-lr | |
| 535 | | Creator Build Number | 我在此记录中发现过 1019-d6e4792，这是 Kindlegen 2.7 的一个构建号 | |
| 536 | | Unknown | | |
| 542 | 4 | Unknown | 某个 Unix 时间戳 | |
| 547 | | InMemory | KindleGen V2.9（build 1029-0897292）的文件中，此记录里发现了字符串 `I\x00n\x00M\x00e\x00m\x00o\x00r\x00y\x00` | |

### Remainder of Record 0

在 PDB 文件格式记录 0 的末尾，通常会存放完整的文件名，其偏移由 MOBI 头给出。

在 EXTH 记录结束与文件名之间，可能存在用途未知的数据。

文件名之后是两个空字节，随后再用空字节填充到 4 字节边界。举例：若文件名长 16 字节，加上两个空字节共 18 字节，然后再补两个空字节凑到 20 字节；但头里存的长度只有 16。若文件名长 19 字节，则跟两个空字节到 21 字节，再补三个空字节凑到 24 字节。

文件名与填充之后，直到第 0 节末尾，还跟着一些用途未知的数据，通常是空字节。

### Index meta record

索引的第一个记录存放该索引的元数据。

| offset | hex | bytes | content | comments |
|---|---|---|---|---|
| 0 | 0x00 | 4 | Identifier | 字符 I N D X |
| 4 | 0x04 | 4 | header length | INDX 头的长度，含前面这 4 字节 |
| 8 | 0x08 | 4 | index type | 索引的类型。已知取值：0 - 普通索引，2 - 词形变化（inflections） |
| 12 | 0x0c | 4 | ? | ? |
| 16 | 0x10 | 4 | ? | ? |
| 20 | 0x14 | 4 | idxt start | IDXT 节的偏移 |
| 24 | 0x18 | 4 | index count | 索引记录的数量 |
| 28 | 0x1c | 4 | index encoding | 1252 = CP1252 (WinLatin1)；65001 = UTF-8 |
| 32 | 0x20 | 4 | index language | 索引的语言代码 |
| 36 | 0x24 | 4 | total index count | 索引条目的数量 |
| 40 | 0x28 | 4 | ordt start | ORDT 节的偏移 |
| 44 | 0x2c | 4 | ligt start | LIGT 节的偏移 |
| 48 | 0x30 | 4 | ? | ? |
| 52 | 0x34 | 4 | ? | ? |

INDX 头的其余取值未知。

#### TAGX section

TAGX 节紧跟 INDX 头之后，对解码索引值至关重要：它定义了每个条目包含多少个控制字节、哪些位对应哪个标签，以及一个标签需要多少个值（大多数标签只要一个值，但有些要两个，可能还有更多的）。

| offset | hex | bytes | content | comments |
|---|---|---|---|---|
| 0 | 0x00 | 4 | Identifier | 字符 T A G X |
| 4 | 0x04 | 4 | header length | TAGX 头的长度，含前面这 4 字节 |
| 8 | 0x08 | 4 | control byte count | 控制字节的数量 |
| 12 | 0x0c | n | tag table | 标签表条目（n = header length - 12，必须是 4 字节的倍数） |

标签表条目都是 4 字节的倍数。第一个字节是标签，第二个字节是值的个数，第三个字节是位掩码，第四个字节指示控制字节的结束。若第四个字节为 0x01，则该条目的其余字节全为零。

### Variable-width integers

Mobipocket 格式的某些部分把数据编码为变宽整数（variable-width integers）。这类整数按大端序表示，每字节 7 个有效位（位于 bit 1-7）。它们既可以是**正向编码**（forward-encoded，只有最低有效字节的 bit 8 被置位），也可以是**反向编码**（backward-encoded，只有最高有效字节的 bit 8 被置位）。例如，数 0x11111 的正向编码是：

```
0x04 0x22 0x91
```

反向编码则是：

```
0x84 0x22 0x11
```

#### Trailing entries

MOBI 头的 Extra Data Flags 字段指明了每条文本记录末尾追加了哪些尾部条目（如果有的话）。字段中每个被置位的位对应一个尾部条目。这些条目似乎按位序出现，例如尾部条目 1 紧跟在文本内容之后，条目 16 位于记录最末尾。大多数条目的作用与确切细节都未知。由 bit 2-16 指示的尾部条目似乎遵循一个共同格式，即：

```
<data><size>
```

其中 `<size>` 是整个尾部条目的尺寸（含 `<size>` 自身的尺寸），以反向编码的 Mobipocket 变宽整数表示。

目前只鉴定出少数几个位：

| bit | Data at end of records |
|---|---|
| 0x0001 | 多字节字符跨记录重叠部分 |
| 0x0002 | 一些辅助索引的数据 |
| 0x0004 | 一些关于不可跨越分页点（uncrossable breaks）的数据 |

##### Multibyte character overlap

当 Extra Data Flags 字段的 bit 1 被置位时，每条记录的末尾都会跟一个尾部条目，存放为补全一个跨越记录边界的多字节字符所需的额外字节。无论文件采用哪种压缩方案，这些字节都不参与压缩。但与尾部数据字节不同的是，这些多字节（含计数字节）**确实**会参与加密。随后，重叠的字节会作为正常内容重新出现在下一条记录的开头。尾部条目以一个字节结尾，其中存放重叠字节的计数外加附加标志位。

| offset | bytes | content | comments |
|---|---|---|---|
| 0 | 0-3 | N terminal bytes of a multibyte character | |
| N | 1 | Size & flags | bit 1-2 编码 N，bit 3-8 的用途未知 |

#### PalmDOC Compression

[PalmDOC](https://wiki.mobileread.com/wiki/PalmDOC) 使用 [LZ77](https://wiki.mobileread.com/wiki/LZ77) 压缩技术，一份 PalmDOC 实现见 [Github 上的 palmdoc.c](https://github.com/twpayne/gpsbabel-flytec/blob/master/palmdoc.c)。DOC 文件只能包含压缩后的文本，格式本身不支持任何文本排版——这符合 Palm"文件尽量小"的哲学，也让文件保持小巧。不过，对该格式的各种扩展可以利用标签（例如 [HTML](https://wiki.mobileread.com/wiki/HTML) 或 [PML](https://wiki.mobileread.com/wiki/Palm_Reader#Palm_Markup_Language)）在文本中加入排版。PalmDoc 的这些扩展彼此不通用，它们正是 Palm 设备上大多数电子书阅读格式的基础。

LZ77 算法的压缩原理是：把数据中的一部分替换成指向"已经流经编码器和解码器的匹配数据"的引用。一个匹配由一对数字编码，称为"长度-距离对"（length-distance pair），它等价于这样一句话："接下来的 length 个字符，每一个都等于未压缩流中向前数 distance 个字符处的那个字符。"（"distance"有时也被称为"offset"。）

在 PalmDoc 格式中，一个长度-距离对总是编码为两字节序列。构成这两个字节的 16 个位里，11 位用于编码距离，3 位用于编码长度，剩下 2 位用来确保解码器能把第一个字节识别为这种两字节序列的开头。解压文本所需的精确算法见 [PalmDOC](https://wiki.mobileread.com/wiki/PalmDOC) 页面。

PalmDOC 数据总是按 4096 字节（未压缩尺寸）分块，各块独立处理；压缩或解压某个块时不需要任何来自前块或后块的信息。

PalmDOC 支持书签。这些指针有名字，指向文件中的某个偏移位置。如果文件被编辑过，这些位置可能就不再指向正确的位置了。有的阅读程序允许用户输入或编辑这些书签，有的把它们当作目录（TOC）用，也有的阅读程序干脆完全忽略它们。书签存放在文件本身的末尾，因此加载时需要扫描整个文件才能找到它们。

#### Image Records

如果文件包含图片，图片记录紧跟在文本块之后，每张图片占用一个块。PalmDoc 头中 4096 字节的记录尺寸只对文本记录有效；图片记录可以更大。

#### Magic Records

某些情况下，[MobiPocket Creator](https://wiki.mobileread.com/wiki/MobiPocket_Creator) 会在文件的文本记录之后加入一条 2 个零字节的记录。这条记录既不计入 PalmDoc 头中文本记录的"record count"，也不被用作 MOBI 头里的"first non-book index"。（若存在这条 2 零字节记录，则用**紧随其后**那个块的索引作为"first non-book index"。）

[MobiPocket Creator](https://wiki.mobileread.com/wiki/MobiPocket_Creator) 还会用三条记录来结束文件：'FLIS'、'FCIS' 和 'end-of-file'，按此顺序。对 [MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader) 或 [Amazon Kindle 2](https://wiki.mobileread.com/wiki/Amazon_Kindle_2) 而言，'FLIS' 和 'FCIS' 记录似乎并非读取文件所必需；'end-of-file' 记录**可能**是必需的。

##### FLIS Record

FLIS 记录似乎取一组固定值。这些值的含义未知。

| offset | bytes | content | comments |
|---|---|---|---|
| 0 | 4 | identifier | 字符 F L I S (0x46 0x4c 0x49 0x53) |
| 4 | 4 | ? | 固定值：8 |
| 8 | 2 | ? | 固定值：65 |
| 10 | 2 | ? | 固定值：0 |
| 12 | 4 | ? | 固定值：0 |
| 16 | 4 | ? | 固定值：-1 (0xFFFFFFFF) |
| 20 | 2 | ? | 固定值：1 |
| 22 | 2 | ? | 固定值：3 |
| 24 | 4 | ? | 固定值：3 |
| 28 | 4 | ? | 固定值：1 |
| 32 | 4 | ? | 固定值：-1 (0xFFFFFFFF) |

##### FCIS Record

FCIS 记录的取值似乎绝大部分是固定的。

| offset | bytes | content | comments |
|---|---|---|---|
| 0 | 4 | identifier | 字符 F C I S (0x46 0x43 0x49 0x53) |
| 4 | 4 | ? | 固定值：20 |
| 8 | 4 | ? | 固定值：16 |
| 12 | 4 | ? | 固定值：1 |
| 16 | 4 | ? | 固定值：0 |
| 20 | 4 | ? | 文本长度（与 PalmDoc 头中的 "text length" 同值） |
| 24 | 4 | ? | 固定值：0 |
| 28 | 4 | ? | 固定值：32 |
| 32 | 4 | ? | 固定值：8 |
| 36 | 2 | ? | 固定值：1 |
| 38 | 2 | ? | 固定值：1 |
| 40 | 4 | ? | 固定值：0 |

##### End-of-file Record

end-of-file 记录是一条固定 4 字节的记录。末两个字节看起来是 CRLF 标记，前两个字节的含义未知。

| offset | bytes | content | comments |
|---|---|---|---|
| 0 | 1 | ? | 固定值：233 (0xe9) |
| 1 | 1 | ? | 固定值：142 (0x8e) |
| 2 | 1 | ? | 固定值：13 (0x0d) |
| 3 | 1 | ? | 固定值：10 (0x0a) |

#### Compilation Records

[KindleGen](https://wiki.mobileread.com/wiki/KindleGen) 会在紧邻 [end-of-file 记录](#end-of-file-record)之前（KindleGen 1.2-2.2）或紧邻 BOUNDARY 记录之前（KindleGen 2.3 及以后），放入编译源的记录（KindleGen 1.2-2.5），或编译源加编译器输出的记录（KindleGen 2.7 及以后）。

用 Mobipocket creator、Amazon 的 Personal Document Service 或 Kindle Direct Publishing（前身是 Amazon DTP）创建的 MOBI 文件不含 SRCS 记录。kindlegen 过去有一个压制此记录的未公开选项，但该选项已于 2010 年移除。

SRCS 记录的内容是一个 zip 归档，打包了交给命令行的全部源文件（即 .opf、.ncx、.htm、.jpg……），并把它放进生成的 MOBI 文件里。该记录以 "SRCS" 签名开头，结构如下：

| offset | bytes | content | comments |
|---|---|---|---|
| 0 | 4 | identifier | "SRCS" (0x53 0x52 0x43 0x53) |
| 4 | 4 | ? | 固定值(?)：0x00000010 |
| 8 | 4 | ? | 固定值(?)：0x0000002f |
| 12 | 4 | ? | 固定值(?)：0x00000001 |
| 16 | | zip | zip 归档一直延续到本记录末尾 |

CMET 记录的内容是编译操作的输出，或许还有一些额外信息。该记录以 "CMET" 签名开头，结构如下：

| offset | bytes | content | comments |
|---|---|---|---|
| 0 | 4 | identifier | "CMET" (0x43 0x4D 0x45 0x54) |
| 4 | 4 | ? | 固定值(?)：0x0000000C |
| 8 | 4 | text length | （大端序） |
| 12 | variable | text | 编译输出文本，行尾为 CRLF |
| variable | variable | ? | 直到记录末尾的未知数据 |

#### Media Records (AUDI/VIDE)

kindlegen 支持在部分 Kindle 平台上嵌入音频和视频。每个媒体文件存放在单独的 AUDI（音频）或 VIDE（视频）记录中。

媒体记录的结构如下：

| offset | bytes | content | comments |
|---|---|---|---|
| 0 | 4 | identifier | "AUDI" (0x41 0x55 0x44 0x49) 或 "VIDE" (0x56 0x49 0x44 0x45) |
| 4 | 4 | ? | 未知值 |
| 8 | 4 | ? | 未知值 |
| 12 | | media | 媒体数据一直延续到本记录末尾 |

### MBP

这是 MOBI 格式电子书的边车文件（辅助文件）所用的扩展名，用来存放书库软件使用的[元数据](https://wiki.mobileread.com/wiki/metadata)，也存放用户输入的数据，如书签、批注、最近阅读位置。这类文件由阅读程序在电子书首次打开时自动创建，扩展名为 .mbp。MobiPocket 的书库管理软件通过这个文件获取书库窗口要显示的信息（书名、作者、简介等），从而不必打开更大的电子书文件本身。

目前有一个持续进行的二进制 MBP 文件格式描述工作（见[该站点](http://www.angelfire.com/ego2/idleloop/mbp_reader.html#mbp_file_format)）。另有一个 [mbp reader](http://www.angelfire.com/ego2/idleloop/mbp_reader.html) 程序，可以从 mbp 文件中提取笔记。

## eBook Creation

如今（2026 年）已经没有官方支持的 MOBI 格式文件制作工具了。由于 Kindle 设备的侧载词典只支持 MOBI 格式词典，想制作新的第三方词典就成了一个问题。

[Kindling](https://github.com/ciscoriordan/kindling) 是一个开源（MIT 许可证）的逆向工程 MOBI 文件制作器，支持词典。Kindling 的 github 仓库里还有更多关于 MOBI 文件格式的文档。

以往可用的工具有 [MobiPocket Creator](https://wiki.mobileread.com/wiki/MobiPocket_Creator)、[MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader#Windows) 和 [KindleGen](https://wiki.mobileread.com/wiki/KindleGen)。

### Guidelines

为了更好地支持 [MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader) 的特性，用这种格式做书时要遵守一些准则：

- 不要指定默认字体族、字号或其他字体属性（如字重、颜色）。这是读这本书的人应该能自己做的选择。特殊标题和其他特定元素可以指定字号与属性。只使用通用字体族。
- 不要对正文强制两端对齐。题注和其他特殊文本可能需要。
- 除表格数据外不要用表格。不支持嵌套表格。
- 不要用空行去强行翻页。用 `<mbp:pagebreak/>` 标签。
- 不要为不同设备做多个版本的书。改用多分辨率图片、平台专属框架等高级特性。

### Adapting images to various PDA screen resolutions

注意：以下这一节只适用于原始 MOBI 格式，Amazon 的 [AZW](https://wiki.mobileread.com/wiki/AZW) 文件并不使用。

Mobipocket 出版物的 IMG 标签支持最多三个面向不同分辨率的源属性：src、losrc 和 hisrc。这样就可以为不同设备优化同一本电子书。实际显示哪张图片由 Reader 依据真实设备屏幕的分辨率动态选择：

| Attribute | screen smallest size | example devices |
|---|---|---|
| losrc | ≤ 239 像素 | 低分辨率 160x160 Palm 设备（PalmVx、Treo 600、Zire）；智能手机（Nokia 3650、Sony Ericson P800/900、Microsoft 智能手机） |
| src | >= 240 像素（手持设备） | Pocket PC；高分辨率 Palm 设备（Sony Clie、Tungsten、Zire 71） |
| hisrc | >= 480 像素 | 任何桌面或平板 PC |

示例：

```
<img hisrc="cover480x640.gif" src="cover220x300.gif" losrc="cover140x140.gif"/>
```

另外请注意图片有 63KB 的内部上限（这是 Mobipocket .PRC 格式的限制）。GIF 必须小于 63KB。你可以用 Ulead Smart Saver 之类的 GIF 优化程序把 GIF 压到 63KB 以下。（若图片大于 63KB，MobiGEN 会自动缩放到限制以内，但效果可能不合你意。）JPEG 图片则会改用较低的质量设置来减小文件体积，而不缩小像素尺寸。

### HTML and CSS Tips for MOBI creation

- Kindle 和 Kindle DX 不能正确处理 soft hyphen 的 HTML 实体。改用 `<shy/>` 标签。
- 某些设备上灰色文字会被显示成白色。要避免这个问题，加上：

```
@media  amzn-mobi and (monochrome) {
        .mygreytextclass {
                color: black;
        }
}
```

- kindlegen 工具会忽略 `padding-left`。必要时可以在该元素内部再加一个元素并设置其左 margin 来绕过。
- kindlegen 工具的 CSS 解析器时有 bug。于是，如果你写的是：

```
div.foo p {
 ...
}
```

  kindlegen 工具常常会错误地把它解读成：

```
div.foo, div.foo p {
 ...
}
```

  在只想把样式应用到内层标签的场合，你必须给外层标签内的段落加一个自定义 class，然后单独使用那个 CSS 选择器。

更多针对 KF8 阅读器开发的技巧，见 [KF8 CSS Tips](https://wiki.mobileread.com/wiki/KF8#CSS_Tips)。

## Format limitations

MOBI 格式存在很多限制，这里列举几条：

- 文本块的右边距永远无法大于正常值。
- 左边距只能按 1em 的步进指定。文本只有在没有左边距时才能使用悬挂缩进。较新的 Kindle 渲染器已把左边距步进加大到约 2em。
- 文字无法环绕高于一行文字的图片。
- 图片尺寸不能随字号缩放。
- 在某些（并非全部）Mobipocket 渲染器里，带左边距的文字会根据前一次换行处的字号逐行改变边距值。
- 许多度量值（例如悬挂缩进的缩进量）不能用 em 指定。
- 个别文本无法用等宽字体显示。
- 表格在不同的 Mobipocket 渲染器上表现差异极大，尤其是跨屏的表格。
- 完全不支持嵌套表格。
- 此外，只有当你的标记是按 Mobipocket 那套非标准、有扩展且文档不全的 HTML 3.2 实现来写的时候，才能用上 Mobipocket 排版能力的全部范围。参见 mobipocket 网站上的 [File tag reference](https://web.archive.org/web/20160618120918/http://www.mobipocket.com:80/dev/article.asp?BaseFolder=prcgen&File=TagRef_OEB.htm)。

## MOBI DRM

MOBI 文件格式可以选择性地施加 [DRM](/wiki/formats/drm/)。有一套由 Mobipocket 和 [Overdrive](https://wiki.mobileread.com/wiki/Overdrive) 服务器支持的标准方案，它基于从阅读设备或程序派生的 ID。购买电子书时，服务器必须知道这个 PID，它会嵌入文件并锁定到设备上。该授权方案确实允许支持多台设备（通常最多 4 台），这种情况下服务器需要知道所有设备的 device id。新增设备后必须告知服务器并重新下载电子书，才能在新设备上阅读。新增设备或重新下载电子书通常不收费。但如果经销商倒闭，你可能就无法再新增设备了，因为那时已无从重新下载文件。

第二种更简单的方案只需知道购买电子书所用的账户登录名和密码。输入这些数据后即可阅读电子书，而且每台设备只需输入一次。这是一套新方案，某些阅读器可能还不支持。

某些电子书上使用的第三种方法是采用通用 MOBI 密钥。它有加密，但只用通用 MOBI 密钥（而非针对特定 PID 的密钥）。这意味着任何设备上的任何 MobiPocket Reader 软件都能读取，但任何非 MobiPocket 软件都不行。

DRM 只作用于电子书本身，不覆盖[元数据](https://wiki.mobileread.com/wiki/metadata)。一个库例程无须解锁电子书就能读取元数据。人们已经写出一些程序，甚至能在不碰文件中 DRM 部分的前提下修改这些信息。

## MOBI eBook Readers and converters

除 [MobiPocket 官方阅读器](https://wiki.mobileread.com/wiki/MobiPocket_Reader)外，还有第三方的阅读器和转换器，包括：

- [Calibre](https://wiki.mobileread.com/wiki/Calibre)
- [Kindling](https://github.com/ciscoriordan/kindling)
- [Stanza](https://wiki.mobileread.com/wiki/Stanza)
- [FBReader](https://wiki.mobileread.com/wiki/FBReader)
- [Book Designer](https://wiki.mobileread.com/wiki/Book_Designer)
- [STDU Viewer](https://wiki.mobileread.com/wiki/STDU_Viewer)
- [Sumatra PDF](http://www.sumatrapdfreader.org/)
- [Kindle for PC](http://www.amazon.com/gp/kindle/pc) 或 [Mac 版](http://www.amazon.com/gp/kindle/mac)
- [KindleUnpack](https://wiki.mobileread.com/wiki/KindleUnpack) —— 旧名 MobiUnpack —— 可以把一个 mobi 文件还原成原始形态，也被称为 mobi 解码器。
- [PDF to ePUB/Mobi Converter](http://www.ebook-tool.com/pdf-to-epub-mobi-converter.htm)
- [KindleGen](https://wiki.mobileread.com/wiki/KindleGen) —— Amazon 官方工具，把 ePub 转成 Mobi（[AZW](https://wiki.mobileread.com/wiki/AZW)）或以其他方式生成 Mobi 格式。

## MOBI eBook Hardware Readers

- [Bookeen Cybook Gen3](https://wiki.mobileread.com/wiki/Bookeen_Cybook_Gen3)
- [Bookeen Cybook Opus](https://wiki.mobileread.com/wiki/Bookeen_Cybook_Opus)
- [Hanlin V3 / Bebook / EZ Reader](https://wiki.mobileread.com/wiki/Hanlin_V3)
- [iRex iLiad](https://wiki.mobileread.com/wiki/IRex_iLiad)
- [iRex Digital Reader](https://wiki.mobileread.com/wiki/IRex_Digital_Reader)
- [Amazon Kindle Readers](https://wiki.mobileread.com/wiki/Amazon_Kindle)
- [Onyx BOOX readers](https://wiki.mobileread.com/wiki/Boox60)

并非所有支持 Mobi 格式的电子书阅读器都具有相同的功能。各设备实际支持什么，详见 [Mobi Comparison](https://wiki.mobileread.com/wiki/Mobi_Comparison)。

## Create a MOBI file from an ePub file

下面是从 [ePub](/wiki/formats/epub/) 文件制作 mobi 文件的一种方法：

1. 确保你想要的目录（TOC）条目只使用 h1-h2-h3 标题（原因见后文，或用下面第 10 条的办法）；
2. 在 [Sigil](https://wiki.mobileread.com/wiki/Sigil) 里完成整个 ePub，边做边用 "add existing item" 选项导入你的 [HTML](https://wiki.mobileread.com/wiki/HTML) 文件；
3. 收尾完成你的 ePub，先不要加封面页；
4. 下载并安装 MobiPocket Creator；
5. 解压你的 ePub；
6. 双击 [OPF](https://wiki.mobileread.com/wiki/OPF) 文件；
7. 书会在 MobiPocket Creator 中打开；
8. 把你的封面拖进 MBP Creator；
9. 用 MBP Creator 生成一个只用 1-2-3 级标题的 html.TOC；或者，
10. 另一种做法：编辑 Guide Properties 区，让 MPCreator 指向一个现成的 html.toc。（注意——toc.ncx 已经在你 MBPCreator 目录下 "My Publications" 文件夹里的正确位置了）
11. 点击 "Build"；
12. 你就得到了一个功能完整的 PRC 文件。

## For more information

- [Mobipocket Creator](http://www.mobipocket.com/en/DownloadSoft/ProductDetailsCreator.asp) —— 免费下载，另见 [MobiPocket Creator](https://wiki.mobileread.com/wiki/MobiPocket_Creator)
- [Mobipocket Development center](http://www.mobipocket.com/dev/) —— 制作文档
- [content generation](http://www.mobipocket.com/dev/article.asp?BaseFolder=prcgen) —— 其中"段落排版"一节讲了类 CSS 特性，不过 MOBI 里其实没有 CSS。
- [Amazon KindleGen](http://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000234621) —— mobiGen 的升级版，做 mobi 书完全够用。
- [KindleGen](https://wiki.mobileread.com/wiki/KindleGen) —— 本 wiki 关于 KindleGen 用法的页面。
- [MobileRead forum](http://www.mobileread.com/forums/showpost.php?p=774836&postcount=5) —— Mobi unpack，拆解一个 mobi 文件。
- [Java Mobi Metadata Editor](http://www.mobileread.com/forums/showthread.php?p=1927698) —— 编辑、添加、删除 mobi 文件中的 EXTH 标签。
