# Guia para llenar las fichas tipo wiki

Esta guia explica como agregar informacion a cada vehiculo, moto o avion dentro de `assets/js/data.js`.

Las piezas que ya existen en el proyecto quedaron preparadas con `specs` y `learning`. Si un dato aparece como `Pendiente por investigar`, significa que el equipo debe completarlo cuando consiga la informacion.

Cada pieza puede tener:

- Datos basicos.
- Imagen.
- URL oficial o referencia.
- Historia.
- Datos para el comparador.
- Informacion para el apartado "Para aprender".

## 1. Donde se edita

Abre este archivo:

```text
assets/js/data.js
```

Busca la sala donde esta la pieza. Ejemplo:

```js
"/aviones/combate": {
  area: "Aviones",
  title: "Aviones de combate",
  items: [
    {
      name: "F-35 Lightning II"
    }
  ]
}
```

## 2. Datos basicos obligatorios

Cada pieza debe tener como minimo:

```js
{
  name: "F-35 Lightning II",
  type: "Caza multiusos",
  year: "2010",
  detail: "Servicio militar moderno",
  image: "assets/images/aviones/combate/F-35-Lightning-II.jpg",
  url_referencia: "https://www.lockheedmartin.com/en-us/products/f-35.html"
}
```

## 3. Como agregar una URL de referencia

Usa el campo `url_referencia`.

Ejemplo para un auto:

```js
{
  name: "Ferrari F40",
  type: "Superdeportivo",
  year: "1987",
  detail: "$1,500,000 aprox.",
  image: "assets/images/autos/superdeportivos/Ferrari-F40.jpg",
  url_referencia: "https://www.ferrari.com/es-ES/auto/f40"
}
```

Cuando una pieza tiene `url_referencia`, la ficha tipo wiki muestra un boton llamado `Referencia`.

Tambien se aceptan estos nombres si vienen desde la API:

```js
urlReferencia: "https://..."
officialUrl: "https://..."
referenceUrl: "https://..."
```

## 4. Como agregar la historia

La historia se agrega con `history`.

Se recomienda escribirla como una lista de parrafos:

```js
history: [
  "Primer parrafo: origen del vehiculo, quien lo fabrico y por que fue creado.",
  "Segundo parrafo: importancia historica, tecnologia o impacto.",
  "Tercer parrafo: comparacion, curiosidades o uso actual."
]
```

Esto ayuda a que la ficha no se vea como un bloque gigante de texto.

## 5. Como llenar el comparador

El comparador usa un objeto llamado `specs`.

Formato recomendado:

```js
specs: {
  creator: "Lockheed Martin",
  power: "Motor Pratt & Whitney F135",
  topSpeed: "Aprox. Mach 1.6",
  records: "Uno de los cazas furtivos mas usados por aliados de Estados Unidos.",
  mainUse: "Ataque, defensa aerea, reconocimiento y guerra en red.",
  importance: "Representa la guerra moderna basada en sensores e informacion."
}
```

Campos disponibles:

- `creator`: creador, marca o fabricante.
- `power`: potencia, motor o empuje.
- `topSpeed`: velocidad maxima.
- `records`: records, logros o datos destacados.
- `mainUse`: uso principal.
- `importance`: por que es importante.

Si un dato no se conoce, se puede dejar sin poner. La pagina mostrara `Pendiente`.

## 6. Apartado "Para aprender"

Por ahora el apartado "Para aprender" muestra puntos generales automaticamente.

Cuando quieran hacerlo personalizado, pueden preparar los datos asi:

```js
learning: {
  level: "Intermedio",
  keyConcepts: [
    "Tecnologia furtiva",
    "Sensores avanzados",
    "Guerra en red"
  ],
  questions: [
    "Que diferencia al F-35 de un caza tradicional?",
    "Por que sus sensores son importantes?"
  ],
  funFact: "El casco del piloto permite ver informacion del avion en tiempo real.",
  summary: "El F-35 importa porque combina sigilo, sensores y coordinacion digital."
}
```

Campos sugeridos:

- `level`: Basico, Intermedio o Avanzado.
- `keyConcepts`: conceptos importantes para estudiar.
- `questions`: preguntas para repasar.
- `funFact`: dato curioso.
- `summary`: resumen corto para recordar.

## 7. Ejemplo completo

```js
{
  name: "F-35 Lightning II",
  type: "Caza multiusos",
  year: "2010",
  detail: "Servicio militar moderno",
  image: "assets/images/aviones/combate/F-35-Lightning-II.jpg",
  url_referencia: "https://www.lockheedmartin.com/en-us/products/f-35.html",
  specs: {
    creator: "Lockheed Martin",
    power: "Motor Pratt & Whitney F135",
    topSpeed: "Aprox. Mach 1.6",
    records: "Uno de los cazas furtivos mas usados por aliados de Estados Unidos.",
    mainUse: "Ataque, defensa aerea, reconocimiento y guerra en red.",
    importance: "Representa la guerra moderna basada en sensores e informacion."
  },
  history: [
    "El F-35 Lightning II fue desarrollado por Lockheed Martin dentro del programa Joint Strike Fighter.",
    "Es importante porque combina tecnologia furtiva, sensores avanzados y capacidad multirrol.",
    "A diferencia del F-22, el F-35 esta pensado como una plataforma versatil para varias misiones."
  ],
  learning: {
    level: "Intermedio",
    keyConcepts: ["Stealth", "Sensores", "Multirrol"],
    questions: ["Que lo diferencia del F-22?", "Por que es importante en la guerra moderna?"],
    funFact: "El casco del piloto muestra informacion avanzada en tiempo real.",
    summary: "El F-35 es clave porque une sigilo, informacion y coordinacion."
  }
}
```

## 8. Recomendaciones

- No borres las comas entre objetos.
- Usa comillas en textos.
- No pegues etiquetas HTML dentro de `history`.
- Escribe textos cortos por parrafo.
- Verifica que la imagen exista en la carpeta correcta.
- Usa URLs de fuentes confiables: pagina oficial, Wikipedia, fabricante, museo o ficha tecnica.
- No uses enlaces de redes sociales como fuente principal si existe una pagina oficial.
- Si algo se rompe, revisa primero comas, comillas y llaves.
