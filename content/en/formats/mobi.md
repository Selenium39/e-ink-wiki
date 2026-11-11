---
title: "MOBI and AZW: The KF7 Binary Layout"
type: translated
original_title: "MOBI"
source_url: https://wiki.mobileread.com/wiki/MOBI
original_author: "MobileRead Wiki contributors (DaleDe, Pdurrant, Hex, and others)"
translated_at: "2026-11-11"
order: 2
description: "Legacy MOBI and AZW (KF7) layout for MobiPocket and early Kindle files, including the PalmDOC, MOBI, and EXTH header tables, index records, compression, trailing entries, and FLIS, FCIS, and SRCS records, plus how MOBI DRM is applied. Current Kindle store files are KF8 (AZW3) and KFX."
---

> **Status.** MOBI and AZW (KF7) are legacy. Current Kindle store files are KF8 (AZW3) and KFX. The tables on this page describe KF7 and the MOBI half of a dual KF8 file. This page does not describe KFX internals.
> Adapted from the MobileRead Wiki page [MOBI](https://wiki.mobileread.com/wiki/MOBI) (last revised 2026-04-14). Forum links and download links are citations only; this site does not mirror forum posts. The header fields were reverse engineered. Where the source page marks a field unknown, this edition keeps that mark. No offset below was filled in from anywhere else.

MOBI is the name of the format built for [MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader). Amazon still uses the same container under a different [DRM](/wiki/formats/drm/) scheme and calls the result [AZW](https://wiki.mobileread.com/wiki/AZW). [KindleGen](https://wiki.mobileread.com/wiki/KindleGen) wrote files with that extension which actually hold two books: a MOBI (sometimes called KF7) book and a [KF8](https://wiki.mobileread.com/wiki/KF8) book. The tables here cover the MOBI side of that pair, and a standalone KF7 file. They do not describe the KF8 half beyond the boundary fields the MOBI header uses to find it, and they do not describe KFX.

## What the file is

MOBI is what [MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader) and the [Amazon Kindle](https://wiki.mobileread.com/wiki/Amazon_Kindle) readers open. The extension may be `.mobi` or `.prc`. Either extension is recognized, and either file may or may not carry [DRM](/wiki/formats/drm/). The `.prc` extension exists because [Palm OS](https://wiki.mobileread.com/wiki/PalmOS) only allowed two [file extensions](https://wiki.mobileread.com/wiki/file_extension), `.prc` and `.pdb`.

[Mobipocket](https://wiki.mobileread.com/wiki/Mobipocket) did not allow its DRM scheme to be used on a dedicated ebook reader that also implemented some other DRM. Source documents for the format are [OEB](https://wiki.mobileread.com/wiki/OEB) (Open eBook).

## What changed inside it

MOBI began as [PalmDOC](https://wiki.mobileread.com/wiki/PalmDOC) plus a set of [HTML](https://wiki.mobileread.com/wiki/HTML)-like tags in the text. See [eBook HTML](https://wiki.mobileread.com/wiki/EBook_HTML). Many MOBI files are still that simple form. There is also a higher-compression form that packs the same data with a proprietary Huffman scheme called Huff/cdic. Third-party code that reads the original form is fairly common. Third-party code that reads the Huffman form is not. A Python implementation lives in the [Calibre](https://wiki.mobileread.com/wiki/Calibre) tree as [huffcdic.py](https://github.com/kovidgoyal/calibre/blob/master/src/calibre/ebooks/mobi/huffcdic.py).

Features were added over time, so a new file can fail in an old reader. Source documents follow the [Open eBook](https://wiki.mobileread.com/wiki/Open_eBook) rules.

**AZW and MOBI are the same file format. The difference is the DRM scheme.** [Amazon](https://wiki.mobileread.com/wiki/Amazon) bought MobiPocket. The layout below applies to both extensions.

## Palm container

Like PalmDOC, a Mobipocket file is a [Palm Database](https://wiki.mobileread.com/wiki/PDB#Palm_Database_Format). The header carries a database name, usually the book title and sometimes part of the author's name, at most **31** bytes. The file is identified by creator id `MOBI` and type `BOOK`.

Mobipocket published a thin description of the format, mostly the HTML used in the book text. The official page is gone; the archive copy is the [mobipocket.com developer note](http://web.archive.org/web/20160314093357/http://mobipocket.com/dev/article.asp?BaseFolder=prcgen&File=TagRef_OEB.htm). HTML as Mobi7 used it is also on [eBook HTML](https://wiki.mobileread.com/wiki/EBook_HTML).

## PalmDOC header

The first Palm record holds the Mobipocket details. Its first 16 bytes are almost the PalmDOC header.

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 0 | 2 | Compression | 1 = no compression, 2 = PalmDOC compression, 17480 = HUFF/CDIC compression |
| 2 | 2 | Unused | Always zero |
| 4 | 4 | text length | Uncompressed length of the whole book text |
| 8 | 2 | record count | Number of PDB records that hold the book text |
| 10 | 2 | record size | Maximum size of each text record. Always 4096 |
| 12 | 4 | Current Position | Reading position, as an offset into the uncompressed text |

Two things differ from a PalmDOC file. Compression type 17480 exists, and the Current Position bytes are reused:

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 12 | 2 | Encryption Type | 0 = no encryption, 1 = legacy Mobipocket encryption, 2 = Mobipocket encryption |
| 14 | 2 | Unknown | Usually zero |

Legacy Mobipocket encryption registers the file to a single PID. The current scheme allows more than one PID on the same file. Unless a sentence says otherwise, encryption on this page means the current scheme.

## MOBI header

Most files continue record 0 past those 16 bytes with a MOBI header. Newer files follow that with an EXTH header. Both live in record 0 of the Palm database.

The MOBI header has no official documentation and its length varies. The fields below are a partial identification. Every row from the source page is kept, including fields whose meaning is still unknown. Two hex labels are copied as the source page prints them: offset 252 is labeled `0xfb`, and offset 268 is labeled `0x10b`.

| offset | hex | bytes | content | comments |
| --- | --- | --- | --- | --- |
| 16 | 0x10 | 4 | identifier | The characters M O B I |
| 20 | 0x14 | 4 | header length | Length of the MOBI header, including these 4 bytes |
| 24 | 0x18 | 4 | Mobi type | Kind of Mobipocket file. 2 = Mobipocket Book; 3 = PalmDoc Book; 4 = Audio; 232 = mobipocket? (kindlegen 1.2); 248 = KF8 (kindlegen 2); 257 = News; 258 = News_Feed; 259 = News_Magazine; 513 = PICS; 514 = WORD; 515 = XLS; 516 = PPT; 517 = TEXT; 518 = HTML |
| 28 | 0x1c | 4 | text Encoding | 1252 = CP1252 (WinLatin1); 65001 = UTF-8 |
| 32 | 0x20 | 4 | Unique-ID | Some unique id number (random?) |
| 36 | 0x24 | 4 | File version | Mobipocket format version used by this file |
| 40 | 0x28 | 4 | Ortographic index | Section number of the orthographic meta-index. 0xFFFFFFFF if the index is absent |
| 44 | 0x2c | 4 | Inflection index | Section number of the inflection meta-index. 0xFFFFFFFF if the index is absent |
| 48 | 0x30 | 4 | Index names | 0xFFFFFFFF if the index is absent |
| 52 | 0x34 | 4 | Index keys | 0xFFFFFFFF if the index is absent |
| 56 | 0x38 | 4 | Extra index 0 | Section number of the extra-0 meta-index. 0xFFFFFFFF if the index is absent |
| 60 | 0x3c | 4 | Extra index 1 | Section number of the extra-1 meta-index. 0xFFFFFFFF if the index is absent |
| 64 | 0x40 | 4 | Extra index 2 | Section number of the extra-2 meta-index. 0xFFFFFFFF if the index is absent |
| 68 | 0x44 | 4 | Extra index 3 | Section number of the extra-3 meta-index. 0xFFFFFFFF if the index is absent |
| 72 | 0x48 | 4 | Extra index 4 | Section number of the extra-4 meta-index. 0xFFFFFFFF if the index is absent |
| 76 | 0x4c | 4 | Extra index 5 | Section number of the extra-5 meta-index. 0xFFFFFFFF if the index is absent |
| 80 | 0x50 | 4 | First Non-book index? | Record number of the first record that is not book text, counted from 0 |
| 84 | 0x54 | 4 | Full Name Offset | Offset of the book's full name inside record 0. Not an offset from the start of the file |
| 88 | 0x58 | 4 | Full Name Length | Length of the full name, in bytes |
| 92 | 0x5c | 4 | Locale | Locale code. The low byte is the primary language, 09 = English. The next byte is the dialect, 08 = British, 04 = American. US English is 1033. British English is 2057 |
| 96 | 0x60 | 4 | Input Language | Input language of a dictionary |
| 100 | 0x64 | 4 | Output Language | Output language of a dictionary |
| 104 | 0x68 | 4 | Min version | Oldest Mobipocket version that can read this file |
| 108 | 0x6c | 4 | First Image index | Record number of the first image record, counted from 0. Image records should be contiguous |
| 112 | 0x70 | 4 | Huffman Record Offset | Record number of the first Huffman compression record |
| 116 | 0x74 | 4 | Huffman Record Count | How many Huffman compression records there are |
| 120 | 0x78 | 4 | Huffman Table Offset | |
| 124 | 0x7c | 4 | Huffman Table Length | |
| 128 | 0x80 | 4 | EXTH flags | Bit field. If bit 6 (0x40) is set, an EXTH record is present |
| 132 | 0x84 | 32 | ? | 32 unknown bytes, if the MOBI header is long enough to include them |
| 164 | 0xa4 | 4 | Unknown | Use 0xFFFFFFFF |
| 168 | 0xa8 | 4 | DRM Offset | Offset of the DRM key information in a file that has DRM. 0xFFFFFFFF when there is no DRM |
| 172 | 0xac | 4 | DRM Count | Number of entries in the DRM information. 0xFFFFFFFF when there is no DRM |
| 176 | 0xb0 | 4 | DRM Size | Number of bytes the DRM information occupies |
| 180 | 0xb4 | 4 | DRM Flags | Flags related to the DRM information |
| 184 | 0xb8 | 8 | Unknown | Bytes to the end of the MOBI header. If header length >= 228 (244 when counted from the start of the record) this includes what follows. Use 0x0000000000000000 |
| 192 | 0xc0 | 2 | First content record number | Number of the first text record. Usually 1 |
| 194 | 0xc2 | 2 | Last content record number | Number of the last image record, or of the last text record if there are no images. Includes Image, DATP, HUFF, DRM |
| 196 | 0xc4 | 4 | Unknown | Use 0x00000001 |
| 200 | 0xc8 | 4 | FCIS record number | |
| 204 | 0xcc | 4 | Unknown (FCIS record count?) | Use 0x00000001 |
| 208 | 0xd0 | 4 | FLIS record number | |
| 212 | 0xd4 | 4 | Unknown (FLIS record count?) | Use 0x00000001 |
| 216 | 0xd8 | 8 | Unknown | Use 0x0000000000000000 |
| 224 | 0xe0 | 4 | Unknown | Use 0xFFFFFFFF |
| 228 | 0xe4 | 4 | First Compilation data section count | Use 0x00000000 |
| 232 | 0xe8 | 4 | Number of Compilation data sections | Use 0xFFFFFFFF |
| 236 | 0xec | 4 | Unknown | Use 0xFFFFFFFF |
| 240 | 0xf0 | 4 | Extra Record Data Flags | Bit flags. Some of them say which extra data is appended to each text record. The flags seem to be meaningful for Mobipocket format versions 5 and 6 (and higher?) only when the header length is 228 (0xE4) or 232 (0xE8). Bit 1 (0x1): `<extra multibyte bytes><size>`. Bit 2 (0x2): `<TBS indexing description of this HTML record><size>`. Bit 3 (0x4): `<uncrossable breaks><size>`. Setting bit 2 (0x2) disables `<guide><reference type="start">` |
| 244 | 0xf4 | 4 | INDX Record Offset | If not 0xFFFFFFFF, the record number of the first INDX record built from the NCX |
| 248 | 0xf8 | 4 | Unknown | 0xFFFFFFFF. In newer MOBI files the MOBI header is 256 bytes long and this field is skipped on the way to the EXTH header |
| 252 | 0xfb | 4 | Unknown | 0xFFFFFFFF. In newer MOBI files the MOBI header is 256 bytes long and this field is skipped on the way to the EXTH header |
| 256 | 0x100 | 4 | Unknown | 0xFFFFFFFF. In newer MOBI files the MOBI header is 256 bytes long and this field is skipped on the way to the EXTH header |
| 260 | 0x104 | 4 | Unknown | 0xFFFFFFFF. In newer MOBI files the MOBI header is 256 bytes long and this field is skipped on the way to the EXTH header |
| 264 | 0x108 | 4 | Unknown | 0xFFFFFFFF. In newer MOBI files the MOBI header is 256 bytes long and this field is skipped on the way to the EXTH header |
| 268 | 0x10b | 4 | Unknown | 0. In newer MOBI files the MOBI header is 256 bytes long and this field is skipped on the way to the EXTH header. The MOBI header length is 256, plus 12 bytes from the PalmDOC header, which is why the index here is 268 |

## EXTH header

If the MOBI header says an EXTH header is present, it begins immediately after the MOBI header. Because the MOBI header length varies, EXTH has no fixed offset inside record 0. Some readers ignore the whole EXTH header when the Mobipocket version stored in the MOBI header is 2 or less (possibly 3 or less).

EXTH is also undocumented. Part of what follows is inference.

| bytes | content | comments |
| --- | --- | --- |
| 4 | identifier | The characters E X T H |
| 4 | header length | Length of the EXTH header, including these 4 bytes, not including trailing padding |
| 4 | record Count | Number of records in the EXTH header. The rest of the header is a sequence of EXTH records up to that length |
| | EXTH record start | Repeats until the records are exhausted |
| 4 | record type | A number that identifies what the record holds |
| 4 | record length | Length L of this EXTH record, including the 8 bytes of the type and length fields |
| L-8 | record data | The payload |
| | EXTH record end | Repeats until the records are exhausted |
| p | padding | Null bytes that pad the EXTH header out to a multiple of 4. Omitted when the length is already a multiple of 4. This padding is not included in the EXTH header length |

Many record types have been seen. The list below is every type the source page records, with the meaning that was suggested for it. Usual length is blank where the source page left it blank.

| record type | usual length | name | comments | opf meta tag |
| --- | --- | --- | --- | --- |
| 1 | | drm_server_id | | |
| 2 | | drm_commerce_id | | |
| 3 | | drm_ebookbase_book_id | | |
| 100 | | author | | `<dc:Creator>` |
| 101 | | publisher | | `<dc:Publisher>` |
| 102 | | imprint | | `<Imprint>` |
| 103 | | description | | `<dc:Description>` |
| 104 | | isbn | | `<dc:Identifier scheme='ISBN'>` |
| 105 | | subject | May occur more than once | `<dc:Subject>` |
| 106 | | publishingdate | | `<dc:Date>` |
| 107 | | review | | `<Review>` |
| 108 | | contributor | | `<dc:Contributor>` |
| 109 | | rights | | `<dc:Rights>` |
| 110 | | subjectcode | | `<dc:Subject BASICCode="subjectcode">` |
| 111 | | type | | `<dc:Type>` |
| 112 | | source | | `<dc:Source>` |
| 113 | | asin | A Kindle Paperwhite labels a book "Personal" when this record is missing | |
| 114 | | versionnumber | | |
| 115 | 4 | sample | 0x0001 if the file is only a sample of the book | |
| 116 | | startreading | Position to open on first open, as a 4-byte offset in the file | |
| 117 | 3 | adult | Mobipocket Creator writes this when "Adult only" is checked. The bytes are the text "yes" | `<Adult>` |
| 118 | | retail price | Text, for example "4.99" | `<SRP>` |
| 119 | | retail price currency | Text, for example "USD" | `<SRP Currency="currency">` |
| 121 | 4 | KF8 BOUNDARY Offset | | |
| 122 | | fixed-layout | "true" | |
| 123 | | book-type | "comic" | |
| 124 | | orientation-lock | "none", "portrait", or "landscape" | |
| 125 | 4 | count of resources | | |
| 126 | | original-resolution | "1072x1448" | |
| 127 | | zero-gutter | "true" | |
| 128 | | zero-margin | "true" | |
| 129 | | Metadata Resource URI | | |
| 131 | 4 | Unknown | | |
| 132 | | Unknown | "true" | |
| 200 | 3 | Dictionary short name | Text | `<DictionaryVeryShortName>` |
| 201 | 4 | coveroffset | Add this to the first-image field in the MOBI header to get the PDB record that holds the cover image | `<EmbeddedCover>` |
| 202 | 4 | thumboffset | Add this to the first-image field in the MOBI header to get the PDB record that holds the cover thumbnail | |
| 203 | | hasfakecover | | |
| 204 | 4 | Creator Software | Known values: 1 = mobigen, 2 = Mobipocket Creator, 200 = kindlegen (Windows), 201 = kindlegen (Linux), 202 = kindlegen (Mac). **Warning:** Calibre forges this entry. Ordinary books are disguised as Linux kindlegen 1.2 (201, 1, 2, 33307). Periodicals are disguised as an unpublished Linux kindlegen 2.0 (201, 2, 0, 101) | |
| 205 | 4 | Creator Major Version | | |
| 206 | 4 | Creator Minor Version | | |
| 207 | 4 | Creator Build Number | | |
| 208 | | watermark | | |
| 209 | | tamper proof keys | Kindle, and the Android app, use this to build a PID that is specific to the book | |
| 300 | | fontsignature | | |
| 401 | 1 | clippinglimit | Integer percentage of text that may be clipped. Usually 10 | |
| 402 | | publisherlimit | | |
| 403 | | Unknown | | |
| 404 | 1 | ttsflag | 1 = text-to-speech disabled; 0 = text-to-speech enabled | |
| 405 | 1 | Unknown (Rent/Borrow flag?) | A value of 1 seems to mean the book is a rental | |
| 406 | 8 | Rent/Borrow Expiration Date | If this field is removed from a rental, the book displays as expired in 1969 | |
| 407 | 8 | Unknown | | |
| 450 | 4 | Unknown | | |
| 451 | 4 | Unknown | | |
| 452 | 4 | Unknown | | |
| 453 | 4 | Unknown | | |
| 501 | 4 | cdetype | PDOC = personal document; EBOK = ebook; EBSP = ebook sample | |
| 502 | | lastupdatetime | | |
| 503 | | updatedtitle | | |
| 504 | | asin | An ASIN has been seen copied into this record | |
| 524 | | language | | `<dc:language>` |
| 525 | | writingmode | horizontal-lr has been seen in this record | |
| 535 | | Creator Build Number | 1019-d6e4792 has been seen here. That is a Kindlegen 2.7 build | |
| 536 | | Unknown | | |
| 542 | 4 | Unknown | Some Unix timestamp | |
| 547 | | InMemory | In files from KindleGen 2.9 (build 1029-0897292) this record contains the bytes `I\x00n\x00M\x00e\x00m\x00o\x00r\x00y\x00` | |

## The rest of record 0

The full filename is usually stored at the end of Palm record 0, at the offset the MOBI header gives.

Between the end of the EXTH records and that filename there may be bytes whose purpose is not known.

After the filename come two null bytes, then more nulls out to a 4-byte boundary. The length stored in the header does not include those nulls. If the name is 16 bytes, two nulls make 18, and two further nulls bring the stored run to 20, while the header length stays 16. If the name is 19 bytes, two nulls make 21, and three further nulls bring the stored run to 24.

Past the name and that padding, record 0 continues with more bytes of unknown purpose, usually nulls, until the record ends.

## Index meta record

The first record of an index holds the index metadata.

| offset | hex | bytes | content | comments |
| --- | --- | --- | --- | --- |
| 0 | 0x00 | 4 | Identifier | The characters I N D X |
| 4 | 0x04 | 4 | header length | Length of the INDX header, including these 4 bytes |
| 8 | 0x08 | 4 | index type | Known values: 0 = normal index, 2 = inflections |
| 12 | 0x0c | 4 | ? | ? |
| 16 | 0x10 | 4 | ? | ? |
| 20 | 0x14 | 4 | idxt start | Offset of the IDXT section |
| 24 | 0x18 | 4 | index count | Number of index records |
| 28 | 0x1c | 4 | index encoding | 1252 = CP1252 (WinLatin1); 65001 = UTF-8 |
| 32 | 0x20 | 4 | index language | Language code of the index |
| 36 | 0x24 | 4 | total index count | Number of index entries |
| 40 | 0x28 | 4 | ordt start | Offset of the ORDT section |
| 44 | 0x2c | 4 | ligt start | Offset of the LIGT section |
| 48 | 0x30 | 4 | ? | ? |
| 52 | 0x34 | 4 | ? | ? |

The rest of the INDX header is unknown.

### TAGX section

TAGX follows the INDX header. It is what makes the index values decodable. It says how many control bytes each entry has, which bits belong to which tag, and how many values a tag takes. Most tags take one value. Some take two. More than two is possible.

| offset | hex | bytes | content | comments |
| --- | --- | --- | --- | --- |
| 0 | 0x00 | 4 | Identifier | The characters T A G X |
| 4 | 0x04 | 4 | header length | Length of the TAGX header, including these 4 bytes |
| 8 | 0x08 | 4 | control byte count | Number of control bytes |
| 12 | 0x0c | n | tag table | Tag-table entries. n = header length − 12, and n must be a multiple of 4 |

Each tag-table entry is a multiple of 4 bytes. The first byte is the tag, the second is how many values it has, the third is a bit mask, and the fourth marks the end of the control byte. If the fourth byte is 0x01, every remaining byte of that entry is zero.

## Variable-width integers

Some Mobipocket structures encode integers with a variable number of bytes. The integer is big-endian. Each byte carries 7 payload bits (bits 1–7). A **forward-encoded** integer sets bit 8 only on the least significant byte. A **backward-encoded** integer sets bit 8 only on the most significant byte. The number 0x11111 forward-encoded is:

```text
0x04 0x22 0x91
```

Backward-encoded it is:

```text
0x84 0x22 0x11
```

### Trailing entries

The Extra Data Flags field in the MOBI header says which trailing entries, if any, are appended to each text record. Each set bit corresponds to one entry. The entries seem to follow bit order: trailing entry 1 sits just after the text, and entry 16 sits at the very end of the record. The role of most entries is unknown. Entries selected by bits 2 through 16 seem to share one layout:

```text
<data><size>
```

`<size>` is the size of the whole trailing entry, including the size field itself, written as a backward-encoded Mobipocket variable-width integer.

Only a few bits have been identified:

| bit | Data at end of records |
| --- | --- |
| 0x0001 | Overlap bytes of a multibyte character that crosses a record boundary |
| 0x0002 | Data for some auxiliary indexes |
| 0x0004 | Data about uncrossable breaks |

#### Multibyte character overlap

When bit 1 of Extra Data Flags is set, each record ends with a trailing entry that holds the extra bytes needed to finish a multibyte character cut by the record boundary. Those bytes are not compressed, whichever compression the file uses. Unlike other trailing data, the overlap bytes, including the count byte, **are** encrypted. The same overlap bytes then appear again as ordinary content at the start of the next record. The entry ends with one byte that stores the overlap count plus further flags.

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 0 | 0-3 | N terminal bytes of a multibyte character | |
| N | 1 | Size & flags | Bits 1–2 encode N. Bits 3–8 are unknown |

## PalmDOC compression

[PalmDOC](https://wiki.mobileread.com/wiki/PalmDOC) uses [LZ77](https://wiki.mobileread.com/wiki/LZ77). One implementation is [palmdoc.c](https://github.com/twpayne/gpsbabel-flytec/blob/master/palmdoc.c). A DOC file can hold only compressed text. The format itself has no typography, which matches Palm's preference for small files. Extensions of the format put formatting in the text with tags, for example [HTML](https://wiki.mobileread.com/wiki/HTML) or [PML](https://wiki.mobileread.com/wiki/Palm_Reader#Palm_Markup_Language). Those extensions do not interchange with each other. They are the base of most ebook formats on Palm devices.

LZ77 replaces a span of bytes with a pointer at a match that has already passed through the encoder and the decoder. A match is a length-distance pair: the next `length` characters each equal the character `distance` bytes earlier in the uncompressed stream. "Distance" is sometimes called "offset."

In PalmDOC a length-distance pair is always two bytes. Of those 16 bits, 11 encode the distance, 3 encode the length, and 2 mark the first byte so the decoder can recognize the pair. The exact unpacking steps are on the [PalmDOC](https://wiki.mobileread.com/wiki/PalmDOC) page. This page does not restate a bit diagram the source does not give.

PalmDOC data is always cut into independent 4096-byte chunks, measured uncompressed. Compressing or decompressing one chunk needs nothing from the chunk before it or the chunk after it.

PalmDOC also has bookmarks: named pointers at offsets in the file. Editing the file can leave a bookmark aimed at the wrong place. Some readers let the user edit bookmarks, some treat them as a table of contents, and some ignore them. They are stored at the end of the file, so a reader has to scan the whole file to find them.

## Image records

If the file has images, the image records follow the text records, one image per record. The 4096-byte record size in the PalmDOC header applies only to text. An image record may be larger.

## Magic records

[MobiPocket Creator](https://wiki.mobileread.com/wiki/MobiPocket_Creator) sometimes inserts a record of two zero bytes after the text records. That record is not included in the PalmDOC header's text record count, and it is not the record named by "first non-book index" in the MOBI header. When the two-zero record is present, the first non-book index is the index of the **next** record after it.

MobiPocket Creator also ends the file with three records, in this order: FLIS, FCIS, and end-of-file. For [MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader) and the [Kindle 2](https://wiki.mobileread.com/wiki/Amazon_Kindle_2), FLIS and FCIS do not seem to be required in order to read the file. The end-of-file record **might** be required.

### FLIS record

FLIS seems to be a fixed pattern. What the values mean is not known.

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 0 | 4 | identifier | The characters F L I S (0x46 0x4c 0x49 0x53) |
| 4 | 4 | ? | Fixed value: 8 |
| 8 | 2 | ? | Fixed value: 65 |
| 10 | 2 | ? | Fixed value: 0 |
| 12 | 4 | ? | Fixed value: 0 |
| 16 | 4 | ? | Fixed value: -1 (0xFFFFFFFF) |
| 20 | 2 | ? | Fixed value: 1 |
| 22 | 2 | ? | Fixed value: 3 |
| 24 | 4 | ? | Fixed value: 3 |
| 28 | 4 | ? | Fixed value: 1 |
| 32 | 4 | ? | Fixed value: -1 (0xFFFFFFFF) |

### FCIS record

FCIS is mostly fixed values as well.

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 0 | 4 | identifier | The characters F C I S (0x46 0x43 0x49 0x53) |
| 4 | 4 | ? | Fixed value: 20 |
| 8 | 4 | ? | Fixed value: 16 |
| 12 | 4 | ? | Fixed value: 1 |
| 16 | 4 | ? | Fixed value: 0 |
| 20 | 4 | ? | Text length (the same value as "text length" in the PalmDOC header) |
| 24 | 4 | ? | Fixed value: 0 |
| 28 | 4 | ? | Fixed value: 32 |
| 32 | 4 | ? | Fixed value: 8 |
| 36 | 2 | ? | Fixed value: 1 |
| 38 | 2 | ? | Fixed value: 1 |
| 40 | 4 | ? | Fixed value: 0 |

### End-of-file record

The end-of-file record is always 4 bytes. The last two bytes look like a CRLF. The meaning of the first two is unknown.

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 0 | 1 | ? | Fixed value: 233 (0xe9) |
| 1 | 1 | ? | Fixed value: 142 (0x8e) |
| 2 | 1 | ? | Fixed value: 13 (0x0d) |
| 3 | 1 | ? | Fixed value: 10 (0x0a) |

## Compilation records

[KindleGen](https://wiki.mobileread.com/wiki/KindleGen) inserts records of the sources it compiled (KindleGen 1.2 through 2.5), or those sources plus the compiler's own output (KindleGen 2.7 and later). In KindleGen 1.2 through 2.2 those records sit immediately before the [end-of-file record](#end-of-file-record). In KindleGen 2.3 and later they sit immediately before the BOUNDARY record.

A MOBI file built with Mobipocket Creator, Amazon's Personal Document Service, or Kindle Direct Publishing (formerly Amazon DTP) has no SRCS record. KindleGen once had an undocumented switch that suppressed the record. That switch was removed in 2010.

The SRCS record is a zip of every source file passed on the command line (`.opf`, `.ncx`, `.htm`, `.jpg`, and the rest), stored inside the MOBI file. It starts with the signature `SRCS`:

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 0 | 4 | identifier | "SRCS" (0x53 0x52 0x43 0x53) |
| 4 | 4 | ? | Fixed value (?): 0x00000010 |
| 8 | 4 | ? | Fixed value (?): 0x0000002f |
| 12 | 4 | ? | Fixed value (?): 0x00000001 |
| 16 | | zip | The zip archive continues to the end of this record |

The CMET record is the compiler's output, possibly with some further data. It starts with the signature `CMET`:

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 0 | 4 | identifier | "CMET" (0x43 0x4D 0x45 0x54) |
| 4 | 4 | ? | Fixed value (?): 0x0000000C |
| 8 | 4 | text length | Big-endian |
| 12 | variable | text | Compiler output, with CRLF line endings |
| variable | variable | ? | Unknown bytes through the end of the record |

## Media records (AUDI / VIDE)

KindleGen can embed audio and video for some Kindle platforms. Each media file is its own AUDI (audio) or VIDE (video) record:

| offset | bytes | content | comments |
| --- | --- | --- | --- |
| 0 | 4 | identifier | "AUDI" (0x41 0x55 0x44 0x49) or "VIDE" (0x56 0x49 0x44 0x45) |
| 4 | 4 | ? | Unknown |
| 8 | 4 | ? | Unknown |
| 12 | | media | Media bytes continue to the end of this record |

## The MBP sidecar

`.mbp` is the extension of the sidecar that travels with a MOBI book. Library software stores [metadata](https://wiki.mobileread.com/wiki/metadata) there, and the reading program stores what the user does: bookmarks, annotations, and the last reading position. The reader creates the file the first time the book is opened. MobiPocket's library software reads the sidecar for the title, author, and description it shows in the library window, so it does not have to open the larger book.

A description of the binary MBP layout is in progress at [that page](http://www.angelfire.com/ego2/idleloop/mbp_reader.html#mbp_file_format). The same site has an [mbp reader](http://www.angelfire.com/ego2/idleloop/mbp_reader.html) that extracts notes from an `.mbp` file.

## Making a MOBI file

As of 2026 there is no officially supported tool that creates MOBI files. That is a practical problem for dictionaries: Kindle devices still accept only MOBI dictionaries when a dictionary is sideloaded.

[Kindling](https://github.com/ciscoriordan/kindling) is an open-source (MIT) MOBI writer, built by reverse engineering, and it can write dictionaries. Its repository also has further notes on the file format.

Tools that used to do this job are [MobiPocket Creator](https://wiki.mobileread.com/wiki/MobiPocket_Creator), [MobiPocket Reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader#Windows) (Windows), and [KindleGen](https://wiki.mobileread.com/wiki/KindleGen). Those are historical.

### Authoring rules

These rules are what the format needs if a book is going to use MobiPocket Reader's features properly:

- Do not set a default font family, a default size, or other default font properties such as weight or color. That choice belongs to the person reading the book. A heading or some other special element may set a size and other properties. Use generic font families only.
- Do not force full justification on body text. A caption or other special text may need it.
- Do not use tables except for tabular data. Nested tables are not supported.
- Do not fake a page break with blank lines. Use the `<mbp:pagebreak/>` tag.
- Do not ship a separate edition of the book for each device. Use the format's own facilities, such as multi-resolution images and platform-specific frames.

### Images for old PDA screens

This section applies only to original MOBI. Amazon [AZW](https://wiki.mobileread.com/wiki/AZW) files do not use it.

An `img` tag in a Mobipocket publication can carry up to three source attributes, `src`, `losrc`, and `hisrc`, so one book can carry art tuned to different screens. The reader picks the image from the real screen size:

| Attribute | screen smallest size | example devices |
| --- | --- | --- |
| losrc | ≤ 239 pixels | Low-resolution 160×160 Palm devices (Palm Vx, Treo 600, Zire); smartphones (Nokia 3650, Sony Ericsson P800/900, Microsoft smartphones) |
| src | >= 240 pixels (handheld) | Pocket PC; high-resolution Palm devices (Sony Clié, Tungsten, Zire 71) |
| hisrc | >= 480 pixels | Any desktop or tablet PC |

```text
<img hisrc="cover480x640.gif" src="cover220x300.gif" losrc="cover140x140.gif"/>
```

There is also an internal ceiling of 63KB, a limit of the Mobipocket `.PRC` format. A GIF must be under 63KB. A GIF optimizer such as Ulead Smart Saver can bring a GIF under that line. If the image is larger than 63KB, MobiGEN scales it down to the limit on its own, and the result may not be the one you wanted. JPEG is handled differently: the encoder lowers the quality setting instead of reducing the pixel dimensions.

### HTML and CSS while building MOBI

- The Kindle and the Kindle DX do not handle the soft-hyphen HTML entity correctly. Use the `<shy/>` tag instead.
- On some devices gray text is drawn white. Avoid that with a media query:

```text
@media  amzn-mobi and (monochrome) {
        .mygreytextclass {
                color: black;
        }
}
```

- KindleGen ignores `padding-left`. When you need that inset, put another element inside and set its left margin.
- KindleGen's CSS parser is sometimes wrong. A rule written as:

```text
div.foo p {
 ...
}
```

  is often read as:

```text
div.foo, div.foo p {
 ...
}
```

  When the style should hit only the inner element, give those paragraphs their own class and select that class alone.

Further notes aimed at KF8 readers are on [KF8 CSS Tips](https://wiki.mobileread.com/wiki/KF8#CSS_Tips). KF8 is the other half of a dual KindleGen file. It is not KFX, and this page does not describe KFX.

## Limits of the format

- The right margin cannot be made larger than the normal margin.
- The left margin can only be set in steps of 1em. A hanging indent is possible only when there is no left margin. Newer Kindle renderers raised that left-margin step to about 2em.
- Text cannot wrap around an image that is taller than one line of text.
- Image size does not scale with the font size.
- In some Mobipocket renderers, but not all of them, text that has a left margin changes that margin on each line according to the font size at the previous line break.
- Many measurements, including the size of a hanging indent, cannot be given in em.
- An individual run of text cannot be set in a monospace font.
- Tables behave very differently from one Mobipocket renderer to another, especially a table that crosses screens.
- Nested tables are not supported at all.
- The full range of Mobipocket formatting is available only when the markup follows Mobipocket's own HTML 3.2, which is non-standard, extended, and poorly documented. The archived tag reference is the [file tag reference](https://web.archive.org/web/20160618120918/http://www.mobipocket.com:80/dev/article.asp?BaseFolder=prcgen&File=TagRef_OEB.htm).

## MOBI DRM

A MOBI file can optionally carry [DRM](/wiki/formats/drm/). This section describes how the lock is applied. It is not a removal guide. In some countries removal is illegal on its own, and in the United States the DMCA prohibits circumvention. That boundary is stated on the [DRM](/wiki/formats/drm/) page. This article does not name removal tools or steps.

Three schemes show up in the source page.

The standard scheme is backed by Mobipocket and [OverDrive](https://wiki.mobileread.com/wiki/Overdrive) servers. It is based on an id derived from the reading device or the reading program. When the book is bought, the server has to know that PID. The PID is embedded in the file and the file is locked to the device. The same scheme can allow several devices, usually up to four, and in that case the server has to know every device id. After a device is added, the server has to be told and the book has to be downloaded again before the new device can open it. Adding a device or downloading again is usually free. If the retailer disappears, there may be no way to add a device later, because there is nowhere left to download the file.

A second, simpler scheme needs only the account name and password used to buy the book. Once those are entered, the book opens, and each device only has to be told once. This scheme is newer, and some readers may not implement it.

A third method, used on some books, encrypts the file with a generic MOBI key rather than a key for one PID. Any MobiPocket Reader on any device can read it. Software that is not MobiPocket Reader cannot.

The lock covers the book, not the [metadata](https://wiki.mobileread.com/wiki/metadata). A library routine can read the metadata without unlocking the book. Programs have been written that change that metadata without touching the DRM portion of the file. That is a statement about where the metadata sits. It is not a procedure for altering or removing the lock.

## Readers and converters

Besides the [official MobiPocket reader](https://wiki.mobileread.com/wiki/MobiPocket_Reader), the source page lists:

- [Calibre](https://wiki.mobileread.com/wiki/Calibre)
- [Kindling](https://github.com/ciscoriordan/kindling)
- [Stanza](https://wiki.mobileread.com/wiki/Stanza), a historical product line. The iOS app looks unmaintained since August 2013.
- [FBReader](https://wiki.mobileread.com/wiki/FBReader)
- [Book Designer](https://wiki.mobileread.com/wiki/Book_Designer)
- [STDU Viewer](https://wiki.mobileread.com/wiki/STDU_Viewer)
- [Sumatra PDF](http://www.sumatrapdfreader.org/)
- [Kindle for PC](http://www.amazon.com/gp/kindle/pc) or [Kindle for Mac](http://www.amazon.com/gp/kindle/mac)
- [KindleUnpack](https://wiki.mobileread.com/wiki/KindleUnpack), formerly called MobiUnpack. The source page describes it as a tool that turns a MOBI file back into the pieces it was built from, and also calls it a MOBI decoder. This page does not describe it as a way to remove DRM.
- [PDF to EPUB/Mobi converter](http://www.ebook-tool.com/pdf-to-epub-mobi-converter.htm)
- [KindleGen](https://wiki.mobileread.com/wiki/KindleGen), Amazon's tool for turning an EPUB into Mobi ([AZW](https://wiki.mobileread.com/wiki/AZW)) or otherwise producing a Mobi file. Official support for creating MOBI this way has ended; see the note at the start of "Making a MOBI file."

## Hardware readers

- [Bookeen Cybook Gen3](https://wiki.mobileread.com/wiki/Bookeen_Cybook_Gen3)
- [Bookeen Cybook Opus](https://wiki.mobileread.com/wiki/Bookeen_Cybook_Opus)
- [Hanlin V3 / BeBook / EZ Reader](https://wiki.mobileread.com/wiki/Hanlin_V3)
- [iRex iLiad](https://wiki.mobileread.com/wiki/IRex_iLiad)
- [iRex Digital Reader](https://wiki.mobileread.com/wiki/IRex_Digital_Reader)
- [Amazon Kindle readers](https://wiki.mobileread.com/wiki/Amazon_Kindle)
- [Onyx BOOX readers](https://wiki.mobileread.com/wiki/Boox60)

Devices that open MOBI do not all implement the same subset. What each one actually does is on [Mobi Comparison](https://wiki.mobileread.com/wiki/Mobi_Comparison).

## Building a MOBI file from an EPUB

The recipe below is the one the source page gives. It depends on MobiPocket Creator, which is no longer an officially supported creator. It is a build procedure, kept here as documentation of that workflow.

1. Keep the table-of-contents entries you care about on `h1`, `h2`, and `h3` only (the reason is step 9, unless you use step 10 instead).
2. Finish the [EPUB](/wiki/formats/epub/) in [Sigil](https://wiki.mobileread.com/wiki/Sigil), importing each [HTML](https://wiki.mobileread.com/wiki/HTML) file with "add existing item" as you go.
3. Finish the EPUB without a cover page yet.
4. Install MobiPocket Creator.
5. Unzip the EPUB.
6. Double-click the [OPF](https://wiki.mobileread.com/wiki/OPF).
7. The book opens in MobiPocket Creator.
8. Drag the cover into MobiPocket Creator.
9. Have MobiPocket Creator build an `html` table of contents that uses only heading levels 1, 2, and 3. Or:
10. Edit the Guide Properties so MobiPocket Creator points at an `html` table of contents you already have. The source page notes that `toc.ncx` is already in the right place, in the "My Publications" folder under the MobiPocket Creator directory.
11. Click Build.
12. The result is a working PRC file.

## Further reading

- [Mobipocket Creator download](http://www.mobipocket.com/en/DownloadSoft/ProductDetailsCreator.asp), a free download when that page was current, and the wiki's [MobiPocket Creator](https://wiki.mobileread.com/wiki/MobiPocket_Creator) page. The product is historical.
- [Mobipocket development center](http://www.mobipocket.com/dev/), the old production documentation.
- [Content generation](http://www.mobipocket.com/dev/article.asp?BaseFolder=prcgen). The section on paragraph formatting describes CSS-like behavior. MOBI itself has no CSS.
- [Amazon KindleGen](http://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000234621), the successor to mobiGen. The source page says it is enough to produce a MOBI book. Treat the product as historical.
- [KindleGen](https://wiki.mobileread.com/wiki/KindleGen) on MobileRead Wiki, for how it was used.
- [MobileRead forum note on unpacking a MOBI file](http://www.mobileread.com/forums/showpost.php?p=774836&postcount=5). Citation only.
- [Java MOBI metadata editor](http://www.mobileread.com/forums/showthread.php?p=1927698), a forum thread about editing, adding, and deleting EXTH tags. Citation only.
