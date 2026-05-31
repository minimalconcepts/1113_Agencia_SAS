const vehicleModel = require("../models/vehicleModel");

function normalizeVehicle(body) {
  const yearValue = body.anio ?? body["a\u00f1o"] ?? null;

  return {
    nombre: String(body.nombre || "").trim(),
    categoria: String(body.categoria || "").trim(),
    marca: body.marca ? String(body.marca).trim() : null,
    anio: yearValue ? Number(yearValue) : null,
    velocidad: body.velocidad ? String(body.velocidad).trim() : null,
    descripcion: body.descripcion ? String(body.descripcion).trim() : null,
    imagen: body.imagen ? String(body.imagen).trim() : null,
    url_referencia: body.url_referencia || body.urlReferencia || body.url
      ? String(body.url_referencia || body.urlReferencia || body.url).trim()
      : null
  };
}

function validateVehicle(vehicle) {
  const validCategories = ["autos", "motos", "aviones"];

  if (!vehicle.nombre) {
    return "El campo nombre es obligatorio.";
  }

  if (!vehicle.categoria) {
    return "El campo categoria es obligatorio.";
  }

  if (!validCategories.includes(vehicle.categoria)) {
    return "La categoria debe ser autos, motos o aviones.";
  }

  if (vehicle.anio !== null && Number.isNaN(vehicle.anio)) {
    return "El campo anio debe ser numerico.";
  }

  if (vehicle.anio !== null && (vehicle.anio < 1880 || vehicle.anio > 2100)) {
    return "El campo anio debe estar entre 1880 y 2100.";
  }

  if (vehicle.imagen && !isValidUrl(vehicle.imagen) && !vehicle.imagen.startsWith("assets/")) {
    return "El campo imagen debe ser una URL valida o una ruta assets/...";
  }

  if (vehicle.url_referencia && !isValidUrl(vehicle.url_referencia)) {
    return "El campo url_referencia debe ser una URL valida.";
  }

  return null;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch (error) {
    return false;
  }
}

function prepareVehicle(body) {
  const vehicle = normalizeVehicle(body);
  const error = validateVehicle(vehicle);
  return { vehicle, error };
}

module.exports = {
  listVehicles: vehicleModel.findAll,
  exportVehicles: vehicleModel.findForExport,
  getVehicle: vehicleModel.findById,
  createVehicle: vehicleModel.create,
  updateVehicle: vehicleModel.update,
  deleteVehicle: vehicleModel.remove,
  prepareVehicle
};
