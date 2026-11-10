---
title: Kindle Touch 开发指南：工具链与自制功能
original_title: "Kindle Touch Hacking（拆分篇：Development）"
source_url: https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking
original_author: MobileRead Wiki 贡献者（NiLuJe、Eureka、DaleDe、Eschwartz、Ixtab 等）
translated_at: 2026-11-10
order: 6
description: Kindle Touch 开发者向技巧合集：搜索栏隐藏命令、图片查看器、截图与强制更新，GCC 交叉工具链与 Clang 配置，收藏夹实现思路，以及用 KindleTool 制作自定义更新包。
---

> 本文译自 MobileRead Wiki 的《Kindle Touch Hacking》页面，原文最后修订于 2021-07-28。原文是单页长文，本站按主题拆为四篇译文，本文收录其中开发者向的内容：有用的隐藏功能、GCC 交叉工具链、特定功能的实现思路、自制更新包的制作。
> 拆分系列另三篇：[Kindle Touch 越狱](/wiki/kindle/touch-jailbreak/)、[越狱破解包清单](/wiki/kindle/touch-packages/)、[系统内部架构](/wiki/kindle/touch-internals/)。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处与下载入口引用，本站不镜像论坛内容。
> 文中工具链版本与构建步骤反映原文修订时点，实际版本与做法以各项目仓库为准。

本文假设设备已完成越狱：Kindle Touch 的越狱流程见[越狱篇](/wiki/kindle/touch-jailbreak/)；更新的 5.x 触屏机型（PW2 / PW3 / KT2 / KT3 / KV / KOA）见[《Kindle 5.x 软件越狱》](/wiki/kindle/jailbreak/)。

## 有用的隐藏功能

### 搜索栏快捷命令

和老机型一样，KT 支持通过搜索栏输入快捷命令（shortcut / command）。点按搜索栏，输入命令，再按回车"键"确认。

