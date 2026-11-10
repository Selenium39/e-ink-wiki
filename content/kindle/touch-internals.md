---
title: Kindle Touch 系统架构与底层访问
original_title: "Kindle Touch Hacking（拆分篇：Architecture / USB）"
source_url: https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking
original_author: MobileRead Wiki 贡献者（NiLuJe、Eureka、DaleDe、Eschwartz、Ixtab 等）
translated_at: 2026-11-10
order: 5
description: Kindle Touch 的系统架构剖析：Linux / Java / Webkit 三层软件栈、LIPC 进程间通信、屏幕键盘、OTA 更新内部机制，以及 USB 下载模式救砖与从 Amazon 源码构建 U-Boot。
---

> 本文译自 MobileRead Wiki 的《Kindle Touch Hacking》页面，原文最后修订于 2021-07-28。
> 原文是单页长文，本站按主题拆为 4 篇，本文收录其中的 Architecture（系统架构）与 Boot over USB HID serial / USB downloader mode（USB 底层启动模式）两章。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处与下载入口引用，本站不镜像论坛内容。
> 本文涉及底层操作（如 USB downloader mode），操作失误有变砖风险——动手前请先做好备份。

拆分系列另三篇：[越狱](/wiki/kindle/touch-jailbreak/)、[软件包](/wiki/kindle/touch-packages/)、[开发](/wiki/kindle/touch-development/)。

## 系统架构（Architecture）

Kindle Touch 运行的是 Linux 操作系统。在你与它交互的背后，设备上实际运行的是原生程序（native）、Java 与 Javascript 的混合体。[引用 Yifan Lu 在论坛帖中的话](https://www.mobileread.com/forums/showpost.php?p=1887661&postcount=21)：

> Kindle 的"操作系统"（或者随便你怎么称呼它）从内核调用 upstart（不再是 sysvinit）开始启动。upstart 加载底层 Linux 组件。Lipc 是 Amazon 写的一个东西，让所有组件之间可以互相通信。Kindle 里的一切都是模块化的。理论上，我可以用 python 实现一个媒体播放器，注册一个 lipc 事件处理器（event handler）和属性读取器，音乐就能通过 python 播放出来。Pillow 是系统中 HTML5/JS 那一层组件。
>
> 他们居然决定让 OS 的一部分用 HTML 来写，这很奇怪。我猜要么是 1) 他们本来想让整个系统都是 HTML，做到一半发现行不通，退回了 Java，但没时间把所有东西重写一遍；要么 2) 他们本来想全部用 Java 写，但没时间重写一切，于是快速拼了一些反正要给浏览器做的 HTML 上去。不管哪种情况，pillow 都被注册进 appdb（一个 sqlite3 数据库），这个库里还有书处理器（Java 阅读器插件）的清单和下载处理器（未使用）。总之，整个体系非常乱。

### 全局图景（The big picture）

