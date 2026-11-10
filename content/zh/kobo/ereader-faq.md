---
title: "Kobo eReader 常见问题（FAQ）"
original_title: "Kobo eReader"
source_url: https://wiki.mobileread.com/wiki/Kobo_eReader
original_author: MobileRead Wiki 贡献者（Stinger、DaleDe、Artificial、THE TERMINATOR 等）
translated_at: 2026-11-10
order: 3
description: Kobo 初代 eReader 的官方支持渠道、社区宿主应用与 16 条常见问答：预装书清理、传书方法、"Content is Locked" 报错、ADE 授权管理、Linux 源码与自定义字体修正。
---

> 本文译自 MobileRead Wiki 的《Kobo eReader》页面，原文最后修订于 2018-03-27，内容针对早期 Kobo 机型与旧版固件，部分信息已过时，仅作历史参考。
> 原文中的论坛帖链接与外部链接按原样保留，仅作为出处引用，本站不镜像论坛内容。
> 文中的故障排查思路仍具参考价值，具体操作请以 Kobo 官方当前文档为准。

Kobo eReader 是 [Kobo](https://wiki.mobileread.com/wiki/Kobo) 的第一台专用阅读器。此前 Kobo 已为[智能手机](https://wiki.mobileread.com/wiki/smartphones)发布过阅读软件，并运营着一个电子书网站。这台阅读器采用极简按键界面、绒面绗缝背板，并提供多种颜色与图案的 [gela skins 贴膜](http://www.koboereader.com/accessories.html)。

内置的电子书管理器允许你按自己喜欢的方式组织书库——按书名、最近阅读日期或作者。这台阅读器由 Borders（澳大利亚和美国）与 Whitcoulls（新西兰）负责国际市场销售；英国的 WH Smith 从 2010 年 12 月下旬开始销售。

最新版本的阅读器内置 [Wi-Fi](https://wiki.mobileread.com/wiki/Wi-Fi)，可以直接浏览和购书。

## 设备规格

| 项目 | 规格 |
| --- | --- |
| 上市时间 | 2010 年 5 月（澳大利亚、加拿大），2010 年 6 月（新西兰） |
| 颜色 | 瓷白、黑、丁香紫、蓝、银 |
| 机身尺寸（Wi-Fi 版/初代） | 7.2" × 4.7" × 0.40"（184 × 120 × 10 mm） |
| 重量 | 221 g（7.05 oz） |
| 屏幕 | 6" E Ink，800×600 像素；初代 Kobo 为 8 级[灰阶](https://wiki.mobileread.com/wiki/grayscale)，Wi-Fi 版为 16 级 |
| 存储 | 1 GB（约可存 1000 本书） |
| 存储扩展 | SD 卡（最大 32GB） |
| 字号 | 5 档 |
| 字体样式 | 衬线（Serif）与无衬线（SansSerif）两种 |
| 预装内容 | 100 本免费完整电子书 |
| 电子书文件格式 | [ePub](https://wiki.mobileread.com/wiki/ePub)、[PDF](https://wiki.mobileread.com/wiki/PDF)、Adobe [DRM](/zh/wiki/formats/drm/)；从 1.8.1 版固件起（针对 Kobo-1），还支持 RTF、txt、html 及多种图片格式 |
| 连接 | [USB](https://wiki.mobileread.com/wiki/USB)、Bluetooth®、Wi-Fi |
| 电池 | 最多 10000 次翻页 |
| 导航 | 四向导航键：Home、Menu、Back、Display/Shop，中央确认键 |
| 官方网站 | [koboereader.com](http://www.koboereader.com/)、[kobobooks.com](http://www.kobobooks.com/)（宣称有 200 万本电子书） |

## 官方支持选项

以下信息截至 2013 年 9 月 17 日。请注意本 wiki 未必总是收录最新的设备信息。

自 2013 年 9 月 30 日起，Kobo 不再使用 Get Satisfaction。

在 Twitter 上发推 @KoboHelp 即可联系 Kobo 的官方支持。你也可以在 [Facebook](https://www.facebook.com/kobo) 上找到 Kobo，或访问[官方博客](http://cafe.kobo.com/)获取新动态。

邮件支持请联系 help@kobo.com（原文注明该邮箱现已失效）。

你还可以在[帮助页面](http://www.kobo.com/help)了解各设备的信息、获取电话支持，或与 Kobo 客服在线聊天。

全部客服电话号码[在此列出](http://www.kobo.com/help/customer-care-phones/#NA)。

## 宿主应用

社区为 KoboReader 编写了一个宿主应用（host application），支持 Windows、Mac 与 GNU/Linux。它是一个数据库应用，用来管理阅读器上的图书。其[数据库结构有文档](http://wiki.durbn.net/koboko/index.php/DBSchemaV2)可供查阅。

## Kobo FAQ

### 我的 Kobo 上有些 ePub 改不了字号，怎么办？

这是首个正式版固件里的一个已知问题——详情与一个可自动修复问题 ePub 的工具，见[这个帖子](http://www.mobileread.com/forums/showthread.php?t=83209)。

### 我以为我的 Kobo 能撑 8000 页翻页，怎么没到？

参见[这里的讨论](http://www.mobileread.com/forums/showthread.php?t=82717)。（注：Kobo 已在其 [Facebook 主页](http://www.facebook.com/kobobooks)表示，即将发布的固件更新会["延长"](http://www.facebook.com/topic.php?uid=209803832591&topic=14623)电池续航。）

### 我的电池状态指示不准确，为什么？

目前电池电量计（位于 Kobo eReader 的菜单屏幕）只在设备开机时更新一次。所以电量看起来没掉，实际上一直在消耗。想读到准确电量，需要把 Kobo eReader 关机再开机。（注：Kobo 已在其 [Facebook 主页](http://www.facebook.com/kobobooks)表示，即将发布的固件更新会[修复](http://www.facebook.com/topic.php?uid=209803832591&topic=14623)电池指示的问题。）

### 怎么删掉新 Kobo 上预装的 100 本免费书？

这 100 本免费书存放在 Kobo 内置的 [SQLite](https://wiki.mobileread.com/wiki/SQLite) 数据库里，并没有每本书单独的文件。要一次性删掉*全部*免费书，只需（用"我的电脑"或任意文件管理器）删除 `\.kobo` 目录下的 `KoboReader.sqlite` 文件。删除前务必先备份这个数据库文件并妥善保存（如果你不在乎丢掉那 100 本免费书，不备份也无所谓）。删掉数据库后，需要通过桌面应用同步一次 Kobo，它会新建一个干净的空数据库。

注意这样删掉的不只是那 100 本免费书，还包括所有通过官方桌面应用或 ADE 装进 Kobo 的书；设备上普通 ePub 的全部书签（当前阅读位置）也会丢失（ePub 文件本身还在，Kobo 拔线后会把它们当作新书重新处理）。

如果你想有选择地删除单本书，可以用 Calibre：从 0.7.5 版起，带此功能的 Kobo 驱动（此前为测试版）已并入主线。

### 怎么把 ePub 文件传到我的 Kobo eReader？

当时 Kobo 桌面应用只允许把在 Kobo 购买的书传到阅读器上。传输 ePub 可以用下面几种方法：

- **Calibre**：[Calibre](http://calibre-ebook.com) 是一个免费软件，支持 Windows、Mac 和 Linux。把 ePub、PDF、LIT 或其他格式的电子书下载到电脑后，Calibre 可以把它"添加"到电脑上的 Calibre 书库。它还支持格式互转、添加封面、在一定程度上调整电子书版式。然后你可以把书库一次性传到 Kobo，也可以每添一本传一本。如果换了一台 Kobo 或者想清空重灌，可以从 Calibre 重新加载这些电子书。同时你仍然可以用 Kobo 官方软件来购买、管理和下载已购电子书——Kobo 上的书库就是这几处书库的总和。

  需要特别注意：Calibre *可以*用来*管理*带各种 [DRM](/zh/wiki/formats/drm/) 保护的电子书，但不能用来打开/查看受保护的电子书，也不能把它转换成其他格式。要把一本 DRM 保护的电子书加进 Calibre 书库，先用对应的客户端软件（Adobe ADE、Sony Reader 软件等）下载受保护文件，找到该文件后像普通书一样导入 Calibre 即可。

- **ADE**：[Adobe Digital Editions](http://www.adobe.com/products/digitaleditions/) 是一个管理电子书的免费软件，可以用 ADE 把 ePub 传到 Kobo eReader 上。

- **拖放**：用 USB 线连接电脑时，Kobo eReader 会显示为一个 USB 存储设备，把 ePub 文件从本地硬盘拖到 Kobo 根目录即可。

- **邮件发送**：Sendtokobo 是一个面向 Kobo 电纸书的免费服务，类似"Send to Kindle"。

### 不带 DRM 的书提示 "Content is Locked"，怎么修？

书名或作者名里含撇号（apostrophe，即 '）的电子书，有时会触发这条莫名其妙的"已锁定"报错，导致这本书在 Kobo 上无法阅读（虽然在电脑上可以用 Calibre 打开）。用 Calibre 编辑书名和/或作者名，去掉撇号后重新发送到 Kobo 即可。如果不想改动 Calibre 里母本的元数据，也可以手动去掉 Kobo 上相应目录名和文件名里的撇号。

另一个触发场景：你直接在电脑的文件管理器里删掉了主内存里的 `*.epub` 文件。文件已经没了，但数据库还认为它存在；在设备上选中这本书时，给出的不是更准确的"文件未找到"，而是令人困惑的 DRM 报错 "content is locked"。通过 Kobo 菜单从书籍列表里删除该条目，或在 Calibre 里删除，即可清掉这类"僵尸"数据库记录。

### 带 Adobe DRM 的书提示 "Content is Locked"，怎么修？

按以下步骤恢复访问：

1. 在 Adobe Digital Editions 里删除该文件。
2. 确认阅读器的日期和时间设置正确。
3. 取消电脑与阅读器的授权。
4. 恢复 Kobo 出厂设置。

**警告**：恢复出厂设置会删掉后来添加到 Kobo 的所有阅读材料。之后同步 Kobo 可以找回在 Kobo 商店购买的书，但从其他来源获得的书和文档不会恢复。动手前请先备份这些书和文档。

恢复出厂设置的步骤：

1. 按阅读器左侧的 Menu 键。
2. 移动光标到 Settings。
3. 按导航键中央确认。
4. 移动光标到页面顶部的 Advanced。
5. 按导航键中央确认。
6. 移动光标到 Reset Device Now。
7. 按导航键中央确认。
8. 询问是否继续时，移动光标到 Continue。
9. 按导航键中央确认。
10. Kobo 将恢复到原始出厂状态。

然后重新授权设备与电脑：

1. 插上 Kobo。
2. 打开 ADE。
3. 按提示用你的 Adobe ID 登录并授权设备。
4. 重新下载该文件并传到 Kobo。

注：如果是图书馆借的书，需要向图书馆重新索取一份 ePub 下载来续借。

### 为什么我的 Kobo eReader 关不了机？

关机请按机身顶部的蓝色电源键。设备关闭后，屏幕会显示你当前在读那本书的封面，屏幕下方会有 "Press power button to start reading" 的提示。虽然屏幕上仍有画面，但请放心，阅读器确实已经关机、不再耗电——Kobo eReader 的 E Ink 屏幕在设备关机后仍会一直保留最后一幅画面。

（注意：如果 Kobo 因为某种原因失去响应，需要*长按*电源键约十秒钟才能关机。这种情况下屏幕不会有任何确认提示，但再按一次电源键就能把 Kobo 重新开机。）

### 怎么更改 ePub 书籍的段落对齐方式？

目前 Kobo eReader 没有内置的重排 ePub 功能。但如果你的 ePub 没有 [DRM](/zh/wiki/formats/drm/) 保护，可以在传到 Kobo 之前先重排。

一种做法是把 ePub 加进 [Calibre](http://calibre-ebook.com) 书库，做一次 ePub 到 ePub 的转换；在转换设置的 "Look and Feel"（外观）菜单里即可更改文本对齐（justification）方式。

### 页码显示是怎么回事？

用官方桌面应用装进 Kobo 的书，页码按"章内页码"显示；其他来源的书则显示"当前页/总页数"。如果你更喜欢总页数的方式，就通过 "Download ePub" 链接和 Adobe ADE 从 Kobo 下载图书。

### 怎么用 ADE 取消 Kobo（或其他）设备的授权？

Windows 操作步骤：

1. 在电脑上打开 ADE，把 Kobo 连到电脑。
2. 按 Ctrl+Shift+E。会弹出一个询问是否取消授权的对话框，选择"是"。
3. 把 Kobo 从电脑上拔下再重新插上，此时应弹出"检测到新设备"的对话框，即可重新授权。

Mac OS X 操作步骤：

1. 在 Mac 上打开 ADE，把 Kobo 连到电脑。
2. 按 Cmd-Shift-E（原文误作 "Cmc-Shift-E"）。会弹出一个询问是否取消授权的对话框，选择"是"。
3. 把 Kobo 从电脑上拔下再重新插上，此时应弹出"检测到新设备"的对话框，即可重新授权。

### 怎么用 ADE 取消电脑的授权？

Windows 操作步骤：

1. 在电脑上打开 ADE。
2. 按 Ctrl+Shift+D。会弹出一个询问是否取消电脑授权的对话框，选择"是"，ADE 会关闭。
3. 重新打开 ADE，进入书库视图，点击 "library" 下拉菜单，选择 "authorize computer"（授权这台电脑）。

Mac OS X 操作步骤：

1. 在 Mac 上打开 ADE。
2. 按 Cmd-Shift+D。会弹出一个询问是否取消电脑授权的对话框，选择"是"，ADE 会关闭。
3. 重新打开 ADE，进入书库视图，点击 "library" 下拉菜单，选择 "authorize computer"（授权这台电脑）。

### 怎么用 iTunes 把 PDF 和未加密 ePub "侧载"进 Kobo 应用？

1. 确认设备上的 Kobo 应用为 3.4 或更高版本，且设备运行的 iOS 版本支持侧载（能运行 iOS 4.0 或更高版本的 iPhone/iPod，以及所有 iPad，不论其 iOS 版本）。
2. 启动 iTunes。
3. 把设备连接到 iTunes。
4. 在 iTunes 的设备列表中选中该设备。
5. 点击所选设备的 "Apps" 标签页。
6. 滚动到 Apps 页面底部，会看到一个 "File Sharing"（文件共享）区域。
7. 点击 File Sharing 区域里显示的 Kobo 图标。
8. 把 PDF 和/或未加密的 ePub 文件拖入 Kobo 的 Documents 区域，或用 "Add..." 按钮添加文件。
9. iTunes 会自动把文件同步到设备。
10. 启动 Kobo 应用，就能看到通过 iTunes 添加的文件了。

### 它跑的是 Linux——源代码有没有按规定公开？

公开了。Kobo 和 Kobo Wi-Fi 的源代码以 dump 形式发布在 [GitHub](https://github.com/kobolabs/Kobo-Reader) 上。它们是以 tarball 塞进 git 的（唉），没有版本历史，但 Kobo 把自己对库的补丁与库的原始压缩包分开了，所以还算好用。遗憾的是内核补丁（如果有的话）没有从原始的 eb600 2.6.18 内核里分离出来。把这些源码发布到 GitHub 的 [gtalusan](https://github.com/gtalusan) 响应积极、乐于帮忙。

Epson S1D13521 显示驱动只包含二进制文件、没有源码，不过它看起来是从已并入主线的较新内核向 2.6.18 的回移（backport）。

除了设备上用到的库和内核，一些辅助程序的源码（如 Wi-Fi 监控守护进程 wifi monitor daemon）也发布了——法律上本无此义务。谢谢！

设备上运行的 Kobo 用户界面程序*不*开源，也不在发布范围内。它只链接 MIT/BSD/LGPL 代码，所以 Kobo 没有义务公开其源码。可惜之处在于：这个应用用的是 Qt Embedded 工具链，如果代码公开，折腾和增强它会很有意思。社区想要的许多改进，只要代码（哪怕一个插件接口）存在就能实现。

### 怎么拆开它、破解固件，或在上面跑程序？

Soapy Frogs 有一份[相关文档](http://soapyfrogs.blogspot.com/2011/01/kobo-and-kobo-wifi-hacking.html)。

更多资料正在本 wiki 上陆续整理，见 [Kobo 破解](/zh/wiki/kobo/hacking/)（原文页 [Kobo WiFi Hacking](https://wiki.mobileread.com/wiki/Kobo_WiFi_Hacking)）与 [Kobo eReader 拆解](https://wiki.mobileread.com/wiki/Kobo_eReader_disassembled)。

### 修正自定义字体，让它正确显示

虽然 Kobo 加载自定义字体非常容易，但对文件名和字体内部属性（font metrics）有几条严格规则，全部满足才能正常工作。下面以 Amazon Ember 字体为例。

1. Amazon 固件里有很多个 Ember 字体文件，务必挑一套配对的 4 个。按原作者的判断，需要的 4 个文件内部字体名都应为 Amazon Ember（而不是 Amazon Ember Medium、Amazon Ember Bold 或 Amazon Ember Heavy）。4 个原始文件名是：
   - `Amazon-Ember-Bold.ttf`
   - `Amazon-Ember-BoldItalic.ttf`
   - `Amazon-Ember-Regular.ttf`
   - `Amazon-Ember-RegularItalic.ttf`
2. Kobo 对文件命名有严格约定。文件名的第一部分必须与内部字体名 Amazon Ember 完全一致（带空格，而不是 Amazon-Ember）。就这款字体而言，斜体文件名的第二段 `-RegularItalic` 还要改成 `-Italic`。即按下面这样重命名：
   - `Amazon-Ember-Bold.ttf` → `Amazon Ember-Bold.ttf`
   - `Amazon-Ember-BoldItalic.ttf` → `Amazon Ember-BoldItalic.ttf`
   - `Amazon-Ember-Regular.ttf` → `Amazon Ember-Regular.ttf`
   - `Amazon-Ember-RegularItalic.ttf` → `Amazon Ember-Italic.ttf`
3. 这一步稍麻烦：Kobo 不认 Amazon 在部分字体里使用的 Panose Weight 属性值，需要用字体编辑工具手动修正，例如 FontForge（免费）或 FontCreator（收费）。

   原始 Ember 文件里 Panose Weight 的值是 Medium（`-Regular` 与 `-Italic` 两个文件）和 Demi（`-Bold` 与 `-BoldItalic` 两个文件），而 Kobo 期望的值分别是 Book 和 Bold。

   用 FontForge 修改 Panose Weight 的步骤：

   1. 先把 4 个原始 ttf 文件各复制一份备份——FontForge 里手一快很容易覆盖掉原文件。
   2. 打开 FontForge，找到 `xxx-Regular.ttf` 并双击，会打开一个显示全部字形的新窗口。
   3. 菜单栏进入 **Element > Font Info**。
   4. 在左栏选中 **OS/2**，再点击 **Panose** 标签页。
   5. 会看到一列属性，各带一个下拉菜单。**Weight** 是第 3 项，如果它的值不是 **Book**，就点开下拉菜单选 **Book**。
   6. 点击底部的 **OK** 按钮，回到显示字形的主窗口。
   7. 保存修改后的 ttf：点击 **File > Generate Fonts**，选好保存位置后点击底部的 **Generate** 按钮。（可能弹出某种警告，原作者直接点 "Yes" 忽略了。）
   8. 点击 **File > Close**。会弹出是否保存 untitled.sfd 文件的询问，点击 **Don't Save**。
   9. `xxx-Regular` 这个字体就完成了。
   10. 对 `xxx-Italic.ttf` 重复第 2–8 步。
   11. 对 `xxx-Bold.ttf` 和 `xxx-BoldItalic.ttf` 同样重复第 2–8 步，但在第 5 步要把 Weight 值选成 **Bold**。
