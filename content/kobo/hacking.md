---
title: Kobo Touch 破解入门
original_title: "Kobo Touch Hacking"
source_url: https://wiki.mobileread.com/wiki/Kobo_Touch_Hacking
original_author: MobileRead Wiki 贡献者（KevinShort、DaleDe、Lord-valen 等；原页面特别致谢最早记录 Kobo Touch 破解方法的 stef70）
translated_at: 2026-11-10
order: 2
description: Kobo Touch 破解的完整流程：修改 KoboRoot.tgz 固件包启用 Telnet/FTP 与 USB 网络拿到 root 权限，外加跳过账户激活、简化升级后重新破解的方法。
---

> 本文译自 MobileRead Wiki 的《Kobo Touch Hacking》页面，原文最后修订于 2024-01-11。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处与下载入口引用，本站不镜像论坛内容。
> 破解需要修改系统文件，操作失误可能导致设备变砖——动手前请先备份设备上的全部数据。

*本页面仍在建设中。*

特别感谢 [stef70](https://www.mobileread.com/forums/showthread.php?t=141388)，他第一个记录了如何破解 [Kobo Touch](https://wiki.mobileread.com/wiki/Kobo_Touch)。

## 概述

Kobo Touch 升级固件（firmware）的方式非常简单：如果在 Kobo 的公共分区（public partition，即 USB 连接电脑时可见的那个分区）里发现 `.kobo/KoboRoot.tgz` 文件，系统就会把这个 `.tgz` 包解压到内部系统分区的根目录。只要修改 KoboRoot.tgz 里的一些文件，我们就能相当轻松地启用 Telnet 和 FTP 访问，从而拿到 root 权限。

## 破解流程

### 获取升级固件包

第一步是拿到当前固件，这样我们才能给一些文件打补丁。带下载链接的 Kobo 固件文件清单见[这里](https://wiki.mobileread.com/wiki/Kobo_Firmware_Releases)。获取最新固件的另一个办法是做一次恢复出厂设置（factory reset）：

1. 备份你的**全部**电子书！！！（恢复出厂设置会删掉你的所有文件！从 Kobo 商店下载的电子书会在设备同步时自动回到你的 Touch 上。）
2. 执行恢复出厂设置。有两种做法：
   - 设备开机时按住 Home 键；或者
   - 在 Touch 的主屏幕按 HOME，然后进入 **Settings > Device Information > Factory Reset**（设置 > 设备信息 > 恢复出厂设置）。
3. 把 Touch 插到电脑上，用 Kobo 桌面应用完成 Kobo Touch 的初始设置。
4. 拔掉 Touch 之前，把 Touch 上 `.kobo` 目录里的 `KoboRoot.tgz` 文件拷到电脑硬盘。

### 编辑文件

拿到 `KoboRoot.tgz` 之后，我们就可以查看它的内容了。Linux 下用下面的命令解压：

```sh
tar xvzf KoboRoot.tgz
```

Windows 用户可以用 7-zip 之类的程序解压。**绝对不要用写字板（WordPad）或其他 Windows 文本编辑器**（Windows 的换行符会弄坏脚本）。

最值得关注的文件是 `etc/init.d/rcS`。Touch 每次启动时，`init` 进程都会调用这个脚本。我们可以很方便地把自己的 shell 命令加进去。为了灵活起见，在 `/usr/local/Kobo/nickel -qws &` 这一行之前加上：

```sh
/mnt/onboard/run.sh &
```

*注：改用 `/mnt/onboard/run.sh >>/mnt/onboard/run.out 2>&1 &` 这一行的话，日志会输出到 `run.out`，方便你排查 `run.sh` 里命令的问题。*

然后用下面的命令打包：

```sh
tar czf KoboRoot.tgz etc/init.d/rcS
```

把 `KoboRoot.tgz` 文件拷到 Touch 上的 `.kobo` 目录，拔掉 USB 线，设备会自动安装并重启。

### 启用 Telnet/FTP

有两个文件——`inittab` 和 `inetd.conf`——需要编辑才能启用 Telnet 和 FTP。但当前固件的 KoboRoot.tgz 里找不到这两个文件。所以我们先建一个 `run.sh` 脚本，内容如下：

```sh
cp /etc/inittab /mnt/onboard
cp /etc/inetd.conf /mnt/onboard
```

把 Touch 连到电脑，将 `run.sh` 拷到 Touch 上。重启一次后，你应该能在 Touch 的公共分区上找到 `inittab` 和 `inetd.conf`。把它们移到解压出来的 KoboRoot.tgz 的 `etc` 目录里。

Kobo Touch 运行的是 BusyBox，里面带着通过 WiFi 控制 Touch 所需的全部工具。启用 Telnet 和 FTP 需要三步：

1. 向 `etc/init.d/rcS` 加入：

   ```sh
   mkdir -p /dev/pts
   mount -t devpts devpts /dev/pts
   ```

2. 向 `etc/inetd.conf` 加入：

   ```sh
   21 stream tcp nowait root /bin/busybox ftpd -w -S  /
   23 stream tcp nowait root /bin/busybox telnetd -i
   ```

   **注**：按一位补充者的经验，在 Glo 2.1.5 固件上，只有把 `21 stream ...` 这一行末尾的正斜杠（`/`）去掉才能生效。

3. 向 `etc/inittab` 加入：

   ```sh
   ::respawn:/usr/sbin/inetd -f /etc/inetd.conf
   ```

这些文件可以用下面的命令打包：

```sh
tar czf KoboRoot.tgz etc/init.d/rcS etc/inittab etc/inetd.conf
```

把生成的 `KoboRoot.tgz` 拷到 Touch 的 `.kobo` 目录并拔线。

现在你应该能通过 Telnet 登录了！你得先启用 WiFi（比如打开网页浏览器），并弄清 Touch 的 IP 地址。

按 **HOME > Settings > Device Information**（设置 > 设备信息）可以看到 Touch 的 MAC 地址。打开 Touch 的浏览器，然后在同一网络里的一台电脑上运行（假设你的网络 IP 地址是 `192.168.1.x`）：

```sh
sudo nmap -sP 192.168.1.1-254
```

得到所有已连接设备的清单。找到你 Touch 的 MAC 地址，IP 地址就在 MAC 地址上方几行。用那个 IP 地址 Telnet 到你的 Touch：

```sh
telnet 192.168.1.100
```

以 `root` 登录，密码留空，大功告成。

### 启用 USB 网络

如果你的 Linux 使用 systemd，就需要事先找到 USB 端口的 id。做法是：插上阅读器，然后运行：

```sh
$ sudo dmesg
```

你会找到类似这样的行：

```text
[XXXXXXX.XXXXXX] cdc_ether 1-2:1.0 enXXXXXXXXXXXXX: renamed from usb0
```

记下以 `en` 开头的那个代码。下述说明中所有出现 `usb0` 的地方都要用这个代码替换。这个编号取决于所用的 USB 端口，所以把阅读器换到另一个端口连接时要留心。

首先按上面的指南启用 Telnet/FTP，并 Telnet 进你的 Kobo。

#### 手动方式（例如一次性使用——重启后失效）

确保你的 Kobo **没有**通过 USB 连接，然后在 Kobo 上执行这些命令：

```sh
> killall nickel
```

（`nickel` 是阅读器应用；之后可以按[这个脚本](http://pastebin.com/gEuQpaU5)重启它。）

```sh
> /bin/busybox insmod /drivers/ntx508/usb/gadget/arcotg_udc.ko
> /bin/busybox insmod /drivers/ntx508/usb/gadget/g_ether.ko
```

（USB 网络插件不会通过 nickel 连接——我们必须手动配置：）

```sh
> ifconfig usb0 192.168.2.2
```

现在用 USB 线把 Kobo 插到 PC，然后在 PC 上执行：

```sh
> lsusb
```

（输出里应该会显示 *Netchip Technology, Inc. Linux-USB Ethernet/RNDIS Gadget*——如果是这样：）

```sh
> ifconfig usb0 192.168.2.1
> telnet 192.168.2.2
```

然后你就可以和上面 WiFi 的情形一样，以 `root` 和相同的密码（默认：无密码）登录了。

#### 自动方式（例如永久使用——重启后仍然有效）

这一步最简单的做法大概是在 PC 上编辑好文件，再 FTP 回 Kobo（我在 Ubuntu 上用的是 Gftp）。

在 Kobo 上：

```sh
> killall nickel
```

把这些命令放到 `/etc/init.d/rcS` 的末尾：

```sh
/bin/busybox insmod /drivers/ntx508/usb/gadget/arcotg_udc.ko
/bin/busybox insmod /drivers/ntx508/usb/gadget/g_ether.ko
```

把这条命令放到 `/usr/local/Kobo/udev/ac` 和 `/usr/local/Kobo/udev/plug` 的末尾：

```sh
ifconfig usb0 192.168.2.2
```

（你也许不需要两个文件都放，但我懒得验证了。）

现在重启 Kobo，检查改动是否生效：

```sh
> reboot
```

等 Kobo 的主界面出现之后（不过我觉得也许无所谓），用 USB 把 Kobo 插到 PC。忽略弹出的提示框。

然后在 PC 上：

```sh
$ ifconfig usb0 192.168.2.1
$ telnet 192.168.2.2
```

**注意**：在 OS X 上，`usb0` 要换成类似 `en0` 的名字；数字取决于 USB 端口。

然后你就可以以 `root` 和相同的密码（默认：无密码）登录了。

### 关于休眠的备注

下面这些似乎有效：

```sh
echo 1 > /sys/power/state-extended   # 关闭 neonode 触摸屏
echo mem > /sys/power/state
# 唤醒之后：
echo 0 > /sys/power/state-extended
```

这是查看 nickel 的 strace 输出时发现的：

```c
open("/sys/power/state-extended", O_WRONLY|O_CREAT|O_TRUNC|O_LARGEFILE, 0666) = 3
dup2(3, 1) //copy filehandle
write(1, "1\n", 2) = 2
execve("/bin/sh", ["sh", "-c", "echo mem > /sys/power/state"]
```

来自 kobolabs 源码 `/KoboLabs/hw/imx508/cls/linux-2.6.35.3/kernel/power/main.c`：

```c
static ssize_t state_extended_store(struct kobject *kobj, struct kobj_attribute *attr,
                                    const char *buf, size_t n)
{
  if ( buf[0] == '1' )
  {
    if(!g_sys_full_suspend_state)
    {
      neonode_activate(0); disable_irq_wake(get_homekey_irq());
      g_sys_full_suspend_state=1;
    }
  }else if(g_sys_full_suspend_state)
  {
    neonode_activate(1);
    enable_irq_wake(get_homekey_irq());
    g_sys_full_suspend_state=0;
  }
```

我在关闭 WiFi 并拔掉连接的状态下试过上面的方法，看起来有效，但还没有隔一段时间查看电量来完整验证。

## 跳过账户

### 侧载模式（Sideloaded Mode）

这是 4.31.19086 版固件加入的功能（见[这个论坛帖](https://www.mobileread.com/forums/showthread.php?p=4191419#post4191419)）。

如果需要更新，配置文件可以在侧载（sideload，即手动通过 USB 安装包而不走官方同步）固件之前、之后或过程中编辑。

1. 如果是从出厂状态开始，走完设置流程并选择 **"Don't have a Wi Fi network?"**（没有 WiFi 网络？），这样你就能挂载设备。

2. 挂载设备。

3. 在 `/mnt/.kobo/Kobo/Kobo eReader.conf` 文件的 `[ApplicationPreferences]` 小节下加入：

   ```ini
   SideloadedMode=true
   ```

4. 弹出并重启设备。

### 添加假用户

```sh
echo "insert into user values('value0', 'value1', 'value2', 'value3', 'value4', 'value5', 'value6');" | sqlite /mnt/KOBOeReader/.kobo/KoboReader.sqlite
```

数据库格式可能随 Kobo 的固件版本而不同。

在 3.11.0 上，我是这样做的：

```sh
$ sqlite3 ./KoboReader.sqlite
SQLite version 3.8.10.2 2015-01-01 00:00:00
Enter ".help" for usage hints.
sqlite> INSERT INTO "user" VALUES('value0','value1','value2','value3','value4', 'value5', 'value6', 'value7' ,'value8');
sqlite>
```

在 Kobo Clara HD 上，上面的命令会失败，因为这张表有 20 列而不是 7 列或 9 列，所以必须改用下面的命令。只要其他 Kobo 机型上除了 UserID 和 UserKey 之外没有更多不接受 NULL 值的列，这条命令应该同样适用：

```sh
echo "insert into user (UserID, UserKey)  values (1, 'empty')" | sqlite3 /mnt/KOBOeReader/.kobo/KoboReader.sqlite
```

## 简化升级后的重新破解

固件更新会覆盖你为破解设备而编辑过的文件，效果上等于把设备"解破解"了。为了避免每次都重新编辑一大堆复杂文件，你可以把这些修改从原始文件里解耦出来。

在根目录（或任何你喜欢的位置）建一个名为 `customInit.sh` 的文件，把你平时会写进 `/etc/init.d/rcS` 的那些行放进去，并从 `/etc/init.d/rcS` 文件里删掉你改过的行。

把你修改过的 `/etc/inetd.conf` 文件改名为 `/etc/inetd2.conf`。

这样，当一次官方固件更新把你的破解清掉后，只需要（用 KoboRoot.tgz 方法）向 `/etc/inittab` 加入下面几行，就能恢复破解：

```sh
::respawn:/usr/sbin/inetd -f /etc/inetd2.conf
::once:/bin/sh /customInit.sh
```

## 更多 Kobo 玩法

- [在 Kobo 上运行 Debian Linux](https://wiki.mobileread.com/wiki/Debian_Linux_on_a_Kobo)（Debian Linux on a Kobo）
- [Kobo WiFi 破解](https://wiki.mobileread.com/wiki/Kobo_WiFi_Hacking)（Kobo WiFi Hacking）

## 参考资料

1. [Kobo Touch 4.31.19086 固件侧载模式说明帖（MobileRead 论坛）](https://www.mobileread.com/forums/showthread.php?p=4191419#post4191419)