原文此处附有一张架构图（[KT_Arch.png](https://wiki.mobileread.com/wiki/File:KT_Arch.png)），是第一次尝试把 Kindle Touch 的各个子系统可视化，并展示它们之间的关系与交互。图中标红的部件大概是对开发新东西最有用的部分。下面依次描述比较重要的部件。

### Linux 操作系统与应用

KT 运行一个定制版 Linux（[源码可从 Amazon 下载](http://www.amazon.com/gp/help/customer/display.html?nodeId=200203720)）。可用的应用主要是 [busybox](http://busybox.net) 提供的那一套，再加上 Amazon 自己写的不少工具。按拆分系列[软件包篇](/wiki/kindle/touch-packages/)里介绍的方法装上 `extend` 包之后，就能轻松添加更多工具。

#### 启动配置

如果你想折腾启动流程——比如加载哪些软件、参数如何配置——看 `/etc/upstart`。

#### 窗口管理器

窗口管理用的是 [awesome](http://awesome.naquadah.org/)。

相关讨论见 [mobileread.com 上的帖子](https://www.mobileread.com/forums/showthread.php?t=162022)（尤其是 [10 楼](https://www.mobileread.com/forums/showpost.php?p=1930952&postcount=10)、[11 楼](https://www.mobileread.com/forums/showpost.php?p=1940345&postcount=11)和 [13 楼](https://www.mobileread.com/forums/showpost.php?p=1971756&postcount=13)）。

#### 屏幕键盘

屏幕键盘是一个原生编译的应用，通过发送带按键信息的 X Window System 事件来工作。

屏幕键盘的应用文件包括：

- `/usr/bin/kb` —— 可执行文件（只是键盘库外面的一层薄封装）
- `/usr/lib/libkb.so` —— 库（实现了绝大部分功能）
- `/etc/upstart/kb.conf` —— 用于自动启动键盘应用

屏幕键盘的配置文件包括：

- `/var/local/system/keyboard.conf` —— JSON 格式的运行时配置（找到的所有布局、启用的布局、当前布局）
- `/usr/share/keyboard/<locale_code>/*` —— 键盘布局（从 5.1.0 起，还包括 XT9 相关文件）

5.1.0 之前，键盘布局目录里有三个文件：

- `<locale_code>-600x800.keymap` —— 竖屏（portrait）方向的布局
- `<locale_code>-800x600.keymap` —— 横屏（landscape）方向的布局
- `utils.so` —— 带服务函数的"插件"

从 5.1.0 开始，键盘布局目录包含：

- `<locale_code>-600x800.keymap.gz` —— 竖屏方向的布局
- `<locale_code>-800x600.keymap.gz` —— 横屏方向的布局
- `utils.so` —— 带服务函数的"插件"
- `libpredictor.so` —— 提供输入预测的中间层库（自带的 `libpredictor.so` 使用内置的 XT9 引擎）
- `<locale_code>.kdb / *.ldb` —— XT9 相关文件（词典、数据库）
- `<locale_code>-758x1024.keymap.gz` 和 `<locale_code>-1024x758.keymap.gz` —— 未使用的布局（应该是为将来支持 HD 屏 Kindle 机型留下的痕迹）

keymap 文件就是简单的 JSON 文件。它们的结构在 5.1.0 里没有变化，只是某些值（默认字号、部分按键上显示的图片路径）改了。另外，5.1.0 里它们改成了 gzip 压缩。

`utils.so` 是必需的。各个布局之间的它基本相同，只有一些字符串不同，例如：意大利语键盘的 utils.so 里这两个字符串是 `kb-it` 和 `Italian`。前者是键盘的语言代码加上前缀 `kb-`（也可能前缀本身无关紧要），用作这个键盘的 ID；后者是键盘的名称。

`libpredictor.so` 是可选的（即使在 5.1.0 里也是）。没有它键盘布局也能正常工作。

出处：[source 1](https://www.mobileread.com/forums/showthread.php?t=164980)、[source 2](https://www.mobileread.com/forums/showpost.php?p=2094608&postcount=28)。

#### 日志文件

幸运的是，Kindle Touch 提供了相当详细的日志，对弄清楚发生了什么很有用。例如，`showlog -f` 显示 syslog，而 `showlog -p` 显示 `wpa_supplicant` 的日志。执行 `showlog --help` 可了解更多。

可以用快捷命令 `;debugOn` 提高日志的详细程度。

#### 开发与调试

Kindle 使用 ARM 处理器，所以你想运行的所有二进制文件都必须为正确的架构编译。只要工具链对，大多数 Linux 程序都能编译了跑在 Kindle 上。

Kindle 还自带了一个 `gdb`，可以用来（在汇编层面）调试原生应用。

**有人要详细步骤？给。**

```c
#include <stdio.h>

int main()
{
    printf("Not saying it!!!\n");
    return 0;
}
```

- 下载[这个工具链](http://www.mentor.com/embedded-software/sourcery-tools/sourcery-codebench/editions/lite-edition/request?fmpath=/embedded-software/sourcery-tools/sourcery-codebench/editions/lite-edition/form)，或自己编译 GNU 工具链，或者直接安装 gcc-4.6-arm-linux-gnueabi。
- `arm-none-linux-gnueabi-gcc helloworld.c -o hello`，或者（Ubuntu 上）`arm-linux-gnueabi-gcc-4.6 helloworld.c -o helloworld`
- 传到你的 Kindle 上（我怎么知道你怎么传文件，自己想办法）
- `chmod +x hello`
- `./hello`

另见原文页面的 [GCC cross-toolchain](https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking#GCC_cross-toolchain) 一节（拆分系列的开发篇将覆盖该主题）。

### LIPC：进程间通信

LIPC 本质上是一个进程间通信（IPC，inter-process communication）工具。进程可以启动其他应用、向它们发送事件、注册事件监听器等。它内部（看起来）是基于 dbus 构建的。更高层也有 LIPC 绑定，比如让一个 Webkit 应用（用 HTML+Javascript 写的）与 Java 服务或原生应用通信。复杂的数据结构用 [JSON](https://wiki.mobileread.com/wiki/JSON) 编码。

#### LIPC Lua 绑定

写带 LIPC 功能的程序，最简单的方式是用 [Lua](https://wiki.mobileread.com/wiki/Lua)。下面是一个 Lua 示例脚本：

```lua
require("liblipclua")

local lipc_handle, error_message, error_number = lipc.init("com.example.script")
if not lipc_handle then
  print("Failed to initialize LIPC: (" .. tostring(error_number) .. ") " .. error_message)
  os.exit(error_number)
else
  lipc.set_error_handler(function(error) print(error) end)
end

local readonly_property = lipc_handle:register_string_property("readonly", "r")
readonly_property.value = "readonly"

local property = lipc_handle:register_int_property("property", "rw")
property.value = 0
property.listener = function (name, value)
  print("Changed property " .. name .. " to " .. tostring(value) .. ".")
end

lipc_handle:subscribe("com.example.otherscript", "some_event", function(ev_source, ev_name, ev_params)
  print("Received event " .. ev_name .. " from " .. ev_source .. " with parameters:")
  for i, param in ipairs(ev_params) do
    print("*  " .. tostring(param))
  end
end)

-- run event loop with timeout of Infinity seconds
while true do lipc.run_event_loop(math.huge) end
```

下面是一个内省（introspection）脚本的输出：

```lua
require("liblipclua")

print("lipc namespace members:")
for name, value in pairs(lipc) do
  print("* " .. name .. ": " .. type(value))
end
print()

lipc_handle = lipc.init("com.example.introspection")
print("lipc object members:")
for name, value in pairs(getmetatable(lipc_handle)) do
  print("* " .. name .. ": " .. type(value))
end
lipc_handle:close()
```

```text
lipc namespace members:
* run_event_loop: function
* set_error_handler: function
* ERROR: table
* init: function

lipc object members:
* get_string_property: function
* close: function
* unsubscribe: function
* __gc: function
* subscribe: function
* register_int_property: function
* unregister_property: function
* set_int_property: function
* send_event: function
* set_string_property: function
* get_int_property: function
* __index: table
* register_string_property: function
```

设备上的 `/etc/xdg/awesome` 目录里有 LIPC Lua 绑定用法的实例，可以用这个命令查看：

```bash
grep -hr lipcH: /etc/xdg/awesome
```

#### LIPC C 绑定

也可以通过逆向工程得到的库[头文件](https://github.com/Arkq/openlipc/blob/master/include/openlipc.h)（openlipc），把 LIPC 功能整合进 C 源代码。最简单的用法大致如下：

```c
#include <stdio.h>
#include <openlipc.h>

int main()
{
    LIPC *lipc;
    char *status;

    if ((lipc = LipcOpenNoName()) == NULL)
        return 1;

    if (LipcGetStringProperty(lipc, "com.lab126.powerd", "status", &status) == LIPC_OK)
        puts(status);

    LipcClose(lipc);
    return 0;
}
```

#### 应用注册表

事实上，LIPC 是整个系统的重要基石。`/var/local/appreg.db` 有一个 SQLite 数据库，里面有**大量**关于系统"接线"方式的信息。（这个库看起来是 `/var/local/reg/ServerConfig.db` 和 `/var/local/reg/prereg.db` 两个文件的"合体"。）

下面是它一份 dump 的摘录。虽然并非所有内容都被完全理解，但原编者以注释形式加了一些"有根据的猜测"：

```sql
-- 接口（interface）可以看作软件部件的"类型"或"种类"。
CREATE TABLE interfaces ( interface TEXT PRIMARY KEY NOT NULL ON CONFLICT IGNORE );
INSERT INTO "interfaces" VALUES('acx');
INSERT INTO "interfaces" VALUES('extractor');
-- 这些原则上是可以启动并展示给用户看的独立（UI）应用：
INSERT INTO "interfaces" VALUES('application');
INSERT INTO "interfaces" VALUES('detail');
-- 这些是 Java 子系统（可能只有它）用来提供特定功能的内部服务
INSERT INTO "interfaces" VALUES('kaf-service');
INSERT INTO "interfaces" VALUES('todo');
INSERT INTO "interfaces" VALUES('indexer');
INSERT INTO "interfaces" VALUES('download');

-- 系统已知的每个 LIPC handler 都必须注册。多数用途不明，这里挑几个有意思的。
CREATE TABLE handlerIds ( handlerId TEXT PRIMARY KEY NOT NULL ON CONFLICT IGNORE );
-- 几个"隐藏"的 Webkit/WAF 应用。相当简陋，但确实能用：
INSERT INTO "handlerIds" VALUES('com.lab126.draw');
INSERT INTO "handlerIds" VALUES('com.lab126.sample');
-- 这两个 handler 分别触发主屏幕和设置界面：
INSERT INTO "handlerIds" VALUES('com.lab126.booklet.home');
INSERT INTO "handlerIds" VALUES('com.lab126.booklet.settings');
-- 几个服务，名字不言自明：
INSERT INTO "handlerIds" VALUES('com.lab126.kaf.keyboardLayoutService');
INSERT INTO "handlerIds" VALUES('com.lab126.kaf.wifiService');
INSERT INTO "handlerIds" VALUES('com.lab126.kaf.rotationService');
INSERT INTO "handlerIds" VALUES('com.lab126.kaf.TTSService');

-- 这张表存放各个 handler 的进一步配置：
CREATE TABLE properties ( handlerId TEXT NOT NULL REFERENCES handlerIds( handlerId ), name TEXT NOT NULL, value TEXT, PRIMARY KEY (handlerId, name) ON CONFLICT REPLACE );
-- 这个显然是通过命令行启动的：
INSERT INTO "properties" VALUES('com.lab126.draw','command','/usr/bin/wafapp -l com.lab126.draw -c /var/local/waf/draw/');
-- 这几条与主屏幕有关：
INSERT INTO "properties" VALUES('com.lab126.booklet.home','lipcId','com.lab126.booklet.home');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','jar','/opt/amazon/ebook/booklet/home.jar');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','supportedOrientation','U');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','maxLoadTime','40');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','maxGoTime','30');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','defaultContext','context=0');
-- KAF 服务（多半）由它们的类名定义：
INSERT INTO "properties" VALUES('com.lab126.kaf.TTSService','serviceClass','com.amazon.kindle.restricted.media.TTSServiceImpl');

-- 系统支持的 MIME 类型（只展示两条示例）：
CREATE TABLE mimetypes ( ext TEXT COLLATE NOCASE PRIMARY KEY NOT NULL ON CONFLICT IGNORE, mimetype TEXT COLLATE NOCASE NOT NULL ON CONFLICT REPLACE );
INSERT INTO "mimetypes" VALUES('azw','MT:application/x-mobipocket-ebook');
INSERT INTO "mimetypes" VALUES('pdf','MT:application/pdf');

-- 这张表与上一张重复，（几乎）包含相同信息。不清楚为何如此，也不清楚用的是哪张表。
CREATE TABLE extenstions ( ext TEXT COLLATE NOCASE NOT NULL ON CONFLICT REPLACE, mimetype TEXT COLLATE NOCASE PRIMARY KEY NOT NULL ON CONFLICT REPLACE );
INSERT INTO "extenstions" VALUES('azw','MT:application/x-mobipocket-ebook');
INSERT INTO "extenstions" VALUES('pdf','MT:application/pdf');

-- 最后这张表把扩展名或 MIME 类型关联到 handler 上：
CREATE TABLE associations ( handlerId TEXT NOT NULL REFERENCES handlerIds( handlerId ), interface TEXT NOT NULL REFERENCES interfaces( interface ), contentId TEXT NOT NULL, defaultAssoc TEXT, PRIMARY KEY (interface, contentId, handlerId) ON CONFLICT REPLACE);
INSERT INTO "associations" VALUES('com.lab126.mobi.extractor','extractor','GL:*.azw','true');
INSERT INTO "associations" VALUES('kindlet.extractor.azw2','extractor','GL:*.azw2','true');
INSERT INTO "associations" VALUES('com.lab126.booklet.reader','detail','MT:application/pdf','true');
INSERT INTO "associations" VALUES('com.lab126.booklet.reader','download','MT:application/pdf','true');
INSERT INTO "associations" VALUES('com.lab126.kaf.TTSService','kaf-service','none','false');
```

#### 实用 handler 与操作

如果你掌握与特定 handler 交互的更多信息——尤其是当属性的有效取值不好确定时——欢迎往原文补充。
执行 `lipc-probe -a -v` 可以拿到 handler 及其支持属性的完整清单。

##### 像菜单那样开关 WiFi

- 关闭 WiFi：`lipc-set-prop com.lab126.cmd wirelessEnable 0`
- 打开 WiFi：`lipc-set-prop com.lab126.cmd wirelessEnable 1`

##### 启动任意应用

用 `lipc-set-prop com.lab126.appmgrd start app://com.lab126.sample` 之类的命令。最后一段是你要启动的应用的 handler 名。例如：

- `lipc-set-prop com.lab126.appmgrd start app://com.lab126.booklet.home` —— 回到主屏幕
- `lipc-set-prop com.lab126.appmgrd start app://com.lab126.booklet.settings?diagnosticMode=\;411` —— 启动设置界面。因为带了附加参数，会直接进入 411 诊断屏（设备信息）

##### 改变屏幕方向

`lipc-set-prop com.lab126.winmgr orientationLock L` —— 用 U、D、L 或 R 设成你想要的方向。实测可用。

##### 影响标题栏与菜单

```text
lipc-set-prop com.lab126.pillow configureChrome '{"titleBar":{"clientParams":{"secondary":"Hello World","useDefaultPrimary":false}}}'
```

更多信息：[帖子 2072496](http://www.mobileread.com/forums/showthread.php?p=2072496#post2072496)

##### 阻止屏保激活

`lipc-set-prop com.lab126.powerd preventScreenSaver 1`

##### 关掉"分享你读完了这本书"

- 关闭：`/usr/bin/sqlite3 /var/local/appreg.db "update properties set value='hidden' where handlerid='com.lab126.EndActions' and name='viewModes'"`
- 恢复：`/usr/bin/sqlite3 /var/local/appreg.db "update properties set value='windowed hidden' where handlerid='com.lab126.EndActions' and name='viewModes'"`

更多信息：[帖子 2022528](http://www.mobileread.com/forums/showthread.php?p=2022528#post2022528)

##### 显示/隐藏键盘

- 显示：`lipc-set-prop -s com.lab126.keyboard open <destination>:<mode>:<flag>`

mode 取以下之一：abc、Abc、123、web、pad。

flag 的取值：

- 0 —— DEFAULT
- 1 —— COMPOSITION_ENABLED
- 2 —— AUTOCAPITALIZE
- 4 —— CLIENT_DISABLED

它们可以按二进制 OR 组合（例如 flag 3 会同时启用 COMPOSITION_ENABLED 和 AUTOCAPITALIZE，因为 3 = 1|2）。[出处](https://www.mobileread.com/forums/showpost.php?p=2094608&postcount=28)

- 隐藏：`lipc-set-prop -s com.lab126.keyboard close <destination>:<mode>:<flag>`（*原编者注：似乎不起作用？*）

### Java 子系统

用户界面很大一部分是用 Java 写的。JVM 是一个专有实现，兼容 Java 1.4。
框架从 `/etc/upstart/framework` 启动。

- 要重载大部分配置，执行 `restart framework`。
- 更粗暴的方式是 `killall cvm`。

如前文所述，Java 子系统为服务（所谓 Booklet）和 UI 都提供了 LIPC handler。

#### 远程调试

- 简单方式：进入 USB 模式，在 Kindle 的 USB 存储根目录建一个名为 `DEBUG_CVM_JDWP` 的空文本文件。然后重启并切换到 usbnetwork 模式。调试时连 usbnetwork 的 IP、端口 8000。还支持其他文件名：`DEBUG_CVM_JDWP_SUSPEND`（启动时挂起，等调试器连接后才继续）和 `PROFILE_CVM_NB`（在端口 5140 上启用 netbeans 性能分析）。
- 更可定制的方式：直接编辑 `/etc/upstart/framework` 并在那里调整。如果你需要改 MinimumKindletTimeoutMillis，这个方式可能有用。

#### 探查 Amazon 的类

如果你想理解框架某个部分的内部工作原理，这一手极其有用。

具体步骤留给你自己练习，这里只给个大致轮廓：

- 把 `/opt/amazon/ebook/`（及其子目录）里的所有 jar 拷到你的电脑上。
- 安装 [eclipse](http://eclipse.org)、[jad](http://www.varaneckas.com/jad) 和 [jadclipse](http://jadclipse.sourceforge.net/)，或 [JD-Eclipse](http://java.decompiler.free.fr/?q=jdeclipse)（注意：JD-Eclipse 目前无法正常安装或工作），或者直接在 eclipse 里用[这个更新源](http://feeling.sourceforge.net/update)（Chao Chen 的 "Eclipse class Decompiler"，在 Eclipse Juno 上运行流畅）。
- 把这些都接起来，你基本上就能交互式地浏览源代码了。
- 另一个有用的策略是把所有 jar 解压到一个公共目录里，这样可以对文件做 grep 之类的操作。

KT 的 jar（截至 5.0.1 版）只有部分混淆——最关键的是，类名、方法名和许多常量名都完好无损。

有一位会员（wl.）写的 Windows 工具，可以还原类中被混淆的字段名和变量名。在[这个帖子](http://www.mobileread.com/forums/showthread.php?p=2096039)下载，运行它即可反混淆它所在目录及子目录中的所有 \*.class 文件。

反编译 Java 类可以试试 [JD-GUI](http://java.decompiler.free.fr/)，它支持到 Java 7，也有 Eclipse 和 IntelliJ 的插件。jad 无法反编译 Kindle Touch 5.1.2 固件里的部分 jar。

#### 修改功能

有一个极其强大的工具，几乎可以随意修改任何 Java 类，而无需改动设备上的文件。信息、补丁和一份简短 HOWTO 见 [jbpatch 帖子](http://www.mobileread.com/forums/showthread.php?t=175512)。

#### 用不了的 Java 特性

- 用 `+` 运算符做字符串拼接（String-Concatenation）
- 泛型（Generics）

### Webkit 子系统

从 Kindle Touch 开始，Amazon 引入了第二种创建 UI 组件的方式。它基于 Webkit，也就是 HTML5 和 Javascript。

系统里有两处用到了这门技术：

#### /var/local/waf/ 中的应用

WAF 大概是 Web Application Framework（Web 应用框架）的缩写。这个目录里能找到不少应用——最著名的是内置的实验性浏览器。还有相当多的其他应用，比如一个概念验证的画板应用、Facebook 和 GMail 应用、商店（Store）应用等。

有些 WAF 只由一个简单的 config.xml 加上对某个源 URL 的引用构成。这些页面会以某种方式缓存。

```text
com.lab126.draw - <content src="http://mrdoob.com/projects/harmony/#simple" />
com.lab126.gmail - <content src="http://m.gmail.com" />
com.lab126.fb - <content src="http://touch.facebook.com" />
com.lab126.store - http://www.amazon.com/gp/digital/juno/
```

关于 config.xml 格式与功能的较详细描述见[这个帖子](http://www.mobileread.com/forums/showpost.php?p=1941579&postcount=2)（信息基于固件 5.0.1）。

#### /usr/share/webkit-1.0/pillow/ 中的组件

这个目录里能找到两个 html 页面，分别是：

- 内置的媒体播放器
- 内置的 WiFi 配置对话框

与上面的 WAF 应用不同，这两个与系统结合得紧密得多。

#### Pillow

要与系统交互并深度集成，就得有办法从 Javascript 里访问系统。这靠的是 *pillow*——一个提供 LIPC 组件访问能力的 Javascript 库。除了 LIPC 访问，它还提供所谓的"原生桥"（native bridge），可以向 syslog 写日志、创建和销毁对话框窗口、执行可执行命令（当初越狱用的正是这个入口，越狱方法见拆分系列[越狱篇](/wiki/kindle/touch-jailbreak/)）。

### Blanket：底层绘图子系统

Blanket 是 Amazon 用来在架构"低端"把图像和文字绘制到屏幕上的系统。基本上，启动画面、USB 连接画面、屏保、广告屏保、语言选择器、"需要服务"（service needed）画面都是它画的。不过这个系统设计得足够灵活，可以处理任何 LIPC 事件。有意思的部分在于，libblanket 靠加载"模块"（module）来干活。Yifan 逆向了 libblanket，整理出一份可用于编写自定义 blanket 模块的[可用头文件](https://github.com/yifanlu/OpenBlanket/blob/master/include/blanket.h)。他还费力地手工[反编译了屏保模块](https://github.com/yifanlu/OpenBlanket/blob/master/screensaver.c)作为参考实现——你在那里看到的代码应该与 Amazon 自己的代码几乎一致。Blanket 用 [Cairo](http://cairographics.org/) 绘图，所以写一个功能超越"单张画片"的自定义屏保模块并不会太难。能想到的玩法比如：把彩色图片转灰度并在设备上缩放、画当前在读图书的封面、画日历、画天气数据等。

### OTA 更新内部机制（OTA updating internals）

1. **todo** 进程（`/usr/bin/todo`、`/etc/upstart/todo.conf`）从 Amazon 服务器拉取服务信息。获取信息用的 URL 由辅助库协助构建，其中部分参数取自 `/var/local/appreg.db` 这个 SQLite 数据库。服务信息 URL 的查询串里带软件版本号，另有一个独立的 HTTP 请求头也带。查询串里的值取自 **properties** 表中 *handlerId* = 'urlbuilder.gparams' 且 *name* = 'software_rev' 的那一行；请求头里的值取自 **properties** 表中 *handlerId* = 'urlbuilder.headers' 且 *name* = 'X-ADP-SW' 的那一行。
2. 服务器核对客户端 KT 的软件版本（依据 HTTP 请求查询串和/或请求头），如有必要，在服务信息里附上"有可用 OTA 更新"的消息。
3. 如果服务信息里有可用 OTA 更新的消息，**todo** 把它发给由服务消息中相应取值（**GET**、**FWUO**）确定的 lipc 服务。**todo** 在自己的内部 handler 注册表里查找这些取值（该注册表在 **todo** 启动时根据 `/etc/todo/handler_registry.conf` 的内容构建并缓存在内存里）。对于 **legacy.GET.FWUO**，定义的服务是 *com.lab126.ota*，于是 **todo** 通过设置 lipc 属性 *handleToDoItem* 把消息发给 *com.lab126.ota*。
4. *com.lab126.ota* 服务由 **otaupd** 进程（`/usr/bin/otaupd`、`/etc/upstart/otaupd.conf`）提供，这个守护进程负责下载更新包并校验其有效性。
5. 下载并校验通过后，**otaupd** 调用 **ota-update** upstart 脚本（`/etc/upstart/ota-update.conf`），并把更新包路径作为参数传入。
6. OTA 更新安装成功/失败后，**otaupd** 向 **todo** 回报，**todo** 再把状态发回 Amazon（除成败事实外，不向 Amazon 发送任何新信息）。

[出处](https://www.mobileread.com/forums/showpost.php?p=2008593&postcount=13)

#### 屏蔽官方更新

上面这些机制恰好回答了"**我怎么屏蔽官方更新？**"这个问题——如果你不想让官方更新弄坏你手上的东西（或者只是厌倦了每次升到不低于 5.3 的版本后都要重装一遍），就会想这么做。

刚刚讲的这套机制已经被 [BackDoor Lock](http://www.mobileread.com/forums/showthread.php?t=205666) 这个 Hack 利用了起来，它能在很宽的 Kindle 机型范围内阻止官方更新；不过也存在一个简单的办法（**仅**适用于 5.6.x 之前的固件）：直接把临时下载文件名[占住](http://www.mobileread.com/forums/showpost.php?p=2863041&postcount=3)就行…… ;)

两者可以同时使用，在 5.6.x 之前的固件上更加保险——Amazon 学精了，在 5.6.x 系列固件里"修复"了临时下载文件名被封占的问题；但愿他们不会在后续版本里把 BackDoor Lock 也"修复"掉。屏蔽更新以保住越狱的同样思路，也见本站的 [Kindle 5.x 软件越狱](/wiki/kindle/jailbreak/)一文。

## USB HID 串口启动 / USB 下载模式（Boot over USB HID serial / USB downloader mode）

Kindle Touch 使用的 Freescale i.MX508 微控制器（MCU）支持一种"USB 下载"（USB downloader）启动模式。

该模式启用后，Kindle 会被识别为一个 USB HID 设备，VID 为 0x15A2，PID 为 0x0052。应该可以通过 Freescale 自行设计的串行下载协议（Serial Download Protocol，其描述见参考手册）连接到它。该协议可以读写内存、把程序镜像上传到 RAM 并从指定地址开始执行。

启用这个模式的方法：先做"硬复位"——按住电源键直到 LED 熄灭；继续按住电源键，同时再按下 home 键；然后等大约一秒，松开电源键，再等一秒，松开 home 键。

该模式的说明见 [i.MX50 参考手册](http://cache.freescale.com/files/32bit/doc/ref_manual/IMX50RM.pdf?fpsp=1)第 6.9.1 节（第 473 页）。

Freescale 提供了一个 Windows 下的软件工具，用于在 USB 下载模式下向 RAM 上传数据并执行。工具名为 "sb_loader"，可从 Freescale 网站免费下载，直链：[sb_loader.v1.1-g63b47f0_bin+src.zip](http://cache.freescale.com/files/32bit/software/sb_loader.v1.1-g63b47f0_bin+src.zip)。（该链接挂在 i.MX508 产品概要页的 "Software & Tools" 标签下、"Programmers (Flash, etc.)" 一节里，名字是 "IMX_SB_LOADER"。）工具的源代码包含在发行压缩包里，以 BSD 许可发布。

这个 USB 下载模式曾被用来加载并运行一个修改版 u-boot.bin——它由 Amazon 的 GPL 源码编译而来，加了自定义改动以修复损坏的 idme 变量（最关键的是 pcbsn，修好它 Kindle 才能继续启动）。这个自定义 u-boot 还把 idme 变量 "bootmode" 改成了 "fastboot"，随后用 kindle 的 fastboot 工具完成修复。

现在还有配合 Freescale MfgTool 自定义 profile 发行的自定义 u-boot 镜像，让你通过菜单选择把 Kindle 引导进 main、diags 或 fastboot 启动模式。哪怕是一部变砖变得很彻底的 Kindle Touch 或 K4，也能引导进 fastboot 去刷 Linux 内核或 diags 分区，然后再引导进 diags，用镜像文件（配合 `dd`）写回主分区。此外现在还有一个预装了 SSH 的 Touch diags 分区镜像（可以用 fastboot 刷入）。为了让这一切更简单，kindle 的 flashboot 工具也被移植到了原生 win32 命令行环境下。很多 Kindle 就是靠这些工具救回来的。更多内容见：

- Select Boot for K4 and Touch：[showthread.php?t=169645](http://www.mobileread.com/forums/showthread.php?t=169645)
- simple kindle touch (and k4nt) debricking method：[showthread.php?t=170929](http://www.mobileread.com/forums/showthread.php?t=170929)
- Fastboot Manifesto：[showthread.php?t=170241](http://www.mobileread.com/forums/showthread.php?t=170241)

### 从 Amazon 源码构建 U-Boot 二进制

下面基本上是我在 Ubuntu 10.04 上构建 U-Boot 所走步骤的记录。文档算不上详尽，但总比什么都没有强。老规矩，具体情况具体分析，请按你自己的环境调整——也就是说：你可能需要安装别的软件包，也可能需要跳过或修改个别步骤。

1. 从 Amazon 下载[源代码](http://www.amazon.com/gp/help/customer/display.html?nodeId=200203720)。把 u-boot 部分解压到它自己的目录里。

2. 下载并安装所需工具链：

   ```bash
   sudo add-apt-repository ppa:linaro-maintainers/toolchain
   sudo apt-get update
   sudo apt-get install gcc-4.6-arm-linux-gnueabi
   ```

3. 创建必要的符号链接：

   ```bash
   sudo ln -s /usr/bin/arm-linux-gnueabi-gcc-4.6 /usr/local/bin/arm-linux-gnueabi-gcc
   ```

4. 工具链装完了，现在配置 U-Boot。确认你当前在 uboot 目录里。编译 U-Boot 之前，先把 boardid.h 从 linux-2.6.31.tar.gz 的 include/ 目录拷到 uboot 目录的 include/ 子目录。

   注意：如果 linux/include 里没有 boardid.h，可以从更早的源码发行包里取。截至 2016-03-29，最新的 boardid.h 在 Kindle_src_5.6.2.1_2634390002 里。

   ```bash
   TYPE=prod make CROSS_COMPILE=arm-linux-gnueabi- imx50_yoshi_config
   TYPE=prod make CROSS_COMPILE=arm-linux-gnueabi-
   ```