以下命令已被确认可用（[出处帖](http://www.mobileread.com/forums/showpost.php?p=1868644&postcount=206)）：

- `;dm` —— 把消息转储到 `/documents`
- `;dh` —— 转储 cvm 堆（heap）
- `;dt` —— 转储 cvm 栈（stack）
- `;shpm` —— 把设备置为出厂运输模式（shipping mode）
- `;urst` —— 重置用户分区，会删除隐藏 System 目录、Audible 目录、Documents 与 tts 目录的内容。使用前**务必对设备做一次完整备份**
- `;debugOn` —— 开启详细（verbose）日志
- `;debugPaint` —— 记录绘制（painting）函数的日志
- `;debugOff` —— 关闭详细日志
- `;debugPref` —— pref 级别的日志
- `;dP` —— `;debugPref` 的别名
- `;311` —— 更改运营商设置
- `;411` —— 服务器信息
- `;611` —— 广域网（WAN）信息
- `;711` —— WiFi 信息
- `;fc-cache` —— 更新 fontconfig 的缓存，然后重启框架
- `;setTime` —— 把 Kindle 时间设为 Unix 时钟
- `;st` —— `;setTime` 的别名（格式：yyyy-mm-dd HH:MM，例如 `;st 2012-07-22 17:59`）
- `~ds` —— 永不显示屏保（代价是直到下次重启前都无法锁定 Kindle。重启 Kindle 会恢复屏保锁定，但愿一切安好！）

当然，如果你装了 USBNetwork 破解（安装方法见[越狱篇](/wiki/kindle/touch-jailbreak/)），还有：

- `;usbnetwork` —— 切换 USB 网络的开 / 关
- `;un` —— `;usbnetwork` 的别名

这些快捷命令定义在 `/usr/share/webkit-1.0/pillow/javascripts/debug_cmds.js`（5.0.0 固件）或 `/usr/share/webkit-1.0/pillow/debug_cmds.json`（5.0.3）文件里。

也可以按原有条目的格式手动往这个文件里追加快捷命令（风险自担）。例如添加 `";kterm" : "/mnt/us/extensions/kterm/bin/kterm.sh"`（记得给原本的最后一行末尾补一个逗号）之后，在搜索栏输入 `;kterm` 就能启动 [Kterm](http://www.mobileread.com/forums/showthread.php?t=202794)。

注意：与对框架（framework）的一切修改一样，需要重启框架（比如重启设备），改动才会生效。

#### Kindle Paperwhite 的快捷命令

上面的清单适用于 Kindle Touch。下面是一台 Paperwhite（固件 5.3.1）上 `/usr/share/webkit-1.0/pillow/debug_cmds.json` 文件的"未删节"副本。注意：未动过的量产设备上并不存在 `/usr/local/bin/` 目录，所以其中很多命令实际上什么效果都不会有：

```json
";dm" : "/usr/bin/dm.sh",
";dmcc" : "/usr/local/bin/dmcc.sh",
";dh" : "/usr/bin/dh.sh",
";dt" : "/usr/bin/dt.sh",
";wifipopup" : "/usr/local/bin/wifipopup.sh",
";sandbox" : "/usr/local/bin/sandbox.sh",
";sbx" : "/usr/local/bin/sandbox.sh",
";shpm" : "/usr/sbin/shipping_mode",
";lzzl" : "/usr/sbin/shipping_mode",
";urst" : "/usr/sbin/userstore_reset",
";usbnetwork" : "/usr/local/bin/usbnetwork.sh",
";un" : "/usr/local/bin/usbnetwork.sh",
";di" : "/usr/local/bin/indexerdisable.sh",
"`stopIndexing" : "/usr/local/bin/indexerstop.sh",
"`startIndexing" : "/usr/local/bin/indexerenable.sh",
"`disableIndexing" : "/usr/local/bin/indexerdisable.sh",
"`indexStatus" : "/usr/local/bin/indexstatus.sh",
";ddc" : "/usr/local/bin/dynconfig.sh",
";resetConfig" : "/usr/local/bin/resetConfig.sh",
";rc" : "/usr/local/bin/resetConfig.sh",
";twoFingerChromeOn" : "/usr/local/bin/altChrome.sh 1",
";homeKeyChromeOn" : "/usr/local/bin/altChrome.sh 2",
";normalChrome" : "/usr/local/bin/altChrome 0",
";debugOn" : "/usr/bin/debugOn.sh",
";debugPaint" : "/usr/bin/debugPaint.sh",
";debugOff" : "/usr/bin/debugOff.sh",
";debugPerf" : "/usr/bin/debugPerf.sh",
";dP" : "/usr/bin/debugPerf.sh",
";311" : "/usr/bin/311.sh",
";411" : "/usr/bin/411.sh",
";611" : "/usr/bin/611.sh",
";711" : "/usr/bin/711.sh",
";setTime" : "/usr/bin/dateTime.sh",
";st" : "/usr/bin/dateTime.sh",
"~ds" : "/usr/bin/ds.sh",
";toggleLight" : "/usr/bin/light.sh",
";fc-cache" : "/usr/bin/fc-cache.sh",
";htmlViewer" : "/usr/local/bin/htmlViewer.sh",
";installHtml" : "/usr/local/bin/installHtmlViewer.sh",
";merchant" : "/usr/local/bin/merchant.sh",
";updateCamp" : "/usr/bin/updateCamp.sh"
```

另外确认了以下命令（[出处帖](http://www.mobileread.com/forums/showthread.php?p=2462298#post2462298)）：

- `;ReadingTimeOff` —— 关闭阅读时间显示
- `;ReadingTimeOn` —— 打开阅读时间显示
- `;ReadingTimeReset` —— 重置阅读时间的计算

### 图片查看器

**仅适用于固件 5.1——希望后续版本也行！** 在运行 5.3.1 的 Paperwhite 上仍然可用。

把一些图片放进 `/mnt/us/images/`，然后运行这条命令：

```text
lipc-set-prop com.lab126.appmgrd start app://com.lab126.booklet.imageviewer
```

也可以改用直接调用 shell 脚本的方式：

```text
/usr/bin/imageViewer.sh
```

更省事的办法：装上 [Collections Manager（收藏夹管理器）](http://www.mobileread.com/forums/showthread.php?t=186305) 并把图片设为可见（默认不可见），之后直接点击图片就能打开图片查看器。

### 截图

- **Kindle Touch：** 按住 home 键 2 秒，点一下屏幕，再继续按住 home 键一两秒。
- **Kindle Paperwhite：** 同时按下右上角与左下角（[出处帖](http://www.mobileread.com/forums/showthread.php?p=2252433)）。

截图保存在 `/mnt/us/` 目录，也就是设备以 USB 连接电脑时看到的那个根目录。

另外，如果你通过 USB 网络登录了设备，直接执行 `screenshot` 命令，或用 `fbgrab`（由 USBNetwork 提供）即可。

### 强制安装更新

安装更新的常规流程是：把 Kindle 当 USB 存储连到电脑，把 `update_*.bin` 文件拷到 Kindle 盘的根目录，弹出磁盘、拔掉 USB 线，然后在设备上执行 `菜单 → 设置 → 菜单 → 更新你的 Kindle`。

如果更新包是用别的办法放进设备的（比如在 USB 网络模式下把文件放到 `/mnt/us`），Kindle 通常识别不出有更新，"更新你的 Kindle"菜单项也会一直是灰的。不过，你仍然可以从命令行强制安装：

```text
lipc-set-prop com.lab126.ota startUpdate 1
```

KUAL 的 Helper 扩展里就有这么一个按钮 ;)

### 禁用 WiFi 网络连通性检查

默认情况下，Kindle 连接无线网络时会尝试验证互联网连通性。这在很多场景下并不合意，比如连接内网（Intranet）或公共热点时。

要禁用这个连通性检查，在 USB 用户分区放一个名为 `WIFI_NO_NET_PROBE` 的文件即可。

## GCC 交叉工具链

Amazon 提供的源代码压缩包里带有 Makefile，可以构建出与 Amazon 自己所用完全相同的 GCC 交叉工具链（cross-toolchain）。

至少可以在 Source Code Notice（源代码声明）页的 [Kindle_src_5.3.7_2004410010.tar.gz](http://kindle.s3.amazonaws.com/Kindle_src_5.3.7_2004410010.tar.gz) 里找到它。Makefile 与构建说明（`BUILD_HOW-TO.txt`）在源码压缩包内的 `build_linaro-gcc_4.5.4.tar.gz` 里。

不过 Makefile 里有些链接已经失效。下面是修复链接的补丁：

```diff
--- a/Makefile	2014-01-19 00:00:00.000000000 +0000
+++ b/Makefile	2014-01-19 00:00:00.000000000 +0000
@@ -37,7 +37,7 @@
 BUILD_SYSROOT = $(CURDIR)/build/sysroot

 # Where to fetch the packages from
-MIRROR = http://ports.ubuntu.com/
+MIRROR = http://old-releases.ubuntu.com/ubuntu/

 # Set the pre-built headers and libc to build against.
 LIBC6_VER = 2.12.1-0ubuntu6
@@ -92,7 +92,7 @@

 # Fetch the binutils tarball from Ubuntu archive
 $(BINUTILSSRC): $(stamp)init-dirs
-	curl $(CURLFLAGS) -o $@ http://archive.ubuntu.com/ubuntu/pool/main/b/binutils/$(@F)
+	curl $(CURLFLAGS) -o $@ http://old-releases.ubuntu.com/ubuntu/pool/main/b/binutils/$(@F)

 # Extract
 $(stamp)binutils-extract: $(BINUTILSSRC)
```

`BUILD_HOW-TO.txt` 把 texinfo（版本 4.13a.dfsg.1-5ubuntu1）列为构建依赖。但较新的 Linux 发行版自带的 texinfo 版本更新，构建（`binutils` 和 `gcc` 都是）会因此失败（错误示例见 [Debian bug #697353](http://bugs.debian.org/697353)）。

最实际的解决办法：取 [texinfo-4.13a.tar.gz](https://ftp.gnu.org/gnu/texinfo/texinfo-4.13a.tar.gz) 自行编译，把它的二进制目录加进 `$PATH` 并 export，然后再编译工具链。

也可以改为尝试 [bug #697353 第 32 楼](http://bugs.debian.org/697353#32)、[bug #704586 第 16 楼](http://bugs.debian.org/704586#16)与[第 21 楼](http://bugs.debian.org/704586#21)所附的补丁（但它们只针对 binutils，gcc 还需要类似的补丁），或者干脆构建与新版 texinfo 兼容的更新版本 binutils（例如 binutils 2.24）。

### 在 Amazon 交叉工具链中使用 Clang 编译器

Amazon 的交叉工具链可以搭配 Clang 使用（已在 "Debian clang version 3.4-1 (tags/RELEASE_34/final) (based on LLVM 3.4)" 上测试通过）。

下面这个脚本给出了所需 clang 选项的示例：

```bash
TOOLCHAIN_DIR=$HOME/opt/cross-gcc-linaro

clang \
  -target arm-linux-gnueabi \
  -mfloat-abi=softfp \
  -march=armv7-a \
  -mthumb \
  -mtune=cortex-a8 \
  -mfpu=neon \
  --gcc-toolchain="${TOOLCHAIN_DIR}" \
  --sysroot="${TOOLCHAIN_DIR}/arm-linux-gnueabi" \
  -B"${TOOLCHAIN_DIR}/bin" \
  $*
```

`--target` 用于启用交叉编译；`-m*` 系列选项用于选定按 KT 的 SoC 架构编译（KT 的硬件与系统结构见[系统架构篇](/wiki/kindle/touch-internals/)）；`--gcc-toolchain` 指向工具链所在位置；`--sysroot` 用来约束头文件的搜索路径；`-B` 选项设置汇编器与链接器二进制的查找路径。

要用 Clang 以 C++11 标准模式编译，需要给交叉工具链打上下面的补丁（修复取自 GCC 4.7.2，并因 Amazon 工具链所用的 GCC 4.5.4 不支持 `noexcept` 关键字而做了调整）：

```diff
---
 arm-linux-gnueabi/include/c++/4.5.4/exception_ptr.h    |  2 +-
 arm-linux-gnueabi/include/c++/4.5.4/nested_exception.h | 18 ++++++++++++++----
 2 files changed, 15 insertions(+), 5 deletions(-)

diff --git a/arm-linux-gnueabi/include/c++/4.5.4/exception_ptr.h b/arm-linux-gnueabi/include/c++/4.5.4/exception_ptr.h
--- a/arm-linux-gnueabi/include/c++/4.5.4/exception_ptr.h
+++ b/arm-linux-gnueabi/include/c++/4.5.4/exception_ptr.h
@@ -129,7 +129,7 @@ namespace std
       operator==(const exception_ptr&, const exception_ptr&) throw() 
       __attribute__ ((__pure__));
 
-      const type_info*
+      const class type_info*
       __cxa_exception_type() const throw() __attribute__ ((__pure__));
     };
 
diff --git a/arm-linux-gnueabi/include/c++/4.5.4/nested_exception.h b/arm-linux-gnueabi/include/c++/4.5.4/nested_exception.h
--- a/arm-linux-gnueabi/include/c++/4.5.4/nested_exception.h
+++ b/arm-linux-gnueabi/include/c++/4.5.4/nested_exception.h
@@ -42,6 +42,10 @@
 #  error This platform does not support exception propagation.
 #endif
 
+#ifndef __has_feature
+  #define __has_feature(x) 0  // Compatibility with non-clang compilers.
+#endif
+
 extern "C++" {
 
 namespace std
@@ -57,13 +61,21 @@ namespace std
     exception_ptr _M_ptr;
 
   public:
+#if __has_feature(cxx_noexcept)
+    nested_exception() noexcept : _M_ptr(current_exception()) { }
+#else
     nested_exception() throw() : _M_ptr(current_exception()) { }
+#endif
 
     nested_exception(const nested_exception&) = default;
 
     nested_exception& operator=(const nested_exception&) = default;
 
-    inline virtual ~nested_exception();
+#if __has_feature(cxx_noexcept)
+    virtual ~nested_exception() noexcept;
+#else
+    virtual ~nested_exception();
+#endif
 
     void
     rethrow_nested() const __attribute__ ((__noreturn__))
@@ -74,8 +86,6 @@ namespace std
     { return _M_ptr; }
   };
 
-  inline nested_exception::~nested_exception() = default;
-
   template<typename _Except>
     struct _Nested_exception : public _Except, public nested_exception
     {
@@ -119,7 +129,7 @@ namespace std
   // with a type that has an accessible nested_exception base.
   template<typename _Ex>
     inline void
-    __throw_with_nested(_Ex&& __ex, const nested_exception* = 0)
+    __throw_with_nested(_Ex&& __ex, const nested_exception*)
     { throw __ex; }
 
   template<typename _Ex>
```

工具链的 C++ 标准库并未完整支持 C++11 特性，但新语法应当可用。例如下面这个程序可以无错编译并运行（用 `clang++ -std=c++11`）：

```cpp
#include <iostream>
#include <vector>

int main() {
  std::vector<int> vec = {1,3,3,7};
  for (auto v: vec) {
    std::cout << v;
  }
  std::cout << std::endl;
}
```

用 Clang 3.4 加 `-std=c++1y`，连下面这个都能编译：

```cpp
#include <iostream>

auto fun() {
  return 1'000'000;
}

int main() {
  std::cout << fun() << std::endl;
}
```

## 实现特定功能

*本章在原文中即属讨论与备忘性质的记录，内容未经系统整理，可行性请自行甄别。*

### Android

嗨，我是 Yifan。我想看到 Android 跑在这台设备上。到那时我们还能运行 Nook Simple Touch 的系统，用像样的 UI 访问 BN（Barnes & Noble）书店、阅读 ePub，也能方便地开发和运行 Android 应用（虽然会很慢）。这里有一份关于 Android 移植需要做什么的绝佳（但已过时）参考：[AndroidPortingOnRealTarget](http://wiki.kldp.org/wiki.php/AndroidPortingOnRealTarget)。

而且，既然 Amazon 慷慨地提供了 Touch 的内核源码及相关驱动与补丁，这总不该像把 Android 移植到非 Linux 设备上那么难。

Freescale 为 i.MX50 提供了一份很棒的开发指南 [IMX50SDG.pdf](http://cache.freescale.com/files/32bit/doc/user_guide/IMX50SDG.pdf)，其中包含一节讲 Android 移植。

还有 [i.MX Android Firmware Developers Manual（Very Good）](http://reviews.androids.name/2011/03/i-mx-android-firmware-developers-manual-very-good/)（原链接已失效，可试[这个镜像](http://blog.sina.com.cn/s/blog_72dcef220100yf9i.html)）。

Freescale 还为 i.MX50 提供 Android 演示镜像：[IMX50_SW](http://www.freescale.com/webapp/sps/site/prod_summary.jsp?code=IMX50_SW)。

### 收藏夹（Collections）

我想知道 Kindle Touch 的收藏夹有没有能用的工具。我自己攒了一个从目录生成收藏夹的 hack。思路是：用脚本针对 `/mnt/us/documents/` 里的现有内容，生成用于插入和更新收藏夹的 JSON 代码，再让 http://localhost:9101/change 这个端口去干真正的活。我做了个配合 yifanlu 的 launcher 使用的扩展，在[这里](http://wiki.mobileread.com/w/images/1/18/CollectionSync.rar)下载。
直接操作 `/var/local/cc.db` 或许也行，但风险要高得多。

**更新、更好的替代方案：**

- [Collections Manager](http://www.mobileread.com/forums/showthread.php?t=186305)
- [从 Calibre 创建收藏夹的 GUI Launcher 扩展](http://www.mobileread.com/forums/showthread.php?t=171132)

#### 未注册设备上的收藏夹

**注意**：简单得多的替代方案是用上文提到的 Collections Manager，它在设备未注册时也能用。

**注意 2**：[这里](http://www.mobileread.com/forums/showthread.php?p=2509628&postcount=4)有一个能把设备"伪注册"的更新包，已验证可用。解压后按 `Readme_eng.txt` 里的简单说明操作即可。

下面的描述可能过于啰嗦。概括说：你只需创建文件 `/var/local/java/prefs/reginfo`，填入下面给出的内容。

另外注意：**只有在 Kindle 上从未开启过网络连接时**，这个方法才能一直有效。

- **问**：展开说说：如果开了网络连接，具体会发生什么？
- **答**：`reginfo` 文件会被判定无效而删除，连带地，用"正常"固件功能管理收藏夹的能力也会随之失效。

进入诊断模式（在根目录创建 `ENABLE_DIAGS` 文件）并重启。在诊断模式里启用 USB 网络，在所连的电脑上把 USB 网络配起来，用 SSH 连接设备地址 192.168.15.244，以 root 登录（密码 mario）。执行 `vi /var/local/java/prefs/reginfo`，输入并保存以下内容：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<response>
<user_device_name>WhateverName</user_device_name>
<global_device_name>WhateverName</global_device_name>
<given_name>WhateverName</given_name>
<name>WhateverName</name>
<alias>WhateverName</alias>
</response>
```

关闭诊断模式并重启。收藏夹功能现已启用。

如果用 Linux 电脑连接 Kindle，在 Kindle 上启用 USB 网络之后，电脑侧的具体命令如下。先以 root 执行：

```bash
modprobe cdc_ether  #（如有必要）
ifconfig usb0 up
ifconfig usb0 192.168.15.201
ping 192.168.15.244  # 确认网络已通
```

然后以普通用户执行：

```bash
ssh root@192.168.15.244  # 提示时输入密码 mario
```

现在你已登录进这台同样运行 Linux 的 Kindle。于是：

```bash
vi /var/local/java/prefs/reginfo
```

Vi 有点玄奥：按 `i` 进入插入模式，输入上面的 XML；完成后按 `Esc` 退出插入模式，用 `:wq`（即 write 并 quit 命令）保存退出。

```bash
exit  # 登出
```

让 Kindle 退出诊断模式并重启。

用 Windows 电脑也能完成上述操作，但 SSH（乃至 USB 网络）需要第三方软件。唉：Windows。在 Mac 上，终端命令应该大同小异，虽然我不确定 `cdc_ether` 内核模块的情况。玩得开心！

## 制作自定义更新包

本章讲的是自制 `update_*.bin` 更新包；只想安装社区现成破解包的话，请看[越狱破解包清单](/wiki/kindle/touch-packages/)篇。

要自制更新包，得用 [KindleTool](https://github.com/NiLuJe/KindleTool)（它本身就是 yifan 原版 [KindleTool](https://github.com/yifanlu/KindleTool) 的 fork）。

熟悉 K2/K3 破解的人会认出来：它就是我们熟知并喜爱的 Python 工具 [kindle_update_tool.py](http://www.mobileread.com/forums/showthread.php?t=63225) 的继任者 ;)。

[这个帖子](http://www.mobileread.com/forums/showthread.php?t=187880)是它目前在论坛的家 ;)。

KindleTool 为类 Unix 系统设计，在原生 Windows 上不一定好使；不过在 Linux 和 OS X 上很容易搭建，在 Windows 上也能通过 MinGW 或 Cygwin 使用。

下面的说明未必总是最新，拿不准时请看仓库里的 [COMPILING](https://github.com/NiLuJe/KindleTool/blob/master/COMPILING) 文件 ;)。

在 **Linux** 上构建：

用 Gentoo 的话，直接用[这个 portage overlay](https://github.com/NiLuJe/gentoo-kindletool)，或把 [ebuild](https://github.com/NiLuJe/gentoo-kindletool/blob/master/dev-util/kindletool/kindletool-9999.ebuild) 放进本地 overlay 的 dev-util/kindletool 即可 ;)。

用 Arch Linux 的话，直接用 AUR 里的 [kindletool](https://aur.archlinux.org/packages/kindletool) 或 [kindletool-git](https://aur.archlinux.org/packages/kindletool-git) 包。

1. 确保有一套可用的工具链（`gcc`、`make`、`autotools`、`libtool` 等）
2. 安装 `zlib-dev`、`nettle-dev` 和 `libarchive-dev`
3. 从 [GitHub](https://github.com/NiLuJe/KindleTool) 获取 KindleTool 源码，在 shell 里 cd 进去，敲 `make`
4. 如果 gcc 抱怨 libarchive 太旧，就得自己构建 libarchive-3，然后把头文件（archive.h 和 archive_entry.h）放进 KindleTool/includes，静态库（libarchive.a）放进 KindleTool/lib。另外，不妨去催催你的发行版维护者更新他们的 libarchive 包 ;)

（对于足够新的 Debian 系发行版，第 1、2 步可以合成一条命令：`sudo apt-get install build-essential nettle-dev zlib1g-dev libarchive-dev`）

**只想要现成二进制的话：**

1. 下载论坛帖里最新版、适用于你架构的[静态构建](http://www.mobileread.com/forums/showthread.php?t=187880)。
2. 解压后在 shell 里运行即可。

在 **OS X** 上构建：

- 用 Homebrew 配上[这个 tap](https://github.com/NiLuJe/homebrew-kindletool) 即可 ;)。

（也可以走硬路：用 Homebrew 装 nettle 和 libarchive，再通过 Xcode 或 make 构建 KindleTool。）

**只想要现成二进制的话：**

1. 下载最新的 [OS X 静态构建](http://www.mobileread.com/forums/showthread.php?t=187880)。
2. 解压后在 Terminal 里运行即可。

在 **Windows** 上构建：

1. 安装 [Cygwin](http://www.cygwin.com/)
2. 安装一套像样的 Cygwin 工具链所需的包（`gcc4`、`binutils`、`autoconf`、`automake`、`libtool`、`make` 等）
3. 安装这些包：`libnettle4` / `libnettle-devel`、`zlib` / `zlib-devel`、`git`、`cmake`、`patch`、`pkg-config`
4. 编译安装 [libarchive](https://libarchive.github.com) ≥ 3.0.3（我通常用一个最小化构建，配置参数为 `--prefix=/usr --enable-static --enable-shared --disable-xattr --disable-acl --with-zlib --without-bz2lib --without-lzmadec --without-iconv --without-lzma --without-nettle --without-openssl --without-expat --without-xml2`）
5. 从 [GitHub](https://github.com/NiLuJe/KindleTool) 获取 KindleTool 源码，在 Cygwin 的 shell 里 cd 进去，敲 `make`
   （最爱折腾的人，还可以用 MinGW 工具链交叉编译出原生二进制 ;)）

**只想要现成二进制的话：**

1. 下载最新的 [MinGW 静态构建](http://www.mobileread.com/forums/showthread.php?t=187880)。
2. 解压后在你喜欢的 shell（或 cmd.exe，但**不要**用 Cygwin 的 shell）里运行。

另外，如果原生构建遇到怪问题，可以试试 Cygwin 构建：

1. 安装 [Cygwin](http://www.cygwin.com/)
2. 安装 `libgcc1`、`libnettle4` 和 `zlib0` 包
3. 下载最新的 [Cygwin 静态构建](http://www.mobileread.com/forums/showthread.php?t=187880)。
4. 解压后在 Cygwin 的 shell（**不是**命令提示符）里运行。

### 用法

不带任何参数运行该工具，即可看到详细的用法指南；也可以查阅 [README](https://github.com/NiLuJe/KindleTool/blob/master/README.md) 或 man 手册页。

### 示例

假设你想在设备上运行一个脚本 `run.sh`，由它把 `data.tar.gz` 解压到 Kindle 上。

1. 把所有文件挪进一个目录，比如 `~/kindle`
2. cd 进 `~/kindle`
3. 运行工具（假设它已在你的 $PATH 里）：`kindletool create ota2 -d k5w -d k5g -d k5gb run.sh data.tar.gz update_custom_script.bin`

这会生成一个可在所有已知 Kindle Touch 型号上运行的更新包。

更详细的例子，欢迎查看 [NiLuJe 的 hacks](http://www.mobileread.com/forums/showthread.php?t=88004) 里的 `build-updates.sh` 脚本。

### 限制

- 为 Kindle 4.0 及以上（OTA V2）创建的包不能在 Kindle 3.X 及以下运行（反之亦然）。
- 为 Kindle 3.X 及以下（OTA V1）创建的包只能支持一种设备，必须为每种设备单独制作一个包。
- 为 Kindle 4.0 及以上（OTA V2）创建的包可以支持多种设备，但由于 Amazon 实现上的一个 bug（也可能是有意为之），为 Kindle 4.0 创建的包不能在 Kindle 5.0 上运行，反之亦然。
- 为 Kindle 4.0 及以上（OTA V2）创建的包支持携带元数据字符串，但由于 Amazon 实现上的 bug，这种包根本跑不起来！
