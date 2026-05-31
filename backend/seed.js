const { initializeDatabase } = require("./db");
const vehicleService = require("./services/vehicleService");

const seedVehicles = [
  {
    nombre: "Ferrari F40",
    categoria: "autos",
    marca: "Ferrari",
    anio: 1987,
    velocidad: "324 km/h",
    descripcion: "Superdeportivo italiano historico creado para celebrar los 40 anos de Ferrari.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/c/cb/F40_Ferrari_20090509.jpg",
    url_referencia: "https://es.wikipedia.org/wiki/Ferrari_F40"
  },
  {
    nombre: "Kawasaki Ninja H2R",
    categoria: "motos",
    marca: "Kawasaki",
    anio: 2015,
    velocidad: "Mas de 350 km/h",
    descripcion: "Motocicleta de pista con motor sobrealimentado y enfoque extremo de rendimiento.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Kawasaki_Ninja_H2R.jpg",
    url_referencia: "https://es.wikipedia.org/wiki/Kawasaki_Ninja_H2"
  },
  {
    nombre: "Boeing 747",
    categoria: "aviones",
    marca: "Boeing",
    anio: 1969,
    velocidad: "Aprox. 920 km/h",
    descripcion: "Avion comercial de fuselaje ancho conocido como Jumbo Jet.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/4/40/Boeing_747-400_Dreamliner_CI_B-18210.jpg",
    url_referencia: "https://es.wikipedia.org/wiki/Boeing_747"
  }
];

async function seed() {
  await initializeDatabase();
  const existingVehicles = await vehicleService.listVehicles();

  for (const vehicle of seedVehicles) {
    const alreadyExists = existingVehicles.some((current) =>
      current.nombre.toLowerCase() === vehicle.nombre.toLowerCase()
    );

    if (!alreadyExists) {
      await vehicleService.createVehicle(vehicle);
      console.log(`Creado: ${vehicle.nombre}`);
    }
  }

  console.log("Seed terminado.");
}

seed()
  .catch((error) => {
    console.error("No se pudo ejecutar el seed.", error);
    process.exit(1);
  });
