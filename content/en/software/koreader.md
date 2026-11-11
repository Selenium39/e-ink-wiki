---
title: "KOReader"
original_title: "KOReader"
source_url: https://wiki.mobileread.com/wiki/KOReader
original_author: "MobileRead Wiki contributors (DaleDe and others)"
translated_at: 2026-11-11
order: 1
description: "What KOReader is in 2026, which package matches a Kindle, Kobo, PocketBook, or Android device, and how installation differs once a Kindle is already jailbroken."
---

> This edition starts from the MobileRead Wiki page “KOReader” (last revised 2023-02-19) and rewrites it against the project’s own docs as of November 2026. Facts that are newer than the wiki page are cited inline. Forum threads are citations only; this site does not reproduce forum posts.

KOReader is a document viewer aimed at E Ink devices. The 2023 wiki page described builds for Kindle, Kobo, PocketBook, and Android. The project now also ships builds for Cervantes (Bq), reMarkable, and desktop Linux, and developers can run an emulator on Linux and macOS. The current stable line is **2026.07 “Sailing Walrus”** (26 July 2026), with a small follow-up, **2026.07.1** (1 August 2026). Both are listed on the [GitHub releases page](https://github.com/koreader/koreader/releases).

## What changed since the wiki page

The wiki page is still right about the shape of the program: paginated E Ink UI, many book formats, StarDict lookups, OCR on scanned pages, Calibre wireless transfer, PDF reflow. Several specifics are out of date.

- **Platforms.** Cervantes and reMarkable are first-class targets. The 2026.07 notes also call out newer PocketBook, Onyx Android, and Kindle hardware.
- **Kindle packages.** Any Kindle on firmware **5.16.3 or newer** needs the `kindlehf` archive. That split is from the project’s 2025.04 release notes, still reflected in the 2026.07 asset list (`koreader-kindlehf`, alongside `koreader-kindle`, `koreader-kindlepw2`, and `koreader-kindle-legacy`).
- **Kobo.** There is no separate “community firmware” to download from MobileRead. Current Kobos run KOReader beside Nickel. The 2026.07 release added a `koreader-kobov5` archive when Kobo firmware v5 support landed.
- **Formats that matter.** The project’s Kindle install page says EPUB is the best-supported format, MOBI does not get every feature, **KFX is not supported**, and **DRM-protected books do not open**.
- **Cloud sync.** 2026.07 replaced SyncService with a Cloud storage plugin (upload, download, delete, WebDAV). OPDS 2.0 has basic support in the same release. The wiki’s Goodreads and Evernote lines are not in the current feature summary.

## Install, by device

Pick the archive from the [latest release](https://github.com/koreader/koreader/releases), then follow the model page on the [project wiki](https://github.com/koreader/koreader/wiki). The notes below are the decision, not a second copy of those pages.

### Kindle

KOReader runs only on a Kindle that is **already jailbroken**, with OTA updates blocked and any temporary OTA-blocker files removed. Which jailbreak applies depends on model and firmware. The [5.x factory-firmware jailbreak](/wiki/kindle/jailbreak/) on this site covers the old MobileRead Wiki procedure (roughly firmware up to 5.8.7, plus the special cases that page lists). It does not cover current 5.18–5.20 firmware. The project points at [Kindle Modding](https://kindlemodding.org/) for the present landscape and does not document the exploit itself.

Once that jailbreak and its post-install steps are done, the [Kindle install page](https://github.com/koreader/koreader/wiki/Installation-on-Kindle-devices) (updated 22 October 2026) sorts launchers from newest to oldest:

- Jailbreaks that bundle **Kindle Package Manager** (updated WinterBreak from about June 2026, updated AdBreak or Nosebleed from about August 2026, and later jailbreaks) can install from the search bar: `;kpm update`, then `;kpm upgrade`, then `;kpm install koreader`. KPM is marked experimental on that page.
- Older jailbreaks copy the KOReader folder and a launcher scriplet by hand. The same page lists the legacy KUAL path, deprecated from firmware 5.19.4.

Which zip to copy (`kindle`, `kindlepw2`, `kindlehf`, `kindle-legacy`) is also on that page. Do not guess from a 2019 screenshot.

### Kobo

The full lineup from the Kobo Touch upward is supported. You do not jailbreak a Kobo the way you jailbreak a Kindle. Most people should use the project’s semi-automated install script, described on the [Kobo install page](https://github.com/koreader/koreader/wiki/Installation-on-Kobo-devices). Two manual routes are also documented there:

- **KFMon**, including a firmware 4.17+ quirk: Nickel indexes hidden directories, and KOReader lives in one, so `.kobo/Kobo/Kobo eReader.conf` needs an `ExcludeSyncFolders` line under `[FeatureSettings]`. The exact regex is on the install page.
- **NickelMenu**, for KOReader 2020.05+ and firmware 4.6+.

Kobo Start Menu is maintenance-only and broken on firmware 4.25+. Skip it on a Clara or anything newer.

The [Kobo Touch hacking](/wiki/kobo/hacking/) article on this site is the older Telnet/FTP procedure for the original Touch. It is not the KOReader installer.

### Android, PocketBook, and the others

Android builds are not on Google Play. Stable releases are on F-Droid, or install the APK from the release (arm, arm64, or x86). PocketBook, Cervantes, and reMarkable each have their own page on the project wiki. reMarkable 2026.07 turned full refresh on by default for the appload setup.

## Features worth knowing

- Reflowable books (EPUB, FB2, MOBI, DOC, RTF, HTML, CHM, TXT) and fixed-page books (PDF, DjVu, CBT, CBZ). Scanned PDF and DjVu can be reflowed with the built-in k2pdfopt library. Some formats can be opened from a zip.
- StarDict dictionaries, including dictionaries you add yourself. Scanned pages can be looked up through a bundled OCR engine after you install the Tesseract data for that language. See [dictionaries](/wiki/dictionaries/overview/).
- Calibre: search metadata, receive books over wireless, browse a library over OPDS.
- Typographic controls aimed at E Ink: margins, line spacing, external fonts, hyphenation dictionaries, contrast, zoom-to-fit. Page turns are not animated.
- Wikipedia, Wallabag, Google Translate, RSS, and an FTP client and SSH server on platforms where the project manages the network (notably Kobo).
- Notes export, a statistics plugin, and OTA updates of the app itself.
- Plugins. 2026.07 removed `autofrontlight` and `backgroundrunner`, and the exporter plugin dropped memos and flomo (those two can still be installed from [koreader/contrib](https://github.com/koreader/contrib) if you accept that they are unsupported).

## Where to read on

- [KOReader user guide](https://github.com/koreader/koreader/wiki/KOReader-User-Guide)
- [Installation index](https://github.com/koreader/koreader/wiki)
- [MobileRead’s KOReader forum](https://www.mobileread.com/forums/forumdisplay.php?f=276) — discussion only; this page does not copy threads
- [Plato](https://wiki.mobileread.com/wiki/Plato), a related reader that forked from the same family of ideas
