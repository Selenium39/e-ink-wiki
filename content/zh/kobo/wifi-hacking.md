---
title: Kobo WiFi 破解入门
original_title: "Kobo WiFi Hacking"
source_url: https://wiki.mobileread.com/wiki/Kobo_WiFi_Hacking
original_author: MobileRead Wiki 贡献者（KevinShort 主笔、DaleDe 等）
translated_at: 2026-11-10
order: 4
description: 初代 Kobo WiFi 阅读器的破解入门：自制 KoboRoot.tgz 更新包的原理、拆机与内部 micro SD 卡备份、启用 telnet 与 FTP、向 framebuffer 绘图并刷新电子墨水屏。
---

> 本文译自 MobileRead Wiki 的《Kobo WiFi Hacking》页面，原文最后修订于 2018-11-26。
> 本文针对的是初代 Kobo WiFi 机型（Kobo Wireless eReader），内容较为久远，仅作历史参考；Kobo Touch 及之后的较新机型请看姊妹篇[《Kobo Touch 破解》](/zh/wiki/kobo/hacking/)。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处与下载入口引用，本站不镜像论坛内容。
> 破解需要修改系统文件，操作失误可能导致设备变砖——动手前请务必按本文方法先备份内部 SD 卡。

本文的大量信息整理自 [Craig Ringer 的博客](http://blog.ringerc.id.au/search/label/kobo)。原文页顶部配了一张 Kobo WiFi 显示天气预报的截图，出处见文末"资源链接"一节。

## Kobo WiFi 的固件更新机制

[Kobo WiFi](https://wiki.mobileread.com/wiki/Kobo_Wireless_eReader)（即 Kobo Wireless eReader）的固件更新方式非常简单：公共分区（用 USB 线把 Kobo 连到电脑时看到的那个分区）的 `.kobo` 目录里如果有一个名为 `KoboRoot.tgz` 的文件，机器就会把 KoboRoot.tgz 中的全部内容解压到根目录，然后重启。

这意味着我们可以非常容易地为 Kobo WiFi 制作自己的更新包。[Aura HD](https://wiki.mobileread.com/wiki/Aura_HD) 的机制与之类似。

## 拆开 Kobo WiFi

Kobo WiFi 的外壳靠机身四周一圈塑料卡扣固定，用塑料撬棒就能比较轻松地撬开。

撬开外壳后，拧下四颗螺丝，就能把主板从机壳里取出来。内部 micro SD 卡位于主板背面、右下角的位置。

## 备份内部 SD 卡

Kobo WiFi 从机身内部的一张 2GB micro SD 卡启动。如果你打算做任何破解操作，**强烈建议**先给这张内部 SD 卡做一份完整备份——这样一旦出了问题、Kobo 无法启动，只需取出 micro SD 卡、用备份恢复即可。

如果手头还有一张富余的 2GB micro SD 卡，可以更进一步、更加保险：把 Kobo WiFi 里的内部 micro SD 卡取出来，给它做一份完整备份，再把这份备份写到备用卡上。然后就可以把原装内部 micro SD 卡收进安全的地方，用备用卡开机。

### 在 Linux 上复制 micro SD 卡

如果你的 Kobo 已经开通了 telnet 访问，可以完全不开外壳就做出完整备份（不过一旦真出了问题，还是得拆机）。具体做法见 [Craig Ringer 的博客](http://blog.ringerc.id.au/2011/01/taking-disk-image-of-kobo-wifi-without.html)。

从 Kobo 里取出内部 micro SD 卡之后，做完整备份很简单。把卡插进电脑的读卡器，运行命令：

```bash
sudo fdisk -l
```

你会看到类似这样的输出：

```text
...
Disk /dev/sdc: 1977 MB, 1977614336 bytes
31 heads, 61 sectors/track, 2042 cylinders, total 3862528 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000

  Device Boot      Start         End      Blocks   Id  System
/dev/sdc1            7564      535152      263794+  83  Linux
/dev/sdc2          535153     1586548      525698   83  Linux
/dev/sdc3         1586549     3861421     1137436+   b  W95 FAT32
```

我们要找的是显示容量约为 2GB 的那一行（准确说是 1977 MB）：

```text
Disk /dev/sdc: 1977 MB, 1977614336 bytes
```

所以，我这张 micro SD 卡位于 `/dev/sdc`（你的卡所在位置可能不同）。要创建备份，只需运行：

```bash
sudo dd if=YOUR_CARD_LOCATION of=kobo_internal_microsd.img
```

这一步要花上一阵子，等着的时候可以去找点别的事做。完成后你就可以安心了：就算 Kobo 挂掉，你手里也有一份完整备份。

## 启用 Telnet 与 FTP

要让 Kobo 获得 telnet 和 FTP 访问，有两条路可走。

### 简单方法

- 下载[这个 KoboRoot.tgz 文件](https://docs.google.com/open?id=0B6fzXeHwR9miTUFBWmwyc2tNcHc)
- 把 Kobo WiFi 连到电脑，选择"管理图书馆"（Manage Library）
- 把下载好的 `KoboRoot.tgz` 文件复制到 Kobo 上的 `.kobo` 目录
- 弹出 Kobo，等待它重启
- 主界面启动后再等约 20 秒，直到你看到蓝色 LED 闪烁几次。（确保已连上 WiFi。如果没连，现在连接，然后重启设备。）
- 再次把 Kobo 连到电脑，在 `.kobo` 目录里找到一个名为 `ip.txt` 的文件，里面就是你这台 Kobo 的 IP 地址
- 现在你拥有 telnet 和 FTP 访问了！

```bash
telnet YOUR_KOBO_IP_ADDRESS
```

以 root 登录，无需密码。

### 手把手方法

> 外部用户备注：此方法已在 **Kobo Glo**（固件 2.6.1 - 06/17/13）上测试成功，但我按照 [Kobo Touch 破解](/zh/wiki/kobo/hacking/)页面中的建议，去掉了 `inetd.conf` 第一行末尾的正斜杠；不过也许不去掉也能用。

要启用 telnet/FTP，需要编辑两个文件。你可以从 Kobo 内部的 micro SD 卡上拿到它们，分别是：

- `/etc/inetd.conf`
- `/etc/inittab`

在电脑上建一个名为 `etc` 的目录，把 inetd.conf 和 inittab 放进去。

编辑 etc/inittab，加入以下几行：

```text
::sysinit:/etc/init.d/rcS2
::respawn:/usr/sbin/inetd -f /etc/inetd.conf.en
```

编辑 etc/inetd.conf，加入：

```text
21 stream  tcp     nowait  root    /bin/busybox ftpd -w -S  /
23 stream tcp nowait root /bin/busybox telnetd -i
```

你还需要创建 etc/init.d/rcS2，内容如下：

```bash
#!/bin/sh
mkdir -p /dev/pts
mount -t devpts devpts /dev/pts
/usr/sbin/inetd /etc/inetd.conf
```

然后运行

```bash
chmod a+x etc/init.d/rcS2
```

把它标记为可执行。现在把你的 etc 目录打成 KoboRoot.tgz 文件：

```bash
tar czf KoboRoot.tgz etc
```

并把它复制到 Kobo 上的 `.kobo` 目录。

Kobo 重启并连上 WiFi 之后，在同一网络的电脑上可以用下面的命令查到它的 IP 地址：

```bash
sudo nmap -sP 192.168.1.1-254
```

找到你 Kobo 的 MAC 地址，然后 telnet 上去即可！以 root 登录，无需密码。

## 向 WiFi 的 framebuffer 绘图

Kobo WiFi 使用 Linux 帧缓冲区（framebuffer）在屏幕上显示图形。但电子墨水屏（e-ink）的特性决定了：向 framebuffer 绘制完成后，还需要一次特定的调用才能刷新显示。而试图用 Pygame（一个封装 SDL 的 Python 库）打开 framebuffer，会输出错误 `Unsupported console hardware`（不支持的控制台硬件）。

目前已发现 Kobo WiFi 存在 4、8、16、32 位色深的 framebuffer 机型。你可以用 `fbset` 命令查出自己的机器是哪一种。色深就是"geometry"行的最后一个数字：

```text
[root@(none) /]# fbset
mode "600x800-0"
      # D: 0.038 MHz, H: 0.063 kHz, V: 0.079 Hz
      geometry 600 800 600 800 8
      timings 26400000 0 0 0 0 0 0
      accel false
      rgba 8/0,8/0,8/0,0/0
endmode
```

如果你的 WiFi 是 8 位色深，向屏幕绘图的解决办法是修改文件 `/sys/class/graphics/fb0/rotate`。我不知道这为什么有效，但运行命令：

```bash
echo 1 > /sys/class/graphics/fb0/rotate
```

之后 framebuffer 就变得可读可写了。你不一定非得 echo 1，echo 2 或 0 也行，甚至不带参数的 `echo > /sys/class/graphics/fb0/rotate` 同样有效！

### 在 4 位屏上绘图

人们还没有搞清楚如何向 4 位屏 Kobo 的 framebuffer 直接绘制图形。目前的解决办法是制作一个 raw 图像文件，再用下面的命令显示：

```bash
cat image.raw | /usr/local/Kobo/pickel showpic
```

如何为 Kobo 制作 raw 图像，见[这个帖子](http://www.mobileread.com/forums/showpost.php?p=2284024&postcount=21)。

### 在 8 位屏上刷新电子墨水屏

在 8 位屏上，我们已经能向 framebuffer 绘制了。但如果无法刷新电子墨水屏、看到绘制的结果，那也没什么用。

Kobo 在 WiFi 上预装了一个名为"Pickel"的程序，位于 `/usr/local/Kobo`。`/etc/init.d/rcS` 里有一个使用这个程序的好例子，我们可以在其中找到下面这一行：

```bash
zcat /etc/images/reboot.raw.gz | /usr/local/Kobo/pickel showpic
```

我们可以用"showpic"选项把图像 cat 进 pickel，pickel 就会刷新电子墨水屏。但让 pygame/SDL 向 framebuffer 绘制完之后，怎么通知 pickel 刷新屏幕呢？`cat /dev/fb0 | /usr/local/Kobo/pickel showpic` 只对屏幕顶部约 100 个像素有效，其余 700 个像素是纯黑的。要解决这个问题，先把 /dev/fb0 cat 到一个文件，再把这个文件 cat 进 pickel：

```bash
cat /dev/fb0 > /tmp/fb
cat /tmp/fb | /usr/local/Kobo/pickel showpic
```

## 零散笔记

- WiFi 上的蓝色 LED 可以用这些命令做一定程度的控制：

  ```bash
  /usr/local/Kobo/pickel blinkon
  ```

  ```bash
  /usr/local/Kobo/pickel blinkoff
  ```

- 你可以用这个脚本重启 nickel（Kobo 的 GUI 应用程序）：

  ```bash
  #!/bin/sh
  # Kill off the old nickel
  pkill nickel
  # Clear plugin cache
  rm -f /mnt/onboard/.kobo/Trolltech.conf
  # Restart nickel
  export PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/lib:
  export NICKEL_HOME=/mnt/onboard/.kobo
  export LD_LIBRARY_PATH=/usr/local/Kobo
  export QWS_KEYBOARD=netronix
  export INTERFACE=eth0
  export LANG=en_US.UTF-8
  /usr/local/Kobo/nickel -qws -display broadsheet_ioctl >/mnt/onboard/.kobo/nickel.log &
  ```

- WiFi 可以用下面的命令关闭：

  ```bash
  /usr/local/Kobo/pickel wifioff
  ```

  据说也能用下面的命令重新打开（不过我一直没能让它生效）：

  ```bash
  /usr/local/Kobo/pickel wifion
  ```

- 你可以模拟插拔 USB 线：

  ```bash
  echo usb plug add >> /tmp/nickel-hardware-status
  ```

  ```bash
  echo usb plug remove >> /tmp/nickel-hardware-status
  ```

- 伪造注册：

  ```bash
  echo "insert into user values('foo', 'foo', 'foo', 'foo', 'foo');" | sqlite3 /path/to/kobo/.kobo/KoboReader.sqlite
  ```

## 资源链接

- [MobileRead 论坛帖](http://www.mobileread.com/forums/showthread.php?t=122701)：给 Kobo Wireless 机型加装内部存储。
- [Kobo WiFi 天气预报显示](http://www.mobileread.com/forums/showthread.php?t=194376)（原文页顶部截图即出自此帖）。
- Kobo 的 Linux 内核源码与开源代码见 [GitHub](https://github.com/kobolabs/Kobo-Reader)。
- Kobo 开发与破解有一个 [IRC](https://wiki.mobileread.com/wiki/IRC) 频道：[freenode 上的 #kobodev](http://webchat.freenode.net/?channels=kobodev)。
- [Craig Ringer 的博客](http://blog.ringerc.id.au/search/label/kobo)有不少关于 Kobo 破解的文章。

站内延伸：较新机型的破解思路见[《Kobo Touch 破解》](/zh/wiki/kobo/hacking/)；想在 Kobo 上跑第三方阅读软件，参见[《KOReader 简介》](/zh/wiki/software/koreader/)。
