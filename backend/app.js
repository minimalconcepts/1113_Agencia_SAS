const path = require("path");
const express = require("express");
const corsMiddleware = require("./middleware/cors");
const securityHeaders = require("./middleware/securityHeaders");
const createRateLimiter = require("./middleware/rateLimit");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const apiRoutes = require("./routes/apiRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
const projectRoot = path.join(__dirname, "..");
const searchLimiter = createRateLimiter({ windowMs: 60000, max: 30 });
const writeLimiter = createRateLimiter({ windowMs: 60000, max: 80, methods: ["POST", "PUT", "DELETE"] });

app.use(express.json());
app.use(securityHeaders);
app.use(corsMiddleware);

app.get("/api/health", (request, response) => {
  response.json({
    ok: true,
    project: "ilovewheels",
    database: "sqlite"
  });
});

app.use("/api", apiRoutes);
app.use("/api/vehiculos", writeLimiter);
app.use("/api/vehiculos", vehicleRoutes);
app.use("/buscar", searchLimiter);
app.use(searchRoutes);
app.use(express.static(projectRoot));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
