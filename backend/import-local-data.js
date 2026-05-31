const path = require("path");
const { pathToFileURL } = require("url");
const { initializeDatabase } = require("./db");
const vehicleService = require("./services/vehicleService");

function inferBrand(name) {
  return String(name || "").split(" ")[0] || null;
}

function inferCategory(area) {
  const normalizedArea = String(area || "").toLowerCase();

  if (normalizedArea.includes("auto")) {
    return "autos";
  }

  if (normalizedArea.includes("moto")) {
    return "motos";
  }

  if (normalizedArea.includes("avion") || normalizedArea.includes("avi")) {
    return "aviones";
  }

  return "autos";
}

function mapLocalItem(item, route) {
  return {
    nombre: item.name,
    categoria: inferCategory(route.area),
    marca: inferBrand(item.name),
    anio: Number.parseInt(item.year, 10) || null,
    velocidad: item.specs?.topSpeed || null,
    descripcion: Array.isArray(item.history)
      ? item.history[0]
      : item.history || item.detail || route.description,
    imagen: item.image || null,
    url_referencia: item.url_referencia || item.urlReferencia || item.officialUrl || item.referenceUrl || null
  };
}

async function importLocalData() {
  global.window = {};
  await import(pathToFileURL(path.join(__dirname, "..", "assets", "js", "data.js")).href);
  await initializeDatabase();

  const existingVehicles = await vehicleService.listVehicles();
  const existingNames = new Set(existingVehicles.map((vehicle) => vehicle.nombre.toLowerCase()));
  const routes = global.window.MUSEUM_DATA.routes;
  let createdCount = 0;

  for (const route of Object.values(routes)) {
    for (const item of route.items) {
      if (existingNames.has(item.name.toLowerCase())) {
        continue;
      }

      const vehicle = mapLocalItem(item, route);
      const { error } = vehicleService.prepareVehicle(vehicle);

      if (error) {
        console.log(`Saltado ${item.name}: ${error}`);
        continue;
      }

      await vehicleService.createVehicle(vehicle);
      existingNames.add(vehicle.nombre.toLowerCase());
      createdCount += 1;
    }
  }

  console.log(`Importacion terminada. Vehiculos creados: ${createdCount}`);
}

importLocalData()
  .catch((error) => {
    console.error("No se pudo importar data.js.", error);
    process.exit(1);
  });
