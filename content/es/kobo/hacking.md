---
type: translated
title: Introducción al hackeo de Kobo Touch
original_title: "Kobo Touch Hacking"
source_url: https://wiki.mobileread.com/wiki/Kobo_Touch_Hacking
original_author: "Contribuidores de MobileRead Wiki (KevinShort, DaleDe, Lord-valen y otros; agradecimiento especial a stef70, el primero en documentar el método)"
translated_at: 2026-11-10
order: 2
description: "Proceso completo para hackear el Kobo Touch: modificar el paquete de firmware KoboRoot.tgz para habilitar Telnet/FTP y USB networking con privilegios de root, además de omitir la activación de cuenta y simplificar el re-hackeo tras las actualizaciones."
---

> Este artículo es una traducción de la página «Kobo Touch Hacking» de MobileRead Wiki; la última revisión del original es del 2024-01-11.
> Los enlaces a hilos del foro y a las descargas de archivos que aparecen en el original se conservan tal cual, únicamente como cita de fuente y punto de acceso a la descarga; este sitio no replica contenido de los foros.
> El hackeo requiere modificar archivos del sistema y un error puede dejar el dispositivo inservible (brick): antes de empezar, haz una copia de seguridad completa de los datos del dispositivo.

*Esta página sigue en construcción.*

