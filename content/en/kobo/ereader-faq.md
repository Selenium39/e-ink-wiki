---
type: translated
title: "Kobo eReader FAQ"
original_title: "Kobo eReader"
source_url: https://wiki.mobileread.com/wiki/Kobo_eReader
original_author: "MobileRead Wiki contributors (Stinger, DaleDe, Artificial, THE TERMINATOR, and others)"
translated_at: "2026-11-11"
order: 3
description: "The first Kobo eReader, from the wiki FAQ: specs, the 2013 support contacts, the community host app, and the sixteen answers on preloaded books, sideloading, Content is Locked, ADE, source code, and custom fonts."
---

> These answers follow the wiki FAQ (page revised 2018-03-27) for the first Kobo eReader. They describe that early hardware and the firmware the page was written against.
> Where an answer depends on Adobe Digital Editions authorization or iTunes sideloading, the steps are the historical desktop workflow the wiki describes, not a 2026 Kobo app UI. Each of those answers is labeled again in place.
> Forum links are citations only. This site does not copy forum posts. For a procedure that still applies to a current model, use Kobo's own current documents; the troubleshooting ideas below are the wiki's.

The Kobo eReader was [Kobo](https://wiki.mobileread.com/wiki/Kobo)'s first dedicated reader. Kobo had already shipped reading software for [smartphones](https://wiki.mobileread.com/wiki/smartphones) and was running an ebook site. This machine is a small set of buttons, a quilted fabric back, and a line of [gela skins](http://www.koboereader.com/accessories.html) in several colors and patterns.

The built-in library can be sorted by title, by the date you last read a book, or by author. Borders sold it in Australia and the United States, Whitcoulls sold it in New Zealand, and WH Smith in the United Kingdom started selling it in late December 2010.

The later revision of the same reader has [Wi-Fi](https://wiki.mobileread.com/wiki/Wi-Fi) and can browse and buy books on the device.

## Specifications

| Item | Specification |
| --- | --- |
| On sale | May 2010 (Australia, Canada); June 2010 (New Zealand) |
| Colors | Porcelain white, black, lilac, blue, silver |
| Body (Wi-Fi model and the original) | 7.2" × 4.7" × 0.40" (184 × 120 × 10 mm) |
| Weight | 221 g (7.05 oz) |
| Screen | 6" E Ink, 800×600. The original Kobo is 8-level [grayscale](https://wiki.mobileread.com/wiki/grayscale); the Wi-Fi model is 16-level |
| Storage | 1 GB (about 1,000 books) |
| Expansion | SD card, up to 32 GB |
| Type sizes | 5 |
| Type styles | Serif and SansSerif |
| Preloaded | 100 complete free books |
| Book formats | [ePub](https://wiki.mobileread.com/wiki/ePub), [PDF](https://wiki.mobileread.com/wiki/PDF), Adobe [DRM](https://wiki.mobileread.com/wiki/DRM). From firmware 1.8.1, on the Kobo-1, also RTF, txt, html, and several image formats |
| Ports and radios | [USB](https://wiki.mobileread.com/wiki/USB), Bluetooth®, Wi-Fi |
| Battery | Up to 10,000 page turns |
| Controls | Four-way pad: Home, Menu, Back, Display/Shop, and a center confirm |
| Sites named on the wiki | [koboereader.com](http://www.koboereader.com/), [kobobooks.com](http://www.kobobooks.com/) (the page says the store claimed 2 million ebooks) |

## Support contacts, as the wiki listed them

The list is dated 17 September 2013. The wiki says it does not always have the newest information about the hardware.

From 30 September 2013, Kobo stopped using Get Satisfaction.

The official support account on Twitter was @KoboHelp. Kobo was also on [Facebook](https://www.facebook.com/kobo), and the [official blog](http://cafe.kobo.com/) was where the page sent readers for news.

Mail went to help@kobo.com. The wiki already notes that this address no longer worked.

The [help page](http://www.kobo.com/help) was the place for per-device articles, phone support, and the online chat with Kobo staff.

The phone numbers were [listed here](http://www.kobo.com/help/customer-care-phones/#NA).

## The community host application

Someone in the community wrote a host application for the KoboReader, with builds for Windows, Mac, and GNU/Linux. It is a database program for the books on the reader. Its [database schema is documented](http://wiki.durbn.net/koboko/index.php/DBSchemaV2).

## The FAQ

### Some ePub files will not change type size

Known bug in the first official firmware. The details, and a tool that repairs the affected files, are in [this thread](http://www.mobileread.com/forums/showthread.php?t=83209). The tool's own steps are not on the wiki page, so they are not repeated here.

### The battery did not last the 8,000 page turns I expected

The discussion is [in this thread](http://www.mobileread.com/forums/showthread.php?t=82717). Kobo said on its [Facebook page](http://www.facebook.com/kobobooks) that a firmware update then in progress would ["extend"](http://www.facebook.com/topic.php?uid=209803832591&topic=14623) battery life. The specification table above is the wiki's other figure, up to 10,000 page turns.

### The battery icon does not match the charge

The gauge, on the Kobo eReader's menu screen, is updated once, when the device powers on. It can sit still on screen while the cell is actually draining. Power the reader off and on again to read a current level. The same [Facebook topic](http://www.facebook.com/topic.php?uid=209803832591&topic=14623) quoted Kobo as saying the upcoming firmware would [fix](http://www.facebook.com/topic.php?uid=209803832591&topic=14623) the indicator.

### Remove the 100 free books that came on the device

Those books are rows in the internal [SQLite](https://wiki.mobileread.com/wiki/SQLite) database. There is no separate file for each book. To drop all of them at once, delete `KoboReader.sqlite` from the `.kobo` directory (the wiki writes the Windows-style path `\.kobo`). Use My Computer or any other file manager. Back the database file up first and keep that copy, unless losing the 100 free books is acceptable.

After the file is gone, sync the reader with the desktop application. The sync creates a new, empty database.

That delete is wider than the 100 free books. It also removes every book that was installed through the official desktop application or through Adobe Digital Editions. Current-position bookmarks for ordinary ePub files on the device are lost with it. The ePub files themselves stay on the reader; after you unplug, the Kobo treats them as new books and processes them again.

To remove one title and leave the rest, use Calibre. From Calibre 0.7.5 the Kobo driver that does this is in the main program. Before that it was a beta driver.

### Copy an ePub onto the reader

At the time of the wiki page, the Kobo desktop application would only send books bought from Kobo. Everything else used one of the paths below.

- **Calibre.** [Calibre](http://calibre-ebook.com) is free, and it runs on Windows, Mac, and Linux. Download an ePub, PDF, LIT, or another ebook to the computer, then add it to the Calibre library on that computer. Calibre can convert between formats, attach a cover, and adjust layout to a point. You can send the whole library across, or send each book as you add it. A replacement reader, or a wiped one, can be reloaded from the same library. The official Kobo software is still how you buy, manage, and download store purchases. The library on the device is the sum of those sources.

  Calibre can *manage* books that carry [DRM](https://wiki.mobileread.com/wiki/DRM). It cannot open or display a protected book, and it cannot convert one. To put a protected file into the Calibre library, download it first with the client for that scheme (Adobe Digital Editions, the Sony Reader software, and the like). That download is the historical desktop workflow the wiki describes, not a 2026 Kobo app UI. Find the downloaded file and import it the way you import any other book.

- **Adobe Digital Editions.** [Adobe Digital Editions](http://www.adobe.com/products/digitaleditions/) is free software for managing ebooks. The wiki's method is to send the ePub to the Kobo eReader from ADE. This is the historical desktop workflow the wiki describes, not a 2026 Kobo app UI.

- **Drag and drop.** Over USB the Kobo eReader is a mass-storage disk. Drag the ePub from the computer's disk to the root of the Kobo volume.

- **Email.** The wiki names Sendtokobo, a free service for Kobo readers, built along the same lines as Send to Kindle.

### "Content is Locked" on a book that has no DRM

An apostrophe (`'`) in the title or the author's name can raise this "locked" error, and the book then will not open on the Kobo. Calibre on the computer can still open it. Edit the title, the author, or both in Calibre, take the apostrophe out, and send the book again. If the master record in Calibre should stay as it is, remove the apostrophe from the matching directory name and file name on the Kobo instead.

The same message appears in a second case. You deleted the `*.epub` from main memory in the computer's file manager. The file is gone, and the database still has a row for it. Choosing that row shows the DRM error "content is locked" rather than a plain "file not found". Delete the row from the on-device book list with the Kobo menu, or delete it in Calibre. That clears the leftover row.

### "Content is Locked" on a book with Adobe DRM

This answer is the historical desktop workflow the wiki describes, not a 2026 Kobo app UI.

1. Delete the file inside Adobe Digital Editions.
2. Check that the date and time on the reader are right.
3. Deauthorize the computer and the reader.
4. Factory-reset the Kobo.

**Warning.** A factory reset deletes reading material you added to the Kobo afterward. A later sync can restore books bought from the Kobo store. Books and documents from anywhere else do not come back. Back those up before you reset.

The reset itself, on this reader:

1. Press the Menu button on the left side of the reader.
2. Move the cursor to Settings.
3. Press the center of the navigation pad to confirm.
4. Move the cursor to Advanced, at the top of the page.
5. Press the center of the pad to confirm.
6. Move the cursor to Reset Device Now.
7. Press the center of the pad to confirm.
8. When it asks whether to continue, move the cursor to Continue.
9. Press the center of the pad to confirm.
10. The Kobo returns to its original factory state.

Authorize the computer and the reader again. This is still the historical desktop workflow the wiki describes, not a 2026 Kobo app UI:

1. Plug the Kobo in.
2. Open ADE.
3. Follow the prompts: sign in with your Adobe ID and authorize the device.
4. Download the file again and transfer it to the Kobo.

A library loan needs a fresh ePub download from the library. That download is how the loan is renewed.

### The reader does not seem to turn off

The power control is the blue button on the top edge. After it shuts down, the screen keeps the cover of the book you were reading, and the lower edge of the screen reads "Press power button to start reading". The picture is still there because this E Ink panel holds its last frame with the power off. The reader is off, and it is not drawing current for that image.

If the Kobo has stopped responding, hold the power button for about ten seconds. There is no on-screen confirmation in that case. Press the power button once more to turn it back on.

### Change paragraph alignment in an ePub

This reader has no built-in reflow for ePub. An ePub that is not under [DRM](https://wiki.mobileread.com/wiki/DRM) can be reflowed on the computer before it is copied over.

One route is Calibre. Add the book to the [Calibre](http://calibre-ebook.com) library and convert ePub to ePub. Justification is in the conversion settings, under the "Look and Feel" menu.

### What the page number means

Books installed with the official desktop application show a page number inside the current chapter. Books from other sources show the current page and the total page count.

The wiki's way to get the total-page style for a Kobo store book is the "Download ePub" link, then Adobe Digital Editions. That is the historical desktop workflow the wiki describes, not a 2026 Kobo app UI.

### Deauthorize the Kobo (or another device) in ADE

This is the historical desktop workflow the wiki describes, not a 2026 Kobo app UI.

Windows:

1. Open ADE on the computer and connect the Kobo.
2. Press Ctrl+Shift+E. A dialog asks whether to remove the authorization. Choose Yes.
3. Unplug the Kobo and plug it back in. A dialog should report a new device, and you can authorize it again.

Mac OS X:

1. Open ADE on the Mac and connect the Kobo.
2. Press Cmd-Shift-E. The wiki text writes this as "Cmc-Shift-E", which is a typo for Cmd-Shift-E. The dialog asks whether to remove the authorization. Choose Yes.
3. Unplug the Kobo and plug it back in. A dialog should report a new device, and you can authorize it again.

### Deauthorize the computer in ADE

This is the historical desktop workflow the wiki describes, not a 2026 Kobo app UI.

Windows:

1. Open ADE on the computer.
2. Press Ctrl+Shift+D. A dialog asks whether to remove the computer's authorization. Choose Yes. ADE closes.
3. Open ADE again, go to the library view, open the "library" dropdown, and choose "authorize computer".

Mac OS X:

1. Open ADE on the Mac.
2. Press Cmd-Shift+D. A dialog asks whether to remove the computer's authorization. Choose Yes. ADE closes.
3. Open ADE again, go to the library view, open the "library" dropdown, and choose "authorize computer".

### Sideload a PDF or an unencrypted ePub into the Kobo app with iTunes

This is the historical desktop workflow the wiki describes, not a 2026 Kobo app UI. The steps are iTunes file sharing into the Kobo iOS app.

1. The Kobo app on the device is version 3.4 or newer, and the device's iOS version allows sideloading. That is an iPhone or iPod that can run iOS 4.0 or newer, and any iPad, whatever iOS version it has.
2. Launch iTunes.
3. Connect the device to iTunes.
4. Select that device in iTunes' device list.
5. Open the Apps tab for the selected device.
6. Scroll to the bottom of the Apps page. There is a "File Sharing" section.
7. Click the Kobo icon shown in File Sharing.
8. Drag PDF files, unencrypted ePub files, or both into the Kobo Documents area, or add them with the "Add..." button.
9. iTunes syncs the files to the device on its own.
10. Open the Kobo app. The files added through iTunes are listed there.

### The device runs Linux. Was the source released?

Yes. Source for the Kobo and the Kobo Wi-Fi was published as a dump on [GitHub](https://github.com/kobolabs/Kobo-Reader). The dumps are tarballs checked into git, with no revision history inside the repository. Kobo did separate its patches to libraries from the upstream tarball of each library, which makes those usable. Kernel patches, if there were any, were not split out of the original eb600 2.6.18 tree.

[gtalusan](https://github.com/gtalusan), who put the trees on GitHub, answered questions and helped people working with them.

The Epson S1D13521 display driver is a binary only. It looks like a backport of a driver that had already gone into a newer mainline kernel, brought back to 2.6.18.

Source for some helper programs was published as well, past what the licenses required. The Wi-Fi monitor daemon is one of those.

The Kobo user interface that runs on the device was not released, and it was not part of that dump. It links only MIT, BSD, and LGPL code, so Kobo had no duty to publish it. It is a Qt Embedded program. The wiki's regret is that a public tree, or even a plugin interface, would have been enough for a lot of the changes people wanted to make.

### Take it apart, change the firmware, or run a program on it

Soapy Frogs wrote [a set of notes](http://soapyfrogs.blogspot.com/2011/01/kobo-and-kobo-wifi-hacking.html).

The wiki FAQ points onward to [Kobo WiFi Hacking](https://wiki.mobileread.com/wiki/Kobo_WiFi_Hacking) and to [Kobo eReader disassembled](https://wiki.mobileread.com/wiki/Kobo_eReader_disassembled). The adaptations of those hacking pages on this site are [Kobo WiFi hacking](/wiki/kobo/wifi-hacking/) (the 2010 model: case, internal card, telnet) and [Kobo Touch hacking](/wiki/kobo/hacking/) (the Touch `KoboRoot.tgz` method). [KOReader](/wiki/software/koreader/) is the overview of that reader application. None of those three is a 2026 install guide, and this FAQ does not add steps they do not already contain.

### Make a custom font display correctly

Loading a custom font on this Kobo is straightforward, and the file name plus a few fields inside the font still have to match a strict pattern. The wiki walks through Amazon Ember.

1. The Amazon firmware ships many Ember files. Pick a matched set of four whose internal font name is Amazon Ember. The wiki's author is explicit that the name is not Amazon Ember Medium, Amazon Ember Bold, or Amazon Ember Heavy. The four original file names are:
   - `Amazon-Ember-Bold.ttf`
   - `Amazon-Ember-BoldItalic.ttf`
   - `Amazon-Ember-Regular.ttf`
   - `Amazon-Ember-RegularItalic.ttf`
2. The file name has to follow Kobo's pattern. The part before the weight must be the internal name, Amazon Ember, including the space, not Amazon-Ember. For this family the italic file's second piece, `-RegularItalic`, also has to become `-Italic`. Rename them to:
   - `Amazon-Ember-Bold.ttf` → `Amazon Ember-Bold.ttf`
   - `Amazon-Ember-BoldItalic.ttf` → `Amazon Ember-BoldItalic.ttf`
   - `Amazon-Ember-Regular.ttf` → `Amazon Ember-Regular.ttf`
   - `Amazon-Ember-RegularItalic.ttf` → `Amazon Ember-Italic.ttf`
3. Kobo does not accept the Panose Weight values Amazon used in some of these files. Fix the value in a font editor. The wiki names FontForge, which is free, and FontCreator, which is paid.

   In the original Ember files, Panose Weight is Medium on `-Regular` and `-Italic`, and Demi on `-Bold` and `-BoldItalic`. Kobo wants Book and Bold in those two pairs.

   Changing Panose Weight in FontForge:

   1. Copy the four original `.ttf` files aside first. It is easy to overwrite the original from inside FontForge.
   2. Open FontForge, find `xxx-Regular.ttf`, and double-click it. A window opens with every glyph.
   3. In the menu bar, open **Element > Font Info**.
   4. In the left column, select **OS/2**, then open the **Panose** tab.
   5. Each property has a dropdown. **Weight** is the third. If it is not **Book**, open the dropdown and choose **Book**.
   6. Click **OK** at the bottom. You are back at the glyph window.
   7. Save the edited font with **File > Generate Fonts**. Choose the destination and click **Generate**. A warning may appear; the wiki's author dismissed it with Yes.
   8. Click **File > Close**. FontForge asks whether to save an `untitled.sfd` file. Click **Don't Save**.
   9. `xxx-Regular` is done.
   10. Repeat steps 2–8 for `xxx-Italic.ttf`.
   11. Repeat steps 2–8 for `xxx-Bold.ttf` and `xxx-BoldItalic.ttf`, and in step 5 set Weight to **Bold** instead of Book.

The wiki does not say which directory the finished files go in. That path is not added here.
