---
title: "Kindle Touch 越狱包清单（Packages）"
original_title: "Kindle Touch Hacking（拆分篇：Packages）"
source_url: https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking
original_author: MobileRead Wiki 贡献者（NiLuJe、Eureka、DaleDe、Ricky23289、Eschwartz、Ixtab 等）
translated_at: 2026-11-10
order: 4
description: Kindle Touch 越狱后的附加组件生态：USB 网络连接（usbnet）、KUAL 应用启动器及其扩展、本地化、屏保替换、自定义字体等越狱包的安装与配置。
---

> 本文译自 MobileRead Wiki 的《Kindle Touch Hacking》页面，原文最后修订于 2021-07-28。
> 原文是单页长文，本站按主题拆为 4 篇，本文收录其中的 Packages（越狱包生态）章节。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处与下载入口引用，本站不镜像论坛内容。
> 工具与包版本以原帖与项目主页为准，本文反映原文修订时点的状态。

本系列另三篇：[《Kindle Touch 越狱》](/zh/wiki/kindle/touch-jailbreak/)、[《Kindle Touch 内部机制》](/zh/wiki/kindle/touch-internals/)、[《Kindle Touch 开发》](/zh/wiki/kindle/touch-development/)。越狱本身的完整流程另见 [Kindle 5.x 软件越狱](/zh/wiki/kindle/jailbreak/)。

除非另有说明，越狱包的安装方式都是：把**更新文件**（通常名为 `update_<package>_<version>_install.bin`）拷贝到设备上，然后选择 **设置 → 菜单 → 更新你的 Kindle**（Settings → Update Your Device）。以这种方式安装的包大多也自带卸载器。

## USB 网络连接（USB Networking）

这可以说是最基础、也最有用的一个包，因为它让你能通过 SSH 连接到 Kindle。

