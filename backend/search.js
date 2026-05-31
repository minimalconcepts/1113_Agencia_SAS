const WIKIPEDIA_API = "https://es.wikipedia.org/w/api.php";
const WIKIPEDIA_SUMMARY = "https://es.wikipedia.org/api/rest_v1/page/summary";

function buildSearchUrl(query) {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    format: "json",
    utf8: "1"
  });

  return `${WIKIPEDIA_API}?${params.toString()}`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "ilovewheels-student-project/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Error consultando fuente publica: ${response.status}`);
  }

  return response.json();
}

async function searchWikipedia(query) {
  const searchData = await fetchJson(buildSearchUrl(query));
  const firstResult = searchData.query?.search?.[0];

  if (!firstResult) {
    return null;
  }

  const title = firstResult.title;
  const summaryUrl = `${WIKIPEDIA_SUMMARY}/${encodeURIComponent(title)}`;
  const summary = await fetchJson(summaryUrl);

  return {
    nombre: summary.title || title,
    descripcion: summary.extract || "No hay descripcion disponible.",
    imagen: summary.thumbnail?.source || null,
    url_referencia: summary.content_urls?.desktop?.page || `https://es.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    fuente: "Wikipedia"
  };
}

async function searchPublicSources(query) {
  const cleanQuery = String(query || "").trim();

  if (!cleanQuery) {
    return null;
  }

  try {
    return await searchWikipedia(cleanQuery);
  } catch (error) {
    return {
      nombre: cleanQuery,
      descripcion: "No se pudo consultar la API publica en este momento. Revisa la referencia manualmente cuando tengas conexion.",
      imagen: null,
      url_referencia: `https://es.wikipedia.org/w/index.php?search=${encodeURIComponent(cleanQuery)}`,
      fuente: "Wikipedia busqueda",
      advertencia: error.message
    };
  }
}

module.exports = {
  searchPublicSources
};
