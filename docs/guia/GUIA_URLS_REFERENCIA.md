# Guia para poner URLs de autos, motos y aviones

Esta guia explica como agregar enlaces oficiales o fuentes de referencia a las fichas.

## Donde se ponen

En:

```text
assets/js/data.js
```

Dentro de la pieza agrega:

```js
url_referencia: "https://..."
```

## Ejemplo para un auto

```js
{
  name: "Aston Martin DB12",
  type: "Gran turismo",
  year: "2024",
  detail: "$320,000",
  image: "assets/images/autos/deportivos/Aston-Martin-DB12.jpg",
  url_referencia: "https://www.astonmartin.com/en/models/db12"
}
```

## Ejemplo para una moto

```js
{
  name: "Yamaha YZR-M1",
  type: "Moto GP",
  year: "2020",
  detail: "Yamaha M1",
  image: "assets/images/motos/gp/Yamaha-YZR-M1-Movistar-Valentino Rossi.jpg",
  url_referencia: "https://www.yamaha-racing.com/motogp/"
}
```

## Ejemplo para un avion

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

## Que aparece en la pagina

Cuando una pieza tiene `url_referencia`, en la ficha wiki aparece un boton:

```text
Referencia
```

Ese boton abre la URL en una pestaña nueva.

## Fuentes recomendadas

- Pagina oficial de la marca.
- Wikipedia si no hay pagina oficial clara.
- Museo o archivo tecnico.
- Fabricante del avion, moto o auto.
- Ficha tecnica reconocida.

## Que evitar

- No uses links rotos.
- No pegues enlaces acortados.
- No uses videos como fuente principal si hay pagina oficial.
- No pongas la URL dentro de `history`; usa `url_referencia`.

## Como conseguir una URL con el backend

Prende el servidor:

```powershell
npm.cmd start
```

Abre:

```text
http://localhost:3000/buscar?q=ferrari
```

Copia el valor de:

```json
"url_referencia"
```

y pegalo en `assets/js/data.js`.
