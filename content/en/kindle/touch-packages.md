---
title: "Kindle Touch packages"
type: translated
original_title: "Kindle Touch Hacking"
source_url: https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking
original_author: "MobileRead Wiki contributors (NiLuJe, Eureka, DaleDe, Ricky23289, Eschwartz, Ixtab, and others)"
translated_at: "2026-11-11"
order: 4
description: "USB networking, KUAL and its extensions, localization, screensavers, custom fonts, and the other packages catalogued for a jailbroken Kindle Touch."
---

> This edition adapts the MobileRead Wiki page “Kindle Touch Hacking” (last revised 2021-07-28), rewritten for clarity. Commands and filenames follow that page. Forum links are citations only; this site does not reproduce forum posts.
>
> **Status, November 2026.** This chapter is Kindle Touch / early Paperwhite material. It is not a jailbreak or a package set for current Kindle firmware. In May 2026 Amazon ended download support for Kindle models from 2012 and earlier, including the Kindle Touch and the 5th-generation Paperwhite; those devices can still open files already stored on them ([BGR, 8 Nov 2026](https://www.bgr.com/2305569/how-to-check-if-your-old-kindle-gets-updates/)).

The wiki page *Kindle Touch Hacking* is one long article. It is split on this site into four chapters. This chapter is the package catalogue: what people installed after a jailbreak, and how those packages were configured. Versions and download links are the ones on the wiki at its 2021-07-28 revision. This site does not rehost the files. Where a project still publishes current builds, the project page is the place to check.

The other three chapters: [Jailbreak, unbrick, and backup](/wiki/kindle/touch-jailbreak/), [Architecture and low-level access](/wiki/kindle/touch-internals/), and [Development](/wiki/kindle/touch-development/). The later factory-firmware procedure for PW2 and newer models of that era is [Kindle 5.x software jailbreak](/wiki/kindle/jailbreak/).

Unless a section says otherwise, install a package by copying its **update file** (the usual name is `update_<package>_<version>_install.bin`) onto the device, then choosing **Settings → Menu → Update Your Kindle**. Most packages installed that way also ship an uninstaller.

## USB networking

This is the package the wiki treats as the basic useful one, because it is how you SSH to the Kindle.

- The device has to be [jailbroken](/wiki/kindle/touch-jailbreak/) first.
- Download usbnet from [this thread](http://www.mobileread.com/forums/showthread.php?t=186645). Unpack it and move the matching update.bin into the `mrpackages` folder at the root of the device (`/mrpackages`).
- Install it from KUAL+, using "Install MR Packages" in the Helper menu.
- Type `;un` into the menu search box to toggle USB networking on and off.
- On the PC, turn on the NDIS USB network. The wiki points at [NDIS driver setup on pc](https://wiki.mobileread.com/wiki/NDIS_driver_setup_on_pc).
- With the default settings, the Kindle's address is `192.168.15.244`.

Connecting:

- From Linux: `ifconfig usb0 192.168.15.201 && ssh root@192.168.15.244`
- From Windows:
  - You need a remote terminal program. The two the wiki names are PuTTY and WinSCP.
  - Plug the Kindle in and wait until Windows sees it.
  - Then open Control Panel → Network and Internet → Network and Sharing Center → Change adapter settings. Find the "Local Area Connection" whose subtitle reads "Unidentified Network, RNDIS/Ethernet Gadget". Right-click it, open Properties, select Internet Protocol Version 4 (TCP/IPv4), open Properties, choose "Use the following IP address", enter IP address `192.168.15.201` and subnet mask `255.255.255.0`, and confirm twice. If the RNDIS adapter is missing, the wiki says to look at the original page's discussion.
  - Open the terminal program and connect to `192.168.15.244` as `root`. Leave the password empty. If that is refused, try `mario`.
- From FreeBSD:
  - Plug the Kindle in and get the device name with `usbconfig | grep -i linux`. It looks like `ugen0.5`.
  - Apply the config: `usbconfig -d ugen0.5 set_config 1`.
  - Set the address: `ifconfig ue0 192.168.15.201`.
  - To set the address on boot, add this line to `/etc/rc.conf`: `ifconfig_ue0="inet 192.168.15.201 netmask 255.255.255.0"`.
  - To run `set_config` on insert, read idVendor and idProduct with `usbconfig -d ugen0.5 dump_device_desc`.
  - Create `/usr/local/etc/devd/kindle.conf` and put the vendor and product you just read into it. The wiki's sample is:

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

- From Linux with NetworkManager (tested on Ubuntu 18.04.1):
  - Open network settings.
  - Open the "USB Ethernet" settings.
  - Optional: on the "Identity" tab, change "Name" to something that reminds you this connection is the Kindle.
  - On the "IPv4" tab:
    - Set "IPv4 Method" to "Manual".
    - Under "Addresses", set "Address" to `192.168.15.201` and "Netmask" to `255.255.255.0`.
  - Click "Apply".
  - Disable the connection and enable it again so the change takes effect.

### USB networking on every boot

Once the settings work, drop an empty file named `auto` into `/mnt/us/usbnet`. The Kindle switches to usbnet early in boot. On a Touch that is during the "boy under the tree" splash with no text and no progress bar. On a Paperwhite it is during the "boy under the tree" splash that has the spinning animation. To see the exact moment, also drop an empty file named `verbose` into `/mnt/us/usbnet`. [That hack](http://hackswiki.com) then prints milestones, such as when sshd comes up, along the bottom of the screen.

Booting while the USB cable is already plugged in can do unpredictable things. Leave the Kindle unplugged until you have confirmed it has switched to usbnet.

### Stop NetworkManager from taking the device over

If you are not hitting the problem in this section, skip the fix.

On some systems the Kindle gets a new random MAC address every time it connects in USB-network mode, so NetworkManager never recognizes it as the same device. A udev rule can pin a MAC address, which is what you need before NetworkManager will treat the Kindle as unmanaged. The same script can set the IP address.

Create `/etc/udev/rules.d/90-local.rules` with:

```ini
ACTION=="add", KERNEL=="usb0", ATTRS{manufacturer}=="Linux 2.6.31-rt11-lab126 with fsl-usb2-udc", RUN+="/etc/udev/scripts/kindle"
```

Create `/etc/udev/scripts/kindle` with this script:

```bash
#!/bin/bash
ifconfig usb0 down
ifconfig usb0 hw ether 48:b3:35:3e:96:9b
ifconfig usb0 192.168.15.201
ifconfig usb0 up
```

Make it executable and reload the udev rules:

```bash
sudo chmod +x /etc/udev/scripts/kindle
sudo udevadm control --reload
```

Then add these lines to `/etc/NetworkManager/NetworkManager.conf`:

```ini
[keyfile]
unmanaged-devices=mac:48:b3:35:3e:96:9b
```

### Useful SSH commands

- Full rescan:

  `lipc-set-prop -- com.lab126.scanner doFullScan 1`

  ([source thread](http://www.mobileread.com/forums/showthread.php?p=2071182#post2071182))

- Refresh the index:

  `dbus-send --system /default com.lab126.powerd.resuming int32:1`

  **Mixing this command with Alt-Z can create duplicate entries. Use this command on its own.** New documents also may not sort to the front; sorting by title finds them.

  ([source post](http://www.mobileread.com/forums/showpost.php?p=1181285&postcount=8))

## SSH over Wi-Fi

SSH on Wi-Fi is off by default. To turn it on, set `USE_WIFI` to `true` in `/mnt/us/usbnet/etc/config`.

If you want SSH on Wi-Fi and do not want the switch into USB ethernet mode, set `USE_WIFI_SSHD_ONLY` to `true`.

### Finding the Kindle Touch Wi-Fi address

Open the network diagnostics page with the [search-bar shortcut](/wiki/kindle/touch-development/#search-bar-shortcuts) `;711`. The address is on that page. The wiki's own anchor for the same shortcut list is [Search Bar Shortcuts](https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking#Search_Bar_Shortcuts).

## Mounting with sshfs

Once SSH works, `sshfs` can mount the Kindle's filesystem on the computer.

- Mount the Kindle root on a local directory named `kindle`: `sshfs root@192.168.15.244:/ kindle/`
- The same mount, read-only: `sshfs -o ro root@192.168.15.244:/ kindle/`
- Unmount: `fusermount -u kindle/`

Change the address and the directory to match your setup.

On Windows, [WinSCP](http://winscp.net) is what the wiki names for browsing the Kindle filesystem.

## Extra command-line tools: Extend

The wiki folds this whole section and says the tool has gone a long time without updates. The recommended approach there is to pull packages from Debian armel instead. The notes below are the historical write-up, kept in full.

**What it was.** Extend adds Linux programs through optware. It mounts a prepared 512 MB image that already contains `openssh`, `nano`, `screen`, `irssi`, `php`, `bash`, `rsync`, and similar programs, built with the optware toolchain. Packages are managed with `/opt/bin/ipkg`, so you do not cross-compile them yourself.

- [Forum thread](http://www.mobileread.com/forums/showthread.php?t=161704)
- [Download](http://gitbrew.org/~dasmoover/kindle/touch/packages/kindle_extend-1.1.zip) / [mirror](http://ge.tt/9Qoa9YD/v/2)
- Install instructions are inside the archive.
- The package can tie into the GUI launcher (next section). The original thread's second screenshot shows that.

### A smaller optware.img

The optware.img in that archive is 500 MB, and only about 55 MB of it is used, so about 445 MB is empty space that still occupies Kindle storage.

- Drop-in replacements at 60 MB and 100 MB are [here](http://ge.tt/9Qoa9YD/v). The idea comes from [this post](http://www.mobileread.com/forums/showpost.php?p=1894205&postcount=9).
- Growing the image later is straightforward; see [this post](http://www.mobileread.com/forums/showpost.php?p=1894437&postcount=10).

### When /opt/bin/ipkg insists the root filesystem be writable

Packages from ipkg install entirely under `/opt`, but **running** `/opt/bin/ipkg` can still fail like this:

```text
 [root@kindle ipkg]# /opt/bin/ipkg list
 ipkg_conf_init: Failed to create temporary directory `(null)': Read-only file system
```

The cause and the fix are in [this thread](http://www.mobileread.com/forums/showthread.php?p=2011956#post2011956).

### Turning extend on automatically

By default extend does not mount itself, and the new programs have to be called from `/opt/bin` by path. The files below are the original author's own setup, showing how far that can be automated. Create or edit them to match what you want.

`/etc/upstart/extend.conf`:

```ini
start on mounted_userstore
task
script
	source /mnt/us/extend/upstart.sh
end script
```

`/mnt/us/extend/upstart.sh`:

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

`/mnt/us/extend/.profile`:

```bash
export PATH=$PATH:/opt/bin
```

## App launchers

These programs exist to start other programs. The wiki also has a separate [GUI Launcher](https://wiki.mobileread.com/wiki/GUI_Launcher) page.

### Kindle Unified Applications Launcher (KUAL)

This [kindlet](http://www.mobileread.com/forums/showthread.php?t=203326) replaced the GUI Launcher, which is obsolete and does not run anymore. KUAL does not add items to the home menu or the reading menu. It shows applications as named buttons, paged inside the kindlet. Developers who had already hooked the GUI Launcher menu did not lose that work: the launcher picks those applications up. Unlike the other launchers of that period, KUAL supports the Kindle 2, 2i, DX, 3, 4, 5, and PW, and it was maintained so people could keep using the features they had chosen from a simple graphical screen. Install and use are described in the MobileRead thread.

### GUI Launcher (Yifan Lu)

The wiki folds this section and marks it replaced by KUAL. The description is kept here as history.

This **obsolete** mod added a menu item on the home screen and in the reader. Other mods could attach to that menu, so their features were reachable from the GUI. It supports only Kindle Touch firmware 5.0.0 through 5.1.2. It was replaced by the [Kindle Unified Applications Launcher](http://www.mobileread.com/forums/showthread.php?t=203326), which covers every Kindle of that line. On those old Touch firmware builds the GUI Launcher still runs. What it looked like:

Home menu: [KT_Launcher.png](https://wiki.mobileread.com/wiki/File:KT_Launcher.png). Submenu: [KT_Launcher_Apps.png](https://wiki.mobileread.com/wiki/File:KT_Launcher_Apps.png).

- [Version 1.0.0](http://www.mobileread.com/forums/showthread.php?t=161263) (**firmware 5.0.0 through 5.0.4 only**). The first post has the download, the source, and notes for developers.
- Documentation: [http://yifanlu.github.com/KindleLauncher/](http://yifanlu.github.com/KindleLauncher/)
- [Update v1.2.2](http://www.mobileread.com/forums/showthread.php?p=2166150#post2166150) (**firmware 5.1.0 through 5.1.2 only**. PW owners: **no**, it does not run on the PW). Use the [Kindle Unified Applications Launcher](http://www.mobileread.com/forums/showthread.php?t=203326) instead. If you want every screen rotation, the wiki strongly suggests installing [JBPatch](http://www.mobileread.com/forums/showthread.php?t=175512) as well, and only the patch build that matches your firmware.
- **Install.** The wiki says the "end user" docs for the GUI Launcher are poor, both in the thread and in the README. The steps themselves are the ordinary Kindle update flow, so the page spells them out:
  1. Connect the Kindle to the computer.
  2. Copy `update_launcher_*_install.bin` straight to the Kindle root. Do not put it in documents or any other folder.
  3. Eject the Kindle disk safely.
  4. On the Kindle, choose Menu → Settings, then Menu → Update Your Kindle.

### Extensions for the launchers

These mods add features on top of Yifan Lu's GUI Launcher or the Kindle Unified Applications Launcher.

#### Terminal emulator

Kindle Touch 5.3.2, Kindle Touch 5.1.2, and Paperwhite (every version the wiki lists) can use [KTERM](http://www.fabiszewski.net/kindle-terminal/) for a terminal.

Firmware 5.1.2 and older can also use [xterm](http://www.mobileread.com/forums/showthread.php?t=179286). **xterm is no longer maintained, and there will be no further updates.**

#### Folder Toggle

[Project page](http://ebookjuggler.com/kindle/folder-and-book-hider/)

Hides or shows a subset of the library. Each profile's config file can list the directories to toggle. The wiki describes it as still in development and moving along. Download the zip attached to the thread and follow its README.

The project started at [http://www.mobileread.com/forums/showthread.php?t=164259](http://www.mobileread.com/forums/showthread.php?t=164259). It does not support KUAL; see [this reply](http://www.mobileread.com/forums/showpost.php?p=2414240&postcount=6).

#### SSModeSwitcher

[Forum thread](http://www.mobileread.com/forums/showthread.php?t=170080)

Switches the screensaver among four profiles: default, screen lock, and two custom modes.

This extension is obsolete. It runs only on a narrow set of early Touch firmware, and it does not support KUAL. **Touch firmware below 5.3.2 only.**

#### CollectionSync

[CollectionSync.zip](https://wiki.mobileread.com/wiki/Special:FilePath/CollectionSync.zip) is an extension for yifanlu's launcher. It builds collections from the content currently on the device.

#### Enterprise WPA

From firmware 5.1, the Kindle Touch supports enterprise WPA out of the box.

Firmware 5.0.0 through 5.0.4 does not, even though the underlying wpa_supplicant does. A launcher extension in [this thread](http://www.mobileread.com/forums/showthread.php?t=168750) covers that gap. You configure the network by hand. Once it is configured, connecting is one action.

The same extension also covers other connection types: [WPA-PSK](http://www.mobileread.com/forums/showthread.php?p=1984928#post1984928) and [WEP](http://www.mobileread.com/forums/showthread.php?p=1994910#post1994910).

#### HackedUpReader / CoolReader 3

HackedUpReader is the CoolReader 3 port for the Kindle Touch. The custom reader opens mobi, epub, fb2, txt, rtf, html, and pdb.

Install: unpack [HackedUpReader-0.1.2-varnie.tar.gz](https://github.com/downloads/varnie/HackedUpReader/HackedUpReader-0.1.2-varnie.tar.gz) (the better build, maintained by user Varnie) into a `cr3xcb` folder under `/mnt/us/` (the USB-visible root). Then unpack [HackedUpReaderLauncher](https://github.com/varnie/HackedUpReaderLauncher/zipball/master) into the extensions folder.

Original thread: [http://www.mobileread.com/forums/showthread.php?t=170436](http://www.mobileread.com/forums/showthread.php?t=170436)

#### Gnash

The GNU Flash player, open source, ported to the K5 (Kindle 5 / Touch).

The main thread is [here](http://www.mobileread.com/forums/showthread.php?t=194451).

GUI Launcher / Kindle Unified Applications Launcher build: [download](https://dl.dropbox.com/s/vzrx5tyhrqwxbcp/gnash-0.2.zip?dl=1)

The author's extra notes are [here](http://www.fabiszewski.net/kindle-flash/).

It ships an extra SWF alarm clock, the R-SIN ALARM clock.

Game download: Hexxagon's [hexxagon.swf](http://goo.gl/qVG6B).

KUAL is supported. The KUAL note is [here](http://www.mobileread.com/forums/showpost.php?p=2414603&postcount=12).

#### GUI Launcher Reboot

A reboot item that is easier to reach: [http://goo.gl/Nn4aH](http://goo.gl/Nn4aH)

The KUAL note is [here](http://www.mobileread.com/forums/showpost.php?p=2415044&postcount=5). **Not supported.**

#### gtksudoku

A native Kindle application written with gtk. It is a simple sudoku game, available from [http://www.mobileread.com/forums/showthread.php?t=188997](http://www.mobileread.com/forums/showthread.php?t=188997). It does not support the Kindle Unified Applications Launcher on most firmware. Specifically, it locks up a KT on 5.3.2 and a Paperwhite. It is known to work on KT 5.1.2.

The KUAL note is [here](http://www.mobileread.com/forums/showpost.php?p=2415041&postcount=19).

#### gtkMines

A native Kindle application written with gtk. It is a simple minesweeper game, available from [http://www.mobileread.com/forums/showthread.php?p=2198434](http://www.mobileread.com/forums/showthread.php?p=2198434). It supports the Kindle Unified Applications Launcher.

#### Komic

A Kindle comic reader: an html/js application for reading comics on the Kindle Touch. Available from [http://www.mobileread.com/forums/showthread.php?t=182183](http://www.mobileread.com/forums/showthread.php?t=182183).

It supports the Kindle Unified Applications Launcher. The KUAL note is [here](http://www.mobileread.com/forums/showpost.php?p=2414622&postcount=14).

#### pbchess — chess for the Kindle 2, 3, DX, 4, Kindle Touch, and Kindle Paperwhite

Commercial software. KUAL is supported.

pbchess is a chess training program. With it you can:

1. Solve chess problems (problem and endgame sets, of which there are many on the web).
2. Load and replay annotated PGN, study a game, and try variations.
3. Study openings and endgames.
4. Play, using six of the best-known free chess engines bundled with the program.

Demo videos recorded on a Kindle Touch: [https://www.youtube.com/playlist?list=PLB130D9CACB03C720&feature=view_all](https://www.youtube.com/playlist?list=PLB130D9CACB03C720&feature=view_all)

The KT build is at [http://pbchess.vlasovsoft.net/en/index.html](http://pbchess.vlasovsoft.net/en/index.html).

The KT build includes three extra games: Sokoban, Othello/Reversi, and Checkers.

#### Sokoban

An extra game shipped with pbchess. It has to be installed together with pbchess. The KT build of [Sokoban](https://wiki.mobileread.com/wiki/Sokoban) is at [http://pbchess.vlasovsoft.net/en](http://pbchess.vlasovsoft.net/en).

#### Checkers

An extra game shipped with pbchess. It has to be installed together with pbchess. The KT build of [Checkers](https://wiki.mobileread.com/wiki/Checkers) is at [http://pbchess.vlasovsoft.net/en](http://pbchess.vlasovsoft.net/en).

#### Othello / Reversi

An extra game shipped with pbchess. It has to be installed together with pbchess. The KT build of [Othello](https://wiki.mobileread.com/wiki/Othello) is at [http://pbchess.vlasovsoft.net/en](http://pbchess.vlasovsoft.net/en).

#### Eboard chess

A chess program with several engines (Crafty, GNU Chess, Stockfish, and Sjeng). It can also play over the network, either on a chess server or directly against another eboard user.

The KT build is at [http://www.fabiszewski.net/kindle-chess/](http://www.fabiszewski.net/kindle-chess/).

It supports the Kindle Unified Applications Launcher. The KUAL note is [here](http://www.mobileread.com/forums/showpost.php?p=2414040&postcount=10).

#### Audio recorder and player

A very small extension. It records from the built-in microphone and plays back the latest recording. [http://www.mobileread.com/forums/showthread.php?t=167172](http://www.mobileread.com/forums/showthread.php?t=167172)

The KUAL note is [here](http://www.mobileread.com/forums/showpost.php?p=2415251&postcount=6).

#### Sudoku for the Kindle Touch

If you have used ksudoku, the on-screen keyboard popping up for every digit gets old quickly. This sudoku game does not need that keyboard. [http://www.mobileread.com/forums/showthread.php?p=2097654#post2097654](http://www.mobileread.com/forums/showthread.php?p=2097654#post2097654)

Direct download: [http://www.filefactory.com/file/27x130nsxejd/n/ksudoku2_rar](http://www.filefactory.com/file/27x130nsxejd/n/ksudoku2_rar)

Or [from MobileRead](http://www.mobileread.com/forums/attachment.php?attachmentid=100251&d=1359425966).

Touch firmware below 5.3.2 only. KUAL compatibility was not tested.

#### Running Tcl/Tk applications with eTcl: a calculator

With eTcl and a launcher you can build and run [Tcl/Tk](https://wiki.mobileread.com/wiki/Tcl) applications. One example is a simple calculator.

Install eTcl first, from [http://www.evolane.com/download/etcl/linux/etcl-1.0.1-linux-arm.tar.gz](http://www.evolane.com/download/etcl/linux/etcl-1.0.1-linux-arm.tar.gz). On a PW2 running 5.4.2, eTcl appears not to work: the binary exits with "Illegal instruction".

A direct MobileRead download is [here](http://www.mobileread.com/forums/attachment.php?attachmentid=100256&d=1359425990). Unpack it to `/mnt/us`.

Download the calculator zip from [http://www.mediafire.com/download.php?4cwur5266ti6bzi](http://www.mediafire.com/download.php?4cwur5266ti6bzi) and unpack it into the extension directory.

The calculator is easy to change if you need a particular math function.

Every eTcl example below needs that same [eTcl download](http://www.mobileread.com/forums/attachment.php?attachmentid=100256&d=1359425990).

#### eTcl: Attax

The same steps as the calculator also get you Attax ([http://en.wikipedia.org/wiki/Ataxx](http://en.wikipedia.org/wiki/Ataxx)).

Download the game from [http://www.mediafire.com/download.php?17ezhmaxkdabz2d](http://www.mediafire.com/download.php?17ezhmaxkdabz2d) and put it in the extension directory.

A direct MobileRead download is [here](http://www.mobileread.com/forums/attachment.php?attachmentid=100252&d=1359425966).

#### eTcl: Gems

Another Tcl/Tk game on eTcl is Gems (Bejeweled). Download and unpack eTcl as in the calculator section.

Download the game from [http://www.mediafire.com/download.php?fklx91ku29bbw2l](http://www.mediafire.com/download.php?fklx91ku29bbw2l) and put it in the extension directory.

Or take it straight from MobileRead: [here](http://www.mobileread.com/forums/attachment.php?attachmentid=100254&d=1359425966).

#### eTcl: 3DMaze

Another Tcl/Tk game on eTcl is a 3D maze. Download and unpack eTcl as in the calculator section.

Download 3DMaze from [http://www.mediafire.com/?773gn53xq5i7pfb](http://www.mediafire.com/?773gn53xq5i7pfb) and put it in the extension directory.

A direct MobileRead download is [here](http://www.mobileread.com/forums/attachment.php?attachmentid=100255&d=1359425966).

#### Leafpad

A port of the basic text editor Leafpad. Download the archive and unpack it into the extension directory.

[http://www.fabiszewski.net/kindle-notepad/](http://www.fabiszewski.net/kindle-notepad/)

The KUAL note is [here](http://www.mobileread.com/forums/showpost.php?p=2414040&postcount=11).

#### Skipstone

An alternate GTK+ browser that uses the WebKit rendering engine.

Download Skipstone from [http://www.fabiszewski.net/kindle-browser/](http://www.fabiszewski.net/kindle-browser/) and put it in the extension directory. It supports the Kindle Unified Applications Launcher. The KUAL note is [here](http://www.mobileread.com/forums/showpost.php?p=2414040&postcount=8).

#### KOReader

[KOReader](/wiki/software/koreader/) (project home: [https://github.com/koreader/koreader/wiki](https://github.com/koreader/koreader/wiki)) is a document viewer for Linux e-readers. The formats named on the wiki page are PDF, DjVu, XPS, CBZ, FB2, TXT, HTML, RTF, CHM, EPUB, DOC, MOBI, and ZIP.

It works with KUAL. The wiki calls out PDF reflow, screen rotation, and many other features.

Install notes: [https://github.com/koreader/koreader/wiki/KOReader-User-Guide](https://github.com/koreader/koreader/wiki/KOReader-User-Guide)

## Localization

Language packs are in [this thread](http://www.mobileread.com/forums/showthread.php?t=162654).

### Text-to-speech (TTS)

Instructions are in [this reply](http://www.mobileread.com/forums/showpost.php?p=1906533&postcount=15). The reply itself only calls out German, but the links there include many other languages, and the steps are the same.

**Firmware 5.1.0 and newer:** TTS is disabled for books that are not English. To turn it on, install [jbpatch](http://www.mobileread.com/forums/showthread.php?t=175512) and confirm the TTS patch is loaded.

### 24-hour clock

To change the top-bar clock from 12-hour to 24-hour, replace the contents of `/var/local/system/locale`:

```ini
LANG=en_US.utf8
LC_ALL=en_US.utf8
```

with:

```ini
LANG=en_GB.utf8
LC_ALL=en_GB.utf8
```

Then reboot.

This can be done without a jailbreak. Build a `data.tar.gz` that contains a file at the absolute path `/var/local/system/locale`, with those two lines in it.

Another route that does not need a jailbreak is on [this page](http://www.mobileread.com/forums/showthread.php?t=167639).

On firmware 5.1, switching the language in Settings from English US to English GB has the same effect.

### Setting the time zone

By default the Kindle shows UTC. If you are somewhere else:

1. Mount the root filesystem read-write: `mntroot rw`
2. Move to a scratch directory: `cd /tmp`
3. Fetch current TZ data from [http://www.iana.org/time-zones](http://www.iana.org/time-zones). The Kindle has to be on Wi-Fi. If it is not, copy the TZ data file to `/mnt/us`, which is the partition Windows and Linux can see. The tarball the wiki names is:

   ```bash
   wget http://www.iana.org/time-zones/repository/releases/tzdata2014j.tar.gz
   ```

   That filename is the 2014 release printed on the wiki page. Newer releases live in the same IANA directory; if you use one, the rest of the steps stay the same and the filename in the next command changes with it.

4. Unpack it: `tar xzvf tzdata2014j.tar.gz`
5. Copy the index files into the Kindle's zoneinfo tree, replacing what is there:

   ```bash
   cp zone.tab /usr/share/zoneinfo/zone.tab
   cp iso3166.tab /usr/share/zoneinfo/iso3166.tab
   ```

6. Copy the region file you need (or copy all of them): `cp europe /usr/share/zoneinfo/europe`
7. Compile that region:

   ```bash
   cd /usr/share/zoneinfo/
   zic europe
   ```

8. Link the zone you want to `/etc/localtime`: `zic -l Europe/Berlin`

The new zone is in effect immediately. `date` shows it. The Kindle's graphical clock shows the new time after a reboot.

Amazon's own `settz` and `setdate` scripts are worth a look as well.

## VNC server

A VNC server can run on the Kindle Touch. A VNC client on the computer then reaches it over Wi-Fi or over usbnetwork.

Over Wi-Fi:

1. Install the package from [this thread](http://www.mobileread.com/forums/showthread.php?t=175297).
2. Install a VNC client on the computer. The wiki names [TightVNC](http://www.tightvnc.com/), which is small. The client and the Kindle have to be on the same Wi-Fi network.
3. Turn Wi-Fi on on the Kindle.
4. Type `;711` into the Kindle search bar and press enter.
5. Note the IP address listed under the "4-Interface" section.
6. Point the VNC client at that IP, port 5900 (IP::5900).

To stop the VNC server without uninstalling it, rename or delete `/mnt/us/vnc/ENABLE_VNC`, then reboot the Kindle.

## Screen savers

On **non-ad** (not Special Offers) models, the screensaver can be your own pictures, including the cover of the book you opened most recently.

### The easy way

The long-standing ScreenSavers hack was ported to the K5 (Touch / Paperwhite), so the wiki's advice is to [start there](http://www.mobileread.com/forums/showthread.php?t=195474).

One of its features is using the cover of the book you last opened as the current screensaver.

If the device is subscribed to **Special Offers**, unsubscribe first. That can be before or after you install the hack. If you cannot unsubscribe because you are outside the United States, the wiki says to try Kindle customer service.

The next two subsections are folded on the wiki and marked as history. They are kept here.

### The old method (the 5.0 era)

Yifan's [custom screensaver](http://yifan.lu/p/custom-screensaver/) worked by installing a custom blanket module. The wiki calls it a clean approach, and it only runs on **firmware 5.0**.

### Another approach

On **Special Offers** models, the same pieces can still put your own pictures on the screensaver, once Special Offers is disabled. The wiki lists several ways and notes that some of them are more questionable than others:

- Pay the 20 dollar fee to unsubscribe from Special Offers, from the "Manage Your Kindle" page in the United States.
- Use [JBPatch](https://wiki.mobileread.com/wiki/JBPatch).
- Use the Ads Toggler extension for the GUI launcher.

If you are in a country where the ads are useless to you, the wiki also says Amazon's own support has been reasonable when people simply ask.

## Custom fonts

### Firmware 5.1 / 5.2

The fonts the Kindle Touch uses can be replaced with [this hack](http://www.mobileread.com/forums/showthread.php?t=168765).

Read the README inside the **fonthack** directory, and keep an eye on [that thread](http://www.mobileread.com/forums/showthread.php?t=168765) for later changes.

Prepacked companion fonts, alphabetical:

- [Antiqua](http://www.mobileread.com/forums/showthread.php?p=2004341#post2004341)
- [Averia](http://ge.tt/3ZRY9XE/v/0)
- [Bodoni](http://www.mobileread.com/forums/showthread.php?p=2004341#post2004341)
- [DejaVu Serif / Serif Condensed / Sans Condensed / Sans Mono](http://www.mobileread.com/forums/showpost.php?p=1991905&postcount=99)
- [Fertigo Pro](http://ge.tt/3ZRY9XE/v/8)
- [Garamond](http://www.mobileread.com/forums/showpost.php?p=2004558&postcount=136)
- [Georgia2](http://www.mobileread.com/forums/showpost.php?p=1998757&postcount=115)
- [Museo](http://ge.tt/3ZRY9XE/v/9)
- [Palatino](http://www.mobileread.com/forums/showpost.php?p=2021064&postcount=168)
- [Segoe](http://www.mobileread.com/forums/showpost.php?p=2021064&postcount=168)
- [Times Roman](http://www.mobileread.com/forums/showpost.php?p=1999191&postcount=118)
- [Trebuchet](http://www.mobileread.com/forums/showpost.php?p=2021064&postcount=168)
- [Ubuntu / Ubuntu Mono](http://ge.tt/3ZRY9XE/v/5)
- [Verdana](http://www.mobileread.com/forums/showpost.php?p=2021064&postcount=168)

There is also a [font pack made for the K3](http://www.mobileread.com/forums/showpost.php?p=1690437&postcount=1) ([mirror](http://www.orangetype.com/kindle/)). It contains Bembo, Constantia, Droid Serif, Georgia, Georgia2, ITC New Baskerville, Linux Biolinum, Linux Libertine, Miller Serif, Minion Pro, Palatino, and Times New Roman. **Those files use a different naming scheme.** Rename them to the names FontHack expects before you use them.

### Paperwhite / firmware 5.3.x and newer

A less friendly route, because of limits built into the newer firmware, is [this Font Hack](http://www.mobileread.com/forums/showthread.php?t=219405).

## Managing collections

[Collections Manager](http://www.mobileread.com/forums/showthread.php?p=2165923#post2165923) is an application rather than a hack. It manages collections with more flexibility than the Kindle's own UI.

## KindCalc

[KindCalc](http://www.mobileread.com/forums/showthread.php?p=2147271#post2147271) is a calculator application.

## System!k Extensions

[System!k Extensions](http://www.mobileread.com/forums/showpost.php?p=2247130&postcount=7) is built on the WAF framework and opens a short path to features the stock UI hides:

- Run an install item that the UI is showing as greyed out.
- A button to block or allow the screensaver.
- Show and hide a custom cursor, with an installer and an uninstaller.
- The 711 and 411 device-info pages.

## Other binaries

- [mplayer, mcabber, elinks, screen, tmux, ettercap, vim, strace, mlocate, the tintin++ MUD client, ffmpeg, wget](http://www.fabiszewski.net/kindle-xterm/). They are listed toward the bottom of that page.
- [bftpd](http://www.mobileread.com/forums/showthread.php?p=2003367#post2003367)