Un gran agradecimiento a [stef70](https://www.mobileread.com/forums/showthread.php?t=141388), el primero en documentar cómo hackear el [Kobo Touch](https://wiki.mobileread.com/wiki/Kobo_Touch).

## Panorama general

El método que usa el Kobo Touch para actualizar su firmware es bastante sencillo: si se encuentra el archivo `.kobo/KoboRoot.tgz` en la partición pública del Kobo (public partition, la partición visible al conectar el dispositivo al ordenador por USB), el archivo .tgz se extrae en la raíz de la partición interna del sistema. Editando algunos de los archivos dentro de KoboRoot.tgz podemos habilitar con bastante facilidad el acceso por Telnet (protocolo de terminal remota) y FTP (protocolo de transferencia de archivos), lo que nos concede privilegios de root.

## El proceso de hackeo

### Obtener el archivo de actualización

El primer paso es conseguir el firmware actual para poder parchear algunos archivos. Hay una lista de archivos de firmware de Kobo con enlaces de descarga [aquí](https://wiki.mobileread.com/wiki/Kobo_Firmware_Releases). La otra forma de conseguir el firmware más reciente es hacer un restablecimiento de fábrica (factory reset):

1. ¡Haz una copia de seguridad de TODOS tus libros electrónicos! (El restablecimiento de fábrica borrará todos tus archivos). Los libros descargados de la tienda Kobo volverán a cargarse automáticamente en tu Touch cuando sincronices el dispositivo.
2. Ejecuta el restablecimiento de fábrica. Esto puede hacerse de dos maneras:
   - Mantén pulsado el botón Home mientras el dispositivo se enciende, o
   - En la pantalla de inicio del Touch, pulsa HOME y luego **Settings > Device Information > Factory Reset** (Ajustes > Información del dispositivo > Restablecimiento de fábrica).
3. Conecta el Touch al ordenador y usa la aplicación de escritorio de Kobo para configurar tu Kobo Touch.
4. Antes de desconectar el Touch, copia a tu disco duro el archivo `KoboRoot.tgz`, que se encuentra en el directorio .kobo del Touch.

### Editar los archivos

Ahora que tenemos `KoboRoot.tgz`, podemos examinar su contenido. En Linux, extrae los archivos con:

```sh
tar xvzf KoboRoot.tgz
```

Los usuarios de Windows pueden usar un programa como 7-zip para extraer los archivos. **NO USES WORDPAD NI NINGÚN OTRO EDITOR DE TEXTO DE WINDOWS** (los caracteres de salto de línea de Windows rompen los scripts).

El archivo más interesante es `etc/init.d/rcS`. Este script lo invoca el proceso `init` cada vez que el Touch arranca. Podemos añadir fácilmente nuestras propias órdenes de shell al script. Para mantener la flexibilidad, añadiremos la siguiente línea justo antes de la línea `/usr/local/Kobo/nickel -qws &`:

```sh
/mnt/onboard/run.sh &
```

*Nota: añadir la línea `/mnt/onboard/run.sh >>/mnt/onboard/run.out 2>&1 &` dará una salida de registro en `run.out` y permitirá depurar cualquier problema con las órdenes de `run.sh`.*

Y lo empaquetamos con:

```sh
tar czf KoboRoot.tgz etc/init.d/rcS
```

Copia el archivo KoboRoot.tgz al directorio `.kobo` del Touch, desconéctalo y se instalará y reiniciará automáticamente.

### Habilitar Telnet/FTP

Hay dos archivos, `inittab` e `inetd.conf`, que debemos editar para habilitar Telnet y FTP. Sin embargo, no aparecen en el KoboRoot.tgz del firmware actual. Así que crearemos un script, `run.sh`, con las órdenes:

```sh
cp /etc/inittab /mnt/onboard
cp /etc/inetd.conf /mnt/onboard
```

Conecta el Touch al ordenador y copia run.sh al Touch. Tras un reinicio, deberías encontrar los archivos `inittab` e `inetd.conf` en la partición pública del Touch. Muévelos al directorio `etc` del KoboRoot.tgz extraído.

El Kobo Touch ejecuta Busybox, que contiene todas las herramientas necesarias para controlar el Touch por WiFi. Para habilitar Telnet y FTP se requieren tres pasos:

1. Añade las siguientes líneas a `etc/init.d/rcS`:

   ```sh
   mkdir -p /dev/pts
   mount -t devpts devpts /dev/pts
   ```

2. A `etc/inetd.conf` añade:

   ```sh
   21 stream tcp nowait root /bin/busybox ftpd -w -S  /
   23 stream tcp nowait root /bin/busybox telnetd -i
   ```

   **Nota**: en el caso de un colaborador, en un Glo 2.1.5 solo funciona si se elimina la barra diagonal del final de la línea «21 stream ...».

3. Y añade a `etc/inittab`:

   ```sh
   ::respawn:/usr/sbin/inetd -f /etc/inetd.conf
   ```

Estos archivos pueden empaquetarse con:

```sh
tar czf KoboRoot.tgz etc/init.d/rcS etc/inittab etc/inetd.conf
```

Copia el KoboRoot.tgz resultante al directorio .kobo del Touch y desconéctalo.

¡Ya deberías poder iniciar sesión por Telnet! Tendrás que habilitar el WiFi, por ejemplo abriendo el navegador web, y averiguar la dirección IP de tu Touch.

Si pulsas **HOME > Settings > Device Information** puedes ver la dirección MAC de tu Touch. Abre el navegador del Touch y, en un ordenador conectado a la misma red que el Touch, ejecuta (suponiendo que las direcciones IP de tu red sean 192.168.1.x):

```sh
sudo nmap -sP 192.168.1.1-254
```

para obtener una lista de todos los dispositivos conectados. Busca la dirección MAC de tu Touch: la dirección IP estará unas líneas por encima de la dirección MAC. Con esa dirección IP, conéctate por Telnet a tu Touch:

```sh
telnet 192.168.1.100
```

Inicia sesión como `root` con la contraseña en blanco y ya lo tienes todo listo.

### Habilitar USB networking

USB networking (conexión de red por USB) permite controlar el Kobo a través del cable USB en lugar de por WiFi. Si tu Linux usa systemd, necesitarás encontrar de antemano el identificador de tu puerto USB. Para ello, conecta el lector y ejecuta:

```sh
$ sudo dmesg
```

Deberías encontrar una línea parecida a esta:

```text
[XXXXXXX.XXXXXX] cdc_ether 1-2:1.0 enXXXXXXXXXXXXX: renamed from usb0
```

Anota el código que empieza por `en`. Tendrás que sustituir «usb0» por ese código en todas partes de las instrucciones siguientes. Este número depende del puerto USB utilizado, así que ten cuidado si conectas el lector a otro puerto.

Primero habilita Telnet/FTP siguiendo la guía anterior y conéctate por Telnet a tu Kobo.

#### Forma manual (p. ej., para uso puntual: deja de funcionar tras reiniciar)

Asegúrate de que el Kobo NO está conectado por USB y ejecuta estas órdenes en el Kobo:

```sh
> killall nickel
```

(nickel es la aplicación de lectura; podrás reiniciarla después con [este script](http://pastebin.com/gEuQpaU5)):

```sh
> /bin/busybox insmod /drivers/ntx508/usb/gadget/arcotg_udc.ko
> /bin/busybox insmod /drivers/ntx508/usb/gadget/g_ether.ko
```

(el módulo no se conectará a través de nickel: hay que configurarlo manualmente):

```sh
> ifconfig usb0 192.168.2.2
```

Ahora conecta el Kobo al PC por USB y ejecuta estas órdenes en el PC:

```sh
> lsusb
```

(debería mostrar *Netchip Technology, Inc. Linux-USB Ethernet/RNDIS Gadget*; si es así:)

```sh
> ifconfig usb0 192.168.2.1
> telnet 192.168.2.2
```

y ya puedes iniciar sesión como `root` con la misma contraseña (por defecto: sin contraseña) que en el caso del WiFi anterior.

#### Forma automática (p. ej., para uso permanente: seguirá funcionando tras los reinicios)

Lo más sencillo probablemente sea editar esto en el PC y luego devolverlo por FTP al Kobo (yo uso Gftp en Ubuntu):

En el Kobo:

```sh
> killall nickel
```

pon estas órdenes al final de `/etc/init.d/rcS`:

```sh
/bin/busybox insmod /drivers/ntx508/usb/gadget/arcotg_udc.ko
/bin/busybox insmod /drivers/ntx508/usb/gadget/g_ether.ko
```

pon esta orden al final de `/usr/local/Kobo/udev/ac` y `/usr/local/Kobo/udev/plug`:

```sh
ifconfig usb0 192.168.2.2
```

(probablemente no haga falta ponerla en ambos, pero soy demasiado perezoso para comprobarlo).

Ahora es el momento de reiniciar el Kobo para comprobar si los cambios han surtido efecto:

```sh
> reboot
```

Cuando aparezca la interfaz principal del Kobo (aunque creo que quizá no importa), conecta el Kobo al PC por USB. Ignora la ventana emergente que aparece.

Después, en el PC:

```sh
$ ifconfig usb0 192.168.2.1
$ telnet 192.168.2.2
```

NOTA: en OS X, en lugar de «usb0» necesitas algo como «en0»; el número depende del puerto USB.

y ya puedes iniciar sesión como `root` con la misma contraseña (por defecto: sin contraseña) que en el caso del WiFi anterior.

### Notas sobre el modo de suspensión

Esto parece funcionar:

```sh
echo 1 > /sys/power/state-extended   # apaga la pantalla táctil neonode
echo mem > /sys/power/state
# tras reanudar:
echo 0 > /sys/power/state-extended
```

El archivo se descubrió mirando el strace de nickel:

```c
open("/sys/power/state-extended", O_WRONLY|O_CREAT|O_TRUNC|O_LARGEFILE, 0666) = 3
dup2(3, 1) //copy filehandle
write(1, "1\n", 2) = 2
execve("/bin/sh", ["sh", "-c", "echo mem > /sys/power/state"]
```

Del código fuente de kobolabs, `/KoboLabs/hw/imx508/cls/linux-2.6.35.3/kernel/power/main.c`:

```c
static ssize_t state_extended_store(struct kobject *kobj, struct kobj_attribute *attr,
                                    const char *buf, size_t n)
{
  if ( buf[0] == '1' )
  {
    if(!g_sys_full_suspend_state)
    {
      neonode_activate(0); disable_irq_wake(get_homekey_irq());
      g_sys_full_suspend_state=1;
    }
  }else if(g_sys_full_suspend_state)
  {
    neonode_activate(1);
    enable_irq_wake(get_homekey_irq());
    g_sys_full_suspend_state=0;
  }
```

He probado lo anterior con el WiFi apagado y el dispositivo desconectado, y parece funcionar, pero no lo he verificado por completo comprobando el nivel de batería al cabo de un tiempo.

## Omisión de la cuenta

### Modo Sideloaded

Esta es una función añadida en 4.31.19086 (véase [este hilo del foro](https://www.mobileread.com/forums/showthread.php?p=4191419#post4191419)).

Si se necesita una actualización, el archivo de configuración puede editarse antes, después o durante el proceso de hacer sideload del firmware (sideload: instalación manual por USB sin pasar por la sincronización oficial).

1. Si partes del estado de fábrica, avanza por el asistente de configuración y selecciona **"Don't have a Wi Fi network?"** (¿No tienes red WiFi?); esto te permitirá montar el dispositivo.

2. Monta el dispositivo.

3. En `/mnt/.kobo/Kobo/Kobo eReader.conf`, bajo la sección `[ApplicationPreferences]`, añade:

   ```ini
   SideloadedMode=true
   ```

4. Expulsa y reinicia el dispositivo.

### Añadir un usuario falso

```sh
echo "insert into user values('value0', 'value1', 'value2', 'value3', 'value4', 'value5', 'value6');" | sqlite /mnt/KOBOeReader/.kobo/KoboReader.sqlite
```

El formato de la base de datos puede depender de la versión de firmware del Kobo.

En 3.11.0 lo hice así:

```sh
$ sqlite3 ./KoboReader.sqlite
SQLite version 3.8.10.2 2015-01-01 00:00:00
Enter ".help" for usage hints.
sqlite> INSERT INTO "user" VALUES('value0','value1','value2','value3','value4', 'value5', 'value6', 'value7' ,'value8');
sqlite>
```

En el Kobo Clara HD, las órdenes anteriores fallan porque la tabla tiene 20 columnas en lugar de 7 o 9, por lo que hay que usar la orden siguiente. También debería funcionar en otros modelos de Kobo siempre que no haya más columnas aparte de UserID y UserKey que no acepten valores NULL:

```sh
echo "insert into user (UserID, UserKey)  values (1, 'empty')" | sqlite3 /mnt/KOBOeReader/.kobo/KoboReader.sqlite
```

## Simplificar el re-hackeo tras las actualizaciones

Las actualizaciones de firmware sobrescriben los archivos que editaste para hackear el dispositivo, con lo que en la práctica lo «deshackean». Para evitar tener que volver a editar un montón de archivos complejos, puedes desacoplar las modificaciones de los archivos originales.

Crea un archivo llamado `customInit.sh` en el directorio raíz (o donde prefieras) con las líneas que normalmente pondrías en el archivo `/etc/init.d/rcS`, y elimina tus líneas modificadas del archivo `/etc/init.d/rcS`.

Renombra tu archivo `/etc/inetd.conf` modificado a `/etc/inetd2.conf`.

Así, cuando una actualización oficial de firmware deshaga el hackeo de tu dispositivo, bastará con añadir (con el método KoboRoot.tgz) las líneas siguientes a `/etc/inittab` para restaurar el hack:

```sh
::respawn:/usr/sbin/inetd -f /etc/inetd2.conf
::once:/bin/sh /customInit.sh
```

## Más hackeo de Kobo

- [Debian Linux on a Kobo](https://wiki.mobileread.com/wiki/Debian_Linux_on_a_Kobo) (Debian Linux en un Kobo)
- [Kobo WiFi Hacking](https://wiki.mobileread.com/wiki/Kobo_WiFi_Hacking) (hackeo del WiFi del Kobo)

## Referencias

1. [Hilo sobre el modo Sideloaded del firmware 4.31.19086 del Kobo Touch (foro de MobileRead)](https://www.mobileread.com/forums/showthread.php?p=4191419#post4191419)

---

Este artículo también está disponible en chino: [Kobo Touch 破解入门](/zh/wiki/kobo/hacking/).
