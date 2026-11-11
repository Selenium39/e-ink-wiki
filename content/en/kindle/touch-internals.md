---
title: "Kindle Touch architecture and low-level access"
type: translated
original_title: "Kindle Touch Hacking"
source_url: https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking
original_author: "MobileRead Wiki contributors (NiLuJe, Eureka, DaleDe, Eschwartz, Ixtab, and others)"
translated_at: "2026-11-11"
order: 5
description: "The Kindle Touch stack (Linux, Java, WebKit), LIPC, the on-screen keyboard, OTA update internals, USB download mode, and building U-Boot from Amazon's sources."
---

> This edition adapts the MobileRead Wiki page “Kindle Touch Hacking” (last revised 2021-07-28), rewritten for clarity. Commands and filenames follow that page. Forum links are citations only; this site does not reproduce forum posts.
>
> **Status, November 2026.** This chapter is Kindle Touch / early Paperwhite material. It is not a jailbreak or a package set for current Kindle firmware. In May 2026 Amazon ended download support for Kindle models from 2012 and earlier, including the Kindle Touch and the 5th-generation Paperwhite; those devices can still open files already stored on them ([BGR, 8 Nov 2026](https://www.bgr.com/2305569/how-to-check-if-your-old-kindle-gets-updates/)).

The wiki page *Kindle Touch Hacking* is one long article. It is split on this site into four chapters. This chapter is the architecture, and the USB download mode used when a device is too broken to boot normally. A mistake in that USB mode can brick the Kindle. Take a backup first.

The other three chapters: [Jailbreak, unbrick, and backup](/wiki/kindle/touch-jailbreak/), [Packages](/wiki/kindle/touch-packages/), and [Development](/wiki/kindle/touch-development/). The backup procedure is in the jailbreak chapter.

## Architecture

The Kindle Touch runs Linux. What you tap on is a mix of native programs, Java, and JavaScript. The wiki quotes a forum remark by Yifan Lu and the technical claims in it are these (this is a paraphrase of that quoted remark, not a copy of the post): boot starts when the kernel runs upstart, which replaced sysvinit. upstart brings up the low-level Linux pieces. Lipc is Amazon's bus so those pieces can talk to each other. Almost everything on the Kindle is a module. In principle a media player written in Python could register a lipc event handler and a property reader, and music would play through Python. Pillow is the HTML5 and JavaScript layer.

Using HTML for part of the OS is an odd choice. The remark offers two guesses. One: the plan was an all-HTML system, it did not work out, they fell back to Java, and there was no time to rewrite everything. Two: the plan was all Java, there was no time to rewrite everything, and they bolted on HTML that the browser work needed anyway. Either way, pillow is registered in appdb, a sqlite3 database that also lists the book handlers (Java reader plugins) and the download handlers (unused). The whole arrangement is messy.

The remark is cited from [this forum post](https://www.mobileread.com/forums/showpost.php?p=1887661&postcount=21).

### The big picture

The wiki attaches an architecture diagram, [KT_Arch.png](https://wiki.mobileread.com/wiki/File:KT_Arch.png). It was a first attempt to draw the Kindle Touch subsystems and how they talk to each other. Parts marked in red on that figure are the ones most useful when you are building something new. The important pieces are described below.

### Linux and the programs on it

The Touch runs a customized Linux. [Amazon publishes the source](http://www.amazon.com/gp/help/customer/display.html?nodeId=200203720). The userland is mostly what [busybox](http://busybox.net) provides, plus a lot of tools Amazon wrote. The `extend` package, described in the [packages chapter](/wiki/kindle/touch-packages/), is the easy way to add more tools.

#### Boot configuration

If you want to change what starts, and with which arguments, look in `/etc/upstart`.

#### Window manager

Window management is [awesome](http://awesome.naquadah.org/).

Discussion: [a thread on MobileRead](https://www.mobileread.com/forums/showthread.php?t=162022), especially [post 10](https://www.mobileread.com/forums/showpost.php?p=1930952&postcount=10), [post 11](https://www.mobileread.com/forums/showpost.php?p=1940345&postcount=11), and [post 13](https://www.mobileread.com/forums/showpost.php?p=1971756&postcount=13).

#### On-screen keyboard

The on-screen keyboard is a natively compiled program. It works by sending X Window System events that carry the key.

Program files:

- `/usr/bin/kb` — the executable. It is a thin wrapper around the keyboard library.
- `/usr/lib/libkb.so` — the library. Almost all of the behavior is here.
- `/etc/upstart/kb.conf` — starts the keyboard application automatically.

Configuration files:

- `/var/local/system/keyboard.conf` — runtime configuration, JSON. It lists the layouts that were found, which ones are enabled, and which one is current.
- `/usr/share/keyboard/<locale_code>/*` — the layouts. From 5.1.0 this directory also holds the XT9 files.

Before 5.1.0 a layout directory held three files:

- `<locale_code>-600x800.keymap` — portrait layout
- `<locale_code>-800x600.keymap` — landscape layout
- `utils.so` — a "plugin" of helper functions

From 5.1.0 the layout directory holds:

- `<locale_code>-600x800.keymap.gz` — portrait layout
- `<locale_code>-800x600.keymap.gz` — landscape layout
- `utils.so` — the helper plugin
- `libpredictor.so` — a middle library for input prediction. The bundled `libpredictor.so` uses the built-in XT9 engine.
- `<locale_code>.kdb / *.ldb` — XT9 files (dictionary and database)
- `<locale_code>-758x1024.keymap.gz` and `<locale_code>-1024x758.keymap.gz` — unused layouts. They look like leftovers aimed at a future Kindle with a higher-resolution screen.

Keymap files are plain JSON. The structure did not change in 5.1.0. Some values did: the default font size, and the image paths drawn on some keys. In 5.1.0 the files are also gzipped.

`utils.so` is required. From one layout to another it is mostly the same file, with a few different strings. On the Italian keyboard those two strings are `kb-it` and `Italian`. The first is the language code with a `kb-` prefix (the prefix itself may not matter) and is the keyboard's id. The second is the keyboard's display name.

`libpredictor.so` is optional, including on 5.1.0. A layout still works without it.

Sources: [source 1](https://www.mobileread.com/forums/showthread.php?t=164980), [source 2](https://www.mobileread.com/forums/showpost.php?p=2094608&postcount=28).

#### Log files

The Touch logs enough to be useful when you are trying to see what happened. `showlog -f` follows syslog. `showlog -p` shows the `wpa_supplicant` log. `showlog --help` lists the rest.

The shortcut `;debugOn` raises the log level.

#### Building and debugging

The Kindle is ARM. Every binary you want to run has to be built for that architecture. With a correct toolchain, most Linux programs can be compiled and run on the device.

The Kindle also ships `gdb`, which can debug native programs down at assembly level.

The wiki's "you wanted the steps, here they are" example:

```c
#include <stdio.h>

int main()
{
    printf("Not saying it!!!\n");
    return 0;
}
```

- Download [this toolchain](http://www.mentor.com/embedded-software/sourcery-tools/sourcery-codebench/editions/lite-edition/request?fmpath=/embedded-software/sourcery-tools/sourcery-codebench/editions/lite-edition/form), or build a GNU toolchain yourself, or install `gcc-4.6-arm-linux-gnueabi`.
- `arm-none-linux-gnueabi-gcc helloworld.c -o hello`, or on Ubuntu `arm-linux-gnueabi-gcc-4.6 helloworld.c -o helloworld`.
- Copy it to the Kindle. The wiki does not prescribe how you copy files.
- `chmod +x hello`
- `./hello`

The longer toolchain write-up is [GCC cross-toolchain](/wiki/kindle/touch-development/#gcc-cross-toolchain) in the development chapter. The wiki's own anchor for the same section is [GCC cross-toolchain](https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking#GCC_cross-toolchain).

### LIPC

LIPC is the inter-process communication tool. A process can start other applications, send them events, and register listeners. Internally it appears to be built on dbus. Higher layers have LIPC bindings too, so a WebKit application written in HTML and JavaScript can talk to a Java service or a native program. Complicated structures are encoded as [JSON](https://wiki.mobileread.com/wiki/JSON).

#### Lua bindings

The easiest way to write a program that speaks LIPC is [Lua](https://wiki.mobileread.com/wiki/Lua). A sample:

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

Output of an introspection script:

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

Examples of the Lua binding in real use are under `/etc/xdg/awesome` on the device:

```bash
grep -hr lipcH: /etc/xdg/awesome
```

#### C bindings

The same calls can be used from C through a header recovered by reverse engineering, [openlipc.h](https://github.com/Arkq/openlipc/blob/master/include/openlipc.h). The smallest useful program looks like this:

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

#### The application registry

LIPC is a structural piece of the system, not a side channel. `/var/local/appreg.db` is a SQLite database with a large amount of information about how the system is wired. It looks like a merge of `/var/local/reg/ServerConfig.db` and `/var/local/reg/prereg.db`.

What follows is an excerpt of a dump. Not every row is fully understood. The comments are the original editors' informed guesses, rephrased:

```sql
-- An interface is the kind, or type, of a software component.
CREATE TABLE interfaces ( interface TEXT PRIMARY KEY NOT NULL ON CONFLICT IGNORE );
INSERT INTO "interfaces" VALUES('acx');
INSERT INTO "interfaces" VALUES('extractor');
-- These are standalone UI applications that can be launched and shown.
INSERT INTO "interfaces" VALUES('application');
INSERT INTO "interfaces" VALUES('detail');
-- Internal services the Java subsystem (possibly only that subsystem) uses to provide a feature.
INSERT INTO "interfaces" VALUES('kaf-service');
INSERT INTO "interfaces" VALUES('todo');
INSERT INTO "interfaces" VALUES('indexer');
INSERT INTO "interfaces" VALUES('download');

-- Every LIPC handler the system knows must be registered. Most are unexplained; a few interesting ones follow.
CREATE TABLE handlerIds ( handlerId TEXT PRIMARY KEY NOT NULL ON CONFLICT IGNORE );
-- A few hidden WebKit/WAF applications. Crude, but they do run.
INSERT INTO "handlerIds" VALUES('com.lab126.draw');
INSERT INTO "handlerIds" VALUES('com.lab126.sample');
-- These two handlers open the home screen and the settings screen.
INSERT INTO "handlerIds" VALUES('com.lab126.booklet.home');
INSERT INTO "handlerIds" VALUES('com.lab126.booklet.settings');
-- A few services whose names say what they do.
INSERT INTO "handlerIds" VALUES('com.lab126.kaf.keyboardLayoutService');
INSERT INTO "handlerIds" VALUES('com.lab126.kaf.wifiService');
INSERT INTO "handlerIds" VALUES('com.lab126.kaf.rotationService');
INSERT INTO "handlerIds" VALUES('com.lab126.kaf.TTSService');

-- Further configuration for each handler.
CREATE TABLE properties ( handlerId TEXT NOT NULL REFERENCES handlerIds( handlerId ), name TEXT NOT NULL, value TEXT, PRIMARY KEY (handlerId, name) ON CONFLICT REPLACE );
-- This one is clearly started from the command line.
INSERT INTO "properties" VALUES('com.lab126.draw','command','/usr/bin/wafapp -l com.lab126.draw -c /var/local/waf/draw/');
-- Rows that belong to the home screen.
INSERT INTO "properties" VALUES('com.lab126.booklet.home','lipcId','com.lab126.booklet.home');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','jar','/opt/amazon/ebook/booklet/home.jar');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','supportedOrientation','U');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','maxLoadTime','40');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','maxGoTime','30');
INSERT INTO "properties" VALUES('com.lab126.booklet.home','defaultContext','context=0');
-- KAF services are, most likely, defined by their class name.
INSERT INTO "properties" VALUES('com.lab126.kaf.TTSService','serviceClass','com.amazon.kindle.restricted.media.TTSServiceImpl');

-- MIME types the system supports. Only two examples are shown.
CREATE TABLE mimetypes ( ext TEXT COLLATE NOCASE PRIMARY KEY NOT NULL ON CONFLICT IGNORE, mimetype TEXT COLLATE NOCASE NOT NULL ON CONFLICT REPLACE );
INSERT INTO "mimetypes" VALUES('azw','MT:application/x-mobipocket-ebook');
INSERT INTO "mimetypes" VALUES('pdf','MT:application/pdf');

-- This table repeats the previous one and holds almost the same rows. It is not clear why both exist, or which one is read.
CREATE TABLE extenstions ( ext TEXT COLLATE NOCASE NOT NULL ON CONFLICT REPLACE, mimetype TEXT COLLATE NOCASE PRIMARY KEY NOT NULL ON CONFLICT REPLACE );
INSERT INTO "extenstions" VALUES('azw','MT:application/x-mobipocket-ebook');
INSERT INTO "extenstions" VALUES('pdf','MT:application/pdf');

-- This last table binds an extension or a MIME type to a handler.
CREATE TABLE associations ( handlerId TEXT NOT NULL REFERENCES handlerIds( handlerId ), interface TEXT NOT NULL REFERENCES interfaces( interface ), contentId TEXT NOT NULL, defaultAssoc TEXT, PRIMARY KEY (interface, contentId, handlerId) ON CONFLICT REPLACE);
INSERT INTO "associations" VALUES('com.lab126.mobi.extractor','extractor','GL:*.azw','true');
INSERT INTO "associations" VALUES('kindlet.extractor.azw2','extractor','GL:*.azw2','true');
INSERT INTO "associations" VALUES('com.lab126.booklet.reader','detail','MT:application/pdf','true');
INSERT INTO "associations" VALUES('com.lab126.booklet.reader','download','MT:application/pdf','true');
INSERT INTO "associations" VALUES('com.lab126.kaf.TTSService','kaf-service','none','false');
```

#### Handlers worth using

If you learn more about a particular handler, especially when the legal values of a property are hard to discover, the wiki asked readers to add that to the original page. `lipc-probe -a -v` prints every handler and the properties it supports.

##### Toggle Wi-Fi the way the menu does

- Off: `lipc-set-prop com.lab126.cmd wirelessEnable 0`
- On: `lipc-set-prop com.lab126.cmd wirelessEnable 1`

##### Start an arbitrary application

The shape is `lipc-set-prop com.lab126.appmgrd start app://com.lab126.sample`, with the last segment replaced by the handler you want. For example:

- `lipc-set-prop com.lab126.appmgrd start app://com.lab126.booklet.home` — back to the home screen
- `lipc-set-prop com.lab126.appmgrd start app://com.lab126.booklet.settings?diagnosticMode=\;411` — open Settings. The extra argument drops you straight into the 411 diagnostics screen (device information).

##### Change screen orientation

`lipc-set-prop com.lab126.winmgr orientationLock L` — set the direction you want with `U`, `D`, `L`, or `R`. The wiki says this was tested and works.

##### Change the title bar and the menu

```text
lipc-set-prop com.lab126.pillow configureChrome '{"titleBar":{"clientParams":{"secondary":"Hello World","useDefaultPrimary":false}}}'
```

More detail: [post 2072496](http://www.mobileread.com/forums/showthread.php?p=2072496#post2072496).

##### Stop the screensaver from activating

`lipc-set-prop com.lab126.powerd preventScreenSaver 1`

##### Turn off "share that you finished this book"

- Hide it: `/usr/bin/sqlite3 /var/local/appreg.db "update properties set value='hidden' where handlerid='com.lab126.EndActions' and name='viewModes'"`
- Put it back: `/usr/bin/sqlite3 /var/local/appreg.db "update properties set value='windowed hidden' where handlerid='com.lab126.EndActions' and name='viewModes'"`

More detail: [post 2022528](http://www.mobileread.com/forums/showthread.php?p=2022528#post2022528).

##### Show or hide the keyboard

- Show: `lipc-set-prop -s com.lab126.keyboard open <destination>:<mode>:<flag>`

`mode` is one of `abc`, `Abc`, `123`, `web`, `pad`.

`flag` values:

- `0` — DEFAULT
- `1` — COMPOSITION_ENABLED
- `2` — AUTOCAPITALIZE
- `4` — CLIENT_DISABLED

They combine with a binary OR. Flag `3` turns on both COMPOSITION_ENABLED and AUTOCAPITALIZE, because `3 = 1|2`. [Source](https://www.mobileread.com/forums/showpost.php?p=2094608&postcount=28).

- Hide: `lipc-set-prop -s com.lab126.keyboard close <destination>:<mode>:<flag>` (*the original editor's note: this seems to do nothing*).

### The Java subsystem

A large part of the user interface is Java. The JVM is a proprietary implementation, compatible with Java 1.4. The framework is started from `/etc/upstart/framework`.

- To reload most configuration, run `restart framework`.
- The blunt version is `killall cvm`.

As noted above, the Java subsystem publishes LIPC handlers for services (the so-called Booklets) and for UI.

#### Remote debugging

- The simple way: while the Kindle is in USB mode, create an empty text file named `DEBUG_CVM_JDWP` in the root of USB storage. Reboot, then switch to usbnetwork. The debugger connects to the usbnetwork address, port 8000. Two other filenames are recognized. `DEBUG_CVM_JDWP_SUSPEND` pauses at startup until a debugger attaches. `PROFILE_CVM_NB` turns on NetBeans profiling on port 5140.
- The more adjustable way: edit `/etc/upstart/framework` and change it there. That is the route if you need to change `MinimumKindletTimeoutMillis`.

#### Looking at Amazon's classes

This is the useful move when you want to see how some part of the framework actually works.

The wiki leaves the details as an exercise and only sketches the outline:

- Copy every jar under `/opt/amazon/ebook/` (and its subdirectories) to your computer.
- Install [Eclipse](http://eclipse.org), [jad](http://www.varaneckas.com/jad), and [jadclipse](http://jadclipse.sourceforge.net/), or [JD-Eclipse](http://java.decompiler.free.fr/?q=jdeclipse). The wiki notes that JD-Eclipse could not be installed or made to work at the time. Another option is [this Eclipse update site](http://feeling.sourceforge.net/update) (Chao Chen's "Eclipse class Decompiler"), which ran well on Eclipse Juno.
- Wire those together and you can browse the sources interactively.
- Another useful tactic is to unpack every jar into one directory, so you can grep the files.

As of Kindle Touch 5.0.1 the jars are only partly obfuscated. The important part of that: class names, method names, and many constant names are intact.

A member (wl.) wrote a Windows tool that restores obfuscated field and variable names inside classes. Download it from [this thread](http://www.mobileread.com/forums/showthread.php?p=2096039) and run it. It deobfuscates every `*.class` file in its directory and in subdirectories.

For decompiling, [JD-GUI](http://java.decompiler.free.fr/) goes up to Java 7 and has Eclipse and IntelliJ plugins. jad cannot decompile some of the jars in Kindle Touch firmware 5.1.2.

#### Changing behavior

There is a tool that can change almost any Java class without editing files on the device. Information, patches, and a short HOWTO are in the [jbpatch thread](http://www.mobileread.com/forums/showthread.php?t=175512).

#### Java features you do not get

- String concatenation with the `+` operator
- Generics

### The WebKit subsystem

Starting with the Kindle Touch, Amazon added a second way to build UI. It is based on WebKit, which means HTML5 and JavaScript.

Two places in the system use it.

#### Applications under /var/local/waf/

WAF is probably short for Web Application Framework. The directory holds quite a few applications. The best known is the built-in experimental browser. Others include a proof-of-concept drawing application, Facebook and Gmail applications, and the Store application.

Some WAF entries are only a simple `config.xml` plus a reference to a source URL. Those pages are cached in some way.

```text
com.lab126.draw - <content src="http://mrdoob.com/projects/harmony/#simple" />
com.lab126.gmail - <content src="http://m.gmail.com" />
com.lab126.fb - <content src="http://touch.facebook.com" />
com.lab126.store - http://www.amazon.com/gp/digital/juno/
```

A more detailed description of the `config.xml` format, based on firmware 5.0.1, is in [this post](http://www.mobileread.com/forums/showpost.php?p=1941579&postcount=2).

#### Components under /usr/share/webkit-1.0/pillow/

Two HTML pages live here:

- the built-in media player
- the built-in Wi-Fi configuration dialog

Unlike the WAF applications above, these two are wired much more tightly into the system.

#### Pillow

To talk to the system from JavaScript, and to be integrated into it, there has to be a bridge. That bridge is *pillow*, a JavaScript library that exposes LIPC. Besides LIPC it offers what the wiki calls the native bridge: write to syslog, create and destroy dialog windows, and run executable commands. The early jailbreak used that last entry point. The jailbreak methods are in the [jailbreak chapter](/wiki/kindle/touch-jailbreak/).

### Blanket

Blanket is the system Amazon uses at the low end of the stack to draw images and text on the screen. It paints the boot splash, the USB-connected screen, the screensaver, the ad screensaver, the language picker, and the "service needed" screen. The design is flexible enough to handle any LIPC event. The interesting part is that libblanket does its work by loading modules. Yifan reverse engineered libblanket and published a [usable header](https://github.com/yifanlu/OpenBlanket/blob/master/include/blanket.h) for writing your own blanket module. He also [decompiled the screensaver module by hand](https://github.com/yifanlu/OpenBlanket/blob/master/screensaver.c) as a reference. The code you see there should be very close to Amazon's own. Blanket draws with [Cairo](http://cairographics.org/), so a custom screensaver that does more than show one picture is not a large project. The wiki's examples: turn a color picture into grayscale and scale it on the device, draw the cover of the book currently being read, draw a calendar, draw weather.

### How OTA updates work internally

1. The **todo** process (`/usr/bin/todo`, `/etc/upstart/todo.conf`) pulls service information from Amazon's servers. A helper library builds the URL. Some of the parameters come from the SQLite database `/var/local/appreg.db`. The query string of the service-info URL carries the software version, and a separate HTTP header carries it too. The query-string value is the row in the **properties** table where *handlerId* is `urlbuilder.gparams` and *name* is `software_rev`. The header value is the row where *handlerId* is `urlbuilder.headers` and *name* is `X-ADP-SW`.
2. The server checks the software version of the client Touch, from the query string and/or the header, and if needed attaches an "OTA update available" message to the service information.
3. If that message is present, **todo** forwards it to the lipc service named by the corresponding values in the service message (**GET**, **FWUO**). **todo** looks those values up in its own handler registry, which it builds from `/etc/todo/handler_registry.conf` at startup and keeps in memory. For **legacy.GET.FWUO** the defined service is *com.lab126.ota*, so **todo** delivers the message by setting the lipc property *handleToDoItem* on *com.lab126.ota*.
4. The *com.lab126.ota* service is provided by the **otaupd** process (`/usr/bin/otaupd`, `/etc/upstart/otaupd.conf`). That daemon downloads the update package and checks that it is valid.
5. After a successful download and check, **otaupd** runs the **ota-update** upstart script (`/etc/upstart/ota-update.conf`) and passes the package path as an argument.
6. After the OTA install succeeds or fails, **otaupd** reports back to **todo**, and **todo** reports the status to Amazon. Beyond the fact of success or failure, it sends Amazon no new information.

[Source](https://www.mobileread.com/forums/showpost.php?p=2008593&postcount=13).

#### Blocking official updates

That mechanism is also the answer to "how do I block official updates?" if an official update would break what you have installed, or if you are tired of reinstalling after every jump to 5.3 or newer.

The mechanism is what the [BackDoor Lock](http://www.mobileread.com/forums/showthread.php?t=205666) hack uses. It blocks official updates across a wide range of Kindle models. There is also a simple approach, and it applies **only** to firmware before 5.6.x: occupy the temporary download filename, as described in [this post](http://www.mobileread.com/forums/showpost.php?p=2863041&postcount=3).

The two can be used together, which is safer on firmware before 5.6.x. Amazon closed the filename-squatting hole in the 5.6.x firmware. The wiki's hope was that later firmware would not also close BackDoor Lock. The same idea, blocking updates so a jailbreak survives, is covered on this site's [Kindle 5.x software jailbreak](/wiki/kindle/jailbreak/) page.

<a id="usb-download-mode"></a>

## USB download mode

The wiki's heading for this section is "Boot over USB HID serial / USB downloader mode."

The Freescale i.MX508 microcontroller in the Kindle Touch can boot into a USB download mode.

When that mode is on, the Kindle shows up as a USB HID device with VID `0x15A2` and PID `0x0052`. You should be able to talk to it with Freescale's Serial Download Protocol, which the reference manual describes. The protocol can read and write memory, upload a program image into RAM, and start execution at a given address.

How to enter the mode: hard-reset first, by holding the power button until the LED goes out. Keep holding power, and also press the home button. Wait about one second, release power, wait another second, then release home.

The mode is documented in section 6.9.1 of the [i.MX50 reference manual](http://cache.freescale.com/files/32bit/doc/ref_manual/IMX50RM.pdf?fpsp=1) (page 473).

Freescale ships a Windows tool that uploads into RAM and executes it while the chip is in USB download mode. The tool is called `sb_loader`. It is a free download from Freescale. Direct link: [sb_loader.v1.1-g63b47f0_bin+src.zip](http://cache.freescale.com/files/32bit/software/sb_loader.v1.1-g63b47f0_bin+src.zip). On the i.MX508 product page it sits under the "Software & Tools" tab, in "Programmers (Flash, etc.)", under the name "IMX_SB_LOADER". The source is in the zip and is BSD-licensed.

This mode was used to load and run a modified `u-boot.bin`, built from Amazon's GPL sources, with extra changes that repair damaged idme variables. The one that matters most is `pcbsn`. Until that value is repaired the Kindle will not continue to boot. The custom U-Boot also sets the idme variable `bootmode` to `fastboot`, and the rest of the repair is done with the Kindle fastboot tool.

Custom U-Boot images are also distributed with a custom profile for Freescale's MfgTool. A menu then lets you boot the Kindle into main, diags, or fastboot. Even a Kindle Touch or K4 that is thoroughly bricked can be sent into fastboot to flash a Linux kernel or the diags partition, then into diags, where a partition image can be written back with `dd`. There is also a Touch diags partition image that already has SSH in it, and it can be flashed with fastboot. To make the host side simpler, the Kindle fastboot tool was ported to a native Win32 command line. A lot of Kindles were recovered with these tools. Further reading, as links only:

- Select Boot for K4 and Touch: [showthread.php?t=169645](http://www.mobileread.com/forums/showthread.php?t=169645)
- Simple Kindle Touch (and K4NT) debricking: [showthread.php?t=170929](http://www.mobileread.com/forums/showthread.php?t=170929)
- Fastboot Manifesto: [showthread.php?t=170241](http://www.mobileread.com/forums/showthread.php?t=170241)

### Building a U-Boot binary from Amazon's source

What follows is a record of building U-Boot on Ubuntu 10.04. It is not a complete document. It is better than nothing. Adjust it to the machine you actually have: you may need other packages, and you may need to skip or change a step.

1. Download the [source](http://www.amazon.com/gp/help/customer/display.html?nodeId=200203720) from Amazon. Unpack the U-Boot portion into its own directory.

2. Download and install the toolchain:

   ```bash
   sudo add-apt-repository ppa:linaro-maintainers/toolchain
   sudo apt-get update
   sudo apt-get install gcc-4.6-arm-linux-gnueabi
   ```

3. Create the symlink the build expects:

   ```bash
   sudo ln -s /usr/bin/arm-linux-gnueabi-gcc-4.6 /usr/local/bin/arm-linux-gnueabi-gcc
   ```

4. With the toolchain in place, configure U-Boot. Be in the uboot directory. Before compiling, copy `boardid.h` from the `include/` directory of `linux-2.6.31.tar.gz` into the `include/` subdirectory of the uboot tree.

   If `linux/include` has no `boardid.h`, take it from an older source drop. As of 2016-03-29 the newest `boardid.h` was in `Kindle_src_5.6.2.1_2634390002`.

   ```bash
   TYPE=prod make CROSS_COMPILE=arm-linux-gnueabi- imx50_yoshi_config
   TYPE=prod make CROSS_COMPILE=arm-linux-gnueabi-
   ```
