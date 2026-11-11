---
title: "Kindle Touch jailbreak, unbrick, and backup"
type: translated
original_title: "Kindle Touch Hacking"
source_url: https://wiki.mobileread.com/wiki/Kindle_Touch_Hacking
original_author: "MobileRead Wiki contributors (NiLuJe, Eureka, DaleDe, Eschwartz, Ixtab, and others)"
translated_at: "2026-11-11"
order: 2
description: "Historical jailbreak notes for the Kindle Touch and early Paperwhite, plus leaving diagnostics mode, rebooting, unbricking, and taking partition backups."
---

> This edition adapts the MobileRead Wiki page, rewritten for clarity. Commands and filenames follow that page. Forum links are citations only; this site does not reproduce forum posts.
>
> **Status, November 2026.** These chapters are the Kindle Touch / early Paperwhite material (wiki page last revised 2021-07-28). They are not a jailbreak for current Kindle firmware. In May 2026 Amazon ended download support for Kindle models from 2012 and earlier, including the Kindle Touch and the 5th-generation Paperwhite; those devices can still open files already stored on them ([BGR, 8 Nov 2026](https://www.bgr.com/2305569/how-to-check-if-your-old-kindle-gets-updates/)).

The wiki page *Kindle Touch Hacking* is one long article. This site splits it into four chapters. This chapter is the jailbreak, leaving diagnostics mode, rebooting, unbricking, and backup.

The other three: [Development](/wiki/kindle/touch-development/), [Packages](/wiki/kindle/touch-packages/), and [Architecture and low-level access](/wiki/kindle/touch-internals/). Download links below are the ones printed on the wiki page. This site does not rehost the files.

The point of the original page was to gather, in one place, the material from the [Kindle Developer's Corner](https://www.mobileread.com/forums/forumdisplay.php?f=150) about the [Kindle Touch](https://wiki.mobileread.com/wiki/Kindle_Touch) (KT) and the [Kindle Paperwhite](https://wiki.mobileread.com/wiki/Kindle_paperwhite) (PW): jailbreaking, changing the device, and developing for it. The wiki treated the page as unfinished and invited readers to add anything useful that was still missing. What follows stops at that 2021 revision.

> **The wiki's own warning, kept here because it is the point of the page:** this is not a cookbook, and it does not contain recipes you can copy without thinking.
>
> It describes a complicated device. If you run a procedure below, especially one of the more technical ones, you should already have a rough idea of what you are doing and be able to say what you expect to happen. If you cannot say what will happen, you do not know what you are doing. In that case, leave the device alone.

Before any of the procedures:

- **After a jailbreak actually succeeds, one of the first things to do is back the device up.** The backup section is below. The wiki's advice is that you will be glad you did it.
- **Set the clock.** The time and date on the Kindle need to be right. Joining a Wi-Fi network is the easy way. Update packages can fail when the clock is wrong.

## K5 index

An index of important K5 posts, replies, and off-site notes lives on the [K5 index](https://wiki.mobileread.com/wiki/K5_Index).

## Jailbreak

A jailbreak, by itself, does not unlock much. What it installs is an extra developer key. With that key present, the Kindle's own update mechanism will accept additional packages.

### The general method, as the wiki stated it

[This thread](https://www.mobileread.com/forums/showthread.php?t=186645) is where the wiki points for a jailbreak that covers **some** Kindle Touch firmware **and** Paperwhite / Paperwhite 2 firmware from 5.0.0 through 5.4.4.2.

PW2 owners who are on 5.4.5 through the builds just short of 5.6.x, or who plan to flash that range: the wiki says it can be done, and it says to read the matching section of the jailbreak instructions with care.

Owners who are not yet on 5.6.x or newer, and who want to update up into that line: the wiki says particular setups can do that safely, and that there are drawbacks. Same instruction: read that section of the thread carefully. This page does not copy the thread.

Later update on the wiki: [this thread](https://www.mobileread.com/forums/showthread.php?t=275877) is the general write-up for most touchscreen Kindles on firmware below 5.8.8. The wiki also has a page that restates that thread. The edition on this site is [Kindle 5.x software jailbreak](/wiki/kindle/jailbreak/) (PW2 and later models in that page's title).

The methods under the next headings come from earlier stages of that history. The wiki keeps them **as history only**.

### Which older method matched which device

It depended on the device and the firmware.

- Kindle **Touch**:
  - Firmware **5.0.0 through 5.1.2**: the **data.tar.gz** method. Pick the file that matches the firmware you are actually running.
  - Firmware **5.3.2, 5.3.2.1, and 5.3.7**: the **manual method** below, or [this thread](https://www.mobileread.com/forums/showthread.php?t=218613). The thread is written against 5.3.7. The wiki says it in fact applies to every version.
- Kindle **Paperwhite**:
  - Firmware **5.2.0 through 5.3.1, plus 5.3.4 and 5.3.5**: the **jailbreak.mobi** method.
  - Firmware **5.3.3 and 5.3.6**: the **jailbreak.mobi** method as well, after a downgrade to 5.3.1 or 5.3.5.

### jailbreak.mobi method (history only)

**Paperwhite only**, firmware **5.2.0 through 5.3.1, 5.3.4, and 5.3.5**. That was the recommended Paperwhite jailbreak for those builds. On a newer firmware of that era, the wiki's route was to downgrade to 5.3.1, install the jailbreak, then update back. How to do the downgrade and the return trip is in the linked thread, which this page does not reproduce.

Install steps are the ones in [this thread](https://www.mobileread.com/forums/showthread.php?t=198446).

### data.tar.gz method (history only)

- Thread: [showthread.php?t=186645](https://www.mobileread.com/forums/showthread.php?t=186645)
- More of the technical background is in [this reply](https://www.mobileread.com/forums/showpost.php?p=1902438&postcount=41)

The wiki lists this method for Kindle Touch firmware 5.0.0 through 5.1.2, and for Kindle Paperwhite firmware 5.2.0.

- Download the jailbreak archive from [that thread](https://www.mobileread.com/forums/showthread.php?t=186645) and unpack it.
- On firmware **5.1.x or 5.2.0**:
  1. Plug the Kindle in and copy `data.stgz` to the root of Kindle USB storage.
  2. Eject the Kindle safely, then restart it (Menu → Settings → Menu → Restart).
- On the older **5.0.x** firmware:
  1. Plug the Kindle in and copy `data.tar.gz` to the root of Kindle USB storage.
  2. Eject the Kindle safely, then restart it (Menu → Settings → Menu → Restart).

### jailbreak.mp3 method (history only)

Kindle Touch firmware 5.0.0 and 5.0.1 only. Newer firmware of that period uses the methods above.

1. [Download](http://yifan.lu/p/kindle-touch-jailbreak) the jailbreak archive and unpack it. ([Mirror](http://gitbrew.org/~dasmoover/kindle/touch/packages/kindle-touch-jailbreak-1.0.zip).)
2. Follow the README in that archive.

- Background on how it worked: [How the Kindle Touch 5.0 jailbreak/root and SSH works](http://yifan.lu/2011/12/10/kindle-touch-5-0-jailbreakroot-and-ssh/)
- [Discussion in the Kindle Developer's Corner](https://www.mobileread.com/forums/showthread.php?t=160454)

You can put the usbnetwork package on in the same pass if you want it (USB networking is in the [packages chapter](/wiki/kindle/touch-packages/)). Copy `update_simple_usbnet_1.1_install.bin` to the top level of the device **before** you apply the jailbreak.

### Manual method (history only)

**Kindle Touch only**, and the wiki says it should work on **every Touch firmware** of that era. It is much more work than the methods above, for a simple reason: Amazon was trying to make jailbreaking harder, and newer firmware had already closed the older methods. On a Touch running 5.3.2, expect a long procedure.

Thread: [showthread.php?t=203971](https://www.mobileread.com/forums/showthread.php?t=203971)

### Removing the jailbreak

**Kindle Paperwhite.** Follow [these instructions](https://www.mobileread.com/forums/showpost.php?p=2331524&postcount=10).

**Kindle Touch.** Whichever jailbreak you installed, the end state is the same: a developer certificate on the device. To undo that, apply the `update_jailbreak_*_uninstall.bin` file from [this thread](https://www.mobileread.com/forums/showthread.php?t=186645).

## Leaving diagnostics mode

The Touch or Paperwhite is sitting in diagnostics mode (diags) and the way out is not obvious. The wiki's sequence:

1. On the touchscreen, press "S) Device Setting" (the first item in the list).
2. Press "X) Exit".
3. Press "D) Exit, Reboot or Disable Diags".
4. Press "D) Disable Diagnostics".
5. Press "Q) To continue".

Wait on the order of 30 seconds. The device reboots into normal mode.

## Rebooting

Press the power button four times, quickly. That reboots the device. It does not reset settings.

## Unbricking

The tool the wiki recommends for unbricking a Kindle **Touch**, or for downgrading one, is [Kubrick](https://www.mobileread.com/forums/showthread.php?t=206064), a Linux live CD / live USB.

With Kubrick, the wiki says you do not need another tool. It also says Kubrick does **not** apply to the Paperwhite.

Other write-ups, linked only:

- [Restore a K5 (Paperwhite) to factory state with one file](https://www.mobileread.com/forums/showthread.php?t=223067)
- [Select Boot for the K4 and the Touch](https://www.mobileread.com/forums/showthread.php?t=169645)
- [Simple debricking for the K3, K4, and K5](https://www.mobileread.com/forums/showthread.php?t=170929)
- [data.tar.gz / RUNME.sh](https://www.mobileread.com/forums/showpost.php?p=1902438&postcount=41) (does not work on every model)
- [Fixing "Your Kindle needs repair"](https://www.mobileread.com/forums/showthread.php?t=164312)
- [Unbricking a Paperwhite over serial](https://www.mobileread.com/forums/showthread.php?t=206767&page=2)

## Backup

Take a full backup before you change anything.

**PW and PW2.** From firmware 5.3 onward, official update packages already contain a full image of partition 1 and of the main kernel. That is most of what the older backup advice treated as essential, so some of the detail below is redundant on those devices. If you need the files out of an update package in a hurry, the tool is KindleTool. How to build and use it is in the [development chapter](/wiki/kindle/touch-development/).

### A. The simple way

- Kindle Touch: install a diagnostics partition that includes SSH, using [these instructions](http://ixtab.tk/kindle-touch-images/update_k5_diags%2Bssh_README.txt), or take the shorter path and let [Kubrick](https://www.mobileread.com/forums/showthread.php?t=206064) flash the firmware. Kubrick installs that partition as part of the flash.
- Kindle Paperwhite: the [Paperwhite jailbreak](https://www.mobileread.com/forums/showthread.php?t=198446) package already includes what you need. If you later update to 5.3.3 or newer, the rescue pack has to be installed again.

That partition is the safety net when the Kindle bricks. Once it is installed, do a dry run: confirm you can actually reach it, and do not rewrite anything while you are checking. The manual section below is the shape of that access.

### B. The manual way

The example assumes the Kindle is already reachable over the network. That means the jailbreak is installed and [USB networking](/wiki/kindle/touch-packages/) is on. The computer (the "host") is Linux or macOS, the needed commands are installed, and the host's address on that network is 192.168.15.201. Change the address to match your setup.

On the **host**:

```
nc -l 31337 | dd of=mmcblk0p1.bin
```

**Note:** that command depends on the netcat you have. An old netcat needs the port flag:

```
nc -l -p 31337 | dd of=mmcblk0p1.bin
```

On the **Kindle**:

```
dd if=/dev/mmcblk0p1 | nc 192.168.15.201 31337
```

Repeat the same pair of commands for `mmcblk0p2` through `mmcblk0p4`. The files you get are raw copies of the partitions. What each one holds:

#### Partitions

- **Partition 1** (`mmcblk0p1` / ext3, 350 MB): the root filesystem. The operating system and the framework live here. Damage this partition and the device does not work normally.
- **Partition 2** (ext3, 64 MB): the emergency recovery system, also called the diagnostics system. In normal use you never see it and you do not edit it. Leave it alone unless you are in a recovery situation that specifically calls for it.
- **Partition 3** (ext3, 32 MB on the KT, 64 MB on the PW): local settings, mounted at `/var/local/`. The contents can be deleted ([discussion](https://www.mobileread.com/forums/showpost.php?p=1893672&postcount=3)). You lose the settings. The device still runs.
- **Partition 4** (FAT32, 3.3 GB on the KT and on some PW2 units, 1.4 GB on the PW): your documents. While the device is running normally it is mounted at `/mnt/us`, which is the partition you see and can change when the Kindle is plugged in over USB. If you can stand to lose the documents, the contents can be deleted and the device still runs. Do not delete `/diagnostic_logs/device_info.xml` from the USB storage that the diagnostics recovery menu exports. Without that file, getting back to the main partition is much harder.

If you can stand to lose personal settings, backups of partitions 3 and 4 are optional. Backups of partitions 1 and 2 are the ones the wiki strongly recommends.

On Linux, mount an image read-only:

```
mount -o loop,ro <image> <mountpoint>
```

Partition 4 is a disk image that itself contains a single partition, so the mount needs an offset:

```
mount -o loop,ro,offset=8192 mmcblk0p4.bin <mountpoint>
```

Once it is mounted you can read the original files and, if a later change goes wrong, copy them back.

While you are browsing a mounted image, ignore symlinks that point outside the image. Otherwise `/lib/firmware/opt` will appear to contain eclipse, and even teamviewer, which are not part of the Kindle image.

#### Kernels

- **Main kernel** (`main_kernel`): the kernel used in ordinary operation.
- **Diagnostics kernel** (`diags_kernel`): the kernel used when the device is in diagnostics mode.

geekmaster's [getkernels](https://www.mobileread.com/forums/showthread.php?t=174674) tool is the easy way to copy both. After you unpack a current copy into the user store:

```
cd /mnt/us && ./getkernels /dev/mmcblk0 && cd -
```

#### Recovery

Putting a badly broken device back together from USB download mode is the [USB download mode](/wiki/kindle/touch-internals/#usb-download-mode) section of the architecture chapter.
