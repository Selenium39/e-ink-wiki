---
title: "EPUB 2.01: Container, Package, and Content"
type: translated
original_title: "EPub"
source_url: https://wiki.mobileread.com/wiki/EPub
original_author: "MobileRead Wiki contributors (DaleDe, primary, with Dgatwood, Bookmedia123, and others)"
translated_at: "2026-11-11"
order: 1
description: "EPUB 2.01 guide to the OCF zip container, the uncompressed mimetype-first rule, OPF packaging, the OPS XHTML content model, how DRM and font obfuscation are applied, and CSS quirks for iBooks, ADE, Nook, and Kobo. The current W3C Recommendation is EPUB 3.3."
---

> **Status.** This page is the EPUB 2.01 guide, adapted from the MobileRead Wiki page [EPub](https://wiki.mobileread.com/wiki/EPub) (last revised 2021-06-04). Forum links below are citations only; this site does not mirror forum posts.
> As of 13 January 2026 the current standard is EPUB 3.3, a W3C Recommendation (https://www.w3.org/TR/epub-33/). The International Digital Publishing Forum (IDPF) merged into the W3C in 2017. The W3C said on 25 May 2023 that moving from EPUB 3.2 to 3.3 does not require workflow changes (https://www.w3.org/press-releases/2023/epub33-rec/). The uncompressed-mimetype-first container rule still applies.
> The old IDPF site, idpf.org, is a historical archive, not the live specification home. Current publishing work is at https://www.w3.org/publishing/.

**EPUB** is an open file format for reflowable books and other publications. The Open eBook Forum, under the IDPF, defined it. A book is XHTML and other XML, with CSS stylesheets optional. It succeeds the [Open eBook](https://wiki.mobileread.com/wiki/Open_eBook) (OEB) standard. This page documents the 2.01 generation. For the later content model see [EPUB 3](https://wiki.mobileread.com/wiki/EPub_3) on MobileRead Wiki, and for pages that do not reflow see [fixed-layout EPUB](https://wiki.mobileread.com/wiki/Fixed_layout_ePub).

## What a 2.01 file is

The `.epub` extension names one XML package of a reflowable publication. That package is three open standards, all originally written at the IDPF:

- **OPS**, the Open Publication Structure, which is the content markup.
- **OPF**, the Open Packaging Format, which lists the parts and their reading order.
- **OCF**, the Open Container Format, which zips those parts into one file.

A publisher can ship a single file, and an unencrypted reflowable book can move between reading software and devices. OPS itself continues the Open eBook Publication Structure ([OEB](https://wiki.mobileread.com/wiki/OEB)), first published in 1999.

MIME (Multipurpose Internet Mail Extensions, RFC 2045) gives the container its media type. A media type is the standard name for what a blob of bytes contains.

## How the container is supposed to be used

EPUB was meant to be both the format you author in and the format a reader opens. The pieces travel together in one container so the book can be copied as a single object. That container is a zip archive whose filename ends in `.epub`.

Two packing rules matter, and the first of them is still required under EPUB 3.3:

1. The first member of the zip must be an uncompressed file named `mimetype`.
2. Everything else should be stored compressed.

A reading system is expected to open that compressed payload directly. It should not need the book to be unpacked first.

## Where the 2.01 text lives

The 2.01 OPS and OPF specifications, and the OCF 1.01 specification, were published on the [IDPF site](http://www.idpf.org/), along with informational notes that explain what the committees were trying to allow. That host is a historical archive of the old IDPF site, not the live specification home.

### OCF, the zip container

A typical Open Container Format package looks like this:

```text
 mimetype
 META-INF/
   container.xml
   [manifest.xml]
   [metadata.xml]
   [signatures.xml]
   [encryption.xml]
   [rights.xml]
 OEBPS/
   Great Expectations.opf
   cover.html
   chapters/
      chapter01.html
      chapter02.html
      … other HTML files for the remaining chapters …
   images/
      cover.jpg
```

Names in square brackets are optional members. `OEBPS` is only a conventional directory name; the OPF can point at another folder.

#### The mimetype member

The **first** member of the ZIP must be an ASCII file whose name is `mimetype`. Its contents are the container's media type and nothing else: `application/epub+zip`, a **20-character ASCII string**. There is no padding, no CR or LF, no whitespace, and the case must not change.

That member must be stored, not deflated, and it must not be encrypted. The ZIP local-file header must not carry an extra field. The point is that a program such as the Unix `file` command can recognize the container without unpacking it. The usual way to satisfy the rule with ordinary zip tools is to archive `mimetype` by itself first, then add the rest of the files.

#### container.xml

`container.xml` is required, and the filename is fixed. It has to sit in the `META-INF` directory. Every other directory is optional and can be named however the producer likes. `container.xml` records the filename and location of the OPF package document. The other `META-INF` files in the tree above (a manifest, extra metadata, signatures, encryption, and rights) are optional.

### OPF, the package document

The Open Packaging Format ([OPF](https://wiki.mobileread.com/wiki/OPF)) is the document that binds an OPS publication together and adds structure the content files do not carry themselves.

An OPF package does six jobs:

- It names every part of the publication (markup, images, navigation) and gives each a media type.
- It holds publication-level [metadata](https://wiki.mobileread.com/wiki/Metadata). The vocabulary is Dublin Core. What EPUB specifically allows is summarized in the [ePUB metadata section](https://wiki.mobileread.com/wiki/Metadata#ePUB_metadata) of that page.
- It gives the linear reading order.
- It supplies fallbacks when a publication uses an extension OPS does not require.
- It points at a declarative table of contents, the [NCX](https://wiki.mobileread.com/wiki/NCX).
- It may point at optional extras such as embedded fonts.

A short package document:

```xml
 <package version="2.0" xmlns="http://www.idpf.org/2007/opf"
         unique-identifier="BookId">
     <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:opf="http://www.idpf.org/2007/opf">
           <dc:title>Alice in Wonderland</dc:title>
           <dc:language>en</dc:language>
           <dc:identifier id="BookId" opf:scheme="ISBN">
            123456789X
           </dc:identifier>
           <dc:creator opf:role="aut">Lewis Carroll</dc:creator>
           <dc:description>
               The story of a little girl who travels to a new world by walking
               through a looking glass.
           </dc:description>
     </metadata>
     <manifest>
        <item id="intro" href="introduction.html"
                media-type="application/xhtml+xml" />
        <item id="c1" href="chapter-1.html"
                media-type="application/xhtml+xml" />
        <item id="c2" href="chapter-2.html"
                media-type="application/xhtml+xml" />
        <item id="toc" href="contents.xml"
                media-type="application/xhtml+xml" />
        <item id="oview" href="arch.png"
                media-type="image/png" />
     </manifest>
     <spine toc="ncx">
        <itemref idref="intro" />
        <itemref idref="toc" />
        <itemref idref="c1" />
        <itemref idref="c2" />
        <itemref idref="oview" linear="no" />
     </spine>
 </package>
```

`unique-identifier` on the root names which `dc:identifier` is the publication's identity. `spine` is the reading order. An item with `linear="no"` is part of the book but not part of the next-page sequence. `toc="ncx"` points at the NCX navigation document.

#### Required metadata

- **Title** is always required.
- **Creator** is required when the creator is known. `opf:file-as` can give a normalized name order, and `opf:role` can give a role such as `aut` in the example above.
- **Language** is required.
- A **unique identifier** is required. Values discussed for this include DOI, ISBN, JDCN, and UUID, from the [identifier registry](https://idpf.github.io/epub-registries/identifiers/).
- **Date** is not required, but it is encouraged. An `event` attribute can say what the date means (publication, creation, and so on).

#### The unique identifier

One generator that returns an id when you open it is http://www.famkruithof.net/uuid/uuidgen . Another is https://www.uuidgenerator.net/ . The `opf:scheme` attribute names the authority or the kind of identifier, as in the package example above.

A UUID identifier looks like this:

```xml
<dc:identifier opf:scheme="uuid">50f9f8b1-8a81-4dd5-b104-0766188d7d2c</dc:identifier>
```

### OPS, the content

The Open Publication Structure is the markup a reading system is expected to render.

The design goal was a small shared set of rules so that publishers, authors, and their tools could count on fidelity, accuracy, accessibility, and presentation across reading systems, while staying close to markup people already used. The same rules are what let one source file be handed to many reading systems and look reasonably alike on each of them.

EPUB 3 replaced this vocabulary. The successor is described under [Content Documents](https://wiki.mobileread.com/wiki/EPub_3#The_Content_Documents).

#### XHTML

OPS content is [XHTML](https://wiki.mobileread.com/wiki/XHTML), which is a fixed XML vocabulary, so a content document starts with an XML declaration:

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
```

The `encoding` value names the [character set](https://wiki.mobileread.com/wiki/Characters) used in that file. The default is Unicode UTF-8. UTF-16 must also be supported. Support for an encoding does not mean the embedded font has to contain every glyph.

A conforming OPS document must accept the following XHTML constructs. The element lists are informative, not a second copy of the DTD.

| XHTML 1.1 module | Elements (informative) | Notes |
| --- | --- | --- |
| Structure | body, head, html, title | The default rendering of `body` matches `page-break-before: right` (on a one-page reading system, "always start a new page"). A stylesheet may override that. |
| Text | abbr, acronym, address, blockquote, br, cite, code, dfn, div, em, h1, h2, h3, h4, h5, h6, kbd, p, pre, q, samp, span, strong, var | The optional `cite` attribute on `blockquote`, `q`, `del`, and `ins` may carry a URI for the element's content. A reading system does not have to fetch or use that URI, whether or not the resource is in the manifest. |
| Hypertext | a | A reading system may fetch or render a URI that is outside the manifest (a resource that is not part of the publication). It does not have to. |
| List | dl, dt, dd, ol, ul, li | |
| Object | object, param | `object` is the preferred way to embed a generic object. If the object's media type is not an OPS core media type, or a `classid` points at some implementation, the element must carry a fallback: another `object`, an `img`, or descriptive text. |
| Presentation | b, big, hr, i, small, sub, sup, tt | `b` is the default rendering of `strong`. `i` is the default rendering of `em`. |
| Edit | del, ins | |
| Bidirectional Text | bdo | |
| [Table](https://wiki.mobileread.com/wiki/Table) | caption, col, colgroup, table, tbody, td, tfoot, th, thead, tr | The basic table set is `caption`, `table`, `th`, `tr`, and `td`. |
| Image | img | The inline `img` element should only refer to OPS core image types: [GIF](https://wiki.mobileread.com/wiki/GIF) (http://www.w3.org/Graphics/GIF/spec-gif89a.txt), [PNG](https://wiki.mobileread.com/wiki/PNG) (RFC 2083), [JPG](https://wiki.mobileread.com/wiki/JPG)/JFIF (http://www.w3.org/Graphics/JPEG), or [SVG](https://wiki.mobileread.com/wiki/SVG) (http://www.w3.org/TR/SVG11/). The required `src` URI must name a resource that is in the manifest. The required `alt` text should be a short, useful description. A reading system may show that text instead of the image or along with it. If `src` is not a core media type and the manifest has no usable fallback, that text is an acceptable fallback. |
| Client-Side Image Map | area, map | |
| Meta-Information | meta | |
| Style Sheet | style | `style` requires a `type` attribute, and the value must be `text/css` or the deprecated `text/x-oeb1-css`. |
| Style Attribute (deprecated) | style attribute | |
| Link | link | `link` can express several relationships to other documents. A reading system must recognize an external stylesheet given by `href` together with `rel="stylesheet"` or `rel="alternate stylesheet"`. |
| Base | base | The root of an EPUB is the top of the file hierarchy inside the container. |

## DRM

EPUB 2.01 does not bless any one [DRM](/wiki/formats/drm/) system, but the container leaves room for one. The scheme that was most widely used when the source page was current is the one built into [Adobe Digital Editions](https://wiki.mobileread.com/wiki/Adobe_Digital_Editions). [OverDrive](https://wiki.mobileread.com/wiki/Overdrive) licensed it for library lending, and many other publishers used it as well. The lock is applied to individual files inside the EPUB container, not as a single wrapper around the zip. Other systems named on the source page are a [Barnes & Noble](https://wiki.mobileread.com/wiki/Barnes_and_Noble) variant served by Adobe's DRM servers, and Apple's [FairPlay](https://wiki.mobileread.com/wiki/FairPlay_DRM) as used by [iBooks](https://wiki.mobileread.com/wiki/IBooks) on the [iPad](https://wiki.mobileread.com/wiki/IPad) and [iPhone](https://wiki.mobileread.com/wiki/IPhone).

[Fonts](https://wiki.mobileread.com/wiki/Fonts) embedded in the book can be locked on their own. There is also font obfuscation, which is lighter than a full book lock. The specification defines one obfuscation method. Adobe defined a slightly different one, and Adobe's variant is the one that came to dominate. Obfuscation runs an XOR over the embedded font bytes so the font cannot be lifted out and reused as a standalone file. The reason is the copyright claim of the font designer, not a lock on the book's text.

A library loan can carry a rights file. The source page shows this path and this document:

```text
 \META-INF\right.xml
```

```xml
 <permissions>
  <display>
   <until>2015-08-01T22:00:00Z</until>
  </display>
  <play>
   <until>2015-08-01T22:00:00Z</until>
  </play>
 </permissions>
```

`display` and `play` here expire together, at the UTC instant in `until`. That is a description of how a time-limited loan is expressed. It is not a recipe for removing the lock. In some countries removal is illegal on its own, and in the United States the DMCA prohibits circumvention. That legal boundary is stated on the [DRM](/wiki/formats/drm/) page. This article does not name removal tools or steps.

## How OPS relates to other standards

**NVDL.** The specification uses NVDL (see http://standards.iso.org/ittf/PubliclyAvailableStandards/c038615_ISO_IEC_19757-4_2006(E).zip ) to say, without ambiguity, how its schemas interact. NVDL can describe validation that crosses several XML schema languages. The normative NVDL definition for OPS is Appendix A of that specification. A reading system is not required to validate OPS documents with an NVDL tool, though such tools exist and can be used.

**XHTML and DTBook.** The committee kept part of the XHTML 1.1 modules, and [DTBook](https://wiki.mobileread.com/wiki/DTBook), as preferred vocabularies, because tools, backlists, and production habits already used them. Producers can keep using that content and that experience. The preferred set is not all of XHTML 1.1. Leaving elements out was deliberate: reading systems may be short on power and on screen, and the modules that were kept were chosen to stay in line with where XHTML was heading at the time. Constructs already deprecated in XHTML 1.1 are either deprecated here or left out, and most of those cases have a CSS equivalent. Presentational features that are not in XHTML are also done with stylesheets.

**CSS.** The style language is based on CSS 2 (http://www.w3.org/TR/CSS2/). The stylesheet media type `text/x-oeb1-css` is deprecated; use `text/css`. Not every CSS 2 feature is in the EPUB subset. There are also `oeb-` extensions (`oeb-page-head`, `oeb-page-foot`, `oeb-column-number`). Many EPUB readers do not implement those extensions either.

**XML.** OPS is [XML](https://wiki.mobileread.com/wiki/XML) because the syntax is general, strict, and likely to survive a change of rendering technology. A defined grammar makes implementations cheaper and reduces the ways two systems can disagree. XML is not tied to one element set, it has a story for international text, and it favors markup that names the parts of a document so that layout and other processing can be automated. A reading system must be an XML processor as XML 1.1 defines that term. Every OPS content document must be valid against its schema.

**Namespaces.** Reading systems must process XML namespaces according to the Namespaces in XML recommendation (http://www.w3.org/TR/xml-names11/), for example:

```xml
 xmlns:ops="http://www.idpf.org/2007/ops"
```

**Dublin Core.** [Dublin Core](https://wiki.mobileread.com/wiki/Dublin_Core) is the metadata vocabulary for an EPUB. The source page's Dublin Core note says that only id, title, and language are required, and that other entries are encouraged. The creator should of course be filled in when the creator is known. That matches the required-metadata list above: creator is required only when it is known.

## Readers

The software and devices below are the catalog on the MobileRead page as of its 2021 revision. Several phone platforms in that list are discontinued, and the hardware entries are period notes, not a 2026 buying guide. [Stanza](https://wiki.mobileread.com/wiki/Stanza) is a dead product line: the iOS app looks unmaintained since August 2013.

### Software

- [Adobe Digital Editions](https://wiki.mobileread.com/wiki/Adobe_Digital_Editions) reads both Adobe-DRM EPUB and EPUB with no DRM.
- [AlReader](https://wiki.mobileread.com/wiki/AlReader) reads many other formats as well. The source lists it for Windows Mobile, Pocket PC, and Windows. Windows Mobile is a discontinued platform.
- [AZARDI](https://wiki.mobileread.com/wiki/AZARDI) reads EPUB and checks conformance.
- [Bookworm](https://wiki.mobileread.com/wiki/Bookworm).
- [Calibre](https://wiki.mobileread.com/wiki/Calibre) for [Windows](https://wiki.mobileread.com/wiki/Windows), Mac OS X, and [Linux](https://wiki.mobileread.com/wiki/Linux).
- [Cool Reader](https://wiki.mobileread.com/wiki/Cool_Reader) for Windows, Linux, and [Android](https://wiki.mobileread.com/wiki/Android).
- [EPUBReader](https://wiki.mobileread.com/wiki/EPUBReader), a Firefox extension, on any platform Firefox runs on.
- [Freda](https://wiki.mobileread.com/wiki/Freda) for Windows 8/RT, Windows Phone 7/8, and Windows Mobile 2003, 5.x, and 6.x. It also reads TXT and FB2. Windows Phone and Windows Mobile are discontinued platforms.
- [FBReader](https://wiki.mobileread.com/wiki/FBReader) for Windows, Linux, and others.
- [OpenBerg Lector](https://wiki.mobileread.com/wiki/OpenBerg_Lector), a browser plugin.
- [Stanza](https://wiki.mobileread.com/wiki/Stanza), historical, for Windows, Mac OS X, and iPhone. See the note above.
- [i2Reader](http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=322680924&mt=8) for iPhone. The link is the source page's App Store URL.
- [ZuluReader](https://wiki.mobileread.com/wiki/ZuluReader) reads EPUB and [RTF](https://wiki.mobileread.com/wiki/RTF) on Windows Mobile Pocket PC and Smartphone. That platform is discontinued.
- [QuickReader](https://wiki.mobileread.com/wiki/QuickReader) for iPhone, iPod Touch, and iPad, covering the [iOS](https://wiki.mobileread.com/wiki/IOS) devices of that period.
- [MegaReader](http://www.megareader.net) for iPhone, iPod Touch, and iPad.
- [txtr eBook Reader](http://txtr.com/install/) for Android, iPhone, iPod Touch, and iPad. txtr as a product line is historical.
- [Reader](https://github.com/Yetangitu/owncloud-apps/tree/master/files_reader), a multi-format reader for Nextcloud (the source page spells it "Nexctcloud") and [ownCloud](https://owncloud.com) personal servers. Besides EPUB it reads CBR and CBZ. The Nextcloud site is https://nextcloud.com/.

### Hardware

These are the devices the 2021 page listed, with the firmware notes it recorded. They are not a current support matrix. The iPad line in particular is historical: the source says the iPad reads only DRM-free EPUB, which describes early iBooks behavior, not Apple Books today.

- [Apple iPad](https://wiki.mobileread.com/wiki/IPad). The source page says DRM-free EPUB only.
- [Sony Reader PRS-700](https://wiki.mobileread.com/wiki/PRS700). Sony's readers also supported Adobe ADEPT DRM for EPUB and PDF.
- [Sony Reader PRS-505](https://wiki.mobileread.com/wiki/PRS505). Firmware 1.1 (July 2008) added EPUB, among other changes.
- [Sony Reader PRS-500](https://wiki.mobileread.com/wiki/PRS500). A November 2009 firmware update added EPUB, among other changes.
- [PRS-600](https://wiki.mobileread.com/wiki/PRS600) and [PRS-300](https://wiki.mobileread.com/wiki/PRS300) use ADE.
- [Hanlin V3](https://wiki.mobileread.com/wiki/Hanlin_V3) and its clones ([BeBook](https://wiki.mobileread.com/wiki/Bebook), [EZ Reader](https://wiki.mobileread.com/wiki/EZ_Reader), and the rest of the [dealer and OEM list](https://wiki.mobileread.com/wiki/Hanlin_V3#Dealers_and_OEM_customers)). Originally no DRM. Firmware from August 2009 switched to DRM-capable [ADE](https://wiki.mobileread.com/wiki/ADE).
- [Hanlin V5](https://wiki.mobileread.com/wiki/Hanlin_V5) and its clones use ADE.
- [JetBook](https://wiki.mobileread.com/wiki/JetBook). Later firmware uses ADE. See also [JetBook Lite](https://wiki.mobileread.com/wiki/JetBook_Lite).
- [Bookeen Cybook Opus](https://wiki.mobileread.com/wiki/Bookeen_Cybook_Opus), full support through ADE.
- [Netronix EB-600](https://wiki.mobileread.com/wiki/EB-600) and its clones. Later units shipped with ADE; the source page says to confirm before buying. See [Netronix](https://wiki.mobileread.com/wiki/Netronix).
- [Hanvon WiseReader N516](https://wiki.mobileread.com/wiki/N516) also reads PDF.
- [Onyx Boox](https://wiki.mobileread.com/wiki/Boox60) also reads FB2 and PDF.
- [Barnes & Noble NOOK](https://wiki.mobileread.com/wiki/Nook) reads EPUB and PDF.
- [Chapters/Indigo Kobo](https://wiki.mobileread.com/wiki/Kobo) reads EPUB and PDF.
- [BK6000](https://wiki.mobileread.com/wiki/BK6000) reads DRM-free EPUB, FB2, HTML, and PDF, including a reflow mode for PDF.

## Software for making and editing EPUB

Editing, in the sense of the first list, means changing the source and building a new EPUB. The second list can open an EPUB that already exists.

### Builders

- [Adobe InDesign](http://www.adobe.com/products/indesign/)
- [Apple Pages](http://www.apple.com/iwork/pages/) exports EPUB. Pages '09, part of [iWork](https://wiki.mobileread.com/wiki/IWork) '09, was Mac OS X only, and the export needed the latest software update of that release before it appeared.
- [Atlantis Word Processor](http://www.atlantiswordprocessor.com/en/help/index.php?page=html/ebook.htm) turns TXT, RTF, DOC, and DOCX into EPUB, with a multi-level contents, embedded fonts, and batch conversion.
- [DAISY Pipeline](https://wiki.mobileread.com/wiki/DAISY_Pipeline), production and checking.
- [eCub](https://wiki.mobileread.com/wiki/ECub), a simple builder for EPUB and MobiPocket.
- [ePubSTAR](http://www.by-smart.com/epubstar/epubstar_en.html) converts Word, TXT, and CHM to EPUB 2 or EPUB 3.
- [EPubPack](https://wiki.mobileread.com/wiki/EPubPack) is narrow on purpose. It builds an EPUB from a folder that already has the right layout, and it can repack an EPUB you unpacked.
- [ePUB Tools](http://code.google.com/p/epub-tools/), open-source tools for creating and checking EPUB. The Google Code URL is a historical host.
- [ePub Zip for Mac OS X](http://www.mobileread.com/forums/showthread.php?t=55681), a forum utility that makes an EPUB when a folder is dropped on it. Citation only.
- [EScape](https://wiki.mobileread.com/wiki/EScape), an OpenOffice ([ODT](https://wiki.mobileread.com/wiki/ODT)) add-on, for non-commercial use.
- [Jutoh](http://www.jutoh.com), an inexpensive WYSIWYG ebook editor for Windows, Mac OS X, Linux, FreeBSD, and Solaris x86.
- [OpenBerg Rector](http://openberg.sourceforge.net/?page_id=54).
- [Writer2ePub](https://wiki.mobileread.com/wiki/Writer2ePub), an OpenOffice Writer macro that saves EPUB directly.
- [Scrivener](http://www.literatureandlatte.com/scrivener.php), a writing application with a configurable EPUB export. It started on Mac OS X. The source page says Windows was supported by then and the Linux build was still beta.
- [RoboHelp](https://wiki.mobileread.com/wiki/RoboHelp) from Adobe, for Windows.
- [Moopato eBook Writer](http://moopato.com), distraction-free writing in Markdown, building EPUB 2 and [MOBI](/wiki/formats/mobi/). Windows and Mac OS X.

See also [EPUB programming](https://wiki.mobileread.com/wiki/EPub_programming) on MobileRead Wiki.

### Editors

- [Kotobee](https://wiki.mobileread.com/wiki/Kotobee), authoring software for interactive books.
- [Sigil](https://wiki.mobileread.com/wiki/Sigil) creates and edits EPUB files directly.
- [Calibre](https://wiki.mobileread.com/wiki/Calibre) is a library and conversion tool, and it includes an editor the source page describes as capable and still improving at the time.
- [Altova XMLSpy](http://www.altova.com/xmlspy/epub-editor.html), a commercial editor with a free trial. The source page labels this link "Atova.com"; the host is Altova.
- [IGP Digital Publisher](https://wiki.mobileread.com/wiki/IGP_Digital_Publisher) for Windows.
- [BlueGriffon EPUB](https://wiki.mobileread.com/wiki/BlueGriffon), a [WYSIWYG](https://wiki.mobileread.com/wiki/WYSIWYG) editor and reader based on the BlueGriffon web editor. Windows, Mac, and Linux. It can produce EPUB 3 and EPUB 2.
- [PubCoder](http://www.pubcoder.com/en/) was in a free beta when the source page recorded it, aimed at [EPUB 3](https://wiki.mobileread.com/wiki/EPub_3) and [KF8](https://wiki.mobileread.com/wiki/KF8), and tuned for [iBooks](https://wiki.mobileread.com/wiki/IBooks), [Readium](https://wiki.mobileread.com/wiki/Readium), [Kobo](https://wiki.mobileread.com/wiki/Kobo), and [Kindle](https://wiki.mobileread.com/wiki/Kindle). Treat the "free beta" note as historical.
- [Tweak EPUB](https://wiki.mobileread.com/wiki/Tweak_EPUB) opens the container and lets an external editor change pieces of it.
- [EPUB Optimizer](https://wiki.mobileread.com/wiki/EPub_Optimizer) recompresses images and drops unused glyphs from embedded fonts.
- [Chapters](http://www.twobytesoftware.com) opens, creates, and edits EPUB on the Mac.
- [EPUB Metadata Editor](https://wiki.mobileread.com/wiki/EPub_Metadata_Editor) views and edits [metadata](https://wiki.mobileread.com/wiki/Metadata).

### Converters

- [Calibre](https://wiki.mobileread.com/wiki/Calibre). The source page says to use the hammer icon on the toolbar and set the default output format to EPUB.
- [ePuper](http://www.epuber.de/), a free German program that turns newspaper websites into EPUB.
- [eBook Converter](http://www.ebook-tool.com/ebook-converter.htm) covers PDF to EPUB, EPUB to PDF, EPUB to Mobi, and Mobi to EPUB.
- [Feedbooks](http://www.feedbooks.com) can turn an uploaded text into an EPUB preview. The source page says you do not have to press publish; edit the text and download the preview.
- A Python converter posted by MishaS ([forum thread](http://www.mobileread.com/forums/showthread.php?p=78356), citation only). A later [oeb2epub](http://bazaar.launchpad.net/%7Emishas/%2Bjunk/ebook-tools/download/mss%40mawhrin.net-20080321200811-yba03okmnf49sycn/oeb2epub-20071117163354-w7j1br3qofyzd48a-2/oeb2epub) lived in [that Launchpad branch](https://code.launchpad.net/~mishas/+junk/ebook-tools).
- [Stanza](https://wiki.mobileread.com/wiki/Stanza), historical, converted on PC and Mac and usually stripped formatting first.
- [Web2FB2](http://web2fb2.net/) turns a URL into FB2 and EPUB.
- [Comics2Reader](http://www.mmsoft.info) turns a set of images into an EPUB and into several other formats.
- [Wikipedia4epub](http://rampa.sk/static/wikipedia4epub.html) downloads a Wikipedia article and builds an EPUB.
- [EPUB to Kindle converter](http://epubkindle.com/) turns EPUB into a Kindle file.
- [Word to ePub](http://hdvideoconverter-mac.com/convert-word-to-epub.html), commercial software that converts among nine office formats: PDF, DOC, DOCX, images, HTML, ODT, RTF, TXT, and EPUB.
- [NEWSTOEBOOK.COM](http://newstoebook.com/) turns an RSS or Atom feed into EPUB and [MOBI](/wiki/formats/mobi/). The source page includes Google Reader subscriptions in that claim. Google Reader is a discontinued product (shut down in 2013).
- [Text2Epub for OS X](http://bluezbox.com/text2epub.html), a commercial Mac OS X app that turns plain text into EPUB.
- [Online EPUB to PDF](http://www.pdfaid.com/epub-to-pdf-conversion.aspx).
- [Pandoc](https://wiki.mobileread.com/wiki/Pandoc) can write EPUB 2 or EPUB 3 from many input formats.

### Validators

- The [W3C CSS validator](http://jigsaw.w3.org/css-validator/#validate_by_upload), by file upload.
- [EpubCheck](https://github.com/IDPF/epubcheck). It needs Java 1.6 or newer and runs on any operating system that has that Java. The GitHub project is the maintained checker; the IDPF organization name on that URL is historical branding.
- [ePUB Validator](http://www.ebook-tool.com/epub-validator.htm), a graphical front end on EpubCheck.
- [FlightCrew](http://code.google.com/p/flightcrew/), which the source page calls a better EPUB checker, and which was also built into [Sigil](https://wiki.mobileread.com/wiki/Sigil). The Google Code URL is a historical host.
- An [epubcheck wrapper for Mac OS X](http://www.mobileread.com/forums/showthread.php?t=55576) that adds drag-and-drop. Forum citation only.

### Utilities

- Info-ZIP and 7-Zip can pack and unpack the archive. 7-Zip can open a `.epub` without renaming it to `.zip`. See [ZIP](https://wiki.mobileread.com/wiki/ZIP).
- [EPubHub](https://wiki.mobileread.com/wiki/EPubHub) edits the container and its contents in place.
- [ePUB Fixer](https://github.com/maforget/epubfixer) does quick table-of-contents repairs and other edits.
- [EPUB Metadata Editor](https://wiki.mobileread.com/wiki/EPub_Metadata_Editor), for the package metadata.
- The [MobileRead EPUB forum](http://www.mobileread.com/forums/showthread.php?t=175824) is where contributors sometimes post one-off tools. Citation only; this site does not copy those posts.
- [Calibre](https://wiki.mobileread.com/wiki/Calibre) converts EPUB to and from other formats.

## Practical notes

- A book that puts all of its content in one XHTML file can still conform. It will also load that entire file into memory, which is a bad trade for anything of normal length. Split a normal book into several files, usually one per chapter.
- Some mobile devices fail on a large EPUB because one XHTML file is too big, not because the zip itself is large. If you can unpack the book, split that file. As a performance rule of thumb, keep each file under about 300K.
- The formal table of contents is the [NCX](https://wiki.mobileread.com/wiki/NCX). Not every reading app honors it. The source page says this limitation is also recorded in the [DTBook](https://wiki.mobileread.com/wiki/DTBook) standard.
- iBooks will not pick up a cover image unless the OPF carries `<meta name="cover" content="[cover image id]" />`, where the id is the cover image's id in the manifest.
- Cover artwork is discussed on [Ebook Covers](https://wiki.mobileread.com/wiki/Ebook_Covers).
- Worked examples of particular features are on [example ePub](https://wiki.mobileread.com/wiki/Example_ePub).

### HTML

- Markup has to be real XHTML: every tag closed, properly nested. [HTML Tidy](https://wiki.mobileread.com/wiki/Htmltidy) and [EpubCheck](https://wiki.mobileread.com/wiki/EpubCheck) are the tools the source page recommends for finding the mistakes.
- [ADE](https://wiki.mobileread.com/wiki/ADE) will not treat an image as a link unless the link sits inside a paragraph. `<p><a href="..."><img ...></a></p>` works. A bare `<a href="..."><img ...></a>` does not.
- Ordinary data tables are often wider than the screen and get clipped. Where the content allows it, turn the table into a list separated by `<hr/>`. See [Tabular Reflow](https://wiki.mobileread.com/wiki/Tabular_Reflow).
- Use tables rarely. A lot of [CHM](https://wiki.mobileread.com/wiki/CHM)-style HTML wraps the whole page in one table, and that pattern causes a run of layout bugs.
- Do not assume the reader has a Back control that returns from a link. If a note link jumps to an endnote, put a link on the note that returns to the citation.

### CSS in general

- With ordinary pagination, the `margin-top` of the first element on a page is treated as zero, and the `margin-bottom` of the last element on a page is treated as zero.
- If you force a break with `page-break-before` or `page-break-after`, zeroing that first top margin is **up to the reader**. ADE does zero it. Many other readers do not. To get the same result everywhere, either use two elements (one carries `page-break-before`, the other carries `margin-top`) or use `padding-top` instead.
- Strip decorative colors. A lot of "color" becomes a light gray on e-ink. Where you can change the color, black or white is the reliable choice.
- Do not put text inside a destination anchor (`<a id="...">`). Some readers draw that text as a link, underlined and blue.
- A `<pre>` block can run past the right margin. Reduce its font size, or allow the lines to wrap (`pre-wrap`). If that still fails, reflow the block to about 70 characters at 6pt.
- Some readers misbehave when one embedded font is given several `local()` names.
- For a drop cap, do not set the vertical position with `padding-bottom`. Any non-zero padding makes many readers compute that position wrong. Margin is the more compatible control.
- On both the paragraph and the drop cap, set `line-height` explicitly to `1.2em` or more. Some readers enforce a minimum line height. Some fonts have an inherent line height under `1.2em`. Those readers may force `1.2em` and the cap then sits too high or too low.
- Where a reader can hyphenate automatically, turn it on with at least `hyphens`, `-epub-hyphens`, `-webkit-hyphens`, `-moz-hyphens`, and `adobe-hyphenate`. The first three follow the same rules as the CSS 3 `hyphens` property. `adobe-hyphenate` is similar, but its manual-only value is `explicit` rather than `manual`.

Worked CSS is on [CSS HowTo](https://wiki.mobileread.com/wiki/CSS_HowTo).

### iBooks

- To make iBooks actually use the font you chose, add a `com.apple.ibooks.display-options.xml` file. The [iBooks](https://wiki.mobileread.com/wiki/IBooks) page has the details.
- iBooks avoids text running into the margin (and then being clipped) by setting `-webkit-line-box-contain: block glyphs replaced;`. A drop cap that sticks up above its paragraph can then be positioned wrongly. If the same cap is fine in ADE and in a browser, try adding `-webkit-line-box-contain: block inline replaced !important;` to the `html` element's style. A longer write-up is in this [forum post](http://www.mobileread.com/forums/showthread.php?p=3060183#post3060183) (citation only).
- Avoid small font sizes inside SVG. iBooks can shift that text badly.
- If an SVG `<text>` element uses a matrix transform, do not put more than one `<tspan>` inside it. A second `<tspan>` often paints on top of the first. Give the second run its own `<text>` element.
- Later iBooks versions, as of the source page's last check, set `-webkit-font-smoothing` on the universal selector of Apple's internal stylesheet. If you override that property anywhere, you have to override it the same way, with a universal selector such as `* { ... }`. Otherwise the override is not inherited, and italic text can render darker than the text around it. The same treatment is a reasonable precaution for `font-smooth` and `text-rendering`.
- As of that same check, iBooks does not appear to support the `epub:switch` element.

### ADE

- [ADE](https://wiki.mobileread.com/wiki/ADE) may drop an entire [CSS](https://wiki.mobileread.com/wiki/CSS) file because of one error. Validate the file, and chase bugs that show up only in ADE. ADE also drops the whole file when it sees a feature it does not understand, which includes anything past CSS 2. Keep `@media` and `@page` rules in their own stylesheet so that a dropped file does not take the rest of the design with it. Do the same for Internet Explorer's `filter` property.
- ADE, and the Nook builds based on it, do not support `font-variant: small-caps`. The workaround is a separate small-caps font whose lowercase glyphs are the small-cap shapes.
- If you use that separate font, rather than a normal font with the OpenType `smcp` feature, put `font-variant: small-caps` on the rule that requests the font **and** on the `@font` rule that declares it. Without the declaration, some readers, notably the Sony Reader, fall through to the next font that has `smcp` or its own small-caps face.
- ADE and ADE-based Nook do not support the `:before` pseudo-element together with `content:`, unless this was fixed after the source page was written.
- Do not trust the cascade. ADE-based readers sometimes fail to rank a class on the element itself above classes on ancestor elements. In a normal browser, if one rule is `div.preface div.section p + p` and an opposing rule is `p.classname`, the class on `p` wins, because a class on the element's own selector outranks any number of ancestor elements. ADE's math is wrong, and the longer selector wins.
- On some ADE-based iOS readers (reported on the Sony Reader and on Bluefire), a drop cap whose paragraph starts at the top of the screen, which is common in landscape, can lose its top. Those readers collapse the paragraph margin into the page margin, ignoring the margin on the cap itself, and they clip anything that crosses the page margin. Use padding for the top of those paragraphs. Padding is not collapsed into the page margin.
- ADE styles a non-link anchor such as `<a id="foo">...</a>` as a link, including the underline. Leave destination anchors empty.
- ADE mishandles some empty-element tags, such as `<a id="foo"/>`, and treats the element as running on to the end of the file.
- ADE often inserts a line break at an element boundary even when there is no whitespace there. A tag that wraps only part of a word can therefore break the word. It also appears to ignore `white-space: nowrap`. The source page notes that `<nobr>` might avoid the break, that this was not tested, and that it is very likely invalid EPUB. It is recorded here as an observed quirk, not as a recommended workaround.
- ADE ignores `text-align` on `<hr>`. To center a rule of a chosen width, subtract that width from 100%, divide by two, and set the result as the left margin.
- ADE can split a long paragraph that crosses pages in the wrong place. The experiments noted on the source page saw this only past about 1024 characters.
- In centered or right-aligned content, ADE mishandles a special character on the line after a `<br>`. If that line starts with `(`, `{`, or `[`, ADE indents the line. Either start the line with a non-breaking space or stop using `<br>`.
- ADE treats `margin: auto` as `margin: 0`. The source page notes that this matches the flawed EPUB 2 specification, and that it makes centering a block difficult. Workarounds are discussed in these forum threads, as citations only: [thread 161097](http://www.mobileread.com/forums/archive/index.php/t-161097.html) and [post 1013062](http://www.mobileread.com/forums/showpost.php?p=1013062&postcount=18).
- If a float does not fit on the page, ADE clips it at the page edge. In some cases the first line of the following block, the one that clears the float, disappears as well.
- Older ADE implements hyphenation with the non-standard property `adobe-hyphenate`, whose values are `auto`, `explicit`, and `none`, rather than with the standard `hyphens` property.

### Nook

These are in addition to the ADE quirks above.

- The Nook does not like a centered heading (`h1`, `h2`, and the rest). Use a `div` when the centered text has to be reliable.
- Nested blocks and `inline-block` are fragile on some readers. The iOS Nook, in particular, seems to treat the margin as zero while painting any block inside an `inline-block`. If iOS Nook matters, do not build a drop cap out of nested blocks.
- Some readers compute a block's height wrong when the height is in `em`. The iOS Nook tends to make the box too small, so the drop cap overlaps the text. Find the smallest and largest heights that look right in a normal browser (WebKit or Firefox) and pick a value near the middle of that range. The source page says this was reported to Barnes & Noble.
- On the iOS Nook, turning off publisher defaults turns white text black, even when the background is black. Also reported to Barnes & Noble.
- On the iOS Nook the reader can change line spacing. The app does not multiply that new spacing by the `line-height` factor in the CSS, so a drop cap is correct only at the tightest spacing. The source page records no fix, and says the bug was reported to Barnes & Noble.
- With publisher defaults off, the Nook seems to apply a font only when the immediately enclosing tag sets one. Fonts set further up the tree are ignored. (The source author was not sure whether that is the real rule, or whether the app simply sets a default font on every element.) That breaks the `<span>` pattern people used for early iBooks:

```xml
<!-- This is styled -->
<p class="styledwithfont">Foo</p>

<!-- This is not -->
<p class="styledwithfont"><span>Foo</span></p>
```

- An extra span like that, together with a transparent font on the paragraph, yields text that is invisible while publisher defaults are on and visible in the Nook's own font mode.
- Because of that behavior, overriding the reader's chosen font while publisher defaults are off has to be done on the immediately enclosing element: on the paragraph, and again on every tag inside those paragraphs, with as much specificity as you can give it. A single element name is not enough specificity.

### Kobo

On Kobo (at least the iOS app), a `body` with left and right margins of zero shows part of page 2 on page 1, and so on, and you cannot reach the last page of the chapter.

### Apabi Reader

In Apabi Reader, a transparent white border is painted black.

### Stanza

Historical. The iOS [Stanza](https://wiki.mobileread.com/wiki/Stanza) app ignores `text-align: center` and honors `text-align: center !important`. If centering is part of the design, add `!important`. The iOS app appears to have been unmaintained since August 2013.

## Tutorials

The source page collected these walkthroughs. Several hosts are old. Forum threads are citations, not pages this site reprints.

- [An EPUB tutorial](http://sites.google.com/site/spontaneousderivation/an-epub-tutorial) on Google Sites.
- [Creating an EPUB document](http://www.epubbooks.com/blog/183/creating-an-epub-document) at epubBooks.com.
- [Creating EPUB files](http://www.snee.com/bobdc.blog/2008/03/creating-epub-files.html) on the bobdc blog.
- [EPUB format construction guide](http://www.hxa.name/articles/content/epub-guide_hxa7241_2007.html) from hxa, including notes on [Adobe Digital Editions](https://wiki.mobileread.com/wiki/Adobe_Digital_Editions) limits.
- [EPUB tutorial on IBM developerWorks](http://blog.threepress.org/2008/12/01/epub-tutorial-on-ibm-developerworks/), linked from threepress.org.
- [jedisaber's EPUB tutorial](http://jedisaber.com/eBooks/).
- [MobileRead step-by-step guide](http://www.mobileread.com/forums/showthread.php?t=43230), forum citation.
- [Simple EPUB tutorial](http://www.mobileread.com/forums/showthread.php?t=130390), forum citation.
- [Tutorial on the EPUB format](http://www.web-books.com/Publishing/epub.htm).
- [ePublicans EPUB better-practices guide](http://thinkubator.ccsp.sfu.ca/wikis/epubguide/ToC).
- [Where an EPUB starts, and what the OPF guide is](http://epubsecrets.com/where-do-you-start-an-epub-and-what-is-the-guide-section-of-the-opf-file.php).

## EPUB 3, in brief

EPUB 3 is a different generation. MobileRead Wiki has a longer page. The links below are the historical IDPF drafts and the announcement, not the live standard. The live text is EPUB 3.3, linked in the status note at the top of this page. idpf.org is an archive.

- [EPUB 3](https://wiki.mobileread.com/wiki/EPub_3) on MobileRead Wiki, which points at the old specification URL http://idpf.org/epub/30
- The revision project, historically at http://code.google.com/p/epub-revision/
- The [public-draft announcement](http://idpf.org/news/epub-3-specification-public-draft-released)

That generation is built from [HTML5](https://wiki.mobileread.com/wiki/HTML5), [CSS](https://wiki.mobileread.com/wiki/CSS), [SVG](https://wiki.mobileread.com/wiki/SVG), [images](https://wiki.mobileread.com/wiki/Images), multimedia, [MathML](https://wiki.mobileread.com/wiki/MathML), [SMIL](https://wiki.mobileread.com/wiki/SMIL), and related pieces. Moving a workflow from EPUB 3.2 to 3.3 was, in the W3C's May 2023 statement, not something that required production changes.

## Further reading

- http://epubzone.org/ was the IDPF's EPUB topic site. Treat it as a historical address.
- [EPUB Tutorial](https://wiki.mobileread.com/wiki/EPub_Tutorial), a production introduction.
- [CSS HowTo](https://wiki.mobileread.com/wiki/CSS_HowTo).
- [OPS 2.0 final specification](http://www.openebook.org/2007/ops/OPS_2.0_final_spec.html), a historical copy.
- [OPS 2.0.1 specification](http://idpf.org/epub/20/spec/OPS_2.0.1_draft.htm), historical, on the archived IDPF host.
- [OPF 2.0 final specification](http://www.openebook.org/2007/opf/OPF_2.0_final_spec.html), historical. The metadata requirements are in this document.
- http://idpf.org/epub/201, the historical EPUB 2.0.1 entry point on the archived IDPF host.
- Two relatives that are not compatible with ordinary EPUB: [mpub](https://wiki.mobileread.com/wiki/Mpub) (a mobile profile) and [fixed-layout EPUB](https://wiki.mobileread.com/wiki/Fixed_layout_ePub).
- [EPUB Reader Test](https://wiki.mobileread.com/wiki/EPub_Reader_Test), a page for comparing which features each reader implements.
- The [construction guide](http://www.hxa.name/articles/content/epub-guide_hxa7241_2007.html) again, including Adobe extensions.
- [Ebook conversion services](https://wiki.mobileread.com/wiki/EBook_Conversion_Services), the MobileRead list of companies that convert books. This site does not sell conversion.
