const express = require("express");
const searchController = require("../controllers/searchController");

const router = express.Router();

router.get("/buscar", searchController.searchReference);

module.exports = router;
