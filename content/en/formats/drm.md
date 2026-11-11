---
title: "Ebook DRM, in outline"
original_title: "DRM"
source_url: https://wiki.mobileread.com/wiki/DRM
original_author: "MobileRead Wiki contributors (DaleDe, with Mattcutts, Madliu, and others)"
translated_at: 2026-11-11
order: 3
description: "How ebook DRM actually binds a file to a device or an account, which schemes EPUB, PDF, and Kindle use, and the legal line around removing it."
---

> This edition adapts the MobileRead Wiki page “DRM” (last revised 2018-10-15). The structure is new, and the 2026 notes below are not in that page. It is a description of how the schemes work. It is not a removal guide: no tools, no commands, no links to circumvention sites.

DRM (digital rights management) is a lock that decides what a reader is allowed to do with one file. For ebooks the lock is usually a key the reading software must have before it will open the book. The key may be tied to one device, to a small set of devices, or to an account. There is no single implementation.

Publishers use it to make copying and redistribution harder. Critics call the same machinery “digital restriction management,” because it also blocks uses that copyright law would otherwise allow, such as format-shifting a book you bought. See the wiki’s [copyright](https://wiki.mobileread.com/wiki/Copyright) page for that argument. A format can exist with no DRM at all, and a format that supports DRM still has plenty of files that are not locked.

A device often runs more than one scheme, one per store. Keys are handed out by a server at purchase time, derived from the device or from a user id the server already knows.

## EPUB

EPUB itself never defined a standard way to mark or apply DRM. In practice the 2018 page counted three systems: Adobe DRM (Adobe Digital Editions, and the scheme most dedicated readers and the Nook used), a second Adobe-managed variant, and Apple FairPlay applied through Apple’s apps. See [EPUB](/wiki/formats/epub/).

**Status, November 2026.** That count is the 2018 picture. Library and bookstore EPUB now commonly uses [Readium LCP](https://www.edrlab.org/readium-lcp/) (Licensed Content Protection) as well as Adobe Content Server. Apple still uses its own scheme for books sold in Apple Books. The practical advice is unchanged: a file from one scheme will not open in a reader that only speaks another, and the failure is often a blank page rather than an error.

Adobe-style EPUB DRM is often applied to only some files inside the zip. The book can look half-working. The common case is encrypted embedded fonts while the text is readable, or fonts scrambled with a simple XOR (font obfuscation) so they cannot be lifted out and reused. That obfuscation is a font-license measure, lighter than a full book lock. EPUB 3 can also carry audio and video, and those media can bring their own locks. The current EPUB specification is [EPUB 3.3](https://www.w3.org/TR/epub-33/) (W3C Recommendation, 13 January 2026).

## Kindle

Kindle books share one DRM family across several containers. The older container is AZW, built on the Palm PDB database, which is also the base of [MOBI](/wiki/formats/mobi/). Ignore the lock and AZW is MOBI; the bytes inside are not always a novel. AZW4 wraps PDF, KF8 (AZW3) wraps a modern reflowable book, and the older TPZ / AZW1 path wrapped scanned pages. Amazon has not licensed this DRM to other companies, apart from library lending.

Amazon inherited Mobipocket’s DRM when it bought the company, then shut off support for that older scheme on 31 October 2016. Library loans were given an expiry the retail scheme did not have.

KFX, the format current Kindle store downloads use, is a later container in the same family. This page does not describe KFX’s internals. The [5.x jailbreak](/wiki/kindle/jailbreak/) article is about the device firmware, not about stripping a book.

## PDF and everyone else

Adobe wrote PDF and still runs the dominant PDF DRM server. Some PDFs are only password-protected, which is a different, weaker control.

Other names from the wiki page, mostly of historical interest now:

- **Microsoft** WMDRM on LIT ebooks, WMA audio, and some video. LIT as a reading format is dead.
- **Sony** OpenMG, used by the Connect music store.
- **Apple FairPlay**, still the name of Apple’s lock, then used for iTunes books, AAC, and video.
- **Kobo** sells ordinary EPUB under Adobe DRM, and uses a separate internal scheme (KDRM) for books stored as kepub.
- **CPRM** on SD cards, for some audio and video in a reserved area. Most ebook readers that take an SD card do not implement it.
- **HDCP** is Intel’s link lock for HDMI video, not an ebook format. Version 2.2 is the 4K variant.
- **ExpressPlay** is a cloud license service covering a wide range of devices. It is media infrastructure, not something you configure on a Kindle.

MOBI has its own scheme, distinct from Kindle’s even though they look similar. Details are on the [MOBI](/wiki/formats/mobi/) page.

## Libraries, fonts, and read-aloud

Library loans are time-limited licenses. The library counts how many it bought; the file expires, so nobody returns it. The 2018 page listed PDF, EPUB, and AZW (MOBI in the US having already been replaced), plus protected WMA audiobooks, with OverDrive as the main distributor. In 2026 many public libraries deliver EPUB through apps that speak Adobe DRM or LCP, and Kindle loans still go through Amazon’s own scheme. The wiki’s [library DRM](https://wiki.mobileread.com/wiki/Library_DRM_and_Devices) page is the older device matrix.

Fonts inside a book can be locked even when the text is not. Besides encryption, obfuscation stops the font file from being reused outside that book.

Read-aloud (TTS) needs the reading software to see the text. A lock can refuse that to any outside engine. The wiki points at the DAISY Consortium’s notes on this. In the United States, copyright law has a narrow exception so that a person with a disability can get an accessible copy. That exception is not a general permission to remove DRM, and a publisher that also sells an audiobook may still turn TTS off for everyone else.

DRM can also block printing, or cap how many times a file will open.

## Removing DRM

In a number of countries, removing the lock is itself illegal, separate from copyright in the book. Copying or sharing the book without permission is already infringement, with narrow exceptions such as quotation. In the United States the DMCA prohibits circumvention. Fair-use advocates argue that removing a lock is sometimes the only way to make a lawful use of a book you bought. The tools that exist usually require the same account or device id that the store used, so they are not a universal pass for every file in that format.

The wiki page names formats for which removal tools have circulated, and it forbids links to them. This edition does not repeat that list and does not link to any removal site. Whether distributing or running such a program is legal is a question for the law where you are, not a feature this site documents.

## Further reading

- [Choosing an ebook reader](https://wiki.mobileread.com/wiki/Choosing_An_Ebook_Reader), including the DRM section
- [DMCA](https://en.wikipedia.org/wiki/Digital_Millennium_Copyright_Act) and [DRM](https://en.wikipedia.org/wiki/Digital_rights_management) on Wikipedia
- [17 U.S.C. Chapter 12](https://www.copyright.gov/title17/92chap12.html), the DMCA’s circumvention chapter
- [Adobe Content Server](https://www.adobe.com/products/content-server.html), the current Adobe DRM product for publishers who run their own licenses
