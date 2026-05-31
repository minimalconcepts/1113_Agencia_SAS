const { searchPublicSources } = require("../search");

function normalizeQuery(query) {
  return String(query || "").trim();
}

async function searchReference(query) {
  const cleanQuery = normalizeQuery(query);

  if (!cleanQuery) {
    return null;
  }

  return searchPublicSources(cleanQuery);
}

module.exports = {
  searchReference
};
