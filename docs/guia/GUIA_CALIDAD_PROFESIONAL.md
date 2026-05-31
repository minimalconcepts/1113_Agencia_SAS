# Guia de calidad profesional

Esta guia resume las mejoras tecnicas aplicadas para que el proyecto sea mas defendible.

## Backend

- Separacion por capas: routes, controllers, services, models y middleware.
- Validaciones antes de guardar en SQLite.
- Respuestas de error consistentes.
- Indices SQLite para mejorar busquedas por categoria, nombre, marca y fecha.
- Filtros en API:

```text
GET /api/vehiculos?q=ferrari
GET /api/vehiculos?categoria=autos
GET /api/vehiculos?format=page&page=1&limit=50
GET /api/vehiculos?format=page&sort=nombre&order=asc
```

- Paginacion para evitar cargar demasiados registros en el admin.
- Ordenamiento controlado por lista segura: id, nombre, categoria, marca, anio y updated_at.
- Exportacion completa:

```text
GET /api/export
GET /api/export?categoria=autos&sort=nombre&order=asc
```

- Ruta de documentacion rapida:

```text
GET /api
```

- Seed e importador de datos locales.
- Cabeceras basicas de seguridad.
- Respuesta 404 JSON para rutas API inexistentes.
- Limitador simple de solicitudes para proteger busquedas externas y escrituras.
- Script de verificacion:

```powershell
npm.cmd run check
```

## Frontend

- Cliente API centralizado en `assets/js/api.js`.
- Modo hibrido: usa SQLite si el backend esta prendido y datos locales si no.
- Indicador de estado del backend.
- Panel admin conectado al CRUD.
- Busqueda externa con fallback si no hay internet.
- Estilos inline movidos a CSS.

## Admin

El admin permite:

- Crear registros.
- Editar registros.
- Borrar registros con confirmacion dentro de la UI.
- Ver estadisticas visibles por categoria.
- Filtrar por texto.
- Filtrar por categoria.
- Ordenar por recientes, nombre, marca, anio o actualizacion.
- Navegar por paginas.
- Exportar registros desde la API como JSON.

Ruta:

```text
http://localhost:3000/#/admin
```

## Buenas practicas para continuar

- No escribir SQL en controladores.
- No escribir `fetch()` directo en `app.js`; usar `assets/js/api.js`.
- No duplicar datos manualmente si pueden importarse con `npm.cmd run import:local`.
- Mantener las guias actualizadas cuando cambie una ruta o endpoint.
