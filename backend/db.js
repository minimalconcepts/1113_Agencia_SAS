const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const dataDirectory = path.join(__dirname, "data");
const databasePath = path.join(dataDirectory, "museo.sqlite");

fs.mkdirSync(dataDirectory, { recursive: true });

const db = new sqlite3.Database(databasePath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function handleResult(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      categoria TEXT NOT NULL,
      marca TEXT,
      anio INTEGER,
      velocidad TEXT,
      descripcion TEXT,
      imagen TEXT,
      url_referencia TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run("CREATE INDEX IF NOT EXISTS idx_vehicles_categoria ON vehicles (categoria)");
  await run("CREATE INDEX IF NOT EXISTS idx_vehicles_nombre ON vehicles (nombre)");
  await run("CREATE INDEX IF NOT EXISTS idx_vehicles_marca ON vehicles (marca)");
  await run("CREATE INDEX IF NOT EXISTS idx_vehicles_updated_at ON vehicles (updated_at)");
}

module.exports = {
  db,
  run,
  get,
  all,
  initializeDatabase
};
