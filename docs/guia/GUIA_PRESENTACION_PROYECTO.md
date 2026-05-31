# Guia para presentar el proyecto

## Que es

`ilovewheels` es una wiki tipo museo para autos, motos y aviones.

Tiene:

- Frontend en HTML, CSS y JavaScript.
- Rutas con hash.
- Backend en Node.js y Express.
- Base de datos SQLite.
- Busqueda externa usando Wikipedia.
- Panel admin para crear, editar y borrar registros.

## Como prenderlo

```powershell
cd "C:\Users\Jhoan Andres\Documents\1113_Agencia_SAS"
npm.cmd start
```

Abrir:

```text
http://localhost:3000/
```

## Que mostrar primero

1. Inicio de la wiki.
2. Buscador global.
3. Una sala de autos, motos o aviones.
4. Una ficha tipo Wikipedia.
5. Favoritos.
6. Comparador.
7. Panel Admin:

```text
http://localhost:3000/#/admin
```

## Arquitectura explicada simple

```text
Frontend -> assets/js/api.js -> Backend Express -> Services -> Models -> SQLite
```

## Modo hibrido

Si el backend esta prendido:

- La pagina muestra registros de SQLite.
- El buscador puede consultar referencias externas.
- El panel admin puede guardar datos.

Si el backend esta apagado:

- La pagina sigue funcionando con `assets/js/data.js`.
- No se pierde el frontend.

## Comandos utiles

```powershell
npm.cmd start
npm.cmd run check
npm.cmd run seed
npm.cmd run import:local
```

## Que decirle al profesor

- El proyecto separa frontend y backend.
- El frontend no depende totalmente del backend; tiene fallback local.
- El backend usa capas: routes, controllers, services, models.
- SQLite permite persistir vehiculos.
- La API REST permite CRUD.
- La busqueda externa complementa la wiki con fuentes publicas.
- El panel admin permite filtrar, paginar y exportar JSON.
