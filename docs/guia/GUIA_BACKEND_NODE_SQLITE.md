# Guia backend Node + Express + SQLite

Esta guia explica el backend agregado al proyecto y como se conecta con el frontend.

## Archivos creados

```text
package.json
.gitignore
backend/
├── server.js
├── app.js
├── db.js
├── search.js
├── routes/
├── controllers/
├── services/
├── models/
├── middleware/
└── data/
    └── museo.sqlite
```

La base de datos `museo.sqlite` se crea automaticamente cuando se prende el servidor.

## Requisitos

Necesitas tener instalado:

```text
Node.js 18 o superior
npm
```

Para revisar:

```powershell
node -v
npm -v
```

## Instalar dependencias

Desde la carpeta principal del proyecto:

```powershell
cd "C:\Users\Jhoan Andres\Documents\1113_Agencia_SAS"
npm install
```

## Prender el servidor

```powershell
npm start
```

En PowerShell, si `npm` se bloquea, usa:

```powershell
npm.cmd start
```

El backend queda en:

```text
http://localhost:3000
```

Tambien puedes abrir el frontend desde:

```text
http://localhost:3000/
```

Live Server sigue funcionando igual si prefieren usarlo.

## Como queda unido con el frontend

El frontend mantiene sus datos locales en:

```text
assets/js/data.js
```

Pero cuando prendes el backend y abres:

```text
http://localhost:3000/
```

el buscador global del inicio tambien consulta:

```text
GET /buscar?q=texto
```

Eso permite mostrar una referencia externa desde Wikipedia sin cambiar el diseno principal.

La comunicacion del frontend con el backend esta centralizada en:

```text
assets/js/api.js
```

Si necesitan hacer otra llamada al backend, agreguen la funcion ahi y luego usen `window.MuseumApi` desde `app.js`.

Si abres el proyecto con Live Server, el frontend sigue funcionando igual. Para que aparezca la referencia externa, el backend debe estar prendido en `http://localhost:3000`.

## Endpoints principales

### Revisar servidor

```text
GET /api/health
```

### Listar vehiculos

```text
GET /api/vehiculos
```

### Ver un vehiculo

```text
GET /api/vehiculos/1
```

### Crear vehiculo

```text
POST /api/vehiculos
```

Ejemplo de JSON:

```json
{
  "nombre": "Ferrari F40",
  "categoria": "autos",
  "marca": "Ferrari",
  "año": 1987,
  "velocidad": "324 km/h",
  "descripcion": "Superdeportivo italiano historico.",
  "imagen": "https://example.com/ferrari.jpg",
  "url_referencia": "https://es.wikipedia.org/wiki/Ferrari_F40"
}
```

Tambien se acepta `anio` si prefieren evitar la ñ en el JSON.

### Actualizar vehiculo

```text
PUT /api/vehiculos/1
```

Usa el mismo formato JSON de crear vehiculo.

### Eliminar vehiculo

```text
DELETE /api/vehiculos/1
```

## Busqueda automatica

El endpoint usa Wikipedia como fuente publica inicial:

```text
GET /buscar?q=ferrari
GET /buscar?q=kawasaki
GET /buscar?q=boeing
```

Devuelve:

```json
{
  "nombre": "Ferrari",
  "descripcion": "Descripcion corta...",
  "imagen": "https://...",
  "url_referencia": "https://...",
  "fuente": "Wikipedia"
}
```

## Importante

- El backend no reemplaza `assets/js/data.js`; lo complementa.
- El CRUD guarda datos en SQLite.
- El buscador del inicio usa `fetch()` para consultar `/buscar`.
- Si no hay internet, `/buscar` devuelve un enlace de busqueda de Wikipedia como respaldo.

## Scripts utiles

```powershell
npm.cmd run seed
npm.cmd run import:local
```

`seed` crea ejemplos basicos.

`import:local` copia las piezas de `assets/js/data.js` a SQLite sin duplicar nombres existentes.
