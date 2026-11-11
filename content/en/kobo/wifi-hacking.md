---
type: translated
title: "Kobo WiFi hacking"
original_title: "Kobo WiFi Hacking"
source_url: https://wiki.mobileread.com/wiki/Kobo_WiFi_Hacking
original_author: "MobileRead Wiki contributors (KevinShort as the main author, DaleDe, and others)"
translated_at: "2026-11-11"
order: 4
description: "The original Kobo WiFi (2010): how KoboRoot.tgz is applied, how to open the case and image the internal microSD, how to enable telnet and FTP, and how to draw on the e-ink framebuffer."
---

> This is the original Kobo WiFi (2010) model: opening the case, imaging the internal microSD, and enabling telnet. It is not a guide for Clara, Libra, Sage, or Elipsa.
> A mistake can brick the device. Image the internal card first, by the method below, before you change any system file. If the reader will not boot afterward, write that image back to the card.
> The wiki page was last revised 2018-11-26. The later Touch archive method is [Kobo Touch hacking](/wiki/kobo/hacking/), and that page is still the Touch `KoboRoot.tgz` procedure, not an installer for current models. A separate overview of the reader application is [KOReader](/wiki/software/koreader/).
> Much of the wiki page was gathered from [Craig Ringer's blog](http://blog.ringerc.id.au/search/label/kobo). The wiki leads with a photo of this reader showing a weather forecast; that image comes from the forum thread cited under Sources. Forum links here are citations only. This site does not copy those posts.

## How this reader applies an update

On the [Kobo WiFi](https://wiki.mobileread.com/wiki/Kobo_Wireless_eReader) (the Kobo Wireless eReader), an update is a tarball with a fixed name. If the public partition — the disk you see when the USB cable is attached — has `.kobo/KoboRoot.tgz`, the reader unpacks everything in that archive onto the root filesystem and reboots.

A home-made update is the same shape of file. The [Aura HD](https://wiki.mobileread.com/wiki/Aura_HD) uses a similar mechanism. This article stays with the 2010 WiFi hardware.

## Open the case

A ring of plastic clips holds the shell. A plastic spudger will release them.

With the shell off, four screws hold the main board. The internal microSD card sits on the back of that board, in the lower right.

## Image the internal card

The WiFi boots from a 2GB microSD card inside the case. Before any of the edits below, take a full image of that card. If the reader later fails to boot, the recovery is to take the card out and write the image back.

A spare 2GB card makes this safer still. Remove the internal card, image it, write that image to the spare, put the original card away, and boot the reader from the spare.

### On Linux, with the card in a reader

If telnet is already working, a full image can be taken without opening the case. You would still have to open the case if that image were needed for a recovery. The wiki points at [Craig Ringer's write-up](http://blog.ringerc.id.au/2011/01/taking-disk-image-of-kobo-wifi-without.html) for that route and does not repeat it here.

Once the card is out, plug it into a card reader and identify it:

```bash
sudo fdisk -l
```

The listing the wiki prints looks like this:

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

The line you want is the disk of about 2GB, given there as 1977 MB:

```text
Disk /dev/sdc: 1977 MB, 1977614336 bytes
```

On that machine the card was `/dev/sdc`. Yours may be a different node. Read the `fdisk` output before you type the next command. The image itself is:

```bash
sudo dd if=YOUR_CARD_LOCATION of=kobo_internal_microsd.img
```

It takes a while. When it finishes, you hold a full image and can write it back if the reader will not boot.

## Enable telnet and FTP

Two routes. Both end at a root shell with no password.

### The prebuilt archive

- Download [this KoboRoot.tgz](https://docs.google.com/open?id=0B6fzXeHwR9miTUFBWmwyc2tNcHc).
- Connect the Kobo WiFi and choose Manage Library.
- Copy that `KoboRoot.tgz` into the `.kobo` directory on the reader.
- Eject it and wait for the reboot.
- After the home screen appears, wait about 20 seconds, until the blue LED blinks a few times. Wi-Fi has to be connected. If it is not, connect it, then reboot.
- Connect the reader again. `.kobo/ip.txt` contains its IP address.

```bash
telnet YOUR_KOBO_IP_ADDRESS
```

Log in as root. There is no password. Telnet and FTP are both open at that point.

### Build the archive yourself

> A later note on the wiki: this method was tried on a **Kobo Glo** (firmware 2.6.1, 06/17/13) and worked after the trailing slash was removed from the first line of `inetd.conf`, which is the suggestion on the [Kobo Touch hacking](/wiki/kobo/hacking/) page. The slash may not have to come off.

Copy these two files off the internal microSD card:

- `/etc/inetd.conf`
- `/etc/inittab`

On the computer, make a directory named `etc` and put `inetd.conf` and `inittab` in it.

Add these lines to `etc/inittab`:

```text
::sysinit:/etc/init.d/rcS2
::respawn:/usr/sbin/inetd -f /etc/inetd.conf.en
```

Add these lines to `etc/inetd.conf`:

```text
21 stream  tcp     nowait  root    /bin/busybox ftpd -w -S  /
23 stream tcp nowait root /bin/busybox telnetd -i
```

Create `etc/init.d/rcS2` with this contents:

```bash
#!/bin/sh
mkdir -p /dev/pts
mount -t devpts devpts /dev/pts
/usr/sbin/inetd /etc/inetd.conf
```

Mark it executable:

```bash
chmod a+x etc/init.d/rcS2
```

Pack the `etc` directory:

```bash
tar czf KoboRoot.tgz etc
```

Copy that `KoboRoot.tgz` into the `.kobo` directory on the reader.

After the reader has rebooted and joined Wi-Fi, find it from another machine on the same network:

```bash
sudo nmap -sP 192.168.1.1-254
```

Match the reader's MAC address in that scan, then telnet to that host. Log in as root, with no password. The wiki does not give a menu path for the MAC on this 2010 model. The scan is useful once you already know that address.

## Draw on the framebuffer

The panel is a Linux framebuffer, and an e-ink panel does not show a write until something issues a refresh. Opening the framebuffer through Pygame (the Python wrapper around SDL) fails with `Unsupported console hardware`.

Readers in this family have shown up with 4-bit, 8-bit, 16-bit, and 32-bit framebuffers. `fbset` reports which one you have. The depth is the last number on the `geometry` line:

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

On an 8-bit WiFi, writing a value into `/sys/class/graphics/fb0/rotate` makes the framebuffer readable and writable. The wiki does not explain why. This is the usual write:

```bash
echo 1 > /sys/class/graphics/fb0/rotate
```

`echo 2` and `echo 0` do the same thing. So does `echo` with no operand:

```bash
echo > /sys/class/graphics/fb0/rotate
```

### A 4-bit panel

Direct drawing into a 4-bit framebuffer was not worked out. The route that does work is a raw image file, displayed with:

```bash
cat image.raw | /usr/local/Kobo/pickel showpic
```

How that raw file is produced is left to [this forum post](http://www.mobileread.com/forums/showpost.php?p=2284024&postcount=21). The steps are not repeated here.

### Refresh an 8-bit panel

Writing the framebuffer is not enough. Until the panel is refreshed, the new pixels stay invisible.

The WiFi image includes a program called Pickel at `/usr/local/Kobo`. `/etc/init.d/rcS` already uses it:

```bash
zcat /etc/images/reboot.raw.gz | /usr/local/Kobo/pickel showpic
```

`showpic` is how an image is handed to Pickel, and Pickel is what refreshes the panel. After Pygame or SDL has drawn into the framebuffer, piping the live framebuffer does not refresh the whole screen:

```bash
cat /dev/fb0 | /usr/local/Kobo/pickel showpic
```

That updates about the top 100 pixels. The other 700 pixels come out solid black. Copy the framebuffer to a file first, then hand Pickel the file:

```bash
cat /dev/fb0 > /tmp/fb
cat /tmp/fb | /usr/local/Kobo/pickel showpic
```

## Short commands from the same notes

The blue LED:

```bash
/usr/local/Kobo/pickel blinkon
```

```bash
/usr/local/Kobo/pickel blinkoff
```

Restart nickel, the GUI, with this script:

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

Turn Wi-Fi off:

```bash
/usr/local/Kobo/pickel wifioff
```

The matching command is supposed to turn it back on. The wiki's author never got it to work:

```bash
/usr/local/Kobo/pickel wifion
```

Pretend the USB cable was inserted, or removed:

```bash
echo usb plug add >> /tmp/nickel-hardware-status
```

```bash
echo usb plug remove >> /tmp/nickel-hardware-status
```

A stand-in registration row:

```bash
echo "insert into user values('foo', 'foo', 'foo', 'foo', 'foo');" | sqlite3 /path/to/kobo/.kobo/KoboReader.sqlite
```

## Sources

- [MobileRead thread](http://www.mobileread.com/forums/showthread.php?t=122701) on adding internal storage to the Kobo Wireless. Citation only.
- [Kobo WiFi weather display](http://www.mobileread.com/forums/showthread.php?t=194376), the thread the wiki's header photo comes from.
- Kernel and other open code Kobo published: [kobolabs/Kobo-Reader](https://github.com/kobolabs/Kobo-Reader) on GitHub.
- The wiki's IRC pointer: the [MobileRead IRC page](https://wiki.mobileread.com/wiki/IRC), and [#kobodev on freenode](http://webchat.freenode.net/?channels=kobodev) at the webchat URL the page recorded. Treat that channel pointer as historical.
- [Craig Ringer's Kobo posts](http://blog.ringerc.id.au/search/label/kobo).

On this site, the Touch-era archive procedure is [Kobo Touch hacking](/wiki/kobo/hacking/). [KOReader](/wiki/software/koreader/) is the overview of that reader, not a hardware guide for this 2010 model.
