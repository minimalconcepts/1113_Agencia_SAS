const { run, get, all } = require("../db");

function buildWhereClause(filters = {}) {
  const conditions = [];
  const params = [];

  if (filters.categoria) {
    conditions.push("categoria = ?");
    params.push(filters.categoria);
  }

  if (filters.q) {
    conditions.push("(nombre LIKE ? OR marca LIKE ? OR descripcion LIKE ?)");
    const search = `%${filters.q}%`;
    params.push(search, search, search);
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params
  };
}

function sanitizePagination(options = {}) {
  const limit = Math.min(Math.max(Number(options.limit) || 100, 1), 200);
  const page = Math.max(Number(options.page) || 1, 1);
  const offset = (page - 1) * limit;

  return { limit, page, offset };
}

function sanitizeSorting(options = {}) {
  const columns = {
    id: "id",
    nombre: "nombre",
    categoria: "categoria",
    marca: "marca",
    anio: "anio",
    updated_at: "updated_at"
  };
  const sort = columns[options.sort] || "id";
  const order = String(options.order || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";

  return { column: sort, direction: order };
}

async function findAll(filters = {}, options = {}) {
  const where = buildWhereClause(filters);
  const pagination = sanitizePagination(options);
  const sorting = sanitizeSorting(options);

  const rows = await all(
    `SELECT * FROM vehicles ${where.clause} ORDER BY ${sorting.column} ${sorting.direction} LIMIT ? OFFSET ?`,
    [...where.params, pagination.limit, pagination.offset]
  );
  const totalRow = await get(
    `SELECT COUNT(*) AS total FROM vehicles ${where.clause}`,
    where.params
  );

  return {
    rows,
    meta: {
      total: totalRow.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.max(Math.ceil(totalRow.total / pagination.limit), 1)
    }
  };
}

function findForExport(filters = {}, options = {}) {
  const where = buildWhereClause(filters);
  const sorting = sanitizeSorting(options);

  return all(
    `SELECT * FROM vehicles ${where.clause} ORDER BY ${sorting.column} ${sorting.direction}`,
    where.params
  );
}

function findById(id) {
  return get("SELECT * FROM vehicles WHERE id = ?", [id]);
}

async function create(vehicle) {
  const result = await run(
    `INSERT INTO vehicles
      (nombre, categoria, marca, anio, velocidad, descripcion, imagen, url_referencia)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      vehicle.nombre,
      vehicle.categoria,
      vehicle.marca,
      vehicle.anio,
      vehicle.velocidad,
      vehicle.descripcion,
      vehicle.imagen,
      vehicle.url_referencia
    ]
  );

  return findById(result.id);
}

async function update(id, vehicle) {
  const result = await run(
    `UPDATE vehicles
     SET nombre = ?,
         categoria = ?,
         marca = ?,
         anio = ?,
         velocidad = ?,
         descripcion = ?,
         imagen = ?,
         url_referencia = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      vehicle.nombre,
      vehicle.categoria,
      vehicle.marca,
      vehicle.anio,
      vehicle.velocidad,
      vehicle.descripcion,
      vehicle.imagen,
      vehicle.url_referencia,
      id
    ]
  );

  if (result.changes === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const result = await run("DELETE FROM vehicles WHERE id = ?", [id]);
  return result.changes > 0;
}

module.exports = {
  findAll,
  findForExport,
  findById,
  create,
  update,
  remove
};
