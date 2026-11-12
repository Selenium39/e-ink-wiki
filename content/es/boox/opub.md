---
title: "OPUB: el archivo de libro del BOOX Picco"
type: original
author: e-ink.me
order: 2
description: "Qué es un archivo OPUB en el BOOX Picco y cómo BOOX Tiles lleva los libros al dispositivo."
---

> Este artículo es contenido original de E-ink Wiki. Los datos del dispositivo y de la transferencia proceden de la [página de producto del Picco](https://shop.boox.com/products/picco) (consultada el 2026-11-12) y de los informes públicos citados al final. BOOX no ha publicado una especificación de este archivo.
> Picco es una línea nueva. Los pasos de transferencia pueden cambiar; antes de seguir uno, compruebe [booxtiles.com](https://booxtiles.com/) y la página de producto.

## Qué es OPUB

**OPUB** es el archivo de libro que usa **Picco**, el primer dispositivo de la línea BOOX Tiles. Picco es un lector del tamaño de una tarjeta, de 3,97 pulgadas. No es uno de los dispositivos Android del [panorama de BOOX](/es/wiki/boox/overview/), y no ejecuta NeoReader.

En esos dispositivos Android, un EPUB, un MOBI y los demás formatos que admite NeoReader se abren tal cual. Picco funciona de otra manera. La [página de producto](https://shop.boox.com/products/picco) enumera un conjunto amplio de formatos de documento —EPUB, MOBI, AZW3, AZW, AZW5, FB2 y sus variantes comprimidas, TXT, PDB, PRC, RTF, HTML, XHTML y CHM— y dice que están admitidos **cuando el archivo se transfiere con la app BOOX Tiles o con la web**. Copiar un EPUB tal cual a la tarjeta no es el camino que documenta BOOX.

BOOX no publica una especificación del formato, y la página de producto no usa el nombre OPUB. Los informes públicos llaman así al archivo que el dispositivo guarda: un `.opub`. Un informe del 6 de octubre de 2026 lo describe como un libro ajustable, preparado a partir del archivo de origen, imágenes incluidas, y no como una pila de imágenes de página ([Read with Pro](https://www.readwithpro.com/blog/boox-picco-ttf-opub-transfer)). Coincide con la página de producto, que indica que, una vez el libro está en el dispositivo, se pueden cambiar la tipografía, el espaciado y los márgenes.

## Cómo llega un libro al Picco

[BOOX Tiles](https://booxtiles.com/) es la aplicación de transferencia. La página de producto describe tres vías:

1. **App del teléfono.** Instale BOOX Tiles, escanee el código QR del Picco para emparejarlo y envíe el archivo. La transferencia por teléfono y por web funciona en la misma Wi-Fi, o por la nube cuando el teléfono y el lector no están en la misma red.
2. **En la web.** Abra booxtiles.com, inicie sesión y suba el archivo.
3. **Cable USB.** Conecte el Picco, abra booxtiles.com, elija la transferencia USB y seleccione la carpeta BOOX TILE.

Esa misma revisión de octubre de 2026 del cuadro de importación señalaba que la opción USB está marcada como que no exige iniciar sesión, mientras que las vías Wi-Fi, nube, enlace y app del teléfono sí lo piden. La vía de la nube sube el archivo. El informe también anotaba que, entonces, el selector de carpeta del USB necesitaba un navegador de escritorio Chromium (Chrome, Edge u Opera).

Las imágenes tienen su propia lista en la página de producto (PNG, JPEG, WEBP, BMP, GIF) y usan la misma transferencia. Las tipografías son otra transferencia, no forman parte del archivo del libro.

## Lo que esta página no cubre

No hay una especificación pública que citar, así que la página se detiene en el archivo tal como lo encuentra quien lee en el Picco: el nombre, qué dispositivo lo usa y cómo BOOX Tiles pone un libro en ese dispositivo. No describe los bytes del interior del archivo.

## Fuentes y referencias

- [Página de producto del BOOX Picco](https://shop.boox.com/products/picco), consultada el 2026-11-12
- [Introducing BOOX Picco](https://shop.boox.com/blogs/news/introducing-boox-picco) (BOOX, 2026-09-28)
- [BOOX Tiles](https://booxtiles.com/)
- [Notas de transferencia del BOOX Picco: de EPUB a OPUB](https://www.readwithpro.com/blog/boox-picco-ttf-opub-transfer) (Read with Pro, 2026-10-06)
