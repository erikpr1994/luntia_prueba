# Luntia - Sistema de Gestión de ONG

## Ejecución de la aplicación

Para ejecutar la app correctamente, sigue estos pasos:

- Descarga e instala [Docker desktop](https://www.docker.com/products/docker-desktop/)
- Descarga e instala [Node](https://nodejs.org/es/download) y [pnpm](https://pnpm.io/es/installation)
- Una vez descargado, instala los paquetes npm con `pnpm i`
- Desde la carpeta principal, corre el comando `pnpm dev`

En la carpeta `sample-data` podeis encontrar CSV de ejemplo para subir a traves de la app.

## Decisiones

### Prioridades durante el desarrollo

**Funcionalidad core primero**: Se priorizó implementar las funcionalidades básicas (CRUD completo, visualización de datos, métricas) antes que optimizaciones o características avanzadas. Esto permitió tener una aplicación funcional rápidamente.

**Simplicidad sobre complejidad**: Se optó por una arquitectura simple y directa (separación clara frontend/backend) en lugar de microservicios o arquitecturas más complejas, priorizando la mantenibilidad y comprensión del código.

**Reutilización de componentes**: Se crearon componentes genéricos (Modal, KPICard, Tables) que se reutilizan en todos los dominios, reduciendo duplicación de código.

### Tratamiento de datos ambiguos

**Validación de CSV**: Se implementó validación básica en el frontend para detectar archivos CSV malformados o con columnas faltantes, mostrando errores claros al usuario.

**Tipos estrictos**: Se definieron interfaces TypeScript específicas para cada entidad (Activity, Donation, Member, etc.) para evitar inconsistencias en los datos.

**Valores por defecto**: Para campos opcionales o ambiguos, se establecieron valores por defecto (ej: fechas vacías se muestran como "No especificada").

**Manejo de errores**: Se implementó manejo de errores tanto en frontend como backend para casos como datos faltantes, conexión a BD, etc.

### Arquitectura y organización

**Separación por dominios**: Cada entidad (activities, donations, members, etc.) tiene sus propios tipos, servicios, rutas y páginas. Esto permite reutilizar código común pero personalizar para necesidades específicas.

**Stack tecnológico**:

- **Backend**: Node.js + Express + PostgreSQL para simplicidad y rapidez de desarrollo
- **Frontend**: Next.js + React para aprovechar SSR y componentes reutilizables
- **Base de datos**: PostgreSQL para manejar relaciones complejas entre entidades

### Mejoras con más tiempo

**Arquitectura**:

- Reorganizar en estructura `domains/[nombreDominio]/` para mejor cohesión
- Implementar patrón Repository para abstracción de datos
- Añadir middleware de autenticación/autorización

**Frontend**:

- Aprovechar mejor Next.js: Server Components, Suspense, streaming
- Implementar estado global (Zustand/Redux) para reducir useState
- Añadir filtros, paginación y búsqueda en las tablas
- Mejorar UX con loading states y skeleton screens

**Backend**:

- Implementar validación de datos con Joi/Zod
- Añadir logging estructurado
- Implementar rate limiting y CORS más estricto
- Añadir documentación API con Swagger

**Testing y calidad**:

- Tests unitarios para servicios y componentes
- Tests de integración para endpoints
- Tests E2E para flujos críticos

**Funcionalidades**:

- Exportación de datos (PDF, Excel)
- Dashboard con gráficos más avanzados
- Sistema de notificaciones
- Auditoría de cambios