- **需要先[越狱](/zh/wiki/kindle/touch-jailbreak/)**。
- 从[这个帖子](http://www.mobileread.com/forums/showthread.php?t=186645)下载 usbnet，解压后把对应的 update.bin 移到设备根目录的 mrpackages 文件夹（`/mrpackages`）。
- 在 KUAL+ 里安装这个包（用 Helper 菜单的 "Install MR Packages"）。
- 在菜单的搜索框输入 `;un` 可以开关 USB 网络连接。
- 在 PC 上启用基于 NDIS 的 USB 网络连接，见 [NDIS driver setup on pc](https://wiki.mobileread.com/wiki/NDIS_driver_setup_on_pc)。
- 使用默认设置时，Kindle 的 IP 是 `192.168.15.244`。

连接到 Kindle：

- 从 Linux：`ifconfig usb0 192.168.15.201 && ssh root@192.168.15.244`
- 从 Windows：
  - 要从 Windows 连接，你需要一个远程终端软件（最流行的两个选择是 PuTTy 和 WinSCP）。
  - 插上 Kindle，等 Windows 识别出设备。
  - 然后打开 控制面板 → 网络和 Internet → 网络和共享中心 → 更改适配器设置，
    找到下方标着 "Unidentified Network, RNDIS/Ethernet Gadget" 小字的那个"本地连接 #"，
    右键点属性，选择 Internet 协议版本 4（TCP/IPv4）再点属性，点"使用下面的 IP 地址"，
    输入 IP 地址 `192.168.15.201`、子网掩码 `255.255.255.0`，点两次确定。
    （如果找不到 RNDIS 连接，可以看看原文的讨论页。）
  - 打开你的远程终端软件，以 `root` 身份连接到地址 `192.168.15.244`，密码留空
    （实在不行就试 `mario`）。
- 从 FreeBSD：
  - 插上 Kindle，用 `usbconfig | grep -i linux` 取得设备名——形如 `ugen0.5`。
  - 用设备名更新配置：`usbconfig -d ugen0.5 set_config 1`。
  - 设置 IP 地址：`ifconfig ue0 192.168.15.201`。
  - 要自动设置 IP 地址，把下面这行加进 `/etc/rc.conf`：
    `ifconfig_ue0="inet 192.168.15.201 netmask 255.255.255.0"`。
  - 要在插入时自动执行 set_config 设置，先用 `usbconfig -d ugen0.5 dump_device_desc`
    查出 idVendor 和 idProduct。
  - 创建文件 `/usr/local/etc/devd/kindle.conf`，内容如下（vendor/product 换成 usbconfig 查到的值）：

    ```ini
    notify 100 {
            match "system"          "USB";
            match "subsystem"       "DEVICE";
            match "type"            "ATTACH";
            match "vendor"          "0x0525";
            match "product"         "0xa4a2";
            action "usbconfig -d $cdev set_config 1";
    };
    ```

- 从 Linux（使用 NetworkManager，在 Ubuntu 18.04.1 上测试）：
  - 打开网络设置。
  - 打开 "USB Ethernet" 设置。
  - （可选）在 "Identity" 标签页把 "Name" 改成能提醒你"这是 Kindle"的名字。
  - 在 "IPv4" 标签页：
    - 把 "IPv4 Method" 设为 "Manual"。
    - 在 "Addresses" 下，把 "Address" 设为 `192.168.15.201`、"Netmask" 设为 `255.255.255.0`。
  - 点 "Apply"。
  - 先禁用再重新启用这个连接，让它重启生效。

### 开机自动启用 USB 网络

确认设置可用之后，只需在 `/mnt/us/usbnet` 文件夹里放一个空白的 `auto` 文件。Kindle 会在启动过程中尽早切换到 usbnet（通常在图形启动的早期：Touch 上是"树下的男孩"（无文字、无进度条）启动画面期间，PaperWhite 上是"树下的男孩"（带转圈动画）启动画面期间）。想知道确切的切换时机，可以在 `/mnt/us/usbnet` 文件夹里放一个空白的 `verbose` 文件，[这个 hack](http://hackswiki.com) 随后会把重要节点（比如 sshd 何时起来）打印在屏幕底部。

插着 USB 线这样开机可能导致不确定的结果。建议在确认已切换到 usbnet 之前，不要把设备插到电脑上。

### 阻止 NetworkManager 接管设备

**注意**：如果你没遇到下面说的问题，也不用修它（废话）……

在某些系统上你可能会遇到这个问题：每次以 USB 网络模式连接 Kindle，系统都会给它分配一个随机 MAC 地址，导致 NetworkManager 无法识别这个设备。所以要加一条 udev 规则给它固定一个新的 MAC 地址，这样才能把 Kindle 指定为不受管理的设备（unmanaged device）。IP 地址也可以顺手在这里设置。

创建文件 `/etc/udev/rules.d/90-local.rules`，写入以下内容并保存：

```ini
ACTION=="add", KERNEL=="usb0", ATTRS{manufacturer}=="Linux 2.6.31-rt11-lab126 with fsl-usb2-udc", RUN+="/etc/udev/scripts/kindle"
```

然后在 `/etc/udev/scripts/` 下创建名为 `kindle` 的文件，粘贴这段小脚本：

```bash
#!/bin/bash
ifconfig usb0 down
ifconfig usb0 hw ether 48:b3:35:3e:96:9b
ifconfig usb0 192.168.15.201
ifconfig usb0 up
```

把脚本加上可执行权限，然后重新加载 udev 规则：

```bash
sudo chmod +x /etc/udev/scripts/kindle
sudo udevadm control --reload
```

最后一步是编辑 `/etc/NetworkManager/NetworkManager.conf`，加入以下几行：

```ini
[keyfile]
unmanaged-devices=mac:48:b3:35:3e:96:9b
```

### SSH 实用命令

- 完整重新扫描：

  `lipc-set-prop -- com.lab126.scanner doFullScan 1`
  （[出处帖子](http://www.mobileread.com/forums/showthread.php?p=2071182#post2071182)）

- 刷新索引：

  `dbus-send --system /default com.lab126.powerd.resuming int32:1`
  **如果这条命令和 Alt-Z 混着用，可能会出现重复条目，所以只用这条命令就好。**
  另外出于某些原因，新文档可能出现后并不排在最前面，按标题排序就能找到它们。
  （[出处帖子](http://www.mobileread.com/forums/showpost.php?p=1181285&postcount=8)）

## 通过 WiFi 使用 SSH

默认情况下，WiFi 上的 SSH 访问是关闭的。要开启它，在配置文件（`/mnt/us/usbnet/etc/config`）里把 `USE_WIFI` 设为 `true`。

如果你只想开启 WiFi 上的 SSH、不切换到 USB 以太网模式，把 `USE_WIFI_SSHD_ONLY` 设为 `true`。

### 查看 Kindle Touch 的 WiFi IP

用[搜索栏快捷方式](https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking#Search_Bar_Shortcuts) `;711` 打开网络诊断页面，里面就能找到这些信息。

## 通过 sshfs 挂载

把 Kindle 的文件系统挂载到电脑上有时也很有用，可以用 `sshfs` 实现——前提是 SSH 访问已经能正常工作。

- 把 Kindle 的根文件系统挂载到本地目录 "kindle"：`sshfs root@192.168.15.244:/ kindle/`
- 以只读方式把根文件系统挂载到本地目录 "kindle"：`sshfs -o ro root@192.168.15.244:/ kindle/`
- 卸载：`fusermount -u kindle/`

按你的实际环境自行调整上面的示例。

在 Windows 上可以用 [WinSCP](http://winscp.net) 访问 Kindle 的文件系统。

## 附加命令行工具："Extend"

> 译注：原文将本节整体折叠并注明"此工具已很久未更新，现在推荐的做法是从 Debian armel 拉取软件包"。以下内容按原样完整译出，仅作历史参考。

**描述**：Extend 使用 "optware" 软件包增强 Linux 功能，做法是挂载一个预先做好的 512MB 镜像文件，里面预装了用 optware 工具链编译好的 `openssh`、`nano`、`screen`、`irssi`、`php`、`bash`、`rsync` 等软件。软件包用 `/opt/bin/ipkg` 命令管理，无需交叉编译。

- [论坛帖子](http://www.mobileread.com/forums/showthread.php?t=161704)
- [下载](http://gitbrew.org/~dasmoover/kindle/touch/packages/kindle_extend-1.1.zip) / [镜像](http://ge.tt/9Qoa9YD/v/2)
- 安装说明包含在压缩包内。
- 这个包支持与 GUI 启动器（见下节 GUI Launcher）集成（见原帖第二张截图）。

### 更小的 optware.img

上面压缩包里的 optware.img 足足有 500 MB，而实际只用到约 55 MB——也就是说约 445 MB 被浪费了（但会实实在在吃掉你 Kindle 的存储空间）。

- 60 MB / 100 MB 的直接替换版 optware.img 可在[这里](http://ge.tt/9Qoa9YD/v)获取（思路来自[这个帖子](http://www.mobileread.com/forums/showpost.php?p=1894205&postcount=9)）。
- 有需要的话，扩容镜像也很容易，见[这个帖子](http://www.mobileread.com/forums/showpost.php?p=1894437&postcount=10)。

### 修复 /opt/bin/ipkg 要求根文件系统以读写方式挂载的问题

虽然 ipkg 提供的软件包都完整安装在 `/opt` 下的目录里，但实际**使用** ipkg 命令时可能报这个错：

```text
 [root@kindle ipkg]# /opt/bin/ipkg list
 ipkg_conf_init: Failed to create temporary directory `(null)': Read-only file system
```

这是个小问题，原因与解决方案见[这个帖子](http://www.mobileread.com/forums/showthread.php?p=2011956#post2011956)。

### 自动启用 extend

默认情况下，extend 不会自动挂载，新可用的程序必须显式地从 `/opt/bin` 调用。下面的例子展示了这些环节可以自动化到什么程度，取自原作者的个人配置——按需创建或修改这些文件。

`/etc/upstart/extend.conf`：

```ini
start on mounted_userstore
task
script
	source /mnt/us/extend/upstart.sh
end script
```

`/mnt/us/extend/upstart.sh`：

```bash
if [ -e /opt/bin/nano ]; then
	echo Extend already mounted
else
        sleep 7 # workaround for "Stale NFS Mount errors"
	/mnt/us/extend/mount.sh
	cp /mnt/us/extend/.profile /tmp/root/
	source /tmp/root/.profile
fi
```

`/mnt/us/extend/.profile`：

```bash
export PATH=$PATH:/opt/bin
```

## 应用启动器（App Launchers）

这类程序用来启动其他应用程序。另见原文的 [GUI Launcher](https://wiki.mobileread.com/wiki/GUI_Launcher) 页面。

### Kindle Unified Applications Launcher（KUAL）

这个 [kindlet](http://www.mobileread.com/forums/showthread.php?t=203326) 取代了如今已过时且不能用的 GUI Launcher（见下文）。它不再往主界面或阅读界面里加菜单项，而是把应用程序以 kindlet 内分页的命名按钮列表呈现。KUAL 让那些此前已对接 GUI Launcher 菜单体系的开发者的成果不至于作废——这些应用会被启动器自动识别。与其他同类方案不同，它支持 Kindle 2、2i、DX、3、4、5 和 PW，并持续保证用户能通过简单的图形界面使用自己选定的功能。安装与使用方法见 MobileRead 帖子。

### （Yifan Lu 的）GUI Launcher

> 译注：原文将本节整体折叠并标注"已被 KUAL 取代"。以下内容按原样完整译出，仅作历史参考。

这个**现已过时**的 mod 会在主界面和阅读界面里加一个新菜单项。目的是让其他 mod 接入这套菜单体系，用户便能通过图形界面方便地使用它们的功能。它只支持 Kindle Touch 的固件 5.0.0 – 5.1.2，如今已被支持所有 Kindle 设备的 [Kindle Unified Applications Launcher](http://www.mobileread.com/forums/showthread.php?t=203326) 取代。不过在那些较老的固件上 GUI Launcher 仍然可用……它当时的样子：

主菜单：[KT_Launcher.png](https://wiki.mobileread.com/wiki/File:KT_Launcher.png)（启动器主菜单）　子菜单：[KT_Launcher_Apps.png](https://wiki.mobileread.com/wiki/File:KT_Launcher_Apps.png)（启动器应用子菜单）

- [版本 1.0.0](http://www.mobileread.com/forums/showthread.php?t=161263)（**仅限固件 5.0.0 – 5.0.4**）——帖子首楼含下载链接、源代码和开发者说明。
- 文档：[http://yifanlu.github.com/KindleLauncher/](http://yifanlu.github.com/KindleLauncher/)
- [更新 v1.2.2](http://www.mobileread.com/forums/showthread.php?p=2166150#post2166150)（**仅限固件 5.1.0 – 5.1.2**；PW 用户：**不行**，它在 PW 上跑不起来！）——请改用 [Kindle Unified Applications Launcher](http://www.mobileread.com/forums/showthread.php?t=203326)。注意：如果你想充分利用各种屏幕旋转方向，强烈建议同时安装 [JBPatch](http://www.mobileread.com/forums/showthread.php?t=175512)，当然同样要先确认你的固件版本有对应补丁。
- **安装说明**：说实话，GUI Launcher 的"最终用户"文档相当糟糕（帖子里和 README 里都是）。流程本身很标准也很简单，只是没人为这个软件写出来过。所以这里给新手写一下：
  1. 把 Kindle 连到电脑。
  2. 把 `update_launcher_*_install.bin` 文件直接拷到 Kindle 根目录（不要放进 documents 或其他文件夹）。
  3. 从电脑上安全弹出 Kindle 磁盘。
  4. 最后，在 Kindle 上选择 菜单 → 设置，再 菜单 → 更新你的 Kindle。

### 启动器扩展（Extensions for the App Launchers）

以 Yifan Lu 的 GUI Launcher 或 Kindle Unified Applications Launcher 为基础，下面这些 mod 提供额外的功能。

#### 终端模拟器（Terminal Emulator）

Kindle Touch 5.3.2、5.1.2 以及 PaperWhite（所有版本）的用户可以用 [KTERM](http://www.fabiszewski.net/kindle-terminal/) 获得终端功能。

固件 ≤ 5.1.2 的还可以用 [xterm](http://www.mobileread.com/forums/showthread.php?t=179286)。**注意：xterm 已不再受支持，也不会再有任何更新。**

#### 文件夹开关（Folder Toggle）

[项目页面](http://ebookjuggler.com/kindle/folder-and-book-hider/)

这个 mod 让你可以隐藏或显示藏书的一个子集。你可以在每个 profile 的配置文件里加入要切换的目录列表。仍在开发中，但进展顺利。下载帖子附件里的 zip 包，按 README 操作即可。

项目发源于：[http://www.mobileread.com/forums/showthread.php?t=164259](http://www.mobileread.com/forums/showthread.php?t=164259)
不支持 KUAL（Kindle Unified Applications Launcher），见[这个回帖](http://www.mobileread.com/forums/showpost.php?p=2414240&postcount=6)。

#### SSModeSwitcher

[论坛帖子](http://www.mobileread.com/forums/showthread.php?t=170080)

这个扩展帮助在四个屏保 profile（默认、屏幕锁定和 2 个自定义模式）之间切换屏保模式。

这个过时的扩展只在有限范围的早期固件 Touch 上能用，且不支持 KUAL。**仅适用于低于 5.3.2 的 Touch 固件。**

#### CollectionSync

[CollectionSync.zip](https://wiki.mobileread.com/wiki/Special:FilePath/CollectionSync.zip) 是配合 yifanlu 启动器工作的扩展，可根据当前内容生成收藏夹（collections）。

#### 企业级 WPA（Enterprise WPA）

Kindle Touch 从固件 5.1 起开箱即支持企业级 WPA。

更早的固件（5.0.0 – 5.0.4）不支持（尽管底层的 wpa_supplicant 支持）。[这个帖子](http://www.mobileread.com/forums/showthread.php?t=168750)里有一个启动器扩展可用。配置是手动的，但至少网络配好之后，一键即可连接。

这个扩展也能用于其他连接类型：[WPA-PSK](http://www.mobileread.com/forums/showthread.php?p=1984928#post1984928)、[WEP](http://www.mobileread.com/forums/showthread.php?p=1994910#post1994910)。

#### HackedUpReader / CoolReader 3

HackedUpReader 是 CoolReader 3 向 Kindle Touch 的移植。用这个自定义阅读器可以读 mobi/epub/fb2/txt/rtf/html/pdb 格式。

安装方法：把 [HackedUpReader-0.1.2-varnie.tar.gz](https://github.com/downloads/varnie/HackedUpReader/HackedUpReader-0.1.2-varnie.tar.gz)（更好的版本，由用户 Varnie 维护）解压到 `/mnt/us/`（USB 可见根目录）下的 `cr3xcb` 文件夹。之后再把 [HackedUpReaderLauncher](https://github.com/varnie/HackedUpReaderLauncher/zipball/master) 解压到 extensions 文件夹。

原始帖子：[http://www.mobileread.com/forums/showthread.php?t=170436](http://www.mobileread.com/forums/showthread.php?t=170436)

#### Gnash

开源的 GNU Flash 播放器，曾被移植到 K5（Kindle 5 / Touch）。

主帖在[这里](http://www.mobileread.com/forums/showthread.php?t=194451)。

GUI Launcher / Kindle Unified Applications Launcher 版下载：[下载](https://dl.dropbox.com/s/vzrx5tyhrqwxbcp/gnash-0.2.zip?dl=1)

作者发布的补充信息站点在[这里](http://www.fabiszewski.net/kindle-flash/)。

自带额外的 swf 闹钟（R-SIN ALARM clock）。

游戏下载：Hexxagon 的 [hexxagon.swf](http://goo.gl/qVG6B)。

支持 KUAL，KUAL 支持说明在[这里](http://www.mobileread.com/forums/showpost.php?p=2414603&postcount=12)。

#### GUI Launcher 重启（GUI Launcher Reboot）

一个更容易触达的重启选项：[http://goo.gl/Nn4aH](http://goo.gl/Nn4aH)

KUAL 支持说明在[这里](http://www.mobileread.com/forums/showpost.php?p=2415044&postcount=5)——**不受支持**。

#### gtksudoku

一个用 gtk 编写的 Kindle 原生应用，提供简单的数独游戏，可在
[http://www.mobileread.com/forums/showthread.php?t=188997](http://www.mobileread.com/forums/showthread.php?t=188997) 获取。
在大多数固件上不支持 Kindle Unified Applications Launcher。
具体来说：它会让 KT 5.3.2 和 PaperWhite 卡死；已知在 KT 5.1.2 上可用。

KUAL 支持说明在[这里](http://www.mobileread.com/forums/showpost.php?p=2415041&postcount=19)。

#### gtkMines

一个用 gtk 编写的 Kindle 原生应用，提供简单的扫雷游戏，可在
[http://www.mobileread.com/forums/showthread.php?p=2198434](http://www.mobileread.com/forums/showthread.php?p=2198434) 获取。
支持 Kindle Unified Applications Launcher。

#### Komic

一个 Kindle 漫画阅读器：用 html/js 写成的应用，在 Kindle Touch 上看漫画。可在
[http://www.mobileread.com/forums/showthread.php?t=182183](http://www.mobileread.com/forums/showthread.php?t=182183) 获取。

支持 Kindle Unified Applications Launcher。
KUAL 支持说明在[这里](http://www.mobileread.com/forums/showpost.php?p=2414622&postcount=14)。

#### pbchess——Kindle 2、3、DX、4、Kindle Touch、Kindle PaperWhite 的国际象棋

商业软件。支持 KUAL。

pbchess 是一个功能强大的国际象棋训练程序。

用 pbchess 你可以：

1. 解 chess problems（象棋排局／残局题，网站上能找到大量题目）
2. 加载并复盘带注释/变着的 PGN，分析对局，试推变着
3. 学习开局、残局
4. 当然还有——下棋（内置 6 个最著名的免费象棋引擎）

一些 Kindle Touch 上的演示视频：
[https://www.youtube.com/playlist?list=PLB130D9CACB03C720&feature=view_all](https://www.youtube.com/playlist?list=PLB130D9CACB03C720&feature=view_all)

KT 版 pbchess 可在这里下载：
[http://pbchess.vlasovsoft.net/en/index.html](http://pbchess.vlasovsoft.net/en/index.html)

KT 版 pbchess 附带以下 bonus 游戏：Sokoban（推箱子）、Othello/Reversi（黑白棋）、Checkers（跳棋）。

#### Sokoban（推箱子）

pbchess 的附带游戏，必须随 pbchess 一起安装。可以下载 KT 版 [Sokoban](https://wiki.mobileread.com/wiki/Sokoban)：
[http://pbchess.vlasovsoft.net/en](http://pbchess.vlasovsoft.net/en)

#### Checkers（跳棋）

pbchess 的附带游戏，必须随 pbchess 一起安装。可以下载 KT 版 [Checkers](https://wiki.mobileread.com/wiki/Checkers)：
[http://pbchess.vlasovsoft.net/en](http://pbchess.vlasovsoft.net/en)

#### Othello / Reversi（黑白棋）

pbchess 的附带游戏，必须随 pbchess 一起安装。可以下载 KT 版 [Othello](https://wiki.mobileread.com/wiki/Othello)：
[http://pbchess.vlasovsoft.net/en](http://pbchess.vlasovsoft.net/en)

#### Eboard chess

带多个国际象棋引擎（Crafty、GNU Chess、Stockfish 和 Sjeng）的国际象棋程序，并且可以联网对弈——在象棋服务器上，或直接与其他 eboard 用户下。

KT 版 Eboard chess 可在这里下载：
[http://www.fabiszewski.net/kindle-chess/](http://www.fabiszewski.net/kindle-chess/)

支持 Kindle Unified Applications Launcher，KUAL 支持说明在[这里](http://www.mobileread.com/forums/showpost.php?p=2414040&postcount=10)。

#### 录音与播放（Audio Recorder and Player）

非常简单的扩展：用内置麦克风录音，并回放最近一次录制的文件。
[http://www.mobileread.com/forums/showthread.php?t=167172](http://www.mobileread.com/forums/showthread.php?t=167172)

KUAL 支持说明在[这里](http://www.mobileread.com/forums/showpost.php?p=2415251&postcount=6)。

#### Kindle Touch 数独（Sudoku for the kindle touch）

如果你装过 ksudoku，很快就会发现弹出屏幕键盘输入数字有多烦人。这是一个不需要弹出键盘的数独游戏。[http://www.mobileread.com/forums/showthread.php?p=2097654#post2097654](http://www.mobileread.com/forums/showthread.php?p=2097654#post2097654)

直接下载：[http://www.filefactory.com/file/27x130nsxejd/n/ksudoku2_rar](http://www.filefactory.com/file/27x130nsxejd/n/ksudoku2_rar)

或[从 MobileRead 下载](http://www.mobileread.com/forums/attachment.php?attachmentid=100251&d=1359425966)。

只适用于低于 5.3.2 的 Touch 固件——KUAL 兼容性未测试。

#### 用 eTcl 运行 Tcl/Tk 应用：计算器示例

用 eTcl 和启动器，你可以创建并运行各种 [Tcl/Tk](https://wiki.mobileread.com/wiki/Tcl) 应用。一个例子是简单的计算器。

需要先装 eTcl，可从
[http://www.evolane.com/download/etcl/linux/etcl-1.0.1-linux-arm.tar.gz](http://www.evolane.com/download/etcl/linux/etcl-1.0.1-linux-arm.tar.gz) 下载。
eTcl 在 PW2（5.4.2）上似乎不能用——二进制文件报 "Illegal instruction" 退出。

MobileRead 直接下载在[这里](http://www.mobileread.com/forums/attachment.php?attachmentid=100256&d=1359425990)，解压到 `/mnt/us` 即可。

从 [http://www.mediafire.com/download.php?4cwur5266ti6bzi](http://www.mediafire.com/download.php?4cwur5266ti6bzi) 下载计算器的 zip 包，解压到 extension 目录。

如果你需要额外的特定数学函数，这个计算器很容易改。

下面这些 eTcl 例子都需要先下载[上面说的 eTcl](http://www.mobileread.com/forums/attachment.php?attachmentid=100256&d=1359425990)。

#### eTcl：Attax

按上面计算器的同样步骤，你还能玩 Attax（[http://en.wikipedia.org/wiki/Ataxx](http://en.wikipedia.org/wiki/Ataxx)）。

从 [http://www.mediafire.com/download.php?17ezhmaxkdabz2d](http://www.mediafire.com/download.php?17ezhmaxkdabz2d) 下载游戏，放进 extension 目录。

MobileRead 直接下载在[这里](http://www.mobileread.com/forums/attachment.php?attachmentid=100252&d=1359425966)。

#### eTcl：Gems

另一个用 eTcl 跑的 Tcl/Tk 游戏是经典的 Gems（也就是宝石迷阵 Bejeweled）。按计算器那节的说明下载并解压 eTcl。

从 [http://www.mediafire.com/download.php?fklx91ku29bbw2l](http://www.mediafire.com/download.php?fklx91ku29bbw2l) 下载游戏，放进 extension 目录。

或直接从 MobileRead 下载：[这里](http://www.mobileread.com/forums/attachment.php?attachmentid=100254&d=1359425966)。

#### eTcl：3DMaze

还有一个用 eTcl 跑的 Tcl/Tk 游戏是 3D 迷宫。按计算器那节的说明下载并解压 eTcl。

从 [http://www.mediafire.com/?773gn53xq5i7pfb](http://www.mediafire.com/?773gn53xq5i7pfb) 下载 3DMaze，放进 extension 目录。

MobileRead 直接下载在[这里](http://www.mobileread.com/forums/attachment.php?attachmentid=100255&d=1359425966)。

#### Leafpad

这是基础文本编辑器 Leafpad 的移植。下载压缩包并解压到 extension 目录。

[http://www.fabiszewski.net/kindle-notepad/](http://www.fabiszewski.net/kindle-notepad/)

KUAL 支持说明在[这里](http://www.mobileread.com/forums/showpost.php?p=2414040&postcount=11)。

#### Skipstone

基于 WebKit 渲染引擎的替代型 GTK+ 浏览器。

从 [http://www.fabiszewski.net/kindle-browser/](http://www.fabiszewski.net/kindle-browser/) 下载 Skipstone，放进 extension 目录。
支持 Kindle Unified Applications Launcher，KUAL 支持说明在[这里](http://www.mobileread.com/forums/showpost.php?p=2414040&postcount=8)。

#### KOReader

[KOReader](/zh/wiki/software/koreader/)（项目主页 [https://github.com/koreader/koreader/wiki](https://github.com/koreader/koreader/wiki)）是一个面向 Linux 电纸书设备的文档查看器。支持的格式包括 PDF、DjVu、XPS、CBZ、FB2、TXT、HTML、RTF、CHM、EPUB、DOC、MOBI 和 ZIP 文件。

它兼容 KUAL，支持 PDF 重排（reflow）、屏幕旋转等许多特性。

安装说明见：[https://github.com/koreader/koreader/wiki/KOReader-User-Guide](https://github.com/koreader/koreader/wiki/KOReader-User-Guide)

## 本地化（Localization）

各种语言的本地化包可在[这个帖子](http://www.mobileread.com/forums/showthread.php?t=162654)获取。

### 文本转语音（Text-to-Speech，TTS）

说明见[这个回帖](http://www.mobileread.com/forums/showpost.php?p=1906533&postcount=15)。回帖只明确提到了德语，但给出的链接里有许多其他语言的包，操作步骤完全相同。

**固件 5.1.0 及以上的注意**：TTS 对非英语书籍是禁用的。要开启它，安装 [jbpatch](http://www.mobileread.com/forums/showthread.php?t=175512) 并确认 TTS 补丁已加载。

### 24 小时制时钟

要把顶栏时钟从 12 小时制改成 24 小时制，把 `/var/local/system/locale` 的内容从：

```ini
LANG=en_US.utf8
LC_ALL=en_US.utf8
```

改成：

```ini
LANG=en_GB.utf8
LC_ALL=en_GB.utf8
```

然后重启设备。

这一步也可以不越狱完成：做一个 "data.tar.gz" 文件，内含按绝对路径指向 `/var/local/system/locale` 的文件，写入上面那两行内容即可。

另一个无需越狱的方案在[这个页面](http://www.mobileread.com/forums/showthread.php?t=167639)。

在固件 5.1 上，在设置里把语言从 English US 切换成 English GB 也能达到同样效果。

### 设置时区

默认情况下，Kindle 显示的是 UTC 时间。如果你在其他时区：

1. 把根文件系统挂为读写：`mntroot rw`
2. 切到临时工作目录：`cd /tmp`
3. 从 [http://www.iana.org/time-zones](http://www.iana.org/time-zones) 获取最新的 TZ 数据
   （Kindle 必须开着 WiFi；否则可以把 TZ 数据文件拷到 `/mnt/us`，这个分区在 Windows/Linux 下可见）：

   ```bash
   wget http://www.iana.org/time-zones/repository/releases/tzdata2014j.tar.gz
   ```

4. 解压时区数据文件：`tar xzvf tzdata2014j.tar.gz`
5. 把需要的数据拷贝/替换到 Kindle 的 TZ 仓库：

   ```bash
   cp zone.tab /usr/share/zoneinfo/zone.tab
   cp iso3166.tab /usr/share/zoneinfo/iso3166.tab
   ```

6. 把相关地区的时区数据拷到 Kindle 的 TZ 仓库（或全部拷上）：`cp europe /usr/share/zoneinfo/europe`
7. 编译 TZ 地区数据库：

   ```bash
   cd /usr/share/zoneinfo/
   zic europe
   ```

8. 把所需时区链接到 `/etc/localtime`：`zic -l Europe/Berlin`

新时区随即生效，可以用 `date` 验证；Kindle 的图形界面要重启后才会显示新时间。

另外，也可以看看 Amazon 自己用的 `settz` 和 `setdate` 脚本……

## VNC 服务器（VNC Server）

你可以在 Kindle Touch 上装一个 VNC 服务器，然后从电脑上的 VNC 客户端通过 WiFi 或 usbnetwork 访问 Kindle。

通过 WiFi 连接的步骤：

1. 安装[这个帖子](http://www.mobileread.com/forums/showthread.php?t=175297)里的包。
2. 在电脑上装一个 VNC 客户端（[TightVNC](http://www.tightvnc.com/) 非常小巧好用）。VNC 客户端必须和 Kindle 在同一个 WiFi 里。
3. 在 Kindle 上开启 WiFi。
4. 在 Kindle 的搜索栏输入 `;711` 并回车。
5. 记下 "4-Interface" 一节里列出的 IP 地址。
6. 用 VNC 客户端连接该 IP 的 5900 端口（IP::5900）。

想停用 VNC 服务器但不想卸载它的话，重命名或删除 `/mnt/us/vnc/ENABLE_VNC`，然后重启 Kindle。

## 屏幕保护（Screen Savers）

在**非广告**（non-ad-supported）机型上，你可以把屏保换成自己的图片（甚至直接用你最近打开的那本书的封面！）。

### 简单方法（The Easy Way）

老牌的 ScreenSavers hack 已经移植到 K5（Touch/PaperWhite），所以最好的选择多半就是[去看看它](http://www.mobileread.com/forums/showthread.php?t=195474) ;)

它的特性之一，就是可以自动把你最近打开的书 的封面 用作当前屏保 :)。

如果你的设备订了 **Special Offers**（广告），得先退订（装 hack 之前或之后都行）。如果退订不了（因为你不在美国），试试联系 Kindle 客服。

> 译注：原文将以下两小节整体折叠并标注"仅作历史参考保留"。以下内容按原样完整译出。

### 旧方法（5.0 时代）

Yifan 那套出色的[自定义屏保](http://yifan.lu/p/custom-screensaver/)方案，以自定义 blanket 模块的方式实现，曾是实现这个功能的一条漂亮路子。遗憾的是，它只在 **FW 5.0** 上可用。

### 另一种方法

在 **Special Offers** 机型上，你也可以用上面提到的同一套东西，把自己的图片用作屏保。

不过得先禁用 Special Offers。可选的做法有几种（其中某些也许会被认为比另一些更"灰色"一点……别怪报信的人 ;)）：如果你身在广告对你毫无意义的外国，试试联系 Amazon，他们态度很好。

- 花 20 美元退订 Special Offers（从美国的 "Manage Your Kindle" 页面操作）
- 使用 [JBPatch](https://wiki.mobileread.com/wiki/JBPatch)
- 使用 Ads Toggler 这个 GUI 启动器扩展

## 自定义字体（Custom Fonts）

### FW 5.1 / 5.2 用户

Kindle Touch 使用的字体可以通过安装[这个 hack](http://www.mobileread.com/forums/showthread.php?t=168765) 来更换。

请仔细阅读 README 文件（在 **fonthack** 目录内），并且随时关注[这个帖子](http://www.mobileread.com/forums/showthread.php?t=168765)的最新动态，以便跟进所有开发与讨论。

配套的预打包字体（按字母序）：

- [Antiqua](http://www.mobileread.com/forums/showthread.php?p=2004341#post2004341)
- [Averia](http://ge.tt/3ZRY9XE/v/0)
- [Bodoni](http://www.mobileread.com/forums/showthread.php?p=2004341#post2004341)
- [DejaVu Serif/Serif Condensed/Sans Condensed/Sans Mono](http://www.mobileread.com/forums/showpost.php?p=1991905&postcount=99)
- [Fertigo Pro](http://ge.tt/3ZRY9XE/v/8)
- [Garamond](http://www.mobileread.com/forums/showpost.php?p=2004558&postcount=136)
- [Georgia2](http://www.mobileread.com/forums/showpost.php?p=1998757&postcount=115)
- [Museo](http://ge.tt/3ZRY9XE/v/9)
- [Palatino](http://www.mobileread.com/forums/showpost.php?p=2021064&postcount=168)
- [Segoe](http://www.mobileread.com/forums/showpost.php?p=2021064&postcount=168)
- [Times Roman](http://www.mobileread.com/forums/showpost.php?p=1999191&postcount=118)
- [Trebuchet](http://www.mobileread.com/forums/showpost.php?p=2021064&postcount=168)
- [Ubuntu/Ubuntu Mono](http://ge.tt/3ZRY9XE/v/5)
- [Verdana](http://www.mobileread.com/forums/showpost.php?p=2021064&postcount=168)

你也可以使用为 K3 准备的[字体包](http://www.mobileread.com/forums/showpost.php?p=1690437&postcount=1)（[镜像](http://www.orangetype.com/kindle/)），其中包含：Bembo、Constantia、Droid Serif、Georgia、Georgia2、ITC New Baskerville、Linux Biolinum、Linux Libertine、Miller Serif、Minion Pro、Palatino、Times New Roman。**注意**：这些字体用的是另一套文件命名规则，使用前需要手动把文件名改成 FontHack 所要求的命名规则。

### PW / 固件 ≥ 5.3.x 用户

一个稍微不那么友好的方案（因为较新固件版本本身的一些固有缺陷）可以通过[这个 Font Hack](http://www.mobileread.com/forums/showthread.php?t=219405) 实现。

## 管理收藏夹（Manage Collections）

[Collections Manager](http://www.mobileread.com/forums/showthread.php?p=2165923#post2165923)：严格说这不是一个 hack，而是一个应用，让你能以比 Kindle 默认更灵活的方式管理收藏夹。

## KindCalc

[KindCalc](http://www.mobileread.com/forums/showthread.php?p=2147271#post2147271)：计算器应用。

## System!k Extensions

[System!k Extensions](http://www.mobileread.com/forums/showpost.php?p=2247130&postcount=7)：基于 WAF 框架，提供对隐藏功能的快速访问。功能包括：

- 手动运行界面上显示为灰色的安装项
- "阻止/允许屏保"按钮
- 显示和隐藏自定义光标（附安装与卸载器）
- 711 与 411 设备信息页面

## 其他二进制程序（Other binaries）

- [mplayer、mcabber、elinks、screen、tmux、ettercap、vim、strace、mlocate、tintin++ MUD 客户端、ffmpeg、wget](http://www.fabiszewski.net/kindle-xterm/)——到页面底部可以找到这些。
- [bftpd](http://www.mobileread.com/forums/showthread.php?p=2003367#post2003367)














