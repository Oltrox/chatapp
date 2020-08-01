# Chat con socket.io

Pequeña implementación de una aplicación web utilizando websockets de socket.io.

Utiliza express para el servidor

## Requerimientos

* Node JS

## Instalación

Descargar el repositorio, abrir una terminal y ejecutar:

    npm install

## Uso

Ejecutar en una terminal, dentro de la carpeta:

    node servidor

El servidor se ejecutará en el puerto 5000

## Consideraciones

* Para generar un chat, ambos deben tenerse agregados a los contactos.
* El nombre de usuario no puede repetirse en la plataforma.
* No se puede agregar el alias que es ingresado como un nuevo contacto.
* Los nombres de usuarios se guardaran sin espacios en blanco ni mayúsculas.