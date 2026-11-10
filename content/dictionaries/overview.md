---
title: 电纸书词典制作总览
original_title: "Dictionary"
source_url: https://wiki.mobileread.com/wiki/Dictionary
original_author: MobileRead Wiki 贡献者（DaleDe、Rolgiati 等，另有多位匿名 IP 编辑）
translated_at: 2026-11-10
order: 1
description: 电纸书词典总览：词典电子书与普通电子书的构建差异、取词弹窗与索引查找机制、MOBI/eReader/LIT 等格式的词典支持，以及翻译词典、英语词典、法语词典的资源与制作工具清单。
---

> 本文译自 MobileRead Wiki 的《Dictionary》页面，原文最后修订于 2022-04-17。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处与下载入口引用，本站不镜像论坛内容。

本页是电纸书（eBook）词典的总览。

## 问题所在

并不是每个人都觉得电纸书词典有必要——即使设备自带词典，他们也未必会用。遇到不认识的词，很多人直接从上下文推断词义，或者干脆跳过不管。有些人甚至坚称自己什么词都认识，尽管实际情况很少如此。

当然，读者的类型多种多样，而且有些电子书成书于几百年前，当时更常用的词汇与今天不同。此外，还有人在阅读非母语写成的作品，他们可能需要一部能查词义的词典——更好的是一部能把词翻译成另一种语言的词典。

而对于那些确实想查词的读者，会遇到一些特殊的问题。

## 应对思路

词典在电子书里有两种用法。一种是像纸质词典一样，直接翻开查词；另一种是在正在阅读的电子书里选中一个词，以弹窗形式查它，而不必离开当前这本书。不同的电子书阅读器支持的功能各不相同。

许多电子书阅读器并不支持上述方式的词典功能。词典当然也算一本书，就此而言你完全可以把它做成一本电子书。问题在于，大多数人并不想把一部词典从头到尾"读"一遍。因此，词典类电子书在构建乃至排版格式上通常与普通电子书不同，以便支持直接查词。这也要求阅读程序能够利用这种差异。

词典电子书带有用于查找词条的特殊索引，阅读器需要有一种直接访问词条的手段。如果你在读另一本书，可以在这本电子书里选中一个词，再用这个选区去查词典——这是电纸书词典最主要的用法。Cybook 和 Kindle 都采用了这一技术的不同变体。

如果电子书阅读器或阅读程序支持键盘式输入单词，那么它就可以对词典本身做索引查找，而不需要先在某本书里找到这个词。这种方式有时被称为"词典搜索"（dictionary searching），但词条必须放在专门的索引里，否则搜索会混入出现在释义正文里的词。

也可以利用目录（TOC）能力和内部链接，通过某种逐级展开、多次选择的级联目录来访问词条。只要阅读器支持内部链接，这招就能用，但体验再好也十分笨拙。

所以说到底：词典的构建方式必须与普通图书不同，而阅读器也确实需要一套专门的机制来访问这些数据。

## 解决方案

有些阅读器只支持一部或寥寥几部词典，有些则允许同时装多部。有的按你选定的词典查词，有的会把你的词典收藏逐部全查一遍，把所有结果按顺序列在同一页上。

