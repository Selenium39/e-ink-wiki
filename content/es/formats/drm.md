---
title: Panorama del DRM en libros electrónicos
original_title: "DRM"
type: translated
source_url: https://wiki.mobileread.com/wiki/DRM
original_author: "Contribuidores de MobileRead Wiki (DaleDe como autor principal, Mattcutts, Madliu y otros)"
translated_at: 2026-11-10
order: 3
description: "Panorama del DRM (gestión de derechos digitales) en los libros electrónicos: los esquemas de PDF, ePub y Kindle, HDCP y otros formatos, su uso en bibliotecas y en la protección de tipografías, el impacto en el TTS y los límites legales de su eliminación."
---

> Este artículo es una traducción de la página «DRM» de MobileRead Wiki, cuya última revisión es del 15 de octubre de 2018.
> Los enlaces externos del original se conservan tal cual, citados únicamente como fuente y punto de partida; este sitio no replica su contenido.
> La información sobre herramientas de eliminación de DRM que aparece en este artículo tiene un carácter exclusivamente informativo; cada lector debe valorarla por su cuenta y actuar conforme a las leyes de su región y a los términos de servicio de las plataformas.

DRM significa gestión de derechos digitales (Digital Rights Management) y es a la vez un mecanismo y una idea. En general, pretende imponer una restricción sobre lo que un usuario puede hacer con un archivo determinado.

## Panorama general

En los libros electrónicos, el DRM es por lo general un código que debe estar presente para que el lector pueda abrir el libro. El código puede estar vinculado a un dispositivo concreto o a un conjunto de dispositivos; en otros casos está vinculado al usuario. No existe una implementación estándar del DRM.

