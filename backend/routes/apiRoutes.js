const express = require("express");
const vehicleController = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", (request, response) => {
  response.json({
    name: "ilovewheels API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      vehicles: "GET /api/vehiculos",
      vehicleById: "GET /api/vehiculos/:id",
      createVehicle: "POST /api/vehiculos",
      updateVehicle: "PUT /api/vehiculos/:id",
      deleteVehicle: "DELETE /api/vehiculos/:id",
      exportVehicles: "GET /api/export",
      externalSearch: "GET /buscar?q=ferrari"
    },
    filters: {
      q: "Busca por nombre, marca o descripcion.",
      categoria: "autos, motos o aviones.",
      sort: "id, nombre, categoria, marca, anio o updated_at.",
      order: "asc o desc.",
      format: "Usa format=page para recibir data y meta."
    }
  });
});

router.get("/export", vehicleController.exportVehicles);

module.exports = router;
