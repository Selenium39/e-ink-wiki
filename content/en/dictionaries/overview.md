---
title: "Dictionaries on e-readers"
original_title: "Dictionary"
source_url: https://wiki.mobileread.com/wiki/Dictionary
original_author: "MobileRead Wiki contributors (DaleDe, Rolgiati, and others, including anonymous editors)"
translated_at: "2026-11-11"
order: 1
description: "Why an ebook dictionary is not just a book of definitions, how tap-to-look-up works, and which formats and tools are still worth using in 2026."
---

> This edition adapts the MobileRead Wiki page “Dictionary” (last revised 2022-04-17). The resource lists are reorganized, and dead storefronts are marked. Forum links are citations only.

An ebook dictionary has to answer one word while you are in the middle of another book. That is a different object from a dictionary you read front to back, and readers that do not know about the difference cannot look a word up.

## What the reader has to do

Two uses get conflated. One is opening the dictionary as its own book. The other, the one that matters on an e-reader, is selecting a word in the book you are reading and seeing a definition without leaving the page. The second one needs an index of headwords, and a way for the reading software to jump straight to a headword. If the program can also take typed input, it can search that index directly. A full-text search is the wrong tool: it hits the word inside other definitions.

A table of contents plus internal links can fake this, and any reader that supports internal links can do it. It is clumsy, and it is not what people mean by a dictionary.

Some devices ship a single dictionary. Some let you install several and query one you picked. Some query every installed dictionary and stack the results. [MOBI](/wiki/formats/mobi/) and the old eReader format both had dictionary support in the file format, and a reader that understands the index can use those files while you read other formats. Both formats can also carry [DRM](/wiki/formats/drm/).

**Status, November 2026.** The lookup model is unchanged. The software around it is not the 2022 list:

- Kindle still looks a word up from the selection. You can install more than one dictionary and choose the default; the wiki page’s “only one dictionary” line described an earlier firmware limit.
- [KOReader](/wiki/software/koreader/) looks words up in StarDict files, including dictionaries you add, and can OCR a scanned PDF or DjVu page before the lookup.
- EPUB’s own dictionary and glossary work moved from an IDPF profile to the W3C EPUB specs. The old profile is at [idpf.org/epub/dict](http://idpf.org/epub/dict/); the current book specification is [EPUB 3.3](https://www.w3.org/TR/epub-33/).

## Formats that used to matter

The wiki’s “who supports dictionaries” table is mostly retired hardware. Kept here so the names in old posts still make sense:

- **Kindle** dictionaries are AZW files, which are MOBI with Amazon’s DRM. That part is still true of the dictionaries Kindle installs.
- **Mobipocket and eReader** sold dictionaries in their own formats. Mobipocket the company is gone; the file format is the one described on the MOBI page.
- **Microsoft Reader (LIT)** shipped a free dictionary. The reader itself is discontinued, and the old download page is not a live source.
- **Cool Reader** gained dictionaries through AlReader’s API.
- **Bookeen Cybook Gen3** could use several MOBI dictionaries at once. **JetBook** shipped with dictionaries and cross-language lookup. **eBookwise-1150** had a dictionary. All three are out of production.
- **XDXF** (XML Dictionary eXchange Format) was an attempt to share free dictionaries, without DRM. [BDicty](https://wiki.mobileread.com/wiki/BDicty) started on Palm OS. [SDictionary](http://swaj.net/sdict/index.html) used its own Sdict format on Unix, Windows, and Symbian.

## Building one

A dictionary file needs headwords in an index the reader can seek, not only a stream of HTML. Two tools from the wiki page are still the ones people mean:

- **[Penelope](https://github.com/pettarin/penelope)** creates, edits, and converts dictionaries for ebook devices.
- **[Mobidict](https://wiki.mobileread.com/wiki/Mobidict)** reads MOBI and Kindle dictionaries on Windows, Linux, and macOS.

The wiki points at two MobileRead threads for “build a MOBI dictionary” and for a Cool Reader dictionary on some Hanlin devices ([thread 20480](https://www.mobileread.com/forums/showthread.php?t=20480), [thread 46382](https://www.mobileread.com/forums/showthread.php?t=46382)). Those posts are not copied here. StarDict’s layout is documented at [StarDictFileFormat](http://stardict.sourceforge.net/StarDictFileFormat); that is the format KOReader still consumes. Free StarDict dumps that originated on dict.org are listed from [the StarDict project](http://stardict.sourceforge.net/Dictionaries_dictd-www.dict.org.php). [dict.org](https://www.dict.org/) itself is the client/server dictionary protocol those dumps came from.

## Word lists people actually used

These are the public-domain and free lists the wiki collected. Treat any store link from 2022 as possibly dead.

**English**

- Webster’s 1913 (about 110,000 entries) has circulated as IMP, MOBI, EPUB, RB, and DIC in the MobileRead library.
- The same Webster text is in the [XDXF dictionary pack](https://sourceforge.net/projects/xdxf/files/dicts-XDXF/), with many other languages.
- WordNet, from Princeton, is a lexical database rather than a prose dictionary. The project is at [wordnet.princeton.edu](https://wordnet.princeton.edu/).
- Random House’s old 19,300-entry pocket file, and Microsoft’s Encarta pocket dictionary in LIT (about 86,000 entries), are historical. Encarta’s download page is gone with Microsoft Reader.
- A thread on adding a dictionary to the Sony PRS-500 / PRS-505 only opened the dictionary as its own book. It did not give in-book lookup.

**French.** *Dictionnaire de l’Académie française*, 8th edition (1932–35), and Littré (1860–1876), have circulated as MOBI from ebooksgratuits.com.

**Latin.** The wiki linked a Kindle Latin dictionary sold on Amazon (`B005CA3W2G`). Check that the listing still exists before you rely on it.

**Bilingual.** Italian–English PDF editions were uploaded to MobileRead. Dict-format files also show up inside Lingvo and Slovoed packages; AlReader’s forum is where those were discussed.

ABBYY Lingvo still sells dictionaries for desktop and mobile, with an online version at [lingvo-online.ru](https://www.lingvo-online.ru/en). MobiPocket’s and eReader’s dictionary shops, named on the wiki page, are not current storefronts.

## Spell-check dictionaries

These are word lists for checkers, not lookup dictionaries. [Hunspell](https://hunspell.github.io/) is the engine LibreOffice uses. Peter Norvig’s [How to Write a Spelling Corrector](https://norvig.com/spell-correct.html) is a short Python explanation of noisy-channel correction, useful if you are generating a word list, not a reader feature. The wiki’s Microspell link was a Windows checker used beside Sigil; confirm it still ships before you depend on it.
