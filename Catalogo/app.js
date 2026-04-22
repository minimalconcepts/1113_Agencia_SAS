const catalogoAutos = [
  {
    marca: "Lamborghini",
    modelo: "Aventador SVJ",
    año: 2021,
    kilometraje: 5000,
    precio: 600000,
    color: "Verde",
    combustible: "Gasolina",
    tipo: "Deportivo",
    estado: "Usado",
    transmision: "Automática"
  },
  {
    marca: "Lamborghini",
    modelo: "Huracán EVO",
    año: 2020,
    kilometraje: 8000,
    precio: 320000,
    color: "Amarillo",
    combustible: "Gasolina",
    tipo: "Deportivo",
    estado: "Usado",
    transmision: "Automática"
  },
  {
    marca: "Ferrari",
    modelo: "488 GTB",
    año: 2019,
    kilometraje: 12000,
    precio: 250000,
    color: "Rojo",
    combustible: "Gasolina",
    tipo: "Deportivo",
    estado: "Usado",
    transmision: "Automática"
  },
  {
    marca: "Ferrari",
    modelo: "F8 Tributo",
    año: 2022,
    kilometraje: 3000,
    precio: 350000,
    color: "Rojo",
    combustible: "Gasolina",
    tipo: "Deportivo",
    estado: "Usado",
    transmision: "Automática"
  },
  {
    marca: "Ferrari",
    modelo: "LaFerrari",
    año: 2018,
    kilometraje: 2000,
    precio: 1500000,
    color: "Negro",
    combustible: "Híbrido",
    tipo: "Deportivo",
    estado: "Usado",
    transmision: "Automática"
  },
  {
    marca: "Bugatti",
    modelo: "Chiron",
    año: 2021,
    kilometraje: 1500,
    precio: 3000000,
    color: "Azul",
    combustible: "Gasolina",
    tipo: "Deportivo",
    estado: "Usado",
    transmision: "Automática"
  }
];

const lista = document.getElementById("vehicle-list");

function renderAutos(autos) {
  lista.innerHTML = "";

  autos.forEach(auto => {
    lista.innerHTML += `
      <div class="card">
        <h3>${auto.marca} ${auto.modelo}</h3>
        <p>Año: ${auto.año}</p>
        <p>Precio: $${auto.precio}</p>
        <p>Tipo: ${auto.tipo}</p>
        <button onclick="verDetalle('${auto.modelo}')">Ver más</button>
      </div>
    `;
  });
}

function verDetalle(modelo) {
  const auto = catalogoAutos.find(a => a.modelo === modelo);

  alert(
    "Marca: " + auto.marca + "\n" +
    "Modelo: " + auto.modelo + "\n" +
    "Año: " + auto.año + "\n" +
    "Precio: $" + auto.precio + "\n" +
    "Combustible: " + auto.combustible + "\n" +
    "Transmisión: " + auto.transmision + "\n" +
    "Kilometraje: " + auto.kilometraje + "\n" +
    "Estado: " + auto.estado
  );
}

renderAutos(catalogoAutos);