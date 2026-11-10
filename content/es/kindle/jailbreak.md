---
title: "Jailbreak de software Kindle 5.x (PW2 / PW3 / KT2 / KT3 / KV / KOA)"
type: translated
original_title: "5 x Jailbreak"
source_url: https://wiki.mobileread.com/wiki/5_x_Jailbreak
original_author: "Contribuidores de MobileRead Wiki (Coplate, NiLuJe, DaleDe, Monguin, Ilovejedd, Ttx, Katadelos, Nhgbslik y otros; créditos adicionales en la página original)"
translated_at: 2026-11-10
order: 1
description: "Guía completa del jailbreak de software para los Kindle táctiles (PW2/PW3/KT2/KT3/KV/KOA): comprobar si tu firmware es compatible, bloquear las actualizaciones OTA, preparar el firmware de fábrica, verificar el MD5, instalar el jailbreak y el hotfix, y conservar el jailbreak tras actualizar."
---

> Este artículo es una traducción de la página «5 x Jailbreak» de MobileRead Wiki, última revisión 2021-10-04.
> Los enlaces a hilos del foro y a descargas del original se conservan tal cual, únicamente como cita de fuente y punto de descarga; este sitio no replica contenido de los foros.
> El jailbreak implica flashear firmware: un error puede dejar el dispositivo brickeado (inservible). Sigue los pasos uno a uno y no te saltes ninguno.

Jailbreak de software para los Kindle **PW2, PW3(B), PW3W, KT2, KT3(B), KT3W, KV y KOA**.

El jailbreak de software para el dispositivo de 9.ª generación (KOA2 / Oasis 2) todavía requiere trabajo adicional: el paquete «hotfix» del KOA2 no reinstala el jailbreak automáticamente y no hay fecha estimada de solución. El paso 1 más abajo explica cómo averiguar el apodo (nickname) de tu dispositivo a partir de su número de serie.

## ¿Funcionará este jailbreak con mi firmware actual?

Mira el **tercer campo** del número de versión de tu firmware: en `5.8.`**`7`**`.0.1`, si ese tercer campo es mayor que **7**, este jailbreak no funcionará en tu dispositivo.

Es decir, **no funcionará** en: 5.8.8, 5.8.9, 5.8.10, ..., 5.8.99999999. (Por ahora **NO** es posible bajar de versión y usar este jailbreak.)

Por supuesto, esto también significa que no funcionará en nada más nuevo que la rama 5.8.x en sí (es decir, 5.9.x y lo que pueda venir después ;)).

Por favor, ni siquiera pienses en preguntar si este aviso sigue significando lo que dice: el aviso se mantiene actualizado.

### Casos especiales

