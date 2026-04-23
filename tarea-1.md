# Tarea 1 (1 hora) - JavaScript para aprendices

## Objetivo de hoy
Construir una mini página que:
- muestre un catálogo de vehículos desde JavaScript
- permita filtrar por marca

Tiempo total: **60 minutos**

---

## Paso 1 (15 min) - Estructura mínima

### 1.1 Crea estos archivos en la raíz del proyecto
- `index.html`
- `styles.css`
- `app.js`

### 1.2 Pega esta base en `index.html`
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catálogo de Autos</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <h1>Catálogo de Autos</h1>

  <label for="marca">Filtrar por marca:</label>
  <select id="marca">
    <option value="todos">Todos</option>
    <option value="Toyota">Toyota</option>
    <option value="Mazda">Mazda</option>
    <option value="Ford">Ford</option>
  </select>

  <section id="catalogo"></section>

  <script src="app.js"></script>
</body>
</html>
```

### 1.3 Pega estilos básicos en `styles.css`
```css
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

#catalogo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
}
```

---

## Paso 2 (15 min) - Datos en JavaScript

En `app.js`, crea el arreglo `vehiculos` con 6 autos:

```js
const vehiculos = [
  { marca: "Toyota", modelo: "Corolla", precio: 78000, anio: 2020 },
  { marca: "Toyota", modelo: "Hilux", precio: 120000, anio: 2022 },
  { marca: "Mazda", modelo: "CX-5", precio: 110000, anio: 2021 },
  { marca: "Mazda", modelo: "3 Touring", precio: 90000, anio: 2019 },
  { marca: "Ford", modelo: "Escape", precio: 95000, anio: 2020 },
  { marca: "Ford", modelo: "Ranger", precio: 130000, anio: 2023 }
];
```

---

## Paso 3 (15 min) - Pintar el catálogo

Debajo del arreglo, agrega:

```js
const catalogo = document.getElementById("catalogo");

function pintarVehiculos(lista) {
  catalogo.innerHTML = lista
    .map(
      (auto) => `
      <article class="card">
        <h3>${auto.marca} ${auto.modelo}</h3>
        <p>Precio: $${auto.precio}</p>
        <p>Año: ${auto.anio}</p>
      </article>
    `
    )
    .join("");
}

pintarVehiculos(vehiculos);
```

Meta: al abrir `index.html`, deben verse los 6 vehículos.

---

## Paso 4 (15 min) - Filtro por marca

Agrega al final de `app.js`:

```js
const selectMarca = document.getElementById("marca");

selectMarca.addEventListener("change", () => {
  const marcaSeleccionada = selectMarca.value;

  if (marcaSeleccionada === "todos") {
    pintarVehiculos(vehiculos);
    return;
  }

  const filtrados = vehiculos.filter(
    (auto) => auto.marca === marcaSeleccionada
  );

  pintarVehiculos(filtrados);
});
```

Meta: al cambiar la marca en el `select`, el catálogo debe actualizarse.

---

## Checklist de entrega (rápido)
- [ ] Existen los 3 archivos: `index.html`, `styles.css`, `app.js`
- [ ] El arreglo `vehiculos` tiene 6 objetos
- [ ] Se renderiza el catálogo con JavaScript
- [ ] El filtro por marca funciona
- [ ] No hay errores en la consola del navegador

## Apoyo del docente durante la hora
- Min 0-15: revisar que todos creen archivos y peguen base HTML/CSS
- Min 15-30: validar sintaxis del arreglo (comas, llaves, comillas)
- Min 30-45: ayudar con `map()` + `join("")`
- Min 45-60: ayudar con `filter()` y evento `change`

## Mensaje para Gelves
Gelves, si hoy el `filter()` no filtra, tranquilo: hasta los bugs te respetan y quieren clase extra. Vas bien, sigue dándole.
