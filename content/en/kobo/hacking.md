---
type: translated
title: "Kobo Touch hacking"
original_title: "Kobo Touch Hacking"
source_url: https://wiki.mobileread.com/wiki/Kobo_Touch_Hacking
original_author: "MobileRead Wiki contributors (KevinShort, DaleDe, Lord-valen, and others; the original page thanks stef70, who first documented the Kobo Touch method)"
translated_at: "2026-11-11"
order: 2
description: "The Kobo Touch KoboRoot.tgz method: patch the firmware archive so Telnet and FTP come up, bring up USB networking, skip the account screen, and put the same changes back after an official update."
---

> This is the Kobo Touch `KoboRoot.tgz` method (wiki page revised 2024-01-11). It is not the 2026 KOReader install path for later Kobo models; that lives on the [KOReader project wiki](https://github.com/koreader/koreader/wiki/Installation-on-Kobo-devices). What follows is the Touch procedure from the source.
> [KOReader, as this site describes it](/wiki/software/koreader/), is a separate article. Forum threads and file links below are citations and download pointers only. This site does not copy forum posts.
> The procedure rewrites system files. A mistake can brick the reader. Back up everything stored on the device before you change anything.

*The wiki page this follows is still marked as a work in progress.*

The first write-up of this method was by [stef70](https://www.mobileread.com/forums/showthread.php?t=141388), for the [Kobo Touch](https://wiki.mobileread.com/wiki/Kobo_Touch).

## How the Touch applies an update

The Touch looks for one file. If `.kobo/KoboRoot.tgz` is sitting on the public partition — the volume that appears when you plug the reader into a computer — the device unpacks that archive onto the root of the internal system partition. A file you put in the archive at `etc/inittab` becomes `/etc/inittab`. Telnet and FTP are already built into the BusyBox on the reader. Shipping a few edited files in that archive is enough to start them, and the shell they give you is root.

## Get an archive to edit

You need a `KoboRoot.tgz` that matches the firmware you are about to patch. A list of Kobo firmware files, with download links, is on the [Kobo Firmware Releases](https://wiki.mobileread.com/wiki/Kobo_Firmware_Releases) page. The other way to obtain the archive the reader itself is using is a factory reset:

1. Back up **every** book. A factory reset deletes all of your files. Books bought from the Kobo store come back the next time the Touch syncs.
2. Reset the device, either of these ways:
   - Hold the Home button while the reader is on.
   - From the home screen, press HOME, then open **Settings > Device Information > Factory Reset**.
3. Plug the Touch into the computer and finish the first-time setup in the Kobo desktop application.
4. Before you unplug, copy `KoboRoot.tgz` out of the `.kobo` directory onto the computer.

## Hook a script on the public partition

Unpack the archive. On Linux:

```sh
tar xvzf KoboRoot.tgz
```

On Windows, 7-zip can unpack it. Do not open the scripts in WordPad, or in any other Windows text editor. Windows line endings will break them.

The file that matters first is `etc/init.d/rcS`. `init` runs it on every boot. The convenient place to add your own commands is immediately above the line `/usr/local/Kobo/nickel -qws &`:

```sh
/mnt/onboard/run.sh &
```

A variant that keeps a log, so a failing line in `run.sh` is easier to see, is:

```sh
/mnt/onboard/run.sh >>/mnt/onboard/run.out 2>&1 &
```

Pack that one file back up:

```sh
tar czf KoboRoot.tgz etc/init.d/rcS
```

Copy `KoboRoot.tgz` into `.kobo` on the Touch and unplug. The reader installs the archive and reboots on its own.

## Pull `inittab` and `inetd.conf` off the reader

Telnet and FTP are switched on by `inittab` and `inetd.conf`. Those two files are not inside the `KoboRoot.tgz` of the firmware this procedure starts from, so the first `run.sh` only copies them out to the public partition:

```sh
cp /etc/inittab /mnt/onboard
cp /etc/inetd.conf /mnt/onboard
```

Connect the Touch, copy `run.sh` onto it, and reboot once. `inittab` and `inetd.conf` should then be on the public partition. Move them into the `etc` directory of the unpacked archive.

## Turn Telnet and FTP on

Three edits:

1. Add this to `etc/init.d/rcS` (keep the `run.sh` line from the earlier edit; these lines are additional):

   ```sh
   mkdir -p /dev/pts
   mount -t devpts devpts /dev/pts
   ```

2. Add this to `etc/inetd.conf`:

   ```sh
   21 stream tcp nowait root /bin/busybox ftpd -w -S  /
   23 stream tcp nowait root /bin/busybox telnetd -i
   ```

   One contributor found that on a Glo running firmware 2.1.5 the trailing slash on the port 21 line had to be removed before FTP would work.

3. Add this to `etc/inittab`:

   ```sh
   ::respawn:/usr/sbin/inetd -f /etc/inetd.conf
   ```

Pack the three files:

```sh
tar czf KoboRoot.tgz etc/init.d/rcS etc/inittab etc/inetd.conf
```

Copy that `KoboRoot.tgz` into `.kobo` and unplug.

## Log in over Wi-Fi

Telnet needs the radio on. Opening the web browser is enough to bring Wi-Fi up. You also need the reader's IP address.

**HOME > Settings > Device Information** shows the Touch's MAC address. With the browser open, scan the local network from a computer on the same LAN. The example assumes the LAN is `192.168.1.x`:

```sh
sudo nmap -sP 192.168.1.1-254
```

Match the Touch's MAC in that list. The IP address is a few lines above the MAC. Then:

```sh
telnet 192.168.1.100
```

Use the address you actually found. Log in as `root`. The password is empty.

## USB networking

Do the Telnet and FTP setup above first, and confirm you can telnet in. USB networking is a second path to the same root shell, this time over the cable.

If the computer runs systemd, the kernel will rename the USB interface, and the name depends on which port you use. Plug the reader in and run:

```sh
$ sudo dmesg
```

Look for a line in this shape:

```text
[XXXXXXX.XXXXXX] cdc_ether 1-2:1.0 enXXXXXXXXXXXXX: renamed from usb0
```

Write down the name that starts with `en`. In the instructions below, every `usb0` is that name instead. Move the reader to a different port and the name changes with it.

### One session, gone after reboot

The Kobo must not be plugged into USB while you run the device-side commands. On the Kobo:

```sh
> killall nickel
```

`nickel` is the reading application. The wiki points at [this script](http://pastebin.com/gEuQpaU5) for starting it again.

```sh
> /bin/busybox insmod /drivers/ntx508/usb/gadget/arcotg_udc.ko
> /bin/busybox insmod /drivers/ntx508/usb/gadget/g_ether.ko
```

The USB-network gadget does not come up through nickel. Set the address yourself:

```sh
> ifconfig usb0 192.168.2.2
```

Plug the Kobo into the computer. On the computer:

```sh
> lsusb
```

The listing should include *Netchip Technology, Inc. Linux-USB Ethernet/RNDIS Gadget*. When it does:

```sh
> ifconfig usb0 192.168.2.1
> telnet 192.168.2.2
```

Log in as `root` with the same empty password as over Wi-Fi.

### Left in place across reboots

The wiki's author edited the files on the computer and sent them back over FTP (Gftp, on Ubuntu).

On the Kobo:

```sh
> killall nickel
```

At the end of `/etc/init.d/rcS`:

```sh
/bin/busybox insmod /drivers/ntx508/usb/gadget/arcotg_udc.ko
/bin/busybox insmod /drivers/ntx508/usb/gadget/g_ether.ko
```

At the end of `/usr/local/Kobo/udev/ac` and at the end of `/usr/local/Kobo/udev/plug`:

```sh
ifconfig usb0 192.168.2.2
```

The note on the wiki is that both files may not be required; the author did not check which one is enough.

Reboot the Kobo and see whether the change stuck:

```sh
> reboot
```

Wait until the home screen is up (the author suspected the wait might not matter), then connect USB. Dismiss the dialogs the computer opens.

On the computer:

```sh
$ ifconfig usb0 192.168.2.1
$ telnet 192.168.2.2
```

On OS X the interface is not `usb0`. It is a name like `en0`, and the number depends on the USB port.

Log in as `root`. The password is still empty.

## Suspend, from the kernel notes

This sequence is what the wiki records as working:

```sh
echo 1 > /sys/power/state-extended   # turn the neonode touchscreen off
echo mem > /sys/power/state
# after wake:
echo 0 > /sys/power/state-extended
```

It was spotted in an strace of nickel:

```c
open("/sys/power/state-extended", O_WRONLY|O_CREAT|O_TRUNC|O_LARGEFILE, 0666) = 3
dup2(3, 1) //copy filehandle
write(1, "1\n", 2) = 2
execve("/bin/sh", ["sh", "-c", "echo mem > /sys/power/state"]
```

The matching sysfs handler in the kobolabs tree is `/KoboLabs/hw/imx508/cls/linux-2.6.35.3/kernel/power/main.c`:

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

The wiki's author tried it with Wi-Fi off and the cable unplugged. It looked right, and it was not checked by watching the battery over a long idle period.

## Skip the account

### Sideloaded mode

Firmware 4.31.19086 added this switch. The forum post that records it is [this thread](https://www.mobileread.com/forums/showthread.php?p=4191419#post4191419).

If you are also sideloading a firmware package, the config file can be edited before that package, after it, or while it is being applied.

1. Starting from a factory state, go through setup and choose **"Don't have a Wi Fi network?"** so the volume can be mounted.
2. Mount the reader.
3. Under the `[ApplicationPreferences]` section of `/mnt/.kobo/Kobo/Kobo eReader.conf`, add:

   ```ini
   SideloadedMode=true
   ```

4. Eject the reader and reboot it.

### A placeholder row in the user table

```sh
echo "insert into user values('value0', 'value1', 'value2', 'value3', 'value4', 'value5', 'value6');" | sqlite /mnt/KOBOeReader/.kobo/KoboReader.sqlite
```

The table layout is not stable across firmware versions.

On 3.11.0 the wiki's author did it interactively, with nine values rather than seven:

```sh
$ sqlite3 ./KoboReader.sqlite
SQLite version 3.8.10.2 2015-01-01 00:00:00
Enter ".help" for usage hints.
sqlite> INSERT INTO "user" VALUES('value0','value1','value2','value3','value4', 'value5', 'value6', 'value7' ,'value8');
sqlite>
```

On a Kobo Clara HD that statement fails: the table has 20 columns, not 7 or 9. Name the two columns that have to be filled:

```sh
echo "insert into user (UserID, UserKey)  values (1, 'empty')" | sqlite3 /mnt/KOBOeReader/.kobo/KoboReader.sqlite
```

The same named insert should work on other Kobo models when `UserID` and `UserKey` are the only columns that refuse NULL.

## Put the changes back after an official update

A firmware update replaces the files you edited and, in effect, removes the hack. Keeping your lines out of the stock files means the next update only knocks out a two-line stub.

Create `customInit.sh` in the root directory, or in any other path you prefer. Move into it the lines you would otherwise have added to `/etc/init.d/rcS`, and delete those lines from `/etc/init.d/rcS`.

Rename your modified `/etc/inetd.conf` to `/etc/inetd2.conf`.

After an official update has wiped the hack, restore it by adding these lines to `/etc/inittab` with the `KoboRoot.tgz` method:

```sh
::respawn:/usr/sbin/inetd -f /etc/inetd2.conf
::once:/bin/sh /customInit.sh
```

## Related pages

- [Debian Linux on a Kobo](https://wiki.mobileread.com/wiki/Debian_Linux_on_a_Kobo), on the MobileRead Wiki.
- [Kobo WiFi hacking](/wiki/kobo/wifi-hacking/) on this site, which is the 2010 Kobo WiFi: the case, the internal card, and telnet. The original wiki page is [Kobo WiFi Hacking](https://wiki.mobileread.com/wiki/Kobo_WiFi_Hacking).

The 2010 reader's own FAQ, including its factory-reset menu path, is [Kobo eReader FAQ](/wiki/kobo/ereader-faq/). That menu is not the Touch menu used above.
