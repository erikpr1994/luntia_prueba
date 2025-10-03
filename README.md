# Luntia - Sistema de Gestión de ONG

## Ejecución de la aplicación

Para ejecutar la app correctamente, sigue estos pasos:

- Descarga e instala [Docker desktop](https://www.docker.com/products/docker-desktop/)
- Descarga e instala [Node](https://nodejs.org/es/download) y [pnpm](https://pnpm.io/es/installation)
- Una vez descargado, instala los paquetes npm con `pnpm i`
- Desde la carpeta principal, corre el comando `pnpm dev`

En la carpeta `sample-data` podeis encontrar CSV de ejemplo para subir a traves de la app.

## Decisiones

- Separar cada dominio con sus propios tipos, servicios y paginas. Esto hace que se pueda reutilizar codigo comun para cada dominio, pero que se pueda personalizar para las necesidades de cada uno. Algunas mejoras que implementaria en este caso si tuviera que continuar trabajando en la aplicación sería separar los archivos en dominios en el servidor, siguiendo un esquema tipo domains/[nombreDeDominio]/[sub-folders], para así tener todo junto y que sea mas facil accesible a la hora de hacer cambios.
- El cliente esta hecho con NextJS ya que es uno de los frameworks recomendados por React. Como posibles mejoras, intentaria sacarle mas partido a las funciones que NextJS ofrece, como el uso de `<Suspense>` para la carga de datos y mejorar la separación entre server components y client components. Tambien reorganizaria cada dominio en su propia carpeta, similar a lo comentado en la parte del backend. Tambien intentaria reducir el uso de `useState` para cosas como los estados de carga y errores intentado usar librerias como SWR o creando una función de `fetcher` comun que controle esto.
- A parte de las mejoras comentadas anteriormente, otras mejoras que añadiria serian:
  - Test de integración
  - Filtros en las listas
  - Test unitarios
