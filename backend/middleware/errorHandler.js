function errorHandler(error, request, response, next) {
  console.error(error);
  response.status(500).json({
    error: "Error interno del servidor.",
    detalle: error.message
  });
}

module.exports = errorHandler;