[Mobipocket](https://wiki.mobileread.com/wiki/MOBI) 和 [eReader](https://wiki.mobileread.com/wiki/EReader) 是两种在格式层面内置了词典支持的电子书格式。不过，只要阅读程序本身具备相应支持，这些词典也可以为阅读其他格式图书的程序所用。两种格式都支持 [DRM](https://wiki.mobileread.com/wiki/DRM)。

[Kindle](https://wiki.mobileread.com/wiki/Kindle) 的全线产品都有不错的词典可用。

[LIT](https://wiki.mobileread.com/wiki/LIT) 包含词典支持，并且可以从微软网站下载一部免费词典。

[Cool Reader](https://wiki.mobileread.com/wiki/Cool_Reader) 通过 [AlReader](https://wiki.mobileread.com/wiki/AlReader) 词典实现了词典支持，因此使用这套 API 的产品都可以轻松加上词典功能。

有一个叫[词典交换格式](http://xdxf.sourceforge.net/)（Dictionary exchange format）的项目，试图统一各种免费格式，让词典可以共享。不过它不涉及带 [DRM](https://wiki.mobileread.com/wiki/DRM) 的词典。参见 [XDXF](https://wiki.mobileread.com/wiki/XDXF)。

[BDicty](https://wiki.mobileread.com/wiki/BDicty) 是一个词典程序，最初为 [PalmOS](https://wiki.mobileread.com/wiki/PalmOS) 开发，现已支持多个平台。

[SDictionary](http://swaj.net/sdict/index.html) 是一个跨平台词典项目，使用自有的开放 Sdict 词典格式。目前已知的可用平台包括 UNIX、Win32 和 Symbian OS。

## 翻译词典

- 意英、英意词典（Dizionario Dictionary Italiano Inglese / Dizionario Dictionary Inglese Italiano，[PDF](https://wiki.mobileread.com/wiki/PDF) 格式），收录于 MobileRead 电子书上传区
- [StarDict 免费开源词典](http://stardict.sourceforge.net/Dictionaries_dictd-www.dict.org.php)
- [Dict.org](http://www.dict.org/links.html)——一个客户端/服务器实现。
- Dict 格式为 [AlReader](https://wiki.mobileread.com/wiki/AlReader) 等程序所用，Lingvo 与 Slovoed 的词典里也有此格式——详见[俄语论坛](http://www.alreader.com/forum/viewforum.php?f=4)。
- [《数字拉丁语词典》（A Digital Latin Dictionary）](http://www.amazon.com/dp/B005CA3W2G)：Kindle 用的拉丁语词典。

## 英语词典

- 诺亚·韦伯斯特（Webster, Noah）：《韦氏词典 1913 版》（Webster's Dictionary 1913，收词 110,875 条），有 [IMP](https://wiki.mobileread.com/wiki/IMP) [（此处）](http://www.mobileread.com/forums/showthread.php?t=29982)、[MOBI](https://wiki.mobileread.com/wiki/MOBI) [（此处）](http://www.mobileread.com/forums/showthread.php?t=31510)、[EPUB](https://wiki.mobileread.com/wiki/EPUB) [（此处）](http://www.mobileread.com/forums/showthread.php?t=31511)、[RB](https://wiki.mobileread.com/wiki/RB) [（此处）](http://www.mobileread.com/forums/showthread.php?t=31513) 以及 DIC [（此处）](http://www.mobileread.com/forums/showthread.php?p=654920#post654920) 各格式版本，来自 MobileRead 电子书上传区
- [XDXF 词典](http://sourceforge.net/projects/xdxf/files/dicts-XDXF/)——XML 词典交换格式（XML Dictionary Exchange Format），韦氏词典这里也有，另有大量词典可用。
- 《兰登书屋词典》（Random House Dictionary，收词 19,300 条）的旧资源：[rhd.rb](http://www.mobileread.com/forums/showthread.php?p=262705#post262705)
- [Encarta 袖珍词典](http://www.microsoft.com/reader/info/features/dictionary.aspx)（收词 86,000 条），微软提供的 [LIT](https://wiki.mobileread.com/wiki/LIT) 格式
- [MobileRead 帖子](http://www.mobileread.com/forums/showthread.php?t=22320)——讲解如何给 [PRS500](https://wiki.mobileread.com/wiki/PRS500) 或 [PRS505](https://wiki.mobileread.com/wiki/PRS505) 添加词典。注意：这种方式只能进入词典单独查询，阅读其他书时不可用。
- [StarDict 免费开源词典](http://stardict.sourceforge.net/Dictionaries_dictd-www.dict.org.php)
- [MobiPocket](http://www.mobipocket.com) 出售其格式的词典
- [eReader](http://www.ereader.com) 出售其格式的词典
- [ABBYY Lingvo](http://www.lingvo.com/) 词典，覆盖 PC 与移动设备。在线翻译词典见 [Lingvo Online](http://www.lingvo-online.ru/en)。
- [Dict FTP 站](ftp://ftp.dict.org/dict/pre)——预打包及其他 dict 文件。
- 普林斯顿大学的 [WordNet](http://wordnet.princeton.edu/)，有 [MOBI](http://eb.lv/dict/) 格式版本

## 法语词典

（原文本节标题作 "French Dictionnaries"，拼写如此。）

- 《法兰西学院词典》（Dictionnaire de l'Académie française）1932-35 年第 8 版，[MOBI](https://wiki.mobileread.com/wiki/MOBI) 格式 [（此处）](http://www.ebooksgratuits.com/newsendbook.php?id=1609&format=mp)
- 《利特雷词典》（Dictionnaire Littré，1860-1876），[MOBI](https://wiki.mobileread.com/wiki/MOBI) 格式 [（此处）](http://www.ebooksgratuits.com/newsendbook.php?id=1396&format=mp)

## 电纸书设备

以下设备可以在阅读电子书时用词典查词：

- [JetBook](https://wiki.mobileread.com/wiki/JetBook) 内置词典支持，附带多部词典，还支持多语种互译。
- [Kindle](https://wiki.mobileread.com/wiki/Kindle) 自带词典，支持 [AZW](https://wiki.mobileread.com/wiki/AZW)（本质上是 [MOBI](https://wiki.mobileread.com/wiki/MOBI) 格式）词典。只能使用一部词典。
- [Bookeen Cybook Gen3](https://wiki.mobileread.com/wiki/Bookeen_Cybook_Gen3) 支持 [MOBI](https://wiki.mobileread.com/wiki/MOBI) 词典，多部词典可同时生效。
- [EBookwise-1150](https://wiki.mobileread.com/wiki/EBookwise-1150) 带有词典。

## 拼写检查词典

拼写检查器用的"词典"其实算不上经典意义上的词典，为求全面仍一并收录于此。

- [HunSpell](http://hunspell.sourceforge.net/)——开源拼写检查器，[Open Office](https://wiki.mobileread.com/wiki/Open_Office) 用的就是它。
- [Micro spell](http://www.microspell.com/)——[Windows](https://wiki.mobileread.com/wiki/Windows) 上的拼写检查器，配合 [Sigil](https://wiki.mobileread.com/wiki/Sigil) 或其他[图书制作软件](https://wiki.mobileread.com/wiki/Book_authoring_software)很实用。
- [《如何编写拼写纠正器》](http://norvig.com/spell-correct.html)（How to Write a Spelling Corrector）介绍了一个 21 行的 [Python](https://wiki.mobileread.com/wiki/Python) 程序，用于检查并纠正拼写错误。

## 软件

- [Mobidict](https://wiki.mobileread.com/wiki/Mobidict) 是一个 Windows/Linux/MacOS 独立程序，用于读取 [MOBI](https://wiki.mobileread.com/wiki/MOBI) 或 [Kindle](https://wiki.mobileread.com/wiki/Kindle) 格式的词典。
- [Penelope](https://github.com/pettarin/penelope) 是一个集词典创建、编辑与转换于一体的多功能工具，专为电纸书设备而设计。

## 延伸阅读

- [MobileRead 帖子](http://www.mobileread.com/forums/showthread.php?t=20480)——讲解如何用任意语言制作 [MOBI](https://wiki.mobileread.com/wiki/MOBI) 词典。
- [MobileRead 帖子](http://www.mobileread.com/forums/showthread.php?t=46382)——介绍一个运行于部分 Hanlin 设备上的 [Cool Reader](https://wiki.mobileread.com/wiki/Cool_Reader) 词典。
- [StarDict 文件格式说明](http://stardict.sourceforge.net/StarDictFileFormat)
- [IDPF 的 ePub 3 词典与词汇表标准](http://www.idpf.org/epub/dict/)（[ePub 3](https://wiki.mobileread.com/wiki/EPub_3)）
