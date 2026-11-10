---
title: "Kindle Touch 越狱、救砖与备份"
original_title: "Kindle Touch Hacking（拆分篇：Jailbreak / Unbricking / Backup）"
source_url: https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking
original_author: "MobileRead Wiki 贡献者（NiLuJe、Eureka、DaleDe、Eschwartz、Ixtab 等）"
translated_at: 2026-11-10
order: 2
description: Kindle Touch / Paperwhite 的越狱方法总览（当前通用方法与各历史方法）、退出诊断模式、重启、救砖（Kubrick 等）与分区级完整备份流程。
---

> 本文译自 MobileRead Wiki 的《Kindle Touch Hacking》页面，原文最后修订于 2021-07-28。
> 原文是单页长文，本站按主题拆为 4 篇；本文是系列第一篇，收录其中的越狱（Jailbreak）、退出诊断模式（Exiting Diags Mode）、重启（Rebooting）、救砖（Unbricking）与备份（Backup）五章。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处与下载入口引用，本站不镜像论坛内容。
> 越狱与救砖涉及系统级操作，做错会变砖——动手前请先读完本文的"备份"一节并做好备份。

系列另三篇：[开发环境](/zh/wiki/kindle/touch-development/)、[越狱包清单](/zh/wiki/kindle/touch-packages/)、[系统架构与底层访问](/zh/wiki/kindle/touch-internals/)。

