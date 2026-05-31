const searchService = require("../services/searchService");

async function searchReference(request, response, next) {
  try {
    const query = String(request.query.q || "").trim();

    if (!query) {
      response.status(400).json({ error: "Usa /buscar?q=ferrari" });
      return;
    }

    const result = await searchService.searchReference(query);

    if (!result) {
      response.status(404).json({ error: "No se encontraron resultados." });
      return;
    }

    response.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  searchReference
};
