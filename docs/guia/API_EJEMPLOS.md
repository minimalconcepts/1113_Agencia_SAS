# Ejemplos para probar la API

Prende el servidor:

```powershell
npm.cmd start
```

## Health

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing
```

## Listar vehiculos

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos" -UseBasicParsing
```

## Listar con filtros y paginacion

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos?format=page&page=1&limit=10" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos?categoria=autos" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos?q=ferrari" -UseBasicParsing
```

## Ordenar resultados

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos?format=page&sort=nombre&order=asc" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos?format=page&sort=anio&order=desc" -UseBasicParsing
```

Valores permitidos:

```text
sort: id, nombre, categoria, marca, anio, updated_at
order: asc, desc
```

## Exportar JSON completo

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/export" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:3000/api/export?categoria=autos&sort=nombre&order=asc" -UseBasicParsing
```

## Ver documentacion rapida de endpoints

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api" -UseBasicParsing
```

## Crear vehiculo

```powershell
$body = @{
  nombre = "Ferrari F40"
  categoria = "autos"
  marca = "Ferrari"
  anio = 1987
  velocidad = "324 km/h"
  descripcion = "Superdeportivo italiano historico."
  imagen = "https://example.com/f40.jpg"
  url_referencia = "https://es.wikipedia.org/wiki/Ferrari_F40"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
```

## Actualizar vehiculo

```powershell
$body = @{
  nombre = "Ferrari F40"
  categoria = "autos"
  marca = "Ferrari"
  anio = 1987
  velocidad = "324 km/h"
  descripcion = "Actualizado desde la API."
  imagen = "https://example.com/f40.jpg"
  url_referencia = "https://es.wikipedia.org/wiki/Ferrari_F40"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos/1" -Method Put -Body $body -ContentType "application/json" -UseBasicParsing
```

## Borrar vehiculo

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/vehiculos/1" -Method Delete -UseBasicParsing
```

## Buscar referencia externa

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/buscar?q=ferrari" -UseBasicParsing
```