**摘要**：本页的目的，是以尽量简明的方式，汇集 [Kindle Developer's Corner](https://www.mobileread.com/forums/forumdisplay.php?f=150) 论坛版块中关于 [Kindle Touch](https://wiki.mobileread.com/wiki/Kindle_Touch)（KT）与 [Kindle Paperwhite](https://wiki.mobileread.com/wiki/Kindle_paperwhite)（PW）的大量信息，涵盖越狱（jailbreak）、修改（modification）以及如何为设备做开发等主题。

**本页希望永远处于建设中。** 欢迎随时补充你发现的、目前还缺失的有价值信息！

> **很遗憾，这个声明看来必不可少：本页不是一本"食谱"，也**不**包含可以不经思考照抄的"菜谱"。**
> 本页描述的是一台复杂设备的技术细节。如果你要执行下文介绍的流程（尤其是其中偏技术的那些），至少应该对自己在做什么有一个粗略的认识，并且能说清楚预期的结果。如果你不知道会发生什么，那多半说明你并不真正了解自己在做什么——这种情况下，干脆别动手也许更好。

开始之前：

- **成功越狱之后，你**最应该**立刻去做的事情之一，就是给设备做备份！**（见下文"备份"一节。）相信我们，你会庆幸自己做了这件事。
- **确认设备的时间和日期设置正确。**（最简单的办法是连接一个无线网络。）设备时间不对时，安装更新包可能会遇到问题。

## K5 索引

K5 分类下重要帖子、回帖与站外资源的索引，见 [K5 index](https://wiki.mobileread.com/wiki/K5_Index)。

## 越狱（Jailbreak）

越狱本身并不能让你多做多少事。它其实只是在设备上安装了一把附加的"开发者"（developer）密钥，让我们可以通过 Kindle 自带的更新机制安装附加软件包。

### 当前通用方法

在[这个帖子](https://www.mobileread.com/forums/showthread.php?t=186645)里，你可以找到适用于**部分** Kindle Touch **以及** Paperwhite / Paperwhite 2 固件（5.0.0 至 5.4.4.2）的越狱方法。

如果你在 PW2 上正在使用（或打算刷入）5.4.5（含）至 5.6.x（不含）之间的固件：可以做到，但请务必仔细阅读越狱说明中对应的小节！

如果你现在还不是 5.6.x 及以上的固件、但打算通过更新升上去：在特定配置下可以安全完成，但会带来一些潜在的弊端。同样，请非常仔细地阅读越狱帖子的对应小节。

更新：[这个帖子](https://www.mobileread.com/forums/showthread.php?t=275877)提供了适用于绝大多数触屏 Kindle 机型（固件低于 5.8.8）的通用越狱说明。

Wiki 上有一页专门复刻该帖的信息，站内已译出，见[《Kindle 5.x 软件越狱》（PW2 及更新机型）](/zh/wiki/kindle/jailbreak/)。

下面这几种方法出自越狱手段演进的各个时期，**仅作历史参考保留**：

### 哪种方法适合我？（仅历史参考）

这取决于你的设备和固件版本。

- Kindle **Touch**：
  - 固件 **5.0.0 - 5.1.2**：使用 **data.tar.gz** 方法。注意根据你的固件版本选择正确的文件。
  - 固件 **5.3.2、5.3.2.1、5.3.7**：使用下文的**手动方法**，或参考[这个帖子](https://www.mobileread.com/forums/showthread.php?t=218613)（没错，它是针对 5.3.7 写的，但事实上适用于所有版本）。
- Kindle **Paperwhite**：
  - 固件 **5.2.0 - 5.3.1、5.3.4、5.3.5**：使用 **jailbreak.mobi** 方法。
  - 固件 **5.3.3、5.3.6**：同样使用 **jailbreak.mobi** 方法（但得先降级到 5.3.1 或 5.3.5）。

### jailbreak.mobi 方法（仅历史参考）

此方法**仅适用于 Paperwhite**，固件版本 **5.2.0 - 5.3.1、5.3.4、5.3.5**，是 Paperwhite 越狱的推荐方法。如果你在用更新的固件版本，可以先降级到 5.3.1、装好越狱、再升回去；具体怎么做，所链帖子里有说明。

要安装越狱，请按[这个帖子](https://www.mobileread.com/forums/showthread.php?t=198446)里的说明操作。

### data.tar.gz 方法（仅历史参考）

- 帖子：[showthread.php?t=186645](https://www.mobileread.com/forums/showthread.php?t=186645)
- 更多技术背景见[这则回帖](https://www.mobileread.com/forums/showpost.php?p=1902438&postcount=41)

此方法适用于 Kindle Touch 的 5.0.0 至 5.1.2 版本，以及 Kindle Paperwhite 的 5.2.0 版本。

- 从[这个帖子](https://www.mobileread.com/forums/showthread.php?t=186645)下载并解压越狱包。
- 如果你运行的是固件 **5.1.x 或 5.2.0**：
  1. 插上 Kindle，把 `data.stgz` 文件拷贝到 Kindle USB 存储的根目录。
  2. 安全移除 Kindle 的 USB 连接，然后重启设备（菜单 → 设置 → 菜单 → 重启）。
- 如果你运行的是更早的固件 **5.0.x**：
  1. 插上 Kindle，把 `data.tar.gz` 文件拷贝到 Kindle USB 存储的根目录。
  2. 安全移除 Kindle 的 USB 连接，然后重启设备（菜单 → 设置 → 菜单 → 重启）。

### jailbreak.mp3 方法（仅历史参考）

此方法适用于 Kindle Touch 的 5.0.0 和 5.0.1 版本。更新的固件版本请看上文。

1. [下载](http://yifan.lu/p/kindle-touch-jailbreak)并解压越狱包。（[镜像](http://gitbrew.org/~dasmoover/kindle/touch/packages/kindle-touch-jailbreak-1.0.zip)）
2. 按 README 文件里的说明操作。

- 工作原理的背景介绍：[How the Kindle Touch 5.0 jailbreak/root and SSH works](http://yifan.lu/2011/12/10/kindle-touch-5-0-jailbreakroot-and-ssh/)
- [Kindle Developer's Corner 里的讨论帖](https://www.mobileread.com/forums/showthread.php?t=160454)

注意：如果愿意，你可以在应用越狱的同时直接装上 usbnetwork 包（USB 网络连接，见系列[越狱包清单](/zh/wiki/kindle/touch-packages/)）——做法是在应用越狱之前，把 `update_simple_usbnet_1.1_install.bin` 拷贝到设备的最顶层目录。

### 手动方法（仅历史参考）

此方法**仅适用于 Kindle Touch**，但应该能在**所有固件版本**上工作。它比上面的方法麻烦得多，原因很简单：Amazon 想让越狱变难，新固件已经堵死了以前的所有越狱方法。所以如果你在 Touch 上运行 5.3.2 固件，请做好经历一番冗长越狱流程的心理准备。

帖子：[showthread.php?t=203971](https://www.mobileread.com/forums/showthread.php?t=203971)

### 卸载越狱

**Kindle Paperwhite：**
按[这些说明](https://www.mobileread.com/forums/showpost.php?p=2331524&postcount=10)操作。

**Kindle Touch：**
无论你当初装的是哪一种越狱，最终效果都一样：设备上装了一把开发者证书。如果你哪天想"撤销越狱"（un-jailbreak），应用[这里](https://www.mobileread.com/forums/showthread.php?t=186645)的 `update_jailbreak_*_uninstall.bin` 文件即可。

## 退出诊断模式（Exiting Diags Mode）

不知出于什么原因，你的 Kindle Touch 或 Paperwhite 进了诊断模式（diags mode），而你不知道怎么退出来？
方法如下：

1. 在触摸屏上按"S) Device Setting"（列表里的第一项）
2. 按"X) Exit"
3. 按"D) Exit, Reboot or Disable Diags"
4. 按"D) Disable Diagnostics"
5. 按"Q) To continue"

稍等片刻（约 30 秒），设备就会重启回正常模式。

## 重启（Rebooting）

快速按电源键 4 次即可重启设备。这不会重置设置。

## 救砖（Unbricking）

救砖（unbricking / debricking，即修复变砖设备）或给 Kindle **Touch** 降级的推荐工具，是一个叫 [Kubrick](https://www.mobileread.com/forums/showthread.php?t=206064) 的 Linux LiveCD / LiveUSB。

有它你就不需要别的工具了。注意它**不**适用于 Paperwhite。

下面是其他方法的链接：

- [用一个文件恢复 K5（Paperwhite）出厂状态](https://www.mobileread.com/forums/showthread.php?t=223067)
- [K4 与 Touch 的启动选择（Select Boot）](https://www.mobileread.com/forums/showthread.php?t=169645)
- [K3、K4 与 K5 的简单救砖](https://www.mobileread.com/forums/showthread.php?t=170929)
- [data.tar.gz / RUNME.sh](https://www.mobileread.com/forums/showpost.php?p=1902438&postcount=41)（并非在所有机型上都有效）
- [修复"Your Kindle needs repair"](https://www.mobileread.com/forums/showthread.php?t=164312)
- [通过串口救砖 Paperwhite](https://www.mobileread.com/forums/showthread.php?t=206767&page=2)

## 备份（Backup）

在开始改动任何东西之前，先做好完整备份，永远是个好主意。

**PW 与 PW2 用户请特别注意**：从固件 5.3 起，官方更新包里就自带了分区 1 与主内核（Main Kernel）的完整镜像——这差不多就是我们过去推荐备份的最重要的内容，所以下文的一些信息对你们来说是冗余的。（万一需要应急，从更新包外壳里取出这些文件的工具是 KindleTool，原文在页面底部有介绍。）

### A：简单方式

- Kindle Touch：你可以按[这些说明](http://ixtab.tk/kindle-touch-images/update_k5_diags%2Bssh_README.txt)手动安装一个带 SSH 的诊断（diags）分区；或者更省事——用 [Kubrick](https://www.mobileread.com/forums/showthread.php?t=206064) 刷写固件，顺带就装好了。
- Kindle Paperwhite：[Paperwhite 越狱](https://www.mobileread.com/forums/showthread.php?t=198446)包已经包含你需要的一切。注意：如果之后把固件升到 5.3.3 或更高，就得重装 rescue pack。

这是你的 Kindle 变砖时的安全网。装好之后，最好先给它来一次"演练"（dry-run）——"演练"的意思是：验证你确实能正常访问它，但不真的重新刷写任何东西——具体做法见下文。

### B：手动方式

下面的例子假设你已经能够通过网络连接到你的 Kindle（也就是说，你必须已经装好越狱，并启用了 [USB 网络连接](/zh/wiki/kindle/touch-packages/)），使用的是一台 Linux 或 macOS 电脑（下称"主机"），上面装了所需的命令，且在网络上的地址是 192.168.15.201。请按你的实际环境自行调整。

在**主机**上执行：

```
nc -l 31337 | dd of=mmcblk0p1.bin
```

**注意**：取决于你的 netcat 版本，这条命令可能不工作。如果你用的是老版本 netcat，请改试：

```
nc -l -p 31337 | dd of=mmcblk0p1.bin
```

在 **Kindle** 上执行：

```
dd if=/dev/mmcblk0p1 | nc 192.168.15.201 31337
```

对 `mmcblk0p2` 到 `mmcblk0p4` 依样重复这个过程。你拿到的文件是设备各个分区的二进制副本。每个分区的简短说明见下文。

#### 分区（Partitions）

- **分区 1**（`mmcblk0p1` / ext3，350 MB）：根文件系统。包含操作系统与框架（framework）的文件。这个分区一旦损坏，设备就无法正常工作。
- **分区 2**（ext3，64 MB）：紧急恢复系统（诊断系统）。正常情况下你根本见不到、也不会去改这个分区。在任何正常情况下，请离它远点。
- **分区 3**（ext3，32 MB（KT）/ 64 MB（PW））：这个分区（挂载到 `/var/local/`）保存本地设置。其内容基本上可以删除（[讨论帖](https://www.mobileread.com/forums/showpost.php?p=1893672&postcount=3)）。你会丢失设置，但设备还能用。
- **分区 4**（FAT32，3.3 GB（KT 与部分 PW2）/ 1.4 GB（PW））：你的文档就放在这里。正常运行时它挂载为 `/mnt/us`，也就是你通过 USB 线挂载 Kindle 时看到并可修改的那个分区。如果丢得起自己的文档，内容可以删除，设备照样能用。（不要从诊断恢复菜单导出的 USB 存储里删掉 /diagnostic_logs/device_info.xml，否则之后将很难重启回主分区。）

所以，只要丢得起个人设置，分区 3 和分区 4 的备份不是必需的；相比之下，分区 1 和分区 2 的备份强烈推荐。

在 Linux 上，你可以用下面的命令把分区镜像挂载起来（只读）：

```
mount -o loop,ro <image> <mountpoint>
```

由于分区 4 实际上是一个自身只包含单个分区的磁盘镜像，它的挂载命令要加偏移量：

```
mount -o loop,ro,offset=8192 mmcblk0p4.bin <mountpoint>
```

挂载之后，你就能访问里面的原始文件，万一哪次改动出了问题，可以把它们恢复回设备。

翻看挂载好的镜像时，**不要**被那些指向镜像之外的链接（symlink）弄糊涂，不然你会纳闷 `/lib/firmware/opt` 下面怎么会有 eclipse、甚至更离谱的 teamviewer 文件。

#### 内核（Kernels）

- **主内核**（`main_kernel`）：设备日常使用的内核。
- **诊断内核**（`diags_kernel`）：设备运行在诊断模式时使用的内核。

用 geekmaster 的 [getkernels](https://www.mobileread.com/forums/showthread.php?t=174674) 工具可以轻松备份设备的内核。例如，把最新版解压到用户存储（userstore）之后：

```
cd /mnt/us && ./getkernels /dev/mmcblk0 && cd -
```

#### 恢复（Recovery）

见系列[系统架构与底层访问](/zh/wiki/kindle/touch-internals/)一篇的"USB HID 串口启动 / USB 下载模式"一节。




