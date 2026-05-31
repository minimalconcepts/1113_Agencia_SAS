# Guia de integracion frontend + backend

Esta guia explica como quedaron unidos el frontend y el backend de forma profesional.

## Resumen

El proyecto ahora tiene:

- Frontend: `index.html`, `assets/css`, `assets/js`.
- Backend: `backend/`.
- Base de datos: SQLite.
- Cliente API del frontend: `assets/js/api.js`.

El frontend sigue funcionando con sus datos locales, pero tambien puede consultar SQLite cuando el backend esta prendido.

## Arquitectura

```text
index.html
assets/js/
|-- data.js
|-- router.js
|-- api.js
`-- app.js

backend/
|-- server.js
|-- app.js
|-- db.js
|-- search.js
|-- routes/
|-- controllers/
|-- services/
|-- models/
`-- middleware/
```

## Que hace cada parte

`assets/js/api.js`

Centraliza las llamadas del frontend al backend. Si se necesita un endpoint nuevo, primero se agrega aqui.

`backend/routes/`

Define las URLs de la API.

`backend/controllers/`

Recibe peticiones, llama servicios y responde al navegador.

`backend/services/`

Contiene reglas de negocio, validaciones y preparacion de datos.

`backend/models/`

Habla directamente con SQLite. Aqui vive el SQL.

`backend/middleware/`

Maneja CORS, cabeceras de seguridad, limites de solicitudes y errores generales.

## Flujo de busqueda externa

```text
Usuario escribe en el buscador global
        |
assets/js/app.js
        |
assets/js/api.js
        |
GET /buscar?q=ferrari
        |
backend/routes/searchRoutes.js
        |
backend/controllers/searchController.js
        |
backend/services/searchService.js
        |
backend/search.js
        |
Wikipedia API
```

## Como prender todo unido

```powershell
cd "C:\Users\Jhoan Andres\Documents\1113_Agencia_SAS"
npm.cmd start
```

Abre:

```text
http://localhost:3000/
```

## Panel admin

El panel admin esta en:

```text
http://localhost:3000/#/admin
```

Sirve para crear, editar y borrar vehiculos guardados en SQLite.

Tambien permite:

- Filtrar por texto y categoria.
- Ordenar por nombre, marca, anio, actualizacion o recientes.
- Exportar JSON desde `GET /api/export`.
- Revisar estadisticas visibles por categoria.

## Cargar datos iniciales

Crear ejemplos:

```powershell
npm.cmd run seed
```

Importar piezas locales de `assets/js/data.js` a SQLite:

```powershell
npm.cmd run import:local
```

## Como saber si el backend esta vivo

Abre:

```text
http://localhost:3000/api/health
```

Debe responder:

```json
{
  "ok": true,
  "project": "ilovewheels",
  "database": "sqlite"
}
```

## Importante

- Si abres con Live Server, el frontend sigue funcionando en modo local.
- Para usar SQLite, admin, exportacion y referencias externas, prende el backend con `npm.cmd start`.
- No escribas `fetch()` directo en cualquier parte; usa `assets/js/api.js`.
- No escribas SQL en controladores; usa `backend/models/`.
