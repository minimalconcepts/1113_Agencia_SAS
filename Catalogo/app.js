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
        <p>$${auto.precio}</p>
        <p>${auto.tipo}</p>
        <button onclick="verDetalle('${auto.modelo}')">Ver más</button>
      </div>
    `;
  });
}

function applyFilters() {
  const marca = document.getElementById("brandFilter").value;
  const tipo = document.getElementById("typeFilter").value;

  let resultado = catalogoAutos;

  if (marca) {
    resultado = resultado.filter(a => a.marca === marca);
  }

  if (tipo) {
    resultado = resultado.filter(a => a.tipo === tipo);
  }

  renderAutos(resultado);
}

function verDetalle(modelo) {
  const auto = catalogoAutos.find(a => a.modelo === modelo);

  alert(
    auto.marca + " " + auto.modelo + "\n" +
    "Precio: $" + auto.precio + "\n" +
    "Combustible: " + auto.combustible
  );
}

renderAutos(catalogoAutos);