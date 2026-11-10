---
type: translated
title: Panorama de la creación de diccionarios para lectores de libros electrónicos
original_title: "Dictionary"
source_url: https://wiki.mobileread.com/wiki/Dictionary
original_author: "Contribuidores de MobileRead Wiki (DaleDe, Rolgiati y otros)"
translated_at: 2026-11-10
order: 1
description: "Panorama de los diccionarios electrónicos: en qué se diferencia construir un diccionario de un libro corriente, cómo funcionan la consulta emergente y la búsqueda indexada, el soporte de MOBI/eReader/LIT, y un inventario de recursos y herramientas para diccionarios de traducción, inglés y francés."
---

> Este artículo es una traducción de la página «Dictionary» de MobileRead Wiki; la última revisión del original es del 2022-04-17.
> Los enlaces a hilos del foro y a las descargas de archivos que aparecen en el original se conservan tal cual, únicamente como cita de fuente y punto de acceso a la descarga; este sitio no replica contenido de los foros.
> Las herramientas y descargas que se mencionan pueden haber quedado obsoletas o haber cambiado de dirección: el hilo oficial correspondiente manda como referencia del estado actual.

Esta página trata sobre diccionarios para libros electrónicos.

## El problema

Ni siquiera todo el mundo ve la necesidad de un diccionario en el libro electrónico. Hay quien no usaría uno aunque viniera incluido. Muchas veces, la definición de una palabra desconocida simplemente se infiere del contexto circundante, o simplemente se pasa por alto. Algunos incluso insisten en que ya conocen todas las palabras, aunque en la práctica rara vez es así.

Por supuesto, hay muchos tipos distintos de lectores y de libros electrónicos que pueden haberse escrito hace siglos, cuando otras palabras se usaban con más frecuencia que hoy. Además, hay usuarios que leen obras escritas en una lengua que no es la materna y pueden querer un diccionario que contenga significados o, mejor aún, un diccionario capaz de traducir la palabra a otro idioma.

Para quienes de verdad quieren consultar una palabra hay algunos problemas especiales que aparecen.

## Cómo abordar el problema

Un diccionario puede ser útil en un libro electrónico de dos maneras. Una es usarlo como un diccionario de papel y simplemente buscar las palabras. La segunda es poder seleccionar una palabra en el libro electrónico que estás leyendo y consultarla en una ventana emergente sin salir del libro. Los distintos lectores de libros electrónicos admiten funciones diferentes.

Muchos lectores de libros electrónicos no admiten diccionarios de la manera descrita arriba. Por supuesto, un diccionario es un libro y, en ese sentido, podrías convertirlo en un libro electrónico. El problema es que la mayoría de la gente no quiere simplemente leer un diccionario de principio a fin. Por eso, un libro electrónico de diccionario suele tener una diferencia en la forma en que se construye e incluso se formatea, para permitir la consulta directa. Esto exige que el programa de lectura pueda aprovechar esa diferencia.

Un libro electrónico de diccionario tiene una indexación especial para encontrar las entradas. El lector necesita un método para acceder a las palabras directamente. Si estás leyendo otro libro, puedes seleccionar una palabra en ese libro electrónico y acceder al diccionario a partir de esa selección. Esta es la manera principal en que se usa un diccionario electrónico. Tanto el Cybook como el Kindle usan variantes de esta técnica.

Si el lector o el programa de lectura permite introducir una palabra con el teclado, entonces puede admitir la búsqueda indexada del propio diccionario sin necesidad de encontrar la palabra en un libro. A veces esto se llama búsqueda en el diccionario (dictionary searching), pero las palabras deben estar en un índice especial para que la búsqueda no encuentre palabras que aparezcan en las propias definiciones.

Es posible usar la función de tabla de contenidos (TOC) y los enlaces internos para acceder a las entradas mediante una especie de tabla de contenidos en cascada con selecciones múltiples. Funciona si el lector admite enlaces internos, pero en el mejor de los casos resulta torpe.

Así que, en resumen: un diccionario tiene que construirse de forma diferente a un libro corriente, y el lector necesita de verdad una instalación especializada para acceder a los datos.

## Soluciones

Algunos lectores solo admiten un diccionario o unos pocos, mientras que otros permiten varios. Hay quienes usan el diccionario que tú elijas y hay quienes buscan la palabra en todos los diccionarios de tu colección y muestran todas las respuestas de forma secuencial en una página.

[Mobipocket](https://wiki.mobileread.com/wiki/MOBI) y [eReader](https://wiki.mobileread.com/wiki/EReader) son dos formatos que incorporan en el propio formato soporte específico de diccionarios. Sin embargo, es posible usar estos diccionarios para dar soporte a programas de lectura de libros electrónicos en otros formatos, siempre que el propio programa de lectura cuente con ese soporte. Ambos formatos admiten [DRM](https://wiki.mobileread.com/wiki/DRM).

[Kindle](https://wiki.mobileread.com/wiki/Kindle) dispone de buenos diccionarios para todos sus productos.

[LIT](https://wiki.mobileread.com/wiki/LIT) incluye soporte de diccionarios y tiene un diccionario gratuito que puede descargarse del sitio web de Microsoft.

[Cool Reader](https://wiki.mobileread.com/wiki/Cool_Reader) tiene soporte de diccionarios mediante los diccionarios de [AlReader](https://wiki.mobileread.com/wiki/AlReader); así, los productos que usan esta API podrían añadir fácilmente soporte de diccionarios.

Existe una iniciativa llamada [Dictionary exchange format](http://xdxf.sourceforge.net/) (formato de intercambio de diccionarios) para unificar todos los diversos formatos libres y que así los diccionarios puedan compartirse. Sin embargo, no da cabida a los diccionarios con [DRM](https://wiki.mobileread.com/wiki/DRM). Véase: [XDXF](https://wiki.mobileread.com/wiki/XDXF).

[BDicty](https://wiki.mobileread.com/wiki/BDicty) es un programa de diccionario desarrollado originalmente para [PalmOS](https://wiki.mobileread.com/wiki/PalmOS) pero disponible hoy en varias plataformas.

[SDictionary](http://swaj.net/sdict/index.html) es un proyecto de diccionario multiplataforma que usa su propio formato abierto de diccionario, Sdict. Actualmente se sabe que funciona bajo UNIX, Win32 y Symbian OS.

## Diccionarios de traducción

- Dizionario Dictionary Italiano Inglese y Dizionario Dictionary Inglese Italiano en [PDF](https://wiki.mobileread.com/wiki/PDF), en la sección de subidas de libros electrónicos de MobileRead
- [StarDict, diccionario libre y de código abierto](http://stardict.sourceforge.net/Dictionaries_dictd-www.dict.org.php)
- [Dict.org](http://www.dict.org/links.html): una implementación cliente/servidor.
- El formato Dict lo usan [AlReader](https://wiki.mobileread.com/wiki/AlReader) y otros. Está disponible en los diccionarios Lingvo y Slovoed; véase el [foro ruso](http://www.alreader.com/forum/viewforum.php?f=4) para más detalles.
- [A Digital Latin Dictionary](http://www.amazon.com/dp/B005CA3W2G): diccionario de latín para el Kindle.

## Diccionarios de inglés

- Webster, Noah: Webster's Dictionary 1913 (con 110,875 palabras), en formato [IMP](https://wiki.mobileread.com/wiki/IMP) [aquí](http://www.mobileread.com/forums/showthread.php?t=29982), [MOBI](https://wiki.mobileread.com/wiki/MOBI) [aquí](http://www.mobileread.com/forums/showthread.php?t=31510), [EPUB](https://wiki.mobileread.com/wiki/EPUB) [aquí](http://www.mobileread.com/forums/showthread.php?t=31511), [RB](https://wiki.mobileread.com/wiki/RB) [aquí](http://www.mobileread.com/forums/showthread.php?t=31513) o DIC [aquí](http://www.mobileread.com/forums/showthread.php?p=654920#post654920), de la sección de subidas de libros electrónicos de MobileRead
- [Diccionarios XDXF](http://sourceforge.net/projects/xdxf/files/dicts-XDXF/): XML Dictionary Exchange Format (formato XML de intercambio de diccionarios). El diccionario de Webster también está aquí. Hay muchos diccionarios disponibles.
- fuente antigua de un Random House Dictionary (con 19,300 palabras): [rhd.rb](http://www.mobileread.com/forums/showthread.php?p=262705#post262705)
- [Encarta pocket dictionary](http://www.microsoft.com/reader/info/features/dictionary.aspx) (con 86,000 palabras) en formato [LIT](https://wiki.mobileread.com/wiki/LIT), de Microsoft
- [Hilo de MobileRead](http://www.mobileread.com/forums/showthread.php?t=22320): cómo añadir un diccionario a un [PRS500](https://wiki.mobileread.com/wiki/PRS500) o un [PRS505](https://wiki.mobileread.com/wiki/PRS505). Nótese que solo permite la consulta del diccionario en sí, no está disponible mientras se lee otro libro.
- [StarDict, diccionario libre y de código abierto](http://stardict.sourceforge.net/Dictionaries_dictd-www.dict.org.php)
- [MobiPocket](http://www.mobipocket.com) vende diccionarios para su formato
- [eReader](http://www.ereader.com) vende diccionarios para su formato
- Diccionarios [ABBYY Lingvo](http://www.lingvo.com/) para PC y dispositivos móviles. Diccionarios de traducción en línea en [lingvo-online.ru](http://www.lingvo-online.ru/en).
- [Sitio FTP de Dict](ftp://ftp.dict.org/dict/pre): archivos dict preempaquetados y otros.
- [WordNet](http://wordnet.princeton.edu/), de la Universidad de Princeton, en formato [MOBI](http://eb.lv/dict/)

## Diccionarios de francés

(El título de esta sección en el original dice «French Dictionnaries», errata incluida.)

- Dictionnaire de l'Académie française de 1932-35 (8e édition), en [MOBI](https://wiki.mobileread.com/wiki/MOBI) [aquí](http://www.ebooksgratuits.com/newsendbook.php?id=1609&format=mp)
- Dictionnaire Littré (1860-1876), en [MOBI](https://wiki.mobileread.com/wiki/MOBI) [aquí](http://www.ebooksgratuits.com/newsendbook.php?id=1396&format=mp)

## Dispositivos de libros electrónicos

Los siguientes dispositivos pueden usar un diccionario para consultar palabras del libro electrónico que estás leyendo:

- [JetBook](https://wiki.mobileread.com/wiki/JetBook) lleva soporte de diccionarios integrado, con varios diccionarios. También traducción multilingüe.
- [Kindle](https://wiki.mobileread.com/wiki/Kindle) incluye un diccionario y soporte en [AZW](https://wiki.mobileread.com/wiki/AZW) (básicamente formato [MOBI](https://wiki.mobileread.com/wiki/MOBI)). Solo puede usarse un diccionario.
- [Bookeen Cybook Gen3](https://wiki.mobileread.com/wiki/Bookeen_Cybook_Gen3) incluye soporte de diccionarios para diccionarios [MOBI](https://wiki.mobileread.com/wiki/MOBI). Varios diccionarios funcionan a la vez.
- [EBookwise-1150](https://wiki.mobileread.com/wiki/EBookwise-1150) incluye un diccionario.

## Diccionarios ortográficos

Aunque los diccionarios para correctores ortográficos no son diccionarios en el sentido clásico, se incluyen aquí por completitud.

- [HunSpell](http://hunspell.sourceforge.net/): corrector ortográfico de código abierto. Es el que usa [Open Office](https://wiki.mobileread.com/wiki/Open_Office).
- [Micro spell](http://www.microspell.com/): corrector ortográfico para [Windows](https://wiki.mobileread.com/wiki/Windows), útil con [Sigil](https://wiki.mobileread.com/wiki/Sigil) u otro [software de creación de libros](https://wiki.mobileread.com/wiki/Book_authoring_software).
- [How to Write a Spelling Corrector](http://norvig.com/spell-correct.html) (cómo escribir un corrector ortográfico) describe un programa de 21 líneas en [Python](https://wiki.mobileread.com/wiki/Python) para detectar y corregir errores.

## Software

- [Mobidict](https://wiki.mobileread.com/wiki/Mobidict) es un programa independiente para Windows/Linux/MacOS diseñado para leer diccionarios con formato [MOBI](https://wiki.mobileread.com/wiki/MOBI) o de [Kindle](https://wiki.mobileread.com/wiki/Kindle).
- [Penelope](https://github.com/pettarin/penelope) es una herramienta múltiple para crear, editar y convertir diccionarios, especialmente para dispositivos eReader.

## Para saber más

- [Un hilo de MobileRead](http://www.mobileread.com/forums/showthread.php?t=20480): cómo hacer un diccionario [MOBI](https://wiki.mobileread.com/wiki/MOBI) en cualquier idioma.
- [Un hilo de MobileRead](http://www.mobileread.com/forums/showthread.php?t=46382): un diccionario para [Cool Reader](https://wiki.mobileread.com/wiki/Cool_Reader) que funciona en algunos dispositivos Hanlin.
- [Formato de archivo de StarDict](http://stardict.sourceforge.net/StarDictFileFormat) (en inglés)
- El [estándar del IDPF para diccionarios y glosarios](http://www.idpf.org/epub/dict/) en [ePub 3](https://wiki.mobileread.com/wiki/EPub_3)

---

Este artículo también está disponible en chino: [电纸书词典制作总览](/zh/wiki/dictionaries/overview/).
