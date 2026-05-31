const vehicleService = require("../services/vehicleService");

async function listVehicles(request, response, next) {
  try {
    const result = await vehicleService.listVehicles(
      {
        q: request.query.q,
        categoria: request.query.categoria
      },
      {
        page: request.query.page,
        limit: request.query.limit,
        sort: request.query.sort,
        order: request.query.order
      }
    );

    if (request.query.format === "page") {
      response.json({
        data: result.rows,
        meta: result.meta
      });
      return;
    }

    response.json(result.rows);
  } catch (error) {
    next(error);
  }
}

async function exportVehicles(request, response, next) {
  try {
    const vehicles = await vehicleService.exportVehicles(
      {
        q: request.query.q,
        categoria: request.query.categoria
      },
      {
        sort: request.query.sort,
        order: request.query.order
      }
    );

    response.json({
      exportedAt: new Date().toISOString(),
      total: vehicles.length,
      filters: {
        q: request.query.q || "",
        categoria: request.query.categoria || "",
        sort: request.query.sort || "id",
        order: request.query.order || "desc"
      },
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
}

async function getVehicle(request, response, next) {
  try {
    const vehicle = await vehicleService.getVehicle(request.params.id);

    if (!vehicle) {
      response.status(404).json({ error: "Vehiculo no encontrado." });
      return;
    }

    response.json(vehicle);
  } catch (error) {
    next(error);
  }
}

async function createVehicle(request, response, next) {
  try {
    const { vehicle, error } = vehicleService.prepareVehicle(request.body);

    if (error) {
      response.status(400).json({ error });
      return;
    }

    const created = await vehicleService.createVehicle(vehicle);
    response.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

async function updateVehicle(request, response, next) {
  try {
    const { vehicle, error } = vehicleService.prepareVehicle(request.body);

    if (error) {
      response.status(400).json({ error });
      return;
    }

    const updated = await vehicleService.updateVehicle(request.params.id, vehicle);

    if (!updated) {
      response.status(404).json({ error: "Vehiculo no encontrado." });
      return;
    }

    response.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteVehicle(request, response, next) {
  try {
    const deleted = await vehicleService.deleteVehicle(request.params.id);

    if (!deleted) {
      response.status(404).json({ error: "Vehiculo no encontrado." });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listVehicles,
  exportVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
