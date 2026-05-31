const express = require("express");
const vehicleController = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", vehicleController.listVehicles);
router.get("/:id", vehicleController.getVehicle);
router.post("/", vehicleController.createVehicle);
router.put("/:id", vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);

module.exports = router;
