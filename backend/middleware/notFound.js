function notFound(request, response) {
  const expectsJson = request.path.startsWith("/api") || request.path.startsWith("/buscar");

  if (expectsJson) {
    response.status(404).json({
      error: "Ruta API no encontrada.",
      path: request.path
    });
    return;
  }

  response.status(404).send("Ruta no encontrada.");
}

module.exports = notFound;
