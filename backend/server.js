const app = require("./app");
const { initializeDatabase } = require("./db");

const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listo en http://localhost:${PORT}`);
      console.log(`Frontend servido en http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error("No se pudo iniciar la base de datos.", error);
    process.exit(1);
  });