- **PW3** con firmware 5.9.6.1 o anterior puede hacer jailbreak. Consulta [este hilo](https://www.mobileread.com/forums/showthread.php?t=313086) para las instrucciones.
- **PW4** con firmware 5.10.1.3 o anterior puede hacer jailbreak; quizá también sea posible con firmware posterior. Consulta [esta publicación](https://www.mobileread.com/forums/showpost.php?p=3956552&postcount=782) para más información.
- **KT4** con firmware 5.11.0 puede hacer jailbreak. Consulta [este hilo](https://www.mobileread.com/forums/showthread.php?t=320570) para las instrucciones.

### Sobre bajar de versión (downgrade)

Conviene señalar que hay informes de personas que han logrado bajar de versión en un Kindle con firmware más reciente que 5.8.7.x, pero muchas —la mayoría— reportan **dispositivos brickeados**. No se recomienda intentar bajar de versión si tu firmware es más reciente que 5.8.7. Tu mejor opción es bloquear las actualizaciones (creando un directorio vacío llamado `update.bin.tmp.partial` en la raíz de tu partición de usuario) y volver a consultar aquí o en [los foros](https://www.mobileread.com/forums/forumdisplay.php?f=150) con regularidad para ver si ya existe un jailbreak para tu firmware. La única otra solución es usar [el método del puerto serie](https://www.mobileread.com/forums/showthread.php?t=267541); el puerto serie sería además tu única vía para recuperar un dispositivo si intentaras bajar de versión en un Kindle con firmware no compatible y este acabara brickeado, así que deberías estar preparado para usarlo si decides probar un downgrade en un dispositivo no compatible (insisto: es muy arriesgado y no se recomienda).

### ¿Sobrevive el jailbreak a las actualizaciones?

Si haces el jailbreak en una versión de firmware anterior, se sabe que el jailbreak sobrevive a la actualización a 5.8.8, 5.8.9, 5.8.9.2, 5.8.10 y 5.8.11. Según los reportes de los foros, parece sobrevivir también a las actualizaciones a 5.9.2 y 5.9.4.

Debería sobrevivir a una actualización a **cualquier** versión de firmware: está diseñado para ser «viral». Pero ojo: **ninguno de nuestros complementos (add-ins) está protegido ante las actualizaciones; siempre debes reinstalarlos.**

Los modelos **G090LK y G090LL (pantalla blanco y negro, PW-3, 32 GB, solo WiFi), junto con las dos versiones correspondientes WiFi+3G, cuentan con soporte parcial**. Consulta el [hilo 291336](https://www.mobileread.com/forums/showthread.php?t=291336).

## Prueba del jailbreak (dispositivos táctiles citados en el título)

A continuación se adjunta un paquete de instalación «Dummy» (de prueba) que sirve para comprobar el jailbreak instalado en tu dispositivo: si se ejecuta, tu jailbreak está completo; si no llega a ejecutarse, tu jailbreak falta o está dañado.

Este paquete de prueba no instala nada: únicamente escribe un informe en el nivel superior del almacenamiento USB visible (`dummy_updatetest.log`; el original adjunta un ejemplo).

Si este paquete de prueba no consigue escribir su informe, sigue estas instrucciones **de forma exacta y completa**, desde el paso 0 hasta el paso 8 incluido:

1. Descarga el archivo adjunto y ábrelo. El archivo contiene un único directorio, `Dummy`, con todo el contenido dentro.
2. Desde el contenido del directorio `Dummy`, mueve el archivo `Update_dummy_0.0.N.bin` al directorio `/mrpackages` de tu Kindle. Si no existe un directorio `/mrpackages` en la raíz visible de tu Kindle, o bien el jailbreak está dañado o bien nunca llegó a instalarse.
3. Dispara la instalación del paquete de prueba desde KUAL o desde la barra de búsqueda principal con el comando `;log mrpi`. Ten en cuenta que la versión por barra de búsqueda solo se espera que funcione en los dispositivos para los que se diseñó: los de 8.ª generación.

## Usuarios de PW-2 con firmware 5.4.4.2 o anterior

Ve directamente al [hilo 186645](https://www.mobileread.com/forums/showthread.php?t=186645).

## Para modelos Kindle anteriores (pantalla en escala de grises)

Consulta el [hilo 275881](https://www.mobileread.com/forums/showthread.php?t=275881).

## Preparativos (el «Paso #0»)

Considera la siguiente lista de puntos como un «Paso #0» que puede hacerse en cualquier orden:

- En algunas versiones de firmware, tu Kindle **debe** estar registrado en Amazon para acceder a los menús necesarios. La regla general, válida para todas las versiones, es: si aún no está registrado, hazlo ahora. **Lee el resto de esta sección antes de conectarte a Internet.**
- Algunas de las versiones de firmware más recientes son muy agresivas con las actualizaciones OTA (Over The Air, por aire), y actualmente la OTA actualizaría a una versión que no se puede hacer jailbreak. Hoy por hoy, la mejor forma de evitar las OTA es añadir el directorio bloqueador de OTA en el nivel superior del almacenamiento USB visible. El directorio bloqueador se llama exactamente `update.bin.tmp.partial`: usa ese nombre exacto, sin ninguna extensión adicional y sin contenido alguno.
- Elimina cualquier código PIN del dispositivo o PIN de control parental que hayas configurado.
- Si tienes un modelo con publicidad (Special Offers), considera darte de baja en tu cuenta Kindle. Si te das de baja de las Special Offers, deja tu Kindle suficiente tiempo en línea para que los servidores de Amazon actualicen sus archivos de estado locales.
- ¿Tu Kindle está completamente cargado? Ponte con ello ahora: conéctalo a un cargador de pared para asegurarte.
- Haz **un solo paso cada vez**: están pensados y diseñados para hacerse de uno en uno. Al completar cada paso, si el archivo que pusiste antes en el nivel superior del almacenamiento USB visible sigue ahí, elimínalo.
- Tu Kindle debe permanecer desconectado (en modo avión) durante todo este procedimiento.

## Paso a paso

### 1. Identificar el apodo

Identifica con certeza el apodo (nickname) del modelo de tu Kindle a partir del número de serie. Usa cuatro de los primeros seis caracteres en los Kindle antiguos: `xxxx`xx; en los Kindle recientes, cuatro de los últimos seis: xx`xxxx`. Contrasta con esta tabla: [apodos por número de serie](https://wiki.mobileread.com/wiki/Kindle_Serial_Numbers).

**Las imágenes de fábrica NO están bloqueadas por modelo: ¡el cuidado que pongas en este paso es la única protección de tu Kindle!** Si no encuentras tu número de serie en la tabla, **DETÉNTE AQUÍ** y cuéntanoslo.

### 2. Preparar el dispositivo para una versión anterior de firmware

Prepara tu Kindle para ejecutar una versión anterior del firmware.

Los Kindle tienen dos zonas de almacenamiento de usuario: la que se ve a través del cable USB y otra oculta.

El proceso que borra la zona oculta también borrará lo visible por el cable USB.

- Haz copias de seguridad del contenido de `/documents`.

Estás a punto de borrarlo todo. Si esos libros ya están sincronizados con la nube de tu Kindle, deberías estar cubierto.

No deberías necesitar copias del contenido de `/system`: el sistema debería reconstruirlo por ti.

No copies el contenido de `/documents` de vuelta al Kindle hasta que hayas regresado a la misma versión de firmware desde la que lo copiaste. Con cualquier cosa distinta de «volver al mismo sitio, con la misma versión en marcha», el indexador puede volverse loco.

Vas a perder toda la personalización de tu Kindle.

No puedes alcanzar ese directorio oculto donde se guarda, y es justamente esa base de datos la que causa la mayoría de los problemas, así que DEBE desaparecer: `Inicio → Menú → Ajustes → Menú →` **`Restablecer`** (o la ruta equivalente en tu versión de firmware).

Esta es la infame opción de menú «Restablecer (valores de fábrica)», pero en este caso es un requisito, una entrada de **uso obligatorio**.

Es la **ÚNICA VEZ** que deberías usar la entrada de menú **Restablecer** en toda la vida del dispositivo, porque borra el código de supervivencia del jailbreak que se añadirá en el paso 6.

**NUNCA VUELVAS A USAR LA ENTRADA «Restablecer»**. Nunca, jamás, salvo que tu intención sea borrar el código de supervivencia del jailbreak. Que realmente, realmente necesitas.

Si llegaras a activar la acción «Restablecer» por accidente (nadie lo hace a propósito después de leer lo anterior), puedes encontrar en el [hilo de snapshots de coplate](https://www.mobileread.com/forums/showthread.php?t=289215) un paquete que restaura el código de supervivencia del jailbreak que acabas de destruir.

Ese paquete de propósito especial se coloca en la raíz del almacenamiento USB visible y se ejecuta con la entrada de menú UYK. Está pensado para instalarse sin MrPI incluso en compilaciones de firmware de cliente tan recientes como la 5.8.10.

### 3. Descargar el firmware de fábrica al ordenador

Descarga la imagen de firmware de fábrica inicial de tu modelo a tu ordenador desde uno de estos enlaces (solo IPv4).

El archivo de validación `.md5` puede usarse para confirmar que la descarga está completa y es correcta.

El miembro del foro que alojaba estos archivos ha decidido que ya están lo bastante extendidos y que ya no quiere costear el alojamiento: los enlaces de descarga `.bin` apuntan ahora a Google.

| Apodo | Firmware de fábrica | Archivo | MD5 |
| --- | --- | --- | --- |
| KOA2 | 5.9.0.6 | `update_kindle_oasis_9th_factory_5.9.0.6.bin` | `18624db8c1838ec2b5b8bfb3406ac041` |
| KOA | 5.7.4 | `update_KOA_5.7.4_initial.bin` | `8f1e7c9124a2b12e643b15447d80feae` |
| KV | 5.5.0 | `update_KV_5.5.0_initial.bin` | `f7c8905ea993fef902be82b70a98542a` |
| KT4 | 5.11.0 | `update_kt4_5.11.0_factory.bin` | `fd3e7ed8ebea59432163a5e713cd90c5` |
| KT3 | 5.8.0 | `update_KT3_5.8.0_initial.bin` | `3f1a5294e1bca8c4fa7ca2762c5b4505` |
| KT2 | 5.6.0 | `update_KT2_5.6.0_initial.bin` | `d85a86f5c75b4b9d43648f3b6afd2e84` |
| PW4 | 5.10.1.3 | `update_pw4_5.10.1.3_factory.bin` | `538d939c2cb4f05c7952d33d5348f010` |
| PW3 | 5.9.6.1 | `update_pw3_5.9.6.1_factory.bin` | `a5460e698a531c7770ba2b1ac31667b0` |
| PW2 | 5.4.3.2 | `update_PW2_5.4.3.2_initial.bin` | `3cbac0b4821cec03432b9ed382744f41` |

El original ofrece varios juegos de espejos para cada modelo (búsqueda en Google, Primary, Baidu Yun, Mega.nz y Yandex Drive; Baidu Yun añade códigos de extracción y SHA1). Como las direcciones de los espejos cambian con frecuencia, aquí solo se conservan los nombres de archivo y sus sumas de verificación; para las direcciones concretas, acude a la sección correspondiente de la [página original](https://wiki.mobileread.com/wiki/5_x_Jailbreak).

### 4. Validar la imagen y transferirla al Kindle

Tras validar el archivo descargado (¡comprueba el md5sum!), transfiere la imagen de fábrica inicial de tu ordenador al Kindle.

Si llegas aquí desde este hilo: [jailbreak de software PW3-4, PW3-32, fw-5.8.9.0.1](https://www.mobileread.com/forums/showthread.php?t=291336), usa para este paso el archivo `update_pw3_factory_5.8.9.0.1.bin` (el original da la descarga en dos partes de un ZIP multiparte). Tras extraer el ZIP multiparte, el `.bin` debe tener un tamaño de 776814880 bytes y MD5 `5d38744bd01f4cbf457dae4499c3c32a`.

**No entra en pánico** si la actualización no es inmediata: normalmente tarda 10 minutos o más.

Si **no hay un retraso muy notable** y al revisar el almacenamiento USB el archivo ya ha desaparecido, significa que este método no funcionará con la versión de firmware instalada actualmente en tu Kindle.

1. Conecta el Kindle al PC con el cable USB.
2. Coloca el archivo `update_*.bin` descargado en el nivel visible más alto del almacenamiento USB (junto a `/documents`).
3. Expulsa o extrae de forma segura (el término depende del sistema operativo) el almacenamiento USB del Kindle.
4. Desconecta el cable USB.
5. `Inicio → Menú → Ajustes → Menú → Actualizar tu Kindle` (Update Your Kindle).
6. Confirma.
7. Espera.

**El PW-2 es un caso especial en este punto de las instrucciones**: usa el «jailbreak universal» anterior que encontrarás en este hilo: [Old Universal Jail Break](https://www.mobileread.com/forums/showthread.php?t=186645). Tras completar aquellas instrucciones, sáltate los dos pasos siguientes y continúa con los pasos 7 y 8 de más abajo.

### 5. Descargar e instalar el jailbreak de firmware

Descarga e instala la versión actual del jailbreak de firmware de fábrica de Branch Delay. **Este paso instala dos archivos: nuestro certificado de firma y un documento «Jail Broken».**

Si al terminar este paso el documento «Jail Broken» no está en la carpeta `/documents` de tu Kindle, ¡tampoco estará el certificado! **Si te ocurre esto, detente aquí y publica el problema: no tiene sentido continuar si el jailbreak acaba de perderse.**

La versión actual va adjunta a su publicación de lanzamiento, ver: [Factory Image Jail Break](https://www.mobileread.com/forums/showthread.php?t=275887).

1. Conecta el Kindle al PC con el cable USB.
2. Coloca el archivo descargado (un comprimido, tal cual) en el nivel visible más alto del almacenamiento USB (junto a `/documents`).
3. Expulsa o extrae de forma segura el almacenamiento USB del Kindle.
4. Desconecta el cable USB.
5. Ve a Inicio.
6. En la barra de búsqueda, teclea el código `;installHtml` y pulsa «intro». Sí: el punto y coma forma parte del comando de la barra de búsqueda.

### 6. Descargar e instalar el hotfix

Descarga e instala el «hotfix» (código de supervivencia del jailbreak) actual.

La versión actual va adjunta a su publicación de lanzamiento, ver: [Jail Break Survival Code](https://www.mobileread.com/forums/showthread.php?p=3004892&postcount=1597).

Si llegas aquí desde el hilo del [jailbreak de software PW3-4, PW3-32, fw-5.8.9.0.1](https://www.mobileread.com/forums/showthread.php?t=291336), usa [este otro](https://www.mobileread.com/forums/showpost.php?p=3562968&postcount=4).

1. Descomprime el paquete de lanzamiento.
2. Conecta el Kindle al PC con el cable USB.
3. Coloca el archivo `Update_jailbreak_hotfix_*_install.bin` en el nivel visible más alto del almacenamiento USB (junto a `/documents`).
4. Expulsa o extrae de forma segura el almacenamiento USB del Kindle.
5. Desconecta el cable USB.
6. `Inicio → Menú → Ajustes → Menú → Actualizar tu Kindle` (Update Your Kindle).
7. Confirma.
8. Espera.

### 7. Actualizar el Kindle a una versión de firmware más reciente

Ya puedes actualizar tu Kindle a una versión de firmware más reciente: el jailbreak sobrevivirá.

- **Versión actual de firmware por OTA:** permite que el Kindle se conecte a Internet y espera; se actualizará por aire a la versión de firmware actual. **O:**
- **Descarga manual desde Amazon** e instalación de una versión de firmware elegida.
  - Para impedir las actualizaciones OTA, añade el directorio bloqueador de OTA al nivel superior del almacenamiento USB visible. El directorio bloqueador se llama exactamente `update.bin.tmp.partial`: usa ese nombre exacto, sin ninguna extensión adicional y sin contenido.
  - Puedes obtener cualquier versión de firmware publicada desde el servidor de descargas de Amazon. A continuación se dan enlaces directos al servidor de descargas de Amazon EE. UU. para una selección de versiones. Ten en cuenta que las versiones antiguas de algunos países, como Alemania, usan compilaciones distintas de las de esta lista; en esos casos, usa en su lugar el enlace de descarga que usarías normalmente. Se espera que la técnica de cambiar únicamente el número de versión en esas URL para seleccionar versiones antiguas funcione igual que en los servidores de EE. UU. También se ha descubierto que las versiones más recientes ya no se diferencian por zona geográfica; el cambio **podría** haber ocurrido aproximadamente cuando Amazon reorganizó sus descargas (en torno a fw-5.8.5 en esta lista).

**Enlaces directos de Amazon:**

- **KOA**: [5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.7.4.bin),
  [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.8.1.bin),
  [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.8.2.bin),
  [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_oasis_5.8.5.bin),
  [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_oasis_5.8.7.0.1.bin)
- **KV**: [5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.7.4.bin),
  [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.8.1.bin),
  [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.8.2.bin),
  [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_voyage_5.8.5.bin),
  [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_voyage_5.8.7.0.1.bin)
- **KT3**: [5.8.1.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_8th_5.8.1.1.bin),
  [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_8th_5.8.2.bin),
  [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_8th_5.8.5.bin),
  [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_8th_5.8.7.0.1.bin)
- **KT2**: [5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.7.4.bin),
  [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.8.1.bin),
  [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.8.2.bin),
  [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_5.8.5.bin),
  [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_5.8.7.0.1.bin)
- **PW3**: [5.7.4.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.7.4.1.bin),
  [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.8.1.bin),
  [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.8.2.bin),
  [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_all_new_paperwhite_5.8.5.bin),
  [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_all_new_paperwhite_5.8.7.0.1.bin)
- **PW2**: [5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_paperwhite_v2_5.7.4.bin),
  [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_paperwhite_v2_5.8.1.bin),
  [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_paperwhite_v2_5.8.2.bin),
  [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_paperwhite_v2_5.8.5.bin),
  [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_paperwhite_v2_5.8.7.0.1.bin)

### 8. Paquetes update_*.bin

Todos los modelos cubiertos en este hilo **deben** usar uno de los dos métodos de instalación siguientes para los paquetes con nombre en formato `update_*.bin`.

Los propietarios de KOA y KT3 **deben** usar los métodos de instalación nuevos; los demás modelos **pueden** usar tanto el método antiguo como el nuevo.

Cualquiera de nuestros complementos de terceros (add-ins) con un nombre de archivo en formato `update_*.bin` requiere el uso del **M**obile**r**ead **P**ackage **I**nstaller (MrPI).

Consigue el MR Package Installer en la sección «KUAL and KUAL extensions» de: [hilo 225030](https://www.mobileread.com/forums/showthread.php?t=225030).

Es un paquete del tipo «descomprimir en el nivel superior del almacenamiento USB visible»; asegúrate de que la herramienta de descompresión que uses tenga activada la opción de crear directorios.

Propietarios de KOA y KT3: debéis ejecutar el instalador con el nuevo comando de barra de búsqueda `;log mrpi`.

Los demás modelos cubiertos en este hilo pueden hacer lo mismo o ejecutarlo desde KUAL.

Casi todos nuestros complementos necesitan un lanzador de aplicaciones (application launcher). Consigue el paquete KUAL en la sección «KUAL and KUAL extensions» de: [hilo 225030](https://www.mobileread.com/forums/showthread.php?t=225030).

A partir de la versión 2.6.40 de la publicación, el comprimido contiene tres (3) compilaciones distintas de KUAL: la versión «keyboard», la versión «(old) touchscreen» y la nueva versión «KOA, KT3». Esto no sustituye la lectura del archivo `README.txt` incluido en el paquete, pero en resumen:

Propietarios de KOA y KT3: debéis usar el paquete KUAL en formato `update_*.bin` y debéis instalarlo con el instalador MrPI.

Otros dispositivos: el comprimido sigue conteniendo el KUAL del estilo «documento» anterior, que se usa simplemente colocando el documento KUAL (correcto) en la carpeta `/documents` del almacenamiento USB.

**Nota:** el nuevo KUAL (en formato `update_*.bin`) funcionará en todos los dispositivos táctiles con firmware 5.1.2 o más reciente.

«Casi todas las aplicaciones necesitan un lanzador»... KUAL es justamente una de las aplicaciones que **no** necesita lanzador: tiene un tipo MIME asociado que le dice al sistema cómo ejecutarla cuando se la selecciona.

Los paquetes con nombre en formato `update_*.bin` deben reinstalarse después de cada actualización de firmware.

La aplicación MrPI puede manejar varios paquetes `update_*.bin` a la vez: colócalos todos en `/mrpackages` y dispara MrPI.

## Créditos

- **NiLuJe**: descubrir que la actualización inicial de fábrica podía recuperarse (PW-2).
- **knc1**: publicar el «HowTo» y recuperar las actualizaciones iniciales del KT-2 y el PW-3.
- **Miembros del foro**: varios miembros recuperaron y proporcionaron las imágenes de actualización inicial para el KV.
- **knc1**: reconocer que la actualización inicial de fábrica podía reinstalarse en cualquier modelo comercial (que coincidiera).
- **Branch Delay**: el jailbreak de software original para la versión 5.6.5 y el jailbreak genérico para imágenes de fábrica iniciales.
- **Branch Delay, NiLuJe, Geekmaster**: pruebas iniciales del método.
- **Geekmaster**: archivista de los recursos de recuperación de Kindle externos al sitio.
- **knc1, Geekmaster, NiLuJe, kindlefere**: recursos de servidor.
- **NiLuJe, Ryccardo, eschwartz**: identificar y probar el origen del problema de los Kindle colgados.
- **Un miembro del foro**: recuperó la imagen necesaria para crear el soporte del Oasis.
- **eeeee**: recuperó la imagen necesaria para crear el soporte actualizado del PW-3 y el PW-3W.
- **ktwombley**: recuperó la imagen necesaria para crear el soporte del KT3.
- **eschwartz**: actual mantenedor del jailbreak de imágenes de fábrica de Branch Delay.
- **eschwartz, NiLuJe y otros**: nuevo lanzador de menú para el Oasis (KOA) y otros modelos.
- El primer anuncio público lo hizo Hackaday; ver: [enlace de Hackaday](https://hackaday.com/2016/07/09/a-jailbreak-for-every-kindle/), al que puede atribuirse buena parte de las visitas de este hilo.

Una larga lista con mucho trabajo hecho a lo largo de más de un año, y un trabajo que continúa. Este ataque por downgrade no ocurrió de la noche a la mañana ni es obra de una sola persona.

## Política de publicación

Nuestra política es usar un modelo de «punto único de mantenimiento» para lo que publicamos, con una sola excepción:

- Los snapshots de NiLuJe: para usarlos, filtra por el prefijo `tools` y muestra los hilos. Los usuarios deben consultar siempre el hilo de snapshots para encontrar la compilación más reciente de nuestros complementos de terceros (add-ins).

## Archivos adjuntos (del original)

| Tipo | Archivo | Enlace de descarga |
| --- | --- | --- |
| zip | `install_test_dummy.zip` (11.9 KB) | [adjunto del foro](https://www.mobileread.com/forums/attachment.php?attachmentid=152336&d=1476364320) |
| txt | `dummy_testupdate.txt` (13.5 KB) | [adjunto del foro](https://www.mobileread.com/forums/attachment.php?attachmentid=152345&d=1476371798) |
| zip | `adrive_md5_all.zip` (1.6 KB) | [adjunto del foro](https://www.mobileread.com/forums/attachment.php?attachmentid=159386&d=1507657540) |

El primero es el paquete de prueba del jailbreak; el segundo, el ejemplo de informe que escribe; el tercero, la lista de MD5 de los firmwares de fábrica. Los tres adjuntos cuelgan de la página original, disponible en la [página del original en MobileRead Wiki](https://wiki.mobileread.com/wiki/5_x_Jailbreak).
