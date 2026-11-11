---
title: "Kindle 5.x software jailbreak (PW2, PW3, KT2, KT3, Voyage, Oasis)"
original_title: "5 x Jailbreak"
source_url: https://wiki.mobileread.com/wiki/5_x_Jailbreak
original_author: "MobileRead Wiki contributors (Coplate, NiLuJe, DaleDe, Monguin, Ilovejedd, Ttx, Katadelos, Nhgbslik, and others; the original Credits also thank knc1, Branch Delay, Geekmaster, eschwartz, Ryccardo, eeeee, ktwombley, kindlefere)"
translated_at: "2026-11-11"
order: 1
description: "The factory-firmware software jailbreak for older Kindle touch models: which firmware it still accepts, how to block OTA, check the factory image, and keep the jailbreak across an update."
---

> This edition adapts the MobileRead Wiki page “5 x Jailbreak”. Wording is rewritten. Filenames and MD5 checksums follow the wiki. Forum links are citations only; this site does not reproduce forum posts.
>
> **Status, November 2026.** The procedure below is the factory-firmware jailbreak for the models in the title. On the wiki page (last revised 2021-10-04, and still written this way) it does **not** run when the third number of the firmware version is greater than 7: 5.8.8, 5.8.9, 5.8.10, and anything on the 5.9 branch or later, except the special cases that page lists. It is not a jailbreak for the 5.18–5.20 firmware current Kindles ship with. [KindleModding’s WinterBreak page](https://kindlemodding.org/jailbreaking/WinterBreak/) states that WinterBreak/Mesquito does not work on firmware 5.18.1 or newer. Other 2026 methods are published outside MobileRead Wiki; this site does not reproduce them. Do not downgrade a newer Kindle onto this procedure. The wiki’s own reports say most of those attempts brick the device.
>
> Flashing firmware can brick the Kindle. Do one step at a time, and do not skip.

The models this page is about: **PW2, PW3 (black and white), KT2, KT3 (black and white), Voyage (KV), and Oasis 1 (KOA)**.

Oasis 2 (KOA2, 9th generation) was never finished on this page. Its hotfix package does not put the jailbreak back by itself, and the wiki gave no date for a fix. Step 1 is how you turn a serial number into the nickname used below. If your nickname is KOA2, stop and read that limitation again before you flash anything.

## Will this jailbreak run on the firmware you have now?

Read the **third** field. In `5.8.`**`7`**`.0.1` that field is 7. If it is **greater than 7**, this jailbreak will not run. That means 5.8.8, 5.8.9, 5.8.10, and so on. The wiki also says you cannot downgrade first and then use this jailbreak. Anything newer than the 5.8 branch (5.9 and up) is out of scope for the same reason. The wiki asks readers not to treat that paragraph as stale: the page is kept current, and the ceiling is the point.

### Exceptions the wiki itself lists

These are not extra steps. They are pointers at forum threads, which this site does not copy.

- **PW3** on firmware 5.9.6.1 or earlier: [thread 313086](https://www.mobileread.com/forums/showthread.php?t=313086).
- **PW4** on 5.10.1.3 or earlier, and maybe some later PW4 builds: [this post](https://www.mobileread.com/forums/showpost.php?p=3956552&postcount=782).
- **KT4** on 5.11.0: [thread 320570](https://www.mobileread.com/forums/showthread.php?t=320570).

PW4 and KT4 factory images are in the table in step 3 because the wiki lists them. They are not in the title’s “this works today” set unless you are inside those exceptions.

### Downgrades

People have reported downgrading a Kindle that is already past 5.8.7. Many more have reported a brick. The wiki’s advice is to not try it. Block updates instead, and check back. The only recovery path the wiki names, if a downgrade bricks the device, is [serial-port access](https://www.mobileread.com/forums/showthread.php?t=267541). If you are not already set up to use that, you are not set up to survive a failed downgrade.

To block OTA, put an **empty directory** named `update.bin.tmp.partial` at the root of the USB drive you see when the Kindle is plugged in. The name is exact: no extra extension, nothing inside the directory.

### Does the jailbreak survive a later update?

If you jailbreak on an older firmware, the wiki says the jailbreak is known to survive updates to 5.8.8, 5.8.9, 5.8.9.2, 5.8.10, and 5.8.11, and forum reports said it also survived 5.9.2 and 5.9.4. It was designed to reinstall itself, so it should survive further official updates. **Add-ins do not.** After every firmware update you reinstall them.

**G090LK and G090LL** (PW3, 32 GB, Wi-Fi only) and the matching Wi-Fi + 3G models are only partly supported. See [thread 291336](https://www.mobileread.com/forums/showthread.php?t=291336).

## Check that a jailbreak is actually installed

The wiki attaches a dummy package that installs nothing. It only writes `dummy_updatetest.log` at the top of USB storage. If the log appears, the jailbreak is intact. If it does not, repeat from the preparation list through step 8.

1. Download the zip from the bottom of the [wiki page](https://wiki.mobileread.com/wiki/5_x_Jailbreak) and open it. There is one folder, `Dummy`.
2. Copy `Update_dummy_0.0.N.bin` from that folder into `/mrpackages` on the Kindle. No `/mrpackages` directory means the jailbreak is missing or broken.
3. Run it from KUAL, or from the search bar with `;log mrpi`. The search-bar form was written for 8th-generation devices.

## PW2 on 5.4.4.2 or older

Leave this page and follow [thread 186645](https://www.mobileread.com/forums/showthread.php?t=186645).

## Older grayscale Kindles

See [thread 275881](https://www.mobileread.com/forums/showthread.php?t=275881). The Kindle Touch era is the separate article [Kindle Touch jailbreak, unbrick, and backup](/wiki/kindle/touch-jailbreak/).

## Before you start

Do these in any order. Then do the numbered steps one at a time. Whenever a file you copied to the top of USB storage is still there after a step, delete it before the next step. Stay in airplane mode except where a step tells you to go online.

- Some firmware will not show the menus you need until the Kindle is **registered**. If it is not registered, do that now. Read the rest of this list before you turn Wi-Fi on.
- Put the OTA blocker directory in place **before** you go online. A current OTA will move you onto firmware this jailbreak cannot touch.
- Remove any device PIN or parental-control PIN.
- If the lock screen shows ads (Special Offers), unsubscribe them on the Amazon account, then leave the Kindle online long enough for Amazon to refresh the local ad state.
- Charge from a wall adapter, not from a laptop that may sleep.
- Airplane mode stays on for the flashing steps.

## Steps

### 1. Identify the nickname

Match the serial number to a nickname on the wiki’s [serial-number table](https://wiki.mobileread.com/wiki/Kindle_Serial_Numbers). Older Kindles use four characters out of the first six (`xxxx`xx). Newer ones use four characters out of the last six (xx`xxxx`).

**The factory image is not locked to your serial.** This lookup is the only thing that stops you flashing the wrong model. If the serial is not in the table, stop and ask. Do not guess a close nickname.

### 2. Make the Kindle willing to run an older firmware

The Kindle has two user-storage areas. USB shows one. The other is hidden, and its databases are what actually block a downgrade. The reset that clears the hidden area also erases the visible one.

- Back up `/documents`. You are about to wipe it. Books already in Kindle Cloud are already backed up.
- Do not bother backing up `/system`. The device rebuilds it.
- Do not copy `/documents` back until the Kindle is on the same firmware it had when you made the backup. Anything else tends to wedge the indexer.
- You will lose settings. That is expected.

Run the reset from the settings menu (`Home → Menu → Settings → Menu → Reset`, or the equivalent on your firmware). This is the one time the reset item is required. It also erases the jailbreak-survival code that step 6 installs, so **after this procedure, do not factory-reset again** unless you mean to remove that code.

If a later reset wipes the survival code by mistake, the wiki points at a restore package in [coplate’s snapshot thread](https://www.mobileread.com/forums/showthread.php?t=289215). It is installed from the top of USB storage with Update Your Kindle, and it was written to install on official firmware (including builds as new as 5.8.10) without MrPI.

### 3. Download the factory image on a computer

Download the image for **your** nickname. The `.md5` file is how you know the download is intact. The people who used to host the binaries stopped paying for the hosting; the wiki’s old direct links now point at web searches. Mega, Baidu, Yandex, and the other mirrors move. This page keeps the filenames and checksums. Take the current URL from the [same section of the wiki page](https://wiki.mobileread.com/wiki/5_x_Jailbreak).

| Nickname | Factory firmware | Filename | MD5 |
| --- | --- | --- | --- |
| KOA2 | 5.9.0.6 | `update_kindle_oasis_9th_factory_5.9.0.6.bin` | `18624db8c1838ec2b5b8bfb3406ac041` |
| KOA | 5.7.4 | `update_KOA_5.7.4_initial.bin` | `8f1e7c9124a2b12e643b15447d80feae` |
| KV | 5.5.0 | `update_KV_5.5.0_initial.bin` | `f7c8905ea993fef902be82b70a98542a` |
| KT4 | 5.11.0 | `update_kt4_5.11.0_factory.bin` | `fd3e7ed8ebea59432163a5e713cd90c5` |
| KT3 | 5.8.0 | `update_KT3_5.8.0_initial.bin` | `3f1a5294e1bca8c4fa7ca2762c5b4505` |
| KT2 | 5.6.0 | `update_KT2_5.6.0_initial.bin` | `d85a86f5c75b4b9d43648f3b6afd2e84` |
| PW4 | 5.10.1.3 | `update_pw4_5.10.1.3_factory.bin` | `538d939c2cb4f05c7952d33d5348f010` |
| PW3 | 5.9.6.1 | `update_pw3_5.9.6.1_factory.bin` | `a5460e698a531c7770ba2b1ac31667b0` |
| PW2 | 5.4.3.2 | `update_PW2_5.4.3.2_initial.bin` | `3cbac0b4821cec03432b9ed382744f41` |

KOA2 is in the table because the wiki publishes an image. The hotfix for KOA2 still does not restore the jailbreak. Do not treat the row as “KOA2 is supported.”

### 4. Check the image, then copy it to the Kindle

Run `md5sum` (or the Windows equivalent) and match the table **before** the file touches the Kindle.

If you arrived from [thread 291336](https://www.mobileread.com/forums/showthread.php?t=291336) (PW3 4 GB, PW3 32 GB, firmware 5.8.9.0.1), this step uses `update_pw3_factory_5.8.9.0.1.bin` instead. The wiki distributes it as a two-part zip. After you join and unzip it, the `.bin` is 776814880 bytes, MD5 `5d38744bd01f4cbf457dae4499c3c32a`.

A delay here is normal. Ten minutes is not unusual. What is **not** normal is the file vanishing off USB storage with no delay and no update screen. That means this method does not work on the firmware you are running. Stop.

1. Plug the Kindle in over USB.
2. Copy `update_*.bin` to the **top** of visible USB storage, next to `/documents`, not inside it.
3. Eject the Kindle.
4. Unplug.
5. `Home → Menu → Settings → Menu → Update Your Kindle`.
6. Confirm.
7. Wait.

**PW2 is different at this point.** Use the older universal jailbreak in [thread 186645](https://www.mobileread.com/forums/showthread.php?t=186645), then skip steps 5 and 6 and continue at step 7.

### 5. Install the factory-firmware jailbreak

Install the current build of Branch Delay’s factory-image jailbreak. It installs two things: a signing certificate, and a document titled “Jail Broken”.

If `/documents` has no “Jail Broken” document, the certificate is not there either. **Stop.** The jailbreak did not take, and step 6 will not fix that.

The current build is attached to its release thread, [Factory Image Jailbreak](https://www.mobileread.com/forums/showthread.php?t=275887).

1. Plug the Kindle in.
2. Copy the downloaded archive to the top of USB storage. Do not unzip it.
3. Eject, unplug, go Home.
4. Type `;installHtml` into the search bar and submit it. The semicolon is part of the command.

### 6. Install the hotfix

The hotfix is the survival code. The current build is attached to its release thread, at [this post](https://www.mobileread.com/forums/showthread.php?p=3004892&postcount=1597).

If you came from the PW3 5.8.9.0.1 thread, use [this post](https://www.mobileread.com/forums/showpost.php?p=3562968&postcount=4) instead.

1. Unzip the release archive.
2. Plug the Kindle in.
3. Copy `Update_jailbreak_hotfix_*_install.bin` to the top of USB storage.
4. Eject, unplug.
5. `Home → Menu → Settings → Menu → Update Your Kindle`.
6. Confirm, and wait.

### 7. Move to a newer official firmware

The jailbreak should still be there after an official update. Add-ins will not be.

- Let the Kindle online and take the OTA, or
- Install a specific build you downloaded from Amazon.

Put `update.bin.tmp.partial` back if you want OTA to stay blocked while you install a file by hand. Amazon’s US download host has served these builds. A few countries (Germany is the one the wiki names) used different builds for old versions; in that case start from the download link you would normally use and change the version in the URL. Around firmware 5.8.5, Amazon also stopped splitting downloads by country, and the host name in these links changes from `G7G_FirmwareUpdates_WebDownloads` to `firmwaredownloads`.

- **KOA:** [5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.7.4.bin), [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.8.1.bin), [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.8.2.bin), [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_oasis_5.8.5.bin), [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_oasis_5.8.7.0.1.bin)
- **KV:** [5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.7.4.bin), [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.8.1.bin), [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.8.2.bin), [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_voyage_5.8.5.bin), [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_voyage_5.8.7.0.1.bin)
- **KT3:** [5.8.1.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_8th_5.8.1.1.bin), [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_8th_5.8.2.bin), [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_8th_5.8.5.bin), [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_8th_5.8.7.0.1.bin)
- **KT2:** [5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.7.4.bin), [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.8.1.bin), [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.8.2.bin), [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_5.8.5.bin), [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_5.8.7.0.1.bin)
- **PW3:** [5.7.4.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.7.4.1.bin), [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.8.1.bin), [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.8.2.bin), [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_all_new_paperwhite_5.8.5.bin)

The wiki lists further PW2, KT4, and PW3 URLs in the same section.

### 8. Installing later `update_*.bin` packages

Every model on this page has to install `update_*.bin` packages in one of the two ways below. **KOA and KT3 must use the new way.** The others may use either.

MobileRead add-ins shipped as `update_*.bin` install through **MrPI** (MobileRead Package Installer), from the “KUAL and KUAL extensions” section of [thread 225030](https://www.mobileread.com/forums/showthread.php?t=225030). Unzip it at the top of USB storage. The unzip tool has to be allowed to create directories.

KOA and KT3 run the installer from the search bar: `;log mrpi`. Other models on this page can do that, or run it from KUAL.

Almost every add-in also needs a launcher. KUAL is in that same thread. From version 2.6.40 the archive contains three builds: `keyboard`, `(old) touchscreen`, and the newer `KOA, KT3` build. Read the `README.txt` in the archive. The shortcut below is not a substitute.

KOA and KT3 must use the `update_*.bin` KUAL package, installed with MrPI. Other devices can still use the older “document” KUAL: put the right document in `/documents`.

The `update_*.bin` KUAL runs on touch Kindles with firmware 5.1.2 or newer. KUAL itself does not need a separate launcher. It registers a MIME type, and the system runs it when you open the document. `update_*.bin` packages have to be reinstalled after every firmware update. MrPI can install several at once: put them all in `/mrpackages` and run MrPI.

## Credits

The wiki’s credits, kept because the jailbreak is their work, not this site’s:

- **NiLuJe** found that a factory update could be restored, on the PW2.
- **knc1** published the how-to and restored the KT2 and PW3 factory packages, and recognized that a factory initial update can be reinstalled on a matching retail unit.
- Several forum members restored the Voyage image. **eeeee** restored the PW3 and PW3W images, **ktwombley** the KT3 image, and another member the image Oasis support needed.
- **Branch Delay** wrote the original 5.6.5 software jailbreak and the universal jailbreak for factory images. **eschwartz** maintains that factory-image jailbreak.
- **Branch Delay, NiLuJe, and Geekmaster** did the initial testing. **Geekmaster** archived off-site Kindle rescue material.
- **knc1, Geekmaster, NiLuJe, and kindlefere** provided server space.
- **NiLuJe, Ryccardo, and eschwartz** tracked down a Kindle freeze.
- **eschwartz, NiLuJe, and others** built the newer menu launcher for Oasis and the other models.
- The first public write-up was on [Hackaday](https://hackaday.com/2016/07/09/a-jailbreak-for-every-kindle/), which is also why the thread drew the traffic it did.

The wiki’s note under those names: this was more than a year of work, not a one-night downgrade bug, and not one person’s.

## Where current builds are posted

The wiki’s release policy is a single maintained snapshot thread per project. For NiLuJe’s snapshots, filter by the `tools` prefix and read the thread list. Third-party add-ins should be taken from the snapshot thread, not from an old copy attached to a guide.

## Files on the wiki page

| File | What it is |
| --- | --- |
| `install_test_dummy.zip` (11.9 KB) | The jailbreak self-test |
| `dummy_testupdate.txt` (13.5 KB) | A sample of the log that test writes |
| `adrive_md5_all.zip` (1.6 KB) | MD5 list for the factory images |

All three are attached to the bottom of the [wiki page](https://wiki.mobileread.com/wiki/5_x_Jailbreak).
