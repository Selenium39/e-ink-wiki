---
title: "Kindle Touch development: toolchain and custom packages"
type: translated
original_title: "Kindle Touch Hacking"
source_url: https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking
original_author: "MobileRead Wiki contributors (NiLuJe, Eureka, DaleDe, Eschwartz, Ixtab, and others)"
translated_at: "2026-11-11"
order: 6
description: "Search-bar commands, screenshots, the GCC cross-toolchain and Clang, collection notes, and building a custom update package with KindleTool."
---

> This edition adapts the MobileRead Wiki page “Kindle Touch Hacking” (last revised 2021-07-28), rewritten for clarity. Commands and filenames follow that page. Forum links are citations only; this site does not reproduce forum posts.
>
> **Status, November 2026.** This chapter is Kindle Touch / early Paperwhite material. It is not a jailbreak or a package set for current Kindle firmware. In May 2026 Amazon ended download support for Kindle models from 2012 and earlier, including the Kindle Touch and the 5th-generation Paperwhite; those devices can still open files already stored on them ([BGR, 8 Nov 2026](https://www.bgr.com/2305569/how-to-check-if-your-old-kindle-gets-updates/)).

The wiki page *Kindle Touch Hacking* is one long article. It is split on this site into four chapters. This chapter is the developer material: hidden features, the GCC cross-toolchain, notes on particular features, and how to build your own update package. Toolchain versions and build steps are what the wiki recorded. When a project repo disagrees with this page, the repo is the one to follow.

The other three chapters: [Jailbreak, unbrick, and backup](/wiki/kindle/touch-jailbreak/), [Packages](/wiki/kindle/touch-packages/), and [Architecture and low-level access](/wiki/kindle/touch-internals/). This chapter assumes the device is already jailbroken. The Touch procedure is the [jailbreak chapter](/wiki/kindle/touch-jailbreak/). Newer 5.x touch models of that era (PW2, PW3, KT2, KT3, KV, KOA) are the [Kindle 5.x software jailbreak](/wiki/kindle/jailbreak/).

## Useful hidden features

<a id="search-bar-shortcuts"></a>

### Search-bar shortcuts

Like the older Kindles, the Touch accepts shortcuts from the search bar. Tap the search bar, type the command, and press the enter "key".

These commands were confirmed ([source post](http://www.mobileread.com/forums/showpost.php?p=1868644&postcount=206)):

- `;dm` — dump messages into `/documents`
- `;dh` — dump the cvm heap
- `;dt` — dump the cvm stack
- `;shpm` — put the device into factory shipping mode
- `;urst` — reset the user partition. This deletes the contents of the hidden System directory, the Audible directory, and the Documents and tts directories. **Take a full backup before you use it.**
- `;debugOn` — turn verbose logging on
- `;debugPaint` — log the painting functions
- `;debugOff` — turn verbose logging off
- `;debugPref` — logging at pref level
- `;dP` — alias of `;debugPref`
- `;311` — change carrier settings
- `;411` — server information
- `;611` — WAN information
- `;711` — Wi-Fi information
- `;fc-cache` — refresh the fontconfig cache, then restart the framework
- `;setTime` — set the Kindle clock from the Unix clock
- `;st` — alias of `;setTime`. Format `yyyy-mm-dd HH:MM`, for example `;st 2012-07-22 17:59`
- `~ds` — never show the screensaver. The cost is that you cannot lock the Kindle until the next reboot. Rebooting brings the screensaver lock back. The wiki's hope is that everything is still fine when it does.

If the USBNetwork package is installed (see the [jailbreak chapter](/wiki/kindle/touch-jailbreak/) for how that package went on with the early jailbreak), two more shortcuts exist:

- `;usbnetwork` — toggle USB networking
- `;un` — alias of `;usbnetwork`

On firmware 5.0.0 the shortcuts live in `/usr/share/webkit-1.0/pillow/javascripts/debug_cmds.js`. On 5.0.3 they live in `/usr/share/webkit-1.0/pillow/debug_cmds.json`.

You can append entries in the same format. That is at your own risk. Adding `";kterm" : "/mnt/us/extensions/kterm/bin/kterm.sh"` (and a comma at the end of the line that used to be last) makes `;kterm` in the search bar start [Kterm](http://www.mobileread.com/forums/showthread.php?t=202794).

Any change to the framework, including this file, takes effect only after the framework restarts. Rebooting the device is one way to do that.

#### Search-bar shortcuts on the Kindle Paperwhite

The list above is the Kindle Touch. Below is an unabridged copy of `/usr/share/webkit-1.0/pillow/debug_cmds.json` from a Paperwhite on firmware 5.3.1. A stock device does not have a `/usr/local/bin/` directory, so many of these commands do nothing until something provides those scripts:

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

Three more commands were confirmed later ([source thread](http://www.mobileread.com/forums/showthread.php?p=2462298#post2462298)):

- `;ReadingTimeOff` — hide the reading-time estimate
- `;ReadingTimeOn` — show the reading-time estimate
- `;ReadingTimeReset` — reset the reading-time calculation

### Image viewer

**Firmware 5.1 only, with the hope that later builds would keep it.** It still works on a Paperwhite running 5.3.1.

Put images in `/mnt/us/images/`, then run:

```text
lipc-set-prop com.lab126.appmgrd start app://com.lab126.booklet.imageviewer
```

Or call the shell script directly:

```text
/usr/bin/imageViewer.sh
```

The easier path: install [Collections Manager](http://www.mobileread.com/forums/showthread.php?t=186305) and mark images as visible (they are hidden by default). Tapping an image then opens the image viewer.

### Screenshots

- **Kindle Touch:** hold the home button for 2 seconds, tap the screen, then keep holding home for another second or two.
- **Kindle Paperwhite:** press the top-right corner and the bottom-left corner at the same time ([source thread](http://www.mobileread.com/forums/showthread.php?p=2252433)).

Screenshots land in `/mnt/us/`, the root you see when the device is plugged into a computer over USB.

If you are logged in over USB networking, run `screenshot`, or use `fbgrab` (that one comes with USBNetwork).

### Forcing an update to install

The ordinary install is: plug the Kindle in as USB storage, copy the `update_*.bin` file to the root of the Kindle drive, eject, unplug, then on the device run Menu → Settings → Menu → Update Your Kindle.

If the package arrived some other way (for example you dropped it in `/mnt/us` while USB networking was up), the Kindle often does not notice, and "Update Your Kindle" stays grey. You can still force the install from the command line:

```text
lipc-set-prop com.lab126.ota startUpdate 1
```

The KUAL Helper extension has a button for this.

### Disabling the Wi-Fi connectivity check

By default, when the Kindle joins a wireless network it tries to prove it can reach the internet. That is a poor fit for an intranet or a captive public hotspot.

To disable the check, put a file named `WIFI_NO_NET_PROBE` on the USB user partition.

<a id="gcc-cross-toolchain"></a>

## GCC cross-toolchain

The source tarball Amazon publishes includes a Makefile that builds the same GCC cross-toolchain Amazon used.

One place it shows up is on the Source Code Notice page, inside [Kindle_src_5.3.7_2004410010.tar.gz](http://kindle.s3.amazonaws.com/Kindle_src_5.3.7_2004410010.tar.gz). The Makefile and the build notes (`BUILD_HOW-TO.txt`) are inside `build_linaro-gcc_4.5.4.tar.gz` in that source archive.

Some URLs in the Makefile are dead. This patch points them at the old-releases mirror:

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

`BUILD_HOW-TO.txt` lists texinfo 4.13a.dfsg.1-5ubuntu1 as a build dependency. Newer Linux distributions ship a newer texinfo, and the build of both `binutils` and `gcc` fails on it. An example of the failure is [Debian bug #697353](http://bugs.debian.org/697353).

The practical fix is to build [texinfo-4.13a.tar.gz](https://ftp.gnu.org/gnu/texinfo/texinfo-4.13a.tar.gz) yourself, put its binary directory on `$PATH`, export that, and only then build the toolchain.

Other options the wiki lists: try the patches attached to [bug #697353, message 32](http://bugs.debian.org/697353#32), [bug #704586, message 16](http://bugs.debian.org/704586#16), and [message 21](http://bugs.debian.org/704586#21). Those patches cover binutils only; gcc needs the same kind of change. Or build a newer binutils that already copes with current texinfo, such as binutils 2.24.

### Using Clang with Amazon's cross-toolchain

Amazon's cross-toolchain can drive Clang. The wiki's test was "Debian clang version 3.4-1 (tags/RELEASE_34/final) (based on LLVM 3.4)".

This wrapper shows the flags:

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

`--target` turns cross-compilation on. The `-m` flags select the KT's SoC (the hardware layout is in the [architecture chapter](/wiki/kindle/touch-internals/)). `--gcc-toolchain` is where the toolchain lives. `--sysroot` limits the header search. `-B` is where the assembler and linker binaries are looked up.

Compiling in C++11 mode with Clang needs the following patch on the toolchain. The fix comes from GCC 4.7.2, adjusted because the GCC 4.5.4 in Amazon's toolchain does not understand the `noexcept` keyword:

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

The toolchain's C++ standard library does not implement the whole of C++11, but the new syntax should be usable. This program compiles and runs (with `clang++ -std=c++11`):

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

Clang 3.4 with `-std=c++1y` also compiles this:

```cpp
#include <iostream>

auto fun() {
  return 1'000'000;
}

int main() {
  std::cout << fun() << std::endl;
}
```

## Notes on particular features

*On the wiki this chapter is a scratchpad of ideas, not a finished design. Judge for yourself whether any of it still applies.*

### Android

The note is Yifan's: he wanted Android running on the device. That would have meant the Nook Simple Touch's system as well, a usable UI onto the Barnes & Noble store, ePub reading, and a way to develop and run Android applications, slowly. The reference he points at for what a port takes, useful and already out of date when the wiki said so, is [AndroidPortingOnRealTarget](http://wiki.kldp.org/wiki.php/AndroidPortingOnRealTarget).

Amazon published the Touch kernel sources plus the related drivers and patches, so the note argues this should be less painful than porting Android onto a device that is not already Linux.

Freescale's i.MX50 development guide, [IMX50SDG.pdf](http://cache.freescale.com/files/32bit/doc/user_guide/IMX50SDG.pdf), includes a section on porting Android.

There is also the [i.MX Android Firmware Developers Manual (Very Good)](http://reviews.androids.name/2011/03/i-mx-android-firmware-developers-manual-very-good/). That link is dead. A mirror to try is [this one](http://blog.sina.com.cn/s/blog_72dcef220100yf9i.html).

Freescale also published Android demo images for the i.MX50: [IMX50_SW](http://www.freescale.com/webapp/sps/site/prod_summary.jsp?code=IMX50_SW).

### Collections

The question on the wiki was whether any usable tool existed for Kindle Touch collections. One person had a hack that builds collections from directories. The idea: a script walks what is already in `/mnt/us/documents/`, writes the JSON that inserts and updates collections, and hands the real work to `http://localhost:9101/change`. An extension for yifanlu's launcher that does this is [here](http://wiki.mobileread.com/w/images/1/18/CollectionSync.rar). Writing `/var/local/cc.db` directly might also work, and the risk is much higher.

**Later, better replacements:**

- [Collections Manager](http://www.mobileread.com/forums/showthread.php?t=186305)
- [A GUI Launcher extension that creates collections from Calibre](http://www.mobileread.com/forums/showthread.php?t=171132)

#### Collections on a device that is not registered

**Note:** the much simpler alternative is Collections Manager, mentioned above. It works when the device is not registered.

**Note 2:** [this thread](http://www.mobileread.com/forums/showthread.php?p=2509628&postcount=4) has an update package that "fake registers" the device, and the wiki says it was verified. Unpack it and follow the short instructions in `Readme_eng.txt`.

The description below is the long way. In short, you create `/var/local/java/prefs/reginfo` and put the XML from this section into it.

It keeps working **only if a network connection has never been turned on** on that Kindle.

- **Question:** what actually happens if you do turn networking on?
- **Answer:** `reginfo` is treated as invalid and deleted. With it goes the ability to manage collections through the normal firmware features.

Enter diagnostics mode by creating a file named `ENABLE_DIAGS` in the root directory, then reboot. In diagnostics mode, enable USB networking, bring the USB network up on the computer, SSH to 192.168.15.244, and log in as root. The password is `mario`. Run `vi /var/local/java/prefs/reginfo` and save the following:

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

Leave diagnostics mode and reboot. Collections are then enabled.

On a Linux computer, after USB networking is enabled on the Kindle, the host-side commands are as follows. As root:

```bash
modprobe cdc_ether  # if the module is not already loaded
ifconfig usb0 up
ifconfig usb0 192.168.15.201
ping 192.168.15.244  # confirm the link is up
```

Then as a normal user:

```bash
ssh root@192.168.15.244  # password mario when prompted
```

You are now on the Kindle, which is itself running Linux:

```bash
vi /var/local/java/prefs/reginfo
```

Vi is fussy. Press `i` for insert mode and type the XML above. Press `Esc` to leave insert mode, then `:wq` (write and quit) to save and exit.

```bash
exit  # log out
```

Take the Kindle out of diagnostics mode and reboot.

A Windows computer can do the same job, but SSH, and USB networking itself, need third-party software. On a Mac the terminal commands should be close to the Linux ones. The wiki's author was not sure about the `cdc_ether` kernel module there.

## Building a custom update package

This section is about making your own `update_*.bin`. If you only want to install a package someone else already built, use the [packages chapter](/wiki/kindle/touch-packages/).

The tool is [KindleTool](https://github.com/NiLuJe/KindleTool), which is a fork of yifan's original [KindleTool](https://github.com/yifanlu/KindleTool).

People who did K2 and K3 work will recognize it as the successor to the Python tool [kindle_update_tool.py](http://www.mobileread.com/forums/showthread.php?t=63225).

[This thread](http://www.mobileread.com/forums/showthread.php?t=187880) is where it lives on the forum.

KindleTool targets Unix-like systems and is not a sure thing as a native Windows program. It is easy to build on Linux and OS X, and on Windows it can be used through MinGW or Cygwin.

The notes below may lag the repo. When they disagree, read [COMPILING](https://github.com/NiLuJe/KindleTool/blob/master/COMPILING) in the repository.

**Building on Linux.**

On Gentoo, use [this portage overlay](https://github.com/NiLuJe/gentoo-kindletool), or drop the [ebuild](https://github.com/NiLuJe/gentoo-kindletool/blob/master/dev-util/kindletool/kindletool-9999.ebuild) into `dev-util/kindletool` in a local overlay.

On Arch Linux, use the AUR package [kindletool](https://aur.archlinux.org/packages/kindletool) or [kindletool-git](https://aur.archlinux.org/packages/kindletool-git).

1. Have a working toolchain (`gcc`, `make`, `autotools`, `libtool`, and the rest of that set).
2. Install `zlib-dev`, `nettle-dev`, and `libarchive-dev`.
3. Get the KindleTool source from [GitHub](https://github.com/NiLuJe/KindleTool), `cd` into it, and run `make`.
4. If gcc says libarchive is too old, build libarchive 3 yourself. Put the headers (`archive.h` and `archive_entry.h`) in `KindleTool/includes` and the static library (`libarchive.a`) in `KindleTool/lib`. Asking the distribution maintainer to update their libarchive package is also worth doing.

On a recent enough Debian-family system, steps 1 and 2 collapse to `sudo apt-get install build-essential nettle-dev zlib1g-dev libarchive-dev`.

**If you only want a binary:**

1. Download the newest [static build](http://www.mobileread.com/forums/showthread.php?t=187880) from the forum thread, for your architecture.
2. Unpack it and run it from a shell.

**Building on OS X.**

- Homebrew plus [this tap](https://github.com/NiLuJe/homebrew-kindletool).

The long way is also there: install nettle and libarchive with Homebrew, then build KindleTool with Xcode or with make.

**If you only want a binary:**

1. Download the newest [OS X static build](http://www.mobileread.com/forums/showthread.php?t=187880).
2. Unpack it and run it from Terminal.

**Building on Windows.**

1. Install [Cygwin](http://www.cygwin.com/).
2. Install a usable Cygwin toolchain: `gcc4`, `binutils`, `autoconf`, `automake`, `libtool`, `make`, and the related packages.
3. Install `libnettle4` / `libnettle-devel`, `zlib` / `zlib-devel`, `git`, `cmake`, `patch`, and `pkg-config`.
4. Build and install [libarchive](https://libarchive.github.com) 3.0.3 or newer. The wiki's author usually used a minimal build, configured as `--prefix=/usr --enable-static --enable-shared --disable-xattr --disable-acl --with-zlib --without-bz2lib --without-lzmadec --without-iconv --without-lzma --without-nettle --without-openssl --without-expat --without-xml2`.
5. Get the KindleTool source from [GitHub](https://github.com/NiLuJe/KindleTool), `cd` into it from a Cygwin shell, and run `make`. People who want a native binary can cross-compile one with the MinGW toolchain.

**If you only want a binary:**

1. Download the newest [MinGW static build](http://www.mobileread.com/forums/showthread.php?t=187880).
2. Unpack it and run it from a shell you like, or from `cmd.exe`. **Do not** run that build from a Cygwin shell.

If the native build misbehaves, try the Cygwin build:

1. Install [Cygwin](http://www.cygwin.com/).
2. Install the `libgcc1`, `libnettle4`, and `zlib0` packages.
3. Download the newest [Cygwin static build](http://www.mobileread.com/forums/showthread.php?t=187880).
4. Unpack it and run it from a Cygwin shell, **not** from the command prompt.

### Usage

Run the tool with no arguments for the full usage text. The [README](https://github.com/NiLuJe/KindleTool/blob/master/README.md) and the man page say the same things.

### Example

Suppose `run.sh` should run on the device and unpack `data.tar.gz` there.

1. Move every file into one directory, for example `~/kindle`.
2. `cd` into `~/kindle`.
3. Run the tool (assuming it is on `$PATH`): `kindletool create ota2 -d k5w -d k5g -d k5gb run.sh data.tar.gz update_custom_script.bin`

That produces an update package that runs on every Kindle Touch model the tool knew about.

For a longer example, read `build-updates.sh` inside [NiLuJe's hacks](http://www.mobileread.com/forums/showthread.php?t=88004).

### Limits

- A package built for Kindle 4.0 and newer (OTA V2) does not run on Kindle 3.X and older, and the other direction fails too.
- A package built for Kindle 3.X and older (OTA V1) can name only one device. Each device needs its own package.
- A package built for Kindle 4.0 and newer (OTA V2) can name several devices. Because of a bug in Amazon's implementation (it may have been deliberate), a package built for Kindle 4.0 does not run on Kindle 5.0, and a package built for Kindle 5.0 does not run on Kindle 4.0.
- Packages for Kindle 4.0 and newer (OTA V2) can carry a metadata string. Because of a bug in Amazon's implementation, a package that includes one does not run at all.
