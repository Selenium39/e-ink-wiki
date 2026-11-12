---
title: "OPUB: The Book File on BOOX Picco"
type: original
author: e-ink.me
order: 2
description: "What an OPUB file is on BOOX Picco, and how BOOX Tiles puts a book on the device."
---

> This article is original content by E-ink Wiki. The device and transfer facts come from the [Picco product page](https://shop.boox.com/products/picco) (accessed 2026-11-12) and from public reporting cited below. BOOX has not published a specification for this file.
> Picco is a new product line. Transfer details can change; check [booxtiles.com](https://booxtiles.com/) and the product page before you rely on a step.

## What OPUB is

**OPUB** is the book file used on **Picco**, the first device in the BOOX Tiles line. Picco is a 3.97-inch card-sized reader. It is not one of the Android devices in the [BOOX overview](/wiki/boox/overview/), and it does not run NeoReader.

Those Android devices open an EPUB, a MOBI, and the other formats NeoReader supports as themselves. Picco is different. The [product page](https://shop.boox.com/products/picco) lists a wide set of document formats — EPUB, MOBI, AZW3, AZW, AZW5, FB2 and its zip variants, TXT, PDB, PRC, RTF, HTML, XHTML, and CHM — and says they are supported **when the file is transferred through the BOOX Tiles app or the web app**. Copying a raw EPUB onto the card is not the path BOOX documents.

BOOX does not publish a format specification, and the product page does not use the name OPUB. Public reporting on the transfer names the file the device stores: an `.opub`. A 6 October 2026 report describes it as a reflowable book prepared from the source file, images included, rather than a stack of page pictures ([Read with Pro](https://www.readwithpro.com/blog/boox-picco-ttf-opub-transfer)). That matches the product page, which says you can still change the font, the spacing, and the margins after the book is on the device.

## How a book gets onto Picco

[BOOX Tiles](https://booxtiles.com/) is the transfer app. The product page describes three ways in:

1. **Phone app.** Install BOOX Tiles, scan the QR code on the Picco to pair, and send the file. Phone and web transfers work on the same Wi-Fi, or through the cloud when the phone and the reader are not on the same network.
2. **On the web.** Open booxtiles.com, sign in, and upload the file.
3. **USB cable.** Connect the Picco, open booxtiles.com, choose USB transfer, and pick the BOOX TILE folder.

The same October 2026 look at the import dialog reported that the USB option is labeled as not requiring a sign-in, while the Wi-Fi, cloud, link, and phone-app paths ask you to sign in. The cloud path uploads the file. The page also notes that the USB folder picker, as implemented then, needed a Chromium desktop browser (Chrome, Edge, or Opera).

Images have their own list on the product page (PNG, JPEG, WEBP, BMP, GIF) and use the same transfer. Fonts are a separate transfer, not part of the book file.

## What this page does not cover

There is no public specification to quote, so this page stops at the file readers meet on Picco: the name, which device uses it, and how BOOX Tiles puts a book on that device. It does not describe the bytes inside the file.

## References

- [BOOX Picco product page](https://shop.boox.com/products/picco), accessed 2026-11-12
- [Introducing BOOX Picco](https://shop.boox.com/blogs/news/introducing-boox-picco) (BOOX, 2026-09-28)
- [BOOX Tiles](https://booxtiles.com/)
- [BOOX Picco transfer notes: EPUB to OPUB](https://www.readwithpro.com/blog/boox-picco-ttf-opub-transfer) (Read with Pro, 2026-10-06)