Se supone que el DRM protege al autor y al editor de los libros electrónicos (y también de la música electrónica y otros medios digitales) frente a la piratería y otras actividades ilegales. Algunos detractores lo llaman «gestión de restricciones digitales» (Digital Restriction Management) y sostienen que va mucho más allá de la actividad ilegal: restringe también usos que son legales y razonables. Véase [copyright](https://wiki.mobileread.com/wiki/Copyright).

Algunos formatos de libros electrónicos no admiten DRM y, aun cuando un formato lo admita, puede haber libros en ese formato que no estén controlados por DRM.

Un mismo dispositivo de lectura puede albergar varios esquemas de DRM para los distintos formatos que admite. Algunos formatos —el caso más notable es [MOBI](https://wiki.mobileread.com/wiki/MOBI)— imponen una restricción a los lectores dedicados: no permiten que su software se use en un lector dedicado que admita otros formatos con DRM, aunque los dispositivos más generales, en los que se pueden cargar aplicaciones de lectura, sí suelen poder ejecutar MOBI junto con otros programas de lectura.

En general, el DRM se administra mediante un servidor. Cuando un usuario compra un libro electrónico protegido con DRM, el servidor asigna la clave de descifrado, que puede generarse a partir del propio dispositivo de lectura o de un identificador de usuario conocido por el servidor.

## DRM en PDF

Adobe desarrolló el formato [PDF](https://wiki.mobileread.com/wiki/PDF) y es el actor dominante en el uso del DRM para controlar el acceso a estos documentos. Existe además la protección por contraseña, que algunos sistemas emplean como control de contenido para PDF.

Sin embargo, hay soluciones para eliminar el DRM del PDF mediante herramientas de eliminación de DRM.

## DRM en ePub

Aunque [ePub](https://wiki.mobileread.com/wiki/EPUB) es un estándar de la industria generalmente bien definido, ni siquiera se definió un método para identificar contenido con DRM: este formato no tiene una implementación estándar. En la práctica hay tres sistemas importantes en uso.

Dos de ellos los gestiona Adobe. El servidor de [Adobe DRM](https://wiki.mobileread.com/wiki/Adobe_DRM) lo usa [Adobe Digital Editions](https://wiki.mobileread.com/wiki/Adobe_Digital_Editions), empleado por la mayoría de los lectores dedicados de libros electrónicos; [Barnes and Noble](https://wiki.mobileread.com/wiki/Barnes_and_Noble) lo usa para la nook. El tercer sistema es de Apple, a través de su aplicación iTunes. Para más información, véase el [FairPlay DRM](https://wiki.mobileread.com/wiki/FairPlay_DRM) de Apple.

El problema real para el usuario es que debe extremar el cuidado cuando tiene un dispositivo capaz de ejecutar más de un programa de lectura. Los sistemas disponibles no reconocen la existencia de otra forma de DRM y pueden comportarse de manera extraña si se la encuentran. A menudo no hay ningún mensaje de error, sino solo una pantalla en blanco.

Para complicarlo aún más, el esquema de DRM del ePub se aplica normalmente a un subconjunto de los archivos dentro del contenedor. Esto puede hacer que un libro parezca funcionar a medias en un lector: algunas cosas se ven normales mientras que otras no.

Uno de los usos parciales más desconcertantes se produce cuando las fuentes tipográficas incrustadas especificadas en el libro están cifradas mientras que otros elementos no lo están. Esto puede ocurrir cuando se usan tipografías con copyright. Otra técnica, menos intrusiva para el usuario, consiste en usar fuentes ofuscadas: se aplica una operación XOR (o exclusiva) al conjunto de fuentes incrustadas para ocultarlas, de modo que no puedan extraerse y usarse por sí solas. A veces esto basta para cumplir los requisitos de copyright impuestos por el diseñador de la tipografía.

El DRM se volverá aún más complicado a medida que [ePub 3](https://wiki.mobileread.com/wiki/EPUB_3) llegue al mercado. Esta versión de ePub puede admitir medios de [audio](https://wiki.mobileread.com/wiki/Audio) y [vídeo](https://wiki.mobileread.com/wiki/Video), que además pueden tener sus propios esquemas de DRM.

## DRM en Kindle

La línea de productos [Amazon Kindle](https://wiki.mobileread.com/wiki/Amazon_Kindle) tiene muchos formatos propietarios distintos, y todos admiten un esquema de DRM. El DRM se aplica directamente al formato de contenedor [AZW](https://wiki.mobileread.com/wiki/AZW), que se basa en el formato [PDB](https://wiki.mobileread.com/wiki/PDB) de Palm. Esta es también la base de [MOBI](https://wiki.mobileread.com/wiki/MOBI), que Amazon compró, y utiliza este mismo esquema básico en todos sus formatos. Si se dejan a un lado las diferencias de DRM, el formato MOBI y el formato AZW son esencialmente lo mismo. Internamente, el formato de los datos en bruto puede ser muy distinto: por ejemplo, [AZW4](https://wiki.mobileread.com/wiki/AZW4) contiene contenido [PDF](https://wiki.mobileread.com/wiki/PDF) envuelto en el contenedor de Amazon, mientras que [KF8](https://wiki.mobileread.com/wiki/KF8) contiene contenido [ePub](https://wiki.mobileread.com/wiki/EPUB); [TPZ](https://wiki.mobileread.com/wiki/TPZ), también conocido como [AZW1](https://wiki.mobileread.com/wiki/AZW1), es otro formato de Amazon que contiene archivos pasados por [OCR](https://wiki.mobileread.com/wiki/OCR). Con la excepción del soporte a bibliotecas, Amazon no ha licenciado el uso de su DRM a ninguna otra empresa.

Amazon modificó el esquema de DRM para permitir DRM con caducidad, de cara al préstamo en bibliotecas. Ha trabajado con bibliotecas de EE. UU. para ofrecer versiones AZW de sus libros en las bibliotecas.

Con la compra de Mobipocket, Amazon heredó el esquema de DRM de MOBI. El soporte de este formato terminó el 31 de octubre de 2016.

## HDCP

La protección de contenido digital de gran ancho de banda (High-bandwidth Digital Content Protection, HDCP) es una función de seguridad (un [DRM](#panorama-general)) desarrollada por Intel Corporation que exige el uso de productos certificados HDCP para poder recibir una señal digital cifrada con HDCP. Es para contenido de vídeo y audio, y funciona mediante el protocolo de enlace (handshaking) de [HDMI](https://wiki.mobileread.com/wiki/HDMI).

Funciona cifrando una señal digital con una clave que exige autenticación por parte del producto transmisor y del receptor. La versión 2.2 es para productos 4K, principalmente a través de reproductores Blu-ray y dispositivos HDTV como los decodificadores de satélite y cable.

## ExpressPlay

[ExpressPlay](https://www.expressplay.com/) se presenta como un sistema de protección de contenido seguro y basado en la nube, creado por el inventor del DRM. Afirma admitir todos los formatos y códecs de medios mantenidos por las tecnologías [iOS](https://wiki.mobileread.com/wiki/IOS), [Android](https://wiki.mobileread.com/wiki/Android) y Silverlight. Es compatible con múltiples dispositivos: móviles, portátiles, consolas, televisores conectados y otros aparatos de consumo de medios. ExpressPlay es lo bastante flexible para dar servicio a la mayoría de las ofertas populares: desde la retransmisión en directo y la televisión de recuperación (catch-up TV), hasta la suscripción de música y el entretenimiento a bordo de aviones y vehículos.

## Otros formatos

Existen muchos otros esquemas de DRM para libros electrónicos, archivos multimedia y otros usos.

Microsoft tiene DRM para sus libros electrónicos ([LIT](https://wiki.mobileread.com/wiki/LIT)), su música ([WMA](https://wiki.mobileread.com/wiki/WMA)) e incluso sus archivos de [vídeo](https://wiki.mobileread.com/wiki/Video). El WMDRM de Microsoft puede licenciarse igual que el de Adobe. Muchas tiendas digitales en línea como AIV, BBC iPlayer, Rhapsody y Nokia OVI lo usan para cifrar sus contenidos digitales.

El OpenMG de Sony se usa en el servicio de descarga de música en línea de Sony llamado «Connect».

Apple también tiene (o tenía) [FairPlay DRM](https://wiki.mobileread.com/wiki/FairPlay_DRM) para sus libros electrónicos, su música ([AAC](https://wiki.mobileread.com/wiki/AAC)) y sus archivos de vídeo comprados a través de iTunes.

La mayoría de los demás esquemas de DRM son específicos de formatos que solo admite el propietario del formato. Por ejemplo, MOBI tenía su esquema de DRM y Kindle tiene el suyo (distinto del de MOBI, aunque parecido). [Kobo](https://wiki.mobileread.com/wiki/Kobo) usa [Adobe DRM](https://wiki.mobileread.com/wiki/Adobe_DRM) para sus libros ePub normales, pero emplea una forma interna (KDRM) para los que almacena en su base de datos [kepub](https://wiki.mobileread.com/wiki/Kepub#DRM). Varios formatos menos populares tienen sus propios esquemas.

Existe un estándar llamado CPRM (copy protection for recordable media, protección contra copia para medios grabables) que se usa para ciertas películas y músicas distribuidas en [tarjetas SD](https://wiki.mobileread.com/wiki/SD_card); estos contenidos emplean un área especial disponible en dichas tarjetas. Es poco probable que los lectores de libros electrónicos con ranura SD admitan CPRM, aunque alguna tableta podría hacerlo.

## Uso en bibliotecas

El DRM lo usan a menudo las bibliotecas que prestan libros electrónicos; en este caso, el DRM ofrece al usuario que toma el libro en préstamo una licencia con límite de tiempo. La biblioteca controla el número de licencias que compró y gestiona el préstamo igual que un libro físico, con la diferencia de que no hace falta devolverlo: la licencia caduca sola. Véase [Library DRM and Devices](https://wiki.mobileread.com/wiki/Library_DRM_and_Devices) para más información.

Los formatos de libros electrónicos que admiten actualmente el préstamo con límite de tiempo incluyen [PDF](https://wiki.mobileread.com/wiki/PDF), [ePub](https://wiki.mobileread.com/wiki/EPUB) y [AZW](https://wiki.mobileread.com/wiki/AZW) (antes era [MOBI](https://wiki.mobileread.com/wiki/MOBI), pero Amazon lo cambió, al menos en EE. UU.). Los formatos de [audio](https://wiki.mobileread.com/wiki/Audio) que admiten préstamo con límite de tiempo incluyen el WMA seguro. El soporte a bibliotecas lo proporciona principalmente [Overdrive](https://wiki.mobileread.com/wiki/Overdrive).

Véase [EBook Lending Libraries](https://wiki.mobileread.com/wiki/EBook_Lending_Libraries) para una lista de bibliotecas y dispositivos de lectura que admiten el préstamo bibliotecario.

## DRM en fuentes tipográficas

Muchas [tipografías](https://wiki.mobileread.com/wiki/Fonts) tienen copyright propio. Las que están incrustadas en libros electrónicos también pueden llevar DRM aplicado. A veces el libro no usa DRM, pero las tipografías siguen protegidas. En lugar del DRM tradicional, algunas fuentes incrustadas se ofuscan para impedir su uso fuera del libro electrónico.

## Impacto en el TTS

Los lectores con discapacidad visual suelen usar un motor [TTS](https://wiki.mobileread.com/wiki/TTS) (Text To Speech, texto a voz) para que les lea el texto de la página. Esta capacidad también la aprovechan quienes intentan leer un libro que no está en su lengua materna, como ayuda para aprender el idioma. Sin embargo, el DRM puede afectar al uso del TTS, ya que puede bloquear el acceso de las aplicaciones externas a los datos. Para más información, véase la [publicación de Daisy](http://www.daisy.org/publications/docs/soundproof/sound_proof_book.html). Nótese que la ley de discapacidad de EE. UU. contempla el acceso legal (incluida la ruptura del DRM) para permitir la lectura de libros, lo que juega a favor del TTS; pero si el libro electrónico también se vende como [audiolibro](https://wiki.mobileread.com/wiki/Audio_book), el DRM puede usarse para desactivar la función TTS. Téngase en cuenta que esto solo se aplica a un usuario con discapacidad que necesite esta función, y no es un permiso indiscriminado para romper el DRM. Véase también [Read aloud](https://wiki.mobileread.com/wiki/Read_aloud).

## Restricciones adicionales

El DRM también puede impedir imprimir siquiera una parte de un libro, y puede limitar el número de veces que el libro puede leerse.

## Eliminación del DRM

En algunos países no es legal eliminar el DRM de un libro electrónico. Esto se relaciona con el [copyright](https://wiki.mobileread.com/wiki/Copyright) en el sentido de que copiar o distribuir material protegido sin permiso es ilegal, salvo en ciertos casos limitados, como citar un fragmento en otra obra. En EE. UU., la ley DMCA (Digital Millennium Copyright Act) prohíbe eliminar el DRM. Sin embargo, los partidarios de la doctrina del «uso justo» (fair use) consideran que eliminar el DRM es una manera razonable de permitir el uso justo sobre contenidos comprados por el usuario. Normalmente, un programa que elimina DRM exige que el usuario introduzca el ID correcto con el que el DRM se aplicó en su momento, de modo que el programa no puede usarse para eliminar el DRM de cualquier libro electrónico en ese formato de forma indiscriminada. La distribución de un programa así, y su uso, pueden ser ilegales en el país en que vivas. Los formatos cifrados con DRM que suelen ser objetivo incluyen [LIT](https://wiki.mobileread.com/wiki/LIT), [MOBI](https://wiki.mobileread.com/wiki/MOBI), la versión Adobe de [ePub](https://wiki.mobileread.com/wiki/EPUB), algunos [PDF](https://wiki.mobileread.com/wiki/PDF) de Adobe, [eReader](https://wiki.mobileread.com/wiki/EReader) y las versiones de eReader y ePub de Barnes and Noble. No se conoce ningún método para eliminar el DRM de otros formatos comunes, como [LRX](https://wiki.mobileread.com/wiki/LRX).

Ir contra la DMCA y proporcionar enlaces a sitios de eliminación de DRM va en contra de las normas de MobileRead. No coloques enlaces de ese tipo en este wiki.

## Véase también

- [Choosing An Ebook Reader](https://wiki.mobileread.com/wiki/Choosing_An_Ebook_Reader) incluye una discusión del DRM aplicada a la elección de un lector.
- [Artículo de Wikipedia sobre la DMCA (Digital Millennium Copyright Act)](http://en.wikipedia.org/wiki/DMCA)
- [Artículo de Wikipedia sobre la gestión de derechos digitales (en inglés)](http://en.wikipedia.org/wiki/Digital_Rights_Management)
- [Título 17 del Código de EE. UU., capítulo 12](http://www.copyright.gov/title17/92chap12.html): el capítulo sobre la DMCA en lo relativo al DRM, publicado por el gobierno de EE. UU.
- [Libro de prueba gratuito con DRM](http://www.fictionwise.com/eBooks/eBook1764.htm?cache): «Around the world in 80 days» («La vuelta al mundo en 80 días»), un libro electrónico [MOBI](https://wiki.mobileread.com/wiki/MOBI) que puede usarse para probar la función de DRM del lector antes de comprar libros de verdad. (Ya no disponible)
- [Adobe Content Server](http://www.adobe.com/products/content-server.html): el motor de DRM más reciente de Adobe, que permite a los editores gestionar su propio DRM.
