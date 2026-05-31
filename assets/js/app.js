/*
 * Render principal de la aplicacion.
 * Convierte datos, rutas JavaScript, favoritos, randomizador y pilotos en vistas HTML.
 */
const app = document.getElementById("app");
const FAVORITES_KEY = "carDealerMuseumFavorites";
const THEME_KEY = "carDealerMuseumTheme";
const ORDER_KEY = "carDealerMuseumOrder";
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.getElementById("main-menu");
const themeToggle = document.querySelector(".theme-toggle");
let terminoBusqueda = "";
let terminoBusquedaGlobal = "";
let ordenamientoActual = localStorage.getItem(ORDER_KEY) || "defecto";
let soloFavoritos = false;
let apiSearchTimer;
let apiSearchState = {
  query: "",
  loading: false,
  result: null,
  error: ""
};
let backendState = {
  checked: false,
  connected: false,
  vehicles: [],
  meta: null,
  message: "Modo local"
};
let adminPendingDeleteId = null;
let adminFilters = {
  q: "",
  categoria: "",
  sort: "id",
  order: "desc",
  page: 1,
  limit: 50
};
// Cambia image por la ruta final de cada afiche dentro de assets/images/easter-egg.
const EASTER_EGG_CARDS = [
  {
    name: "Exclusive Access",
    type: "Easter Egg",
    category: "Premium",
    status: "Coming Soon",
    detail: "Premium Collection",
    image: "assets/images/easter-egg/placeholder-premium-collection.jpg",
    collaboration: "Private Creator",
    history: "Afiche placeholder preparado para reemplazar imagen, descripcion y colaboracion cuando el contenido final este listo."
  },
  {
    name: "Hidden Content",
    type: "Easter Egg",
    category: "Members Area",
    status: "Reservado",
    detail: "Members Area",
    image: "assets/images/easter-egg/ONLYPORCHE_GT3RS.jpg",
    collaboration: "Premium Studio",
    history: "Detalle placeholder integrado al sistema de fichas del museo para mantener la misma navegacion y estructura visual."
  },
  {
    name: "Secret Archive",
    type: "Easter Egg",
    category: "Archivo secreto",
    status: "Coming Soon",
    detail: "Coming Soon",
    image: "assets/images/easter-egg/placeholder-secret-archive.jpg",
    collaboration: "Future Partner",
    history: "Contenido preparado para crecer sin crear una arquitectura paralela al detalle existente de autos."
  }
];
const EASTER_EGG_ROUTE = {
  area: "Easter Egg",
  title: "Easter Egg",
  description: "Afiches placeholder del apartado secreto.",
  folder: "assets/images/easter-egg",
  items: EASTER_EGG_CARDS
};

function applyTheme(theme) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = selectedTheme;
  localStorage.setItem(THEME_KEY, selectedTheme);

  if (themeToggle) {
    themeToggle.innerHTML = `<span aria-hidden="true">${selectedTheme === "dark" ? "☀" : "☾"}</span>`;
    themeToggle.title = selectedTheme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    themeToggle.setAttribute(
      "aria-label",
      selectedTheme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
    );
  }
}

applyTheme(localStorage.getItem(THEME_KEY) || "light");

if (themeToggle) {
  let themeClickCount = 0;
  let themeClickTimer;
  const themeClickHint = document.createElement("span");
  themeClickHint.className = "theme-click-hint";
  themeClickHint.setAttribute("aria-live", "polite");
  themeToggle.insertAdjacentElement("afterend", themeClickHint);

  const updateThemeClickHint = () => {
    const clicksLeft = 15 - themeClickCount;
    themeClickHint.textContent = themeClickCount >= 10 && clicksLeft > 0
      ? `Faltan ${clicksLeft} clicks...`
      : "";
  };

  const resetThemeClickCounter = () => {
    themeClickCount = 0;
    clearTimeout(themeClickTimer);
    updateThemeClickHint();
  };

  const openThemeEasterEgg = () => {
    const currentEasterEgg = document.querySelector(".theme-easter-egg");

    if (currentEasterEgg) {
      currentEasterEgg.remove();
    }

    let canCloseFromOutside = false;
    const easterEgg = document.createElement("div");
    easterEgg.className = "theme-easter-egg";
    easterEgg.setAttribute("role", "dialog");
    easterEgg.setAttribute("aria-modal", "true");
    easterEgg.setAttribute("aria-labelledby", "theme-easter-egg-title");
    easterEgg.innerHTML = `
      <div class="theme-easter-egg-card">
        <button class="theme-easter-egg-close" type="button" aria-label="Cerrar Easter Egg">&times;</button>
        <h2 id="theme-easter-egg-title">EASTER EGG</h2>
        <p>espera.......</p>
        <a class="theme-easter-egg-link" href="#/easter-egg">entrar</a>
      </div>
    `;

    const closeEasterEgg = () => {
      easterEgg.remove();
    };

    easterEgg.addEventListener("click", (event) => {
      if (event.target.closest(".theme-easter-egg-close, .theme-easter-egg-link")) {
        closeEasterEgg();
        return;
      }

      if (event.target === easterEgg && canCloseFromOutside) {
        closeEasterEgg();
      }
    });

    document.body.appendChild(easterEgg);
    easterEgg.querySelector(".theme-easter-egg-close").focus();
    setTimeout(() => {
      canCloseFromOutside = true;
    }, 250);
  };

  themeToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const currentTheme = document.documentElement.dataset.theme;
    applyTheme(currentTheme === "dark" ? "light" : "dark");

    // Cuenta clics consecutivos del boton de tema sin alterar su comportamiento.
    themeClickCount += 1;
    clearTimeout(themeClickTimer);
    updateThemeClickHint();

    if (themeClickCount >= 15) {
      resetThemeClickCounter();
      openThemeEasterEgg();
      return;
    }

    themeClickTimer = setTimeout(resetThemeClickCounter, 3000);
  });
}

if (menuToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu principal");
    menuToggle.textContent = "Menu principal";
  };

  const openMenu = () => {
    navMenu.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menu principal");
    menuToggle.textContent = "Cerrar menu";
  };

  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();

    if (navMenu.classList.contains("is-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.classList.contains("is-open")) {
      return;
    }

    if (!event.target.closest(".menu-wrapper")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function renderApp() {
  const path = window.AppRouter.getCurrentPath();
  setCurrentRouteUi(path);

  if (path === "/") {
    renderHome();
    return;
  }

  if (path === "/favoritos") {
    renderFavorites();
    return;
  }

  if (path === "/random") {
    renderRandomizer();
    return;
  }

  if (path === "/pilotos") {
    renderPilots();
    return;
  }

  if (path === "/fundadores") {
    renderFounders();
    return;
  }

  if (path === "/admin") {
    renderAdmin();
    return;
  }

  if (path === "/easter-egg") {
    renderEasterEggPage();
    return;
  }

  if (path.startsWith("/wiki/")) {
    renderWikiDetail(path);
    return;
  }

  const route = window.MUSEUM_DATA.routes[path];

  if (!route) {
    renderNotFound(path);
    return;
  }

  renderRoom(route);
}

function setCurrentRouteUi(path) {
  document.body.dataset.route = path === "/" ? "home" : path.split("/").filter(Boolean)[0] || "home";

  document.querySelectorAll(".nav-menu a, .footer-links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPath = href.replace("#", "") || "/";
    const isActive = linkPath === path || (path.startsWith(linkPath) && linkPath !== "/");
    link.classList.toggle("is-active", isActive);
  });
}

function renderHome() {
  const stats = getMuseumStats();
  const recommended = getRandomEntry();

  const query = terminoBusquedaGlobal.trim().toLowerCase();
  let searchResultsHtml = "";

  if (query) {
    // Filtro general de piezas
    const filteredItems = getAllItems().filter((entry) =>
      getSearchableVehicleText(entry.item).includes(query)
    );

    // Filtro general de pilotos
    const filteredPilots = (window.MUSEUM_DATA.pilots || []).filter((pilot) =>
      [pilot.name, pilot.description, pilot.area, pilot.highlight]
        .map(String)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );

    // Filtro general de fundadores
    const filteredFounders = (window.MUSEUM_DATA.founders || []).filter((founder) =>
      [founder.name, founder.description, founder.brand, founder.area]
        .map(String)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );

    const totalResults = filteredItems.length + filteredPilots.length + filteredFounders.length;

    searchResultsHtml = `
      <section class="global-search-results">
        <div class="section-heading">
          <p class="eyebrow">Resultados de la búsqueda global</p>
          <h2>${totalResults} ${totalResults === 1 ? "coincidencia encontrada" : "coincidencias encontradas"} para "${escapeHtml(terminoBusquedaGlobal)}"</h2>
        </div>
        
        ${filteredItems.length > 0 ? `
          <h3 class="global-result-title">Piezas encontradas</h3>
          <div class="vehicle-grid">
            ${filteredItems.map((entry) => renderVehicleCard(entry.item)).join("")}
          </div>
        ` : ""}

        ${filteredPilots.length > 0 ? `
          <h3 class="global-result-title">Pilotos encontrados</h3>
          <div class="pilot-grid">
            ${filteredPilots.map(renderPilotCard).join("")}
          </div>
        ` : ""}

        ${filteredFounders.length > 0 ? `
          <h3 class="global-result-title">Creadores de marcas</h3>
          <div class="founder-grid">
            ${filteredFounders.map(renderFounderCard).join("")}
          </div>
        ` : ""}

        ${totalResults === 0 ? `
          <p class="empty-state">No se encontraron resultados en ninguna sección para esa búsqueda.</p>
        ` : ""}
        ${renderApiSearchResult()}
        <hr class="section-divider" />
      </section>
    `;
  }

  app.innerHTML = `
    <section class="wiki-intro">
      <div class="wiki-intro-content">
        <p class="eyebrow">Bienvenido a la wiki</p>
        <h1>Museo digital de autos, motos y aviones.</h1>
        <p>Explora maquinas legendarias por categorias, guarda tus favoritas y abre cada ficha como una pagina tipo Wikipedia para estudiar su historia.</p>
        
        <div class="search-container intro-search">
          <input
            type="text"
            id="busqueda-global"
            placeholder="Buscar piezas, pilotos o creadores en todo el museo..."
            class="search-input"
            value="${escapeHtml(terminoBusquedaGlobal)}"
            autocomplete="off"
          />
        </div>
      </div>
    </section>

    ${searchResultsHtml}

    <section class="home-summary">
      <div class="overview-copy">
        <p class="eyebrow">Wiki museo 1113</p>
        <h2>Resumen del museo</h2>
        <p>Las colecciones estan separadas por salas para que sea facil agregar piezas, imagenes e historias sin desordenar el proyecto.</p>
        ${recommended ? `
          <a class="recommended-link" href="#/wiki/${recommended.slug}">
            <span>Recomendado para aprender</span>
            <strong>${recommended.item.name}</strong>
          </a>
        ` : ""}
      </div>

      <div class="stats-panel" aria-label="Resumen del museo">
        <article><strong>${stats.rooms}</strong><span>Salas</span></article>
        <article><strong>${stats.items}</strong><span>Piezas</span></article>
        <article><strong>${stats.pilots}</strong><span>Pilotos</span></article>
      </div>
    </section>

    <section class="home-dashboard">
      <aside class="tool-section">
        <div class="section-heading compact">
          <p class="eyebrow">Herramientas</p>
          <h2>Aprende y guarda</h2>
        </div>
        ${renderBackendStatus()}
        <div class="tool-list">
          <a class="tool-row" href="#/random"><span>01</span><strong>Randomizador</strong><small>Elige una pieza al azar.</small></a>
          <a class="tool-row" href="#/favoritos"><span>02</span><strong>Favoritos</strong><small>Revisa tu coleccion.</small></a>
          <a class="tool-row" href="#/pilotos"><span>03</span><strong>Pilotos</strong><small>Figuras importantes.</small></a>
          <a class="tool-row" href="#/fundadores"><span>04</span><strong>Creadores</strong><small>Fundadores de marcas.</small></a>
          <a class="tool-row" href="#/admin"><span>05</span><strong>Admin</strong><small>Gestiona SQLite.</small></a>
        </div>
      </aside>

      <section class="collections-overview">
        <div class="section-heading compact">
          <p class="eyebrow">Colecciones</p>
          <h2>Salas principales</h2>
        </div>
        ${window.MUSEUM_DATA.sections.filter((section) => !["pilotos", "fundadores"].includes(section.id)).map(renderSection).join("")}
      </section>
    </section>
  `;

  setupGlobalSearch();
}

function renderSection(section) {
  return `
    <section class="museum-section" id="${section.id}">
      <div class="section-heading section-row">
        <div>
          <p class="eyebrow">${section.title}</p>
          <h2>${section.description}</h2>
        </div>
        <span>${section.routes.length} salas</span>
      </div>
      <div class="route-grid">
        ${section.routes.map(renderRouteCard).join("")}
      </div>
    </section>
  `;
}

function renderRouteCard(route) {
  const room = window.MUSEUM_DATA.routes[route.path];
  const itemCount = room ? getRoomItems(room).length : 0;
  const areaSlug = room ? createSlug(room.area) : "general";

  return `
    <a class="route-card" data-area="${areaSlug}" href="#${route.path}">
      <span>Sala</span>
      <strong>${route.label}</strong>
      <small>${itemCount} piezas registradas</small>
    </a>
  `;
}

function renderRoom(route) {
  const relatedRoutes = getRoutesByArea(route.area);
  const roomItems = getRoomItems(route);
  const filteredItems = ordenarVehiculos(filterRoomItems(roomItems));

  app.innerHTML = `
    <section class="room-header ${route.area.toLowerCase()}">
      <a class="back-link" href="#/">Regresar</a>
      <p class="eyebrow">${route.area}</p>
      <h1>${route.title}</h1>
      <p>${route.description}</p>
      <small>Carpeta de imagenes: ${route.folder}</small>
    </section>

    <nav class="room-tabs" aria-label="Salas relacionadas">
      ${relatedRoutes.map((relatedRoute) => `
        <a class="${relatedRoute.path === getPathByRoute(route) ? "is-active" : ""}" href="#${relatedRoute.path}">
          ${relatedRoute.label}
        </a>
      `).join("")}
    </nav>

    <section class="vehicle-section">
      <div class="section-heading">
        <p class="eyebrow">Registrados</p>
        <h2>${roomItems.length === 0 ? "Sala preparada" : "Piezas de la sala"}</h2>
      </div>
      ${
        roomItems.length === 0
          ? `<p class="empty-state">Todavia no hay elementos registrados. Agrega imagenes en <strong>${route.folder}</strong> y despues crea una tarjeta en <strong>assets/js/data.js</strong>.</p>`
          : `
            <div class="search-container">
              <input
                type="search"
                id="busqueda"
                placeholder="Buscar por nombre, marca o modelo..."
                class="search-input"
                value="${escapeHtml(terminoBusqueda)}"
                aria-label="Buscar piezas en esta sala"
                autocomplete="off"
              />
              <p class="search-counter" id="contador-busqueda">${getSearchCounterText(filteredItems.length, roomItems.length)}</p>
            </div>
            <div class="ordenamiento-container">
              <label for="ordenamiento">Ordenar por:</label>
              <select id="ordenamiento" onchange="aplicarOrdenamiento()">
                <option value="defecto">Orden por defecto</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="anio-desc">Año: Más reciente</option>
                <option value="anio-asc">Año: Más antiguo</option>
                <option value="potencia-desc">Potencia: Mayor</option>
                <option value="velocidad-desc">Velocidad máxima: Mayor</option>
              </select>
            </div>
            <button id="btn-solo-favoritos" class="favorite-filter ${soloFavoritos ? "is-active" : ""}" type="button" aria-pressed="${soloFavoritos}" onclick="toggleSoloFavoritos()">
              <span aria-hidden="true">${soloFavoritos ? "&#9829;" : "&#9825;"}</span>
              Solo favoritos
              <strong>${getFavorites().length}</strong>
            </button>
            <div id="vehicle-results">
              ${renderVehicleResults(filteredItems)}
            </div>
          `
      }
    </section>
  `;

  setupRoomSearch(route);
}

function renderVehicleCard(item) {
  const slug = createSlug(item.name);
  const favorite = isFavorite(slug);
  const source = item.source ? String(item.source) : "";

  return `
    <article class="vehicle-card" ${source ? `data-source="${escapeHtml(source)}"` : ""}>
      <button class="favorite-button ${favorite ? "is-active" : ""}" type="button" onclick="toggleFavorite('${slug}')" aria-label="${favorite ? "Quitar de favoritos" : "Agregar a favoritos"}">
        <span aria-hidden="true">${favorite ? "&#9829;" : "&#9825;"}</span>
      </button>
      ${source ? `<span class="source-badge">${escapeHtml(source)}</span>` : ""}
      <a class="vehicle-link" href="#/wiki/${slug}" aria-label="Abrir historia de ${item.name}">
        <div class="image-frame">
          <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" onerror="this.remove(); this.parentElement.classList.add('missing-image'); this.parentElement.innerHTML='Imagen pendiente';" />
        </div>
        <div class="vehicle-info">
          <h3>${highlightSearchMatch(item.name)}</h3>
          <div class="vehicle-meta">
            <span>${highlightSearchMatch(item.type || "Tipo pendiente")}</span>
            <span>${highlightSearchMatch(item.year || "Anio pendiente")}</span>
          </div>
          <p><strong>Detalle:</strong> ${highlightSearchMatch(item.detail || "Pendiente por investigar")}</p>
          <span class="card-action">Abrir ficha</span>
        </div>
      </a>
    </article>
  `;
}

function setupRoomSearch(route) {
  const searchInput = document.getElementById("busqueda");
  const orderSelect = document.getElementById("ordenamiento");

  if (!searchInput) {
    return;
  }

  if (orderSelect) {
    orderSelect.value = ordenamientoActual;
  }

  searchInput.addEventListener("input", (event) => {
    terminoBusqueda = event.target.value;
    updateRoomResults(route);
  });
}

function setupGlobalSearch() {
  const searchInput = document.getElementById("busqueda-global");
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", (event) => {
    terminoBusquedaGlobal = event.target.value;
    scheduleApiSearch(terminoBusquedaGlobal);
    renderHome();
    
    // Mantiene el foco estable en la barra global mientras escribes
    const input = document.getElementById("busqueda-global");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });
}

function scheduleApiSearch(query) {
  clearTimeout(apiSearchTimer);
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    apiSearchState = { query: "", loading: false, result: null, error: "" };
    return;
  }

  apiSearchState = { query: cleanQuery, loading: true, result: null, error: "" };

  apiSearchTimer = setTimeout(() => {
    searchExternalReference(cleanQuery);
  }, 550);
}

async function searchExternalReference(query) {
  try {
    const result = await window.MuseumApi.searchReference(query);

    if (apiSearchState.query !== query) {
      return;
    }

    apiSearchState = { query, loading: false, result, error: "" };
  } catch (error) {
    if (apiSearchState.query !== query) {
      return;
    }

    apiSearchState = {
      query,
      loading: false,
      result: null,
      error: "Prende el backend para ver referencias externas."
    };
  }

  if (window.AppRouter.getCurrentPath() === "/") {
    renderHome();
  }
}

function renderApiSearchResult() {
  if (!terminoBusquedaGlobal.trim()) {
    return "";
  }

  if (apiSearchState.loading) {
    return `<p class="empty-state compact">Buscando referencia externa en el backend...</p>`;
  }

  if (apiSearchState.error) {
    return `<p class="empty-state compact">${apiSearchState.error}</p>`;
  }

  if (!apiSearchState.result) {
    return "";
  }

  return `
    <h3 class="global-result-title">Referencia externa</h3>
    <a class="global-result-card external-reference-card" href="${escapeHtml(apiSearchState.result.url_referencia)}" target="_blank" rel="noopener noreferrer">
      <span>${escapeHtml(apiSearchState.result.fuente || "Fuente externa")}</span>
      <strong>${escapeHtml(apiSearchState.result.nombre)}</strong>
      <small>${escapeHtml(apiSearchState.result.descripcion)}</small>
    </a>
  `;
}

function renderBackendStatus() {
  const statusClass = backendState.connected ? "is-online" : "is-offline";
  const statusText = backendState.connected ? "Backend conectado" : "Modo local";

  return `
    <div class="backend-status ${statusClass}" aria-live="polite">
      <strong>${statusText}</strong>
      <span>${backendState.message}</span>
    </div>
  `;
}

function getRoomItems(route) {
  return [
    ...route.items,
    ...getApiItemsForRoute(route)
  ];
}

function getApiItemsForRoute(route) {
  if (!backendState.connected || backendState.vehicles.length === 0) {
    return [];
  }

  const category = normalizeCategory(route.area);

  return backendState.vehicles
    .filter((vehicle) => normalizeCategory(vehicle.categoria) === category)
    .map((vehicle) => mapApiVehicleToItem(vehicle, route));
}

function normalizeCategory(value) {
  const text = String(value || "").toLowerCase();

  if (text.includes("auto")) {
    return "autos";
  }

  if (text.includes("moto")) {
    return "motos";
  }

  if (text.includes("avion") || text.includes("avi")) {
    return "aviones";
  }

  return text;
}

function mapApiVehicleToItem(vehicle, route) {
  return {
    name: vehicle.nombre,
    type: vehicle.marca || vehicle.categoria || "Registro API",
    year: vehicle.anio ? String(vehicle.anio) : "Pendiente",
    detail: vehicle.velocidad || "Registro guardado en SQLite",
    image: vehicle.imagen || "",
    history: vehicle.descripcion || "Registro creado desde el backend SQLite.",
    category: vehicle.categoria,
    source: "SQLite",
    apiId: vehicle.id,
    url_referencia: vehicle.url_referencia,
    learning: {
      level: "Basico",
      summary: "Pieza cargada desde el backend y disponible para ampliar desde el panel admin.",
      keyConcepts: ["Backend", "SQLite", route.area],
      questions: ["Que dato falta completar?", "Que fuente valida se puede agregar?"]
    },
    specs: {
      creator: vehicle.marca || "Pendiente",
      topSpeed: vehicle.velocidad || "Pendiente",
      importance: "Registro integrado desde SQLite."
    }
  };
}

function aplicarOrdenamiento() {
  const orderSelect = document.getElementById("ordenamiento");
  const path = window.AppRouter.getCurrentPath();
  const route = window.MUSEUM_DATA.routes[path];

  if (!orderSelect || !route) {
    return;
  }

  ordenamientoActual = orderSelect.value;
  localStorage.setItem(ORDER_KEY, ordenamientoActual);
  updateRoomResults(route);
}

function toggleSoloFavoritos() {
  const path = window.AppRouter.getCurrentPath();
  const route = window.MUSEUM_DATA.routes[path];

  if (!route) {
    return;
  }

  soloFavoritos = !soloFavoritos;
  updateRoomResults(route);
}

function updateRoomResults(route) {
  const roomItems = getRoomItems(route);
  const filteredItems = ordenarVehiculos(filterRoomItems(roomItems));
  const results = document.getElementById("vehicle-results");
  const counter = document.getElementById("contador-busqueda");
  const favoriteFilter = document.getElementById("btn-solo-favoritos");

  if (results) {
    results.innerHTML = renderVehicleResults(filteredItems);
  }

  if (counter) {
    counter.textContent = getSearchCounterText(filteredItems.length, roomItems.length);
  }

  if (favoriteFilter) {
    favoriteFilter.classList.toggle("is-active", soloFavoritos);
    favoriteFilter.setAttribute("aria-pressed", String(soloFavoritos));
    favoriteFilter.innerHTML = `
      <span aria-hidden="true">${soloFavoritos ? "&#9829;" : "&#9825;"}</span>
      Solo favoritos
      <strong>${getFavorites().length}</strong>
    `;
  }
}

function ordenarVehiculos(lista) {
  const copia = [...lista];

  switch (ordenamientoActual) {
    case "precio-asc":
      copia.sort((a, b) => obtenerPrecioVehiculo(a) - obtenerPrecioVehiculo(b));
      break;

    case "precio-desc":
      copia.sort((a, b) => obtenerPrecioVehiculo(b) - obtenerPrecioVehiculo(a));
      break;

    case "anio-desc":
      copia.sort((a, b) => obtenerAnioVehiculo(b) - obtenerAnioVehiculo(a));
      break;

    case "anio-asc":
      copia.sort((a, b) => obtenerAnioVehiculo(a) - obtenerAnioVehiculo(b));
      break;

    case "potencia-desc":
      copia.sort((a, b) => extraerNumero(b.specs?.power) - extraerNumero(a.specs?.power));
      break;

    case "velocidad-desc":
      copia.sort((a, b) => extraerNumero(b.specs?.topSpeed) - extraerNumero(a.specs?.topSpeed));
      break;

    case "defecto":
    default:
      break;
  }

  return copia;
}

function obtenerPrecioVehiculo(item) {
  return extraerNumero(item.precio || item.price || item.detail);
}

function obtenerAnioVehiculo(item) {
  return extraerNumero(item.anio || item.year);
}

function extraerNumero(value) {
  if (!value) {
    return 0;
  }

  const match = String(value).match(/\d+(?:[.,]\d+)*/);

  if (!match) {
    return 0;
  }

  const rawNumber = match[0];
  const normalizedNumber = /^\d+[.,]\d{1,2}$/.test(rawNumber)
    ? rawNumber.replace(",", ".")
    : rawNumber.replace(/[.,]/g, "");

  return Number(normalizedNumber) || 0;
}

function filterRoomItems(items) {
  const searchTerm = terminoBusqueda.trim().toLowerCase();
  const favoriteFilteredItems = soloFavoritos
    ? items.filter((item) => isFavorite(createSlug(item.name)))
    : items;

  if (!searchTerm) {
    return favoriteFilteredItems;
  }

  return favoriteFilteredItems.filter((item) => getSearchableVehicleText(item).includes(searchTerm));
}

function getSearchableVehicleText(item) {
  return [
    item.name,
    item.type,
    item.detail,
    item.year,
    item.status,
    item.category,
    item.collaboration,
    item.history,
    item.learning,
    item.specs,
    item.url_referencia,
    item.urlReferencia,
    item.officialUrl,
    item.referenceUrl
  ]
    .map(stringifySearchValue)
    .join(" ")
    .toLowerCase();
}

function stringifySearchValue(value) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(stringifySearchValue).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value).map(stringifySearchValue).join(" ");
  }

  return String(value);
}

function highlightSearchMatch(value, customSearchTerm = terminoBusqueda) {
  const text = String(value || "");
  const searchTerm = customSearchTerm.trim();

  if (!searchTerm) {
    return escapeHtml(text);
  }

  const pattern = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
  return escapeHtml(text).replace(pattern, "<mark>$1</mark>");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getGlobalSearchResults() {
  const searchTerm = terminoBusquedaGlobal.trim().toLowerCase();

  if (!searchTerm) {
    return [];
  }

  return getAllItems().filter((entry) => getGlobalSearchableText(entry).includes(searchTerm));
}

function getGlobalSearchableText(entry) {
  return [
    getSearchableVehicleText(entry.item),
    entry.route.area,
    entry.route.title,
    entry.route.description
  ]
    .map(stringifySearchValue)
    .join(" ")
    .toLowerCase();
}

function renderGlobalSearchResults() {
  const searchTerm = terminoBusquedaGlobal.trim();

  if (!searchTerm) {
    return `<p class="empty-state compact">Escribe un nombre, marca, modelo o categoria para buscar en todo el museo.</p>`;
  }

  const results = getGlobalSearchResults();

  if (results.length === 0) {
    return `<p class="empty-state compact">No encontramos piezas con ese texto. Prueba con otra palabra.</p>`;
  }

  return `
    <div class="global-results-grid">
      ${results.slice(0, 8).map(renderGlobalSearchCard).join("")}
    </div>
  `;
}

function renderGlobalSearchCard(entry) {
  return `
    <a class="global-result-card" href="#/wiki/${entry.slug}">
      <span>${entry.route.area}</span>
      <strong>${highlightGlobalSearchMatch(entry.item.name)}</strong>
      <small>${highlightGlobalSearchMatch(entry.route.title)}</small>
    </a>
  `;
}

function highlightGlobalSearchMatch(value) {
  return highlightSearchMatch(value, terminoBusquedaGlobal);
}

function getGlobalSearchCounterText() {
  const searchTerm = terminoBusquedaGlobal.trim();

  if (!searchTerm) {
    return `${getAllItems().length} piezas disponibles en todo el museo`;
  }

  const count = getGlobalSearchResults().length;
  return `${count} resultado${count === 1 ? "" : "s"} global${count === 1 ? "" : "es"}`;
}

function renderVehicleResults(items) {
  if (items.length === 0) {
    if (soloFavoritos) {
      return `<p class="empty-state">No hay favoritos con esos filtros. Marca piezas con el corazon o limpia la busqueda.</p>`;
    }

    return `<p class="empty-state">No hay resultados para esa busqueda. Prueba con otro nombre, marca o modelo.</p>`;
  }

  return `<div class="vehicle-grid">${items.map((item) => renderVehicleCard(item)).join("")}</div>`;
}

function getSearchCounterText(filteredCount, totalCount) {
  const hasSearch = Boolean(terminoBusqueda.trim());

  if (!hasSearch && !soloFavoritos) {
    return `${totalCount} piezas disponibles`;
  }

  if (soloFavoritos && !hasSearch) {
    return `${filteredCount} favoritos de ${totalCount} piezas`;
  }

  return `${filteredCount} de ${totalCount} resultados`;
}

function renderWikiDetail(path) {
  const slug = path.replace("/wiki/", "");
  const result = findItemBySlug(slug);

  if (!result) {
    renderNotFound(path);
    return;
  }

  const { item, roomPath, route } = result;
  const favorite = isFavorite(slug);
  const referenceUrl = getReferenceUrl(item);
  const relatedItems = route.items
    .filter((candidate) => createSlug(candidate.name) !== slug)
    .map((candidate) => ({
      item: candidate,
      slug: createSlug(candidate.name)
    }));

  app.innerHTML = `
    <article class="wiki-entry">
      <div class="detail-actions">
        <a class="back-link dark" href="#${roomPath}">Regresar a ${route.title}</a>
        <button class="favorite-button detail ${favorite ? "is-active" : ""}" type="button" onclick="toggleFavorite('${slug}')">
          <span aria-hidden="true">${favorite ? "&#9829;" : "&#9825;"}</span>
          ${favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        </button>
        ${referenceUrl ? `<a class="secondary-button" href="${escapeHtml(referenceUrl)}" target="_blank" rel="noopener noreferrer">Referencia</a>` : ""}
      </div>

      <header class="wiki-title">
        <p class="eyebrow">${route.area}</p>
        <h1>${item.name}</h1>
        <p>${item.type} - ${item.status || item.year}</p>
      </header>

      <div class="wiki-layout">
        <aside class="wiki-media">
          <div class="image-frame large">
            <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" onerror="this.remove(); this.parentElement.classList.add('missing-image'); this.parentElement.innerHTML='Imagen pendiente';" />
          </div>
          <dl class="fact-list">
            <div><dt>Tipo</dt><dd>${item.type}</dd></div>
            <div><dt>${item.status ? "Estado" : "Anio"}</dt><dd>${item.status || item.year}</dd></div>
            <div><dt>Detalle</dt><dd>${item.detail}</dd></div>
            ${item.category ? `<div><dt>Categoria</dt><dd>${item.category}</dd></div>` : ""}
            ${item.collaboration ? `<div><dt>Colaboración con</dt><dd>${item.collaboration}</dd></div>` : ""}
            <div><dt>Sala</dt><dd>${route.title}</dd></div>
          </dl>
        </aside>

        <section class="wiki-content">
          <section class="wiki-block main-story">
            <p class="eyebrow">Historia principal</p>
            <h2>Origen e importancia</h2>
            <div class="story-text">
              ${renderHistory(item.history)}
            </div>
          </section>

          <div class="wiki-info-grid">
            <section class="wiki-block">
              <p class="eyebrow">Contexto</p>
              <h3>Por que esta en esta sala</h3>
              <p>Esta pieza pertenece a ${route.title} por su categoria, epoca, diseno o papel dentro de la cultura del motor.</p>
            </section>

            <section class="wiki-block">
              <p class="eyebrow">Para aprender</p>
              <h3>Puntos clave</h3>
              ${renderLearning(item.learning)}
            </section>
          </div>

          ${renderComparisonPanel(item, route, relatedItems)}
        </section>
      </div>
    </article>
  `;
}

function renderComparisonPanel(currentItem, route, relatedItems) {
  if (relatedItems.length === 0) {
    return `
      <section class="wiki-block comparison-panel">
        <p class="eyebrow">Comparador</p>
        <h3>Piezas de la misma sala</h3>
        <p>Cuando agregues otra pieza a ${route.title}, aqui aparecera un comparador automatico.</p>
      </section>
    `;
  }

  const firstRelated = relatedItems[0];

  return `
    <section class="wiki-block comparison-panel">
      <div class="comparison-heading">
        <div>
          <p class="eyebrow">Comparador</p>
          <h3>Comparar con otra pieza de ${route.title}</h3>
        </div>
        <select class="comparison-select" onchange="renderComparison('${createSlug(currentItem.name)}', this.value)" aria-label="Seleccionar pieza para comparar">
          ${relatedItems.map((entry) => `
            <option value="${entry.slug}">${entry.item.name}</option>
          `).join("")}
        </select>
      </div>
      <div id="comparison-result">
        ${renderComparisonTable(currentItem, firstRelated.item, route)}
      </div>
    </section>
  `;
}

function renderComparison(currentSlug, relatedSlug) {
  const currentEntry = findItemBySlug(currentSlug);
  const relatedEntry = findItemBySlug(relatedSlug);
  const result = document.getElementById("comparison-result");

  if (!currentEntry || !relatedEntry || result === null) {
    return;
  }

  result.innerHTML = renderComparisonTable(currentEntry.item, relatedEntry.item, currentEntry.route);
}

function renderComparisonTable(currentItem, relatedItem, route) {
  const rows = [
    { label: "Tipo", key: "type" },
    currentItem.status || relatedItem.status
      ? { label: "Estado", key: "status" }
      : { label: "Anio", key: "year" },
    { label: "Detalle", key: "detail" },
    ...(currentItem.category || relatedItem.category ? [{ label: "Categoria", key: "category" }] : []),
    ...(currentItem.collaboration || relatedItem.collaboration ? [{ label: "Colaboración con", key: "collaboration" }] : []),
    { label: "Creador / fabricante", key: "creator", source: "specs" },
    { label: "Potencia", key: "power", source: "specs" },
    { label: "Velocidad maxima", key: "topSpeed", source: "specs" },
    { label: "Records", key: "records", source: "specs" },
    { label: "Uso principal", key: "mainUse", source: "specs" },
    { label: "Importancia", key: "importance", source: "specs" }
  ];

  return `
    <div class="comparison-table" role="table" aria-label="Comparacion de piezas">
      <div role="row">
        <span role="columnheader">Dato</span>
        <strong role="columnheader">${currentItem.name}</strong>
        <strong role="columnheader">${relatedItem.name}</strong>
      </div>
      ${rows.map((row) => renderComparisonRow(row, currentItem, relatedItem)).join("")}
      <div role="row">
        <span role="cell">Sala</span>
        <span role="cell">${route.title}</span>
        <span role="cell">${route.title}</span>
      </div>
    </div>
  `;
}

function renderComparisonRow(row, currentItem, relatedItem) {
  return `
    <div role="row">
      <span role="cell">${row.label}</span>
      <span role="cell">${getComparisonValue(currentItem, row)}</span>
      <span role="cell">${getComparisonValue(relatedItem, row)}</span>
    </div>
  `;
}

function getComparisonValue(item, row) {
  const value = row.source === "specs"
    ? item.specs && item.specs[row.key]
    : item[row.key];

  return value || "Pendiente";
}

function getReferenceUrl(item) {
  return item.url_referencia || item.urlReferencia || item.officialUrl || item.referenceUrl || "";
}

function renderFavorites() {
  const favoriteSlugs = getFavorites();
  const favoriteItems = getAllItems().filter((entry) => favoriteSlugs.includes(entry.slug));

  app.innerHTML = `
    <section class="room-header">
      <a class="back-link" href="#/">Regresar</a>
      <p class="eyebrow">Coleccion personal</p>
      <h1>Favoritos</h1>
      <p>Aqui aparecen las piezas que marcaste para estudiar despues. Tienes ${favoriteItems.length} favorito${favoriteItems.length === 1 ? "" : "s"} guardado${favoriteItems.length === 1 ? "" : "s"}.</p>
    </section>

    ${
      favoriteItems.length === 0
        ? `<p class="empty-state">Todavia no tienes favoritos. Entra a una sala y presiona el corazon de una tarjeta.</p>`
        : `<div class="vehicle-grid">${favoriteItems.map((entry) => renderVehicleCard(entry.item)).join("")}</div>`
    }
  `;
}

function renderHistory(history) {
  const fallback = "Aqui pueden escribir la historia del vehiculo: origen, marca, importancia, tecnologia, competiciones, curiosidades y por que pertenece a esta sala.";

  if (Array.isArray(history)) {
    return history.map((paragraph) => `<p>${paragraph}</p>`).join("");
  }

  return `<p>${history || fallback}</p>`;
}

function renderLearning(learning) {
  if (!learning) {
    return `
      <ul>
        <li>Identifica a que categoria pertenece.</li>
        <li>Compara su epoca con otras piezas de la sala.</li>
        <li>Agrega datos historicos o tecnicos en assets/js/data.js.</li>
      </ul>
    `;
  }

  return `
    <div class="learning-content">
      <p><strong>Nivel:</strong> ${learning.level || "Pendiente"}</p>
      ${learning.summary ? `<p>${learning.summary}</p>` : ""}
      ${learning.keyConcepts ? `
        <div>
          <strong>Conceptos clave</strong>
          <ul>${learning.keyConcepts.map((concept) => `<li>${concept}</li>`).join("")}</ul>
        </div>
      ` : ""}
      ${learning.questions ? `
        <div>
          <strong>Preguntas para repasar</strong>
          <ul>${learning.questions.map((question) => `<li>${question}</li>`).join("")}</ul>
        </div>
      ` : ""}
      ${learning.funFact ? `<p><strong>Dato curioso:</strong> ${learning.funFact}</p>` : ""}
    </div>
  `;
}

function renderRandomizer() {
  const randomEntry = getRandomEntry();

  if (!randomEntry) {
    app.innerHTML = `<p class="empty-state">Todavia no hay piezas para randomizar.</p>`;
    return;
  }

  app.innerHTML = `
    <section class="room-header">
      <a class="back-link" href="#/">Regresar</a>
      <p class="eyebrow">Aprender algo nuevo</p>
      <h1>Randomizador</h1>
      <p>La app eligio una pieza al azar para que la conozcas.</p>
    </section>

    <div class="random-layout">
      ${renderVehicleCard(randomEntry.item)}
      <div class="random-panel">
        <h2>${randomEntry.item.name}</h2>
        <p>Categoria: ${randomEntry.route.title}</p>
        <a class="primary-button" href="#/wiki/${randomEntry.slug}">Leer historia</a>
        <button class="secondary-button" type="button" onclick="renderRandomizer()">Elegir otra pieza</button>
      </div>
    </div>
  `;
}

function renderPilots() {
  const pilots = window.MUSEUM_DATA.pilots || [];

  app.innerHTML = `
    <section class="room-header">
      <a class="back-link" href="#/">Regresar</a>
      <p class="eyebrow">Personajes historicos</p>
      <h1>Pilotos famosos</h1>
      <p>Un apartado para aprender sobre pilotos importantes del automovilismo, motociclismo y aviacion.</p>
    </section>

    <div class="pilot-grid">
      ${pilots.map(renderPilotCard).join("")}
    </div>
  `;
}

function renderFounders() {
  const founders = window.MUSEUM_DATA.founders || [];

  app.innerHTML = `
    <section class="room-header">
      <a class="back-link" href="#/">Regresar</a>
      <p class="eyebrow">Historia de marcas</p>
      <h1>Creadores de marcas</h1>
      <p>Un apartado para conocer a las personas y figuras clave detras de marcas importantes de autos, motos y aviones.</p>
    </section>

    <div class="founder-grid">
      ${founders.map(renderFounderCard).join("")}
    </div>
  `;
}

function renderAdmin() {
  const vehicles = backendState.vehicles;

  app.innerHTML = `
    <section class="room-header">
      <a class="back-link" href="#/">Regresar</a>
      <p class="eyebrow">Panel interno</p>
      <h1>Admin SQLite</h1>
      <p>Gestiona vehiculos guardados en el backend. Si el backend no esta prendido, esta vista queda en modo lectura local.</p>
      ${renderBackendStatus()}
    </section>

    <section class="admin-layout">
      <form class="admin-form" id="admin-vehicle-form">
        <input type="hidden" name="id" />
        <label>Nombre<input name="nombre" required placeholder="Ferrari F40" /></label>
        <label>Categoria
          <select name="categoria" required>
            <option value="autos">Autos</option>
            <option value="motos">Motos</option>
            <option value="aviones">Aviones</option>
          </select>
        </label>
        <label>Marca<input name="marca" placeholder="Ferrari" /></label>
        <label>Anio<input name="anio" type="number" min="1880" max="2100" placeholder="1987" /></label>
        <label>Velocidad<input name="velocidad" placeholder="324 km/h" /></label>
        <label>Imagen<input name="imagen" placeholder="https://... o assets/images/..." /></label>
        <label>URL referencia<input name="url_referencia" placeholder="https://..." /></label>
        <label class="admin-wide">Descripcion<textarea name="descripcion" rows="4" placeholder="Resumen corto para la ficha"></textarea></label>
        <div class="admin-actions">
          <button class="primary-button" type="submit" ${backendState.connected ? "" : "disabled"}>Guardar</button>
          <button class="secondary-button" type="button" onclick="resetAdminForm()">Limpiar</button>
          <button class="secondary-button" type="button" onclick="refreshAdminPanel()">Actualizar</button>
          <button class="secondary-button" type="button" onclick="exportAdminVehicles()" ${backendState.connected && vehicles.length > 0 ? "" : "disabled"}>Exportar JSON</button>
        </div>
        <p class="admin-message" id="admin-message" aria-live="polite"></p>
      </form>

      <section class="admin-list">
        <div class="section-heading compact">
          <p class="eyebrow">SQLite</p>
          <h2>${getAdminTotalText()}</h2>
        </div>
        ${renderAdminStats()}
        ${renderAdminFilters()}
        ${
          backendState.connected
            ? renderAdminVehicleList(vehicles)
            : `<p class="empty-state">Prende el servidor con npm.cmd start para crear, editar o borrar registros.</p>`
        }
      </section>
    </section>
  `;

  setupAdminForm();
  setupAdminFilters();
}

function getAdminTotalText() {
  if (!backendState.meta) {
    return `${backendState.vehicles.length} registros`;
  }

  return `${backendState.meta.total} registros`;
}

function renderAdminStats() {
  const counters = backendState.vehicles.reduce((accumulator, vehicle) => {
    accumulator[vehicle.categoria] = (accumulator[vehicle.categoria] || 0) + 1;
    return accumulator;
  }, {});

  return `
    <div class="admin-stats" aria-label="Resumen de registros visibles">
      <span><strong>${backendState.vehicles.length}</strong> visibles</span>
      <span><strong>${counters.autos || 0}</strong> autos</span>
      <span><strong>${counters.motos || 0}</strong> motos</span>
      <span><strong>${counters.aviones || 0}</strong> aviones</span>
    </div>
  `;
}

function renderAdminFilters() {
  return `
    <form class="admin-filters" id="admin-filters-form">
      <input name="q" value="${escapeHtml(adminFilters.q)}" placeholder="Buscar por nombre, marca o descripcion" />
      <select name="categoria">
        <option value="">Todas</option>
        <option value="autos" ${adminFilters.categoria === "autos" ? "selected" : ""}>Autos</option>
        <option value="motos" ${adminFilters.categoria === "motos" ? "selected" : ""}>Motos</option>
        <option value="aviones" ${adminFilters.categoria === "aviones" ? "selected" : ""}>Aviones</option>
      </select>
      <select name="sort" aria-label="Ordenar por">
        <option value="id" ${adminFilters.sort === "id" ? "selected" : ""}>Recientes</option>
        <option value="nombre" ${adminFilters.sort === "nombre" ? "selected" : ""}>Nombre</option>
        <option value="marca" ${adminFilters.sort === "marca" ? "selected" : ""}>Marca</option>
        <option value="anio" ${adminFilters.sort === "anio" ? "selected" : ""}>Anio</option>
        <option value="updated_at" ${adminFilters.sort === "updated_at" ? "selected" : ""}>Actualizacion</option>
      </select>
      <select name="order" aria-label="Direccion del orden">
        <option value="desc" ${adminFilters.order === "desc" ? "selected" : ""}>Desc</option>
        <option value="asc" ${adminFilters.order === "asc" ? "selected" : ""}>Asc</option>
      </select>
      <button class="secondary-button" type="submit">Filtrar</button>
      <button class="secondary-button" type="button" onclick="clearAdminFilters()">Limpiar filtros</button>
    </form>
  `;
}

function renderAdminVehicleList(vehicles) {
  if (vehicles.length === 0) {
    return `<p class="empty-state">No hay vehiculos en SQLite. Usa el formulario o ejecuta npm.cmd run seed.</p>`;
  }

  return `
    <div class="admin-table">
      ${vehicles.map((vehicle) => `
        <article>
          <div>
            <strong>${escapeHtml(vehicle.nombre)}</strong>
            <small>${escapeHtml(vehicle.categoria)} | ${escapeHtml(vehicle.marca || "Marca pendiente")}</small>
            <small>Actualizado: ${formatDate(vehicle.updated_at || vehicle.created_at)}</small>
          </div>
          <div class="admin-row-actions">
            <button class="secondary-button" type="button" onclick="editAdminVehicle(${vehicle.id})">Editar</button>
            <button class="secondary-button danger" type="button" onclick="deleteAdminVehicle(${vehicle.id})">
              ${adminPendingDeleteId === vehicle.id ? "Confirmar" : "Borrar"}
            </button>
          </div>
        </article>
      `).join("")}
    </div>
    ${renderAdminPagination()}
  `;
}

function renderAdminPagination() {
  const meta = backendState.meta;

  if (!meta || meta.totalPages <= 1) {
    return "";
  }

  return `
    <div class="admin-pagination">
      <button class="secondary-button" type="button" onclick="changeAdminPage(${meta.page - 1})" ${meta.page <= 1 ? "disabled" : ""}>Anterior</button>
      <span>Pagina ${meta.page} de ${meta.totalPages}</span>
      <button class="secondary-button" type="button" onclick="changeAdminPage(${meta.page + 1})" ${meta.page >= meta.totalPages ? "disabled" : ""}>Siguiente</button>
    </div>
  `;
}

function setupAdminForm() {
  const form = document.getElementById("admin-vehicle-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const id = formData.get("id");
    const vehicle = Object.fromEntries(formData.entries());

    if (!vehicle.anio) {
      delete vehicle.anio;
    }

    try {
      if (id) {
        await window.MuseumApi.updateVehicle(id, vehicle);
      } else {
        await window.MuseumApi.createVehicle(vehicle);
      }

      await refreshBackendData();
      renderAdmin();
    } catch (error) {
      showAdminMessage(error.message || "No se pudo guardar. Revisa los campos y que el backend este prendido.", "error");
    }
  });
}

function setupAdminFilters() {
  const form = document.getElementById("admin-filters-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    adminFilters.q = String(formData.get("q") || "").trim();
    adminFilters.categoria = String(formData.get("categoria") || "");
    adminFilters.sort = String(formData.get("sort") || "id");
    adminFilters.order = String(formData.get("order") || "desc");
    adminFilters.page = 1;
    await refreshAdminPanel();
  });
}

async function clearAdminFilters() {
  adminFilters = { q: "", categoria: "", sort: "id", order: "desc", page: 1, limit: 50 };
  await refreshAdminPanel();
}

async function changeAdminPage(page) {
  adminFilters.page = Math.max(page, 1);
  await refreshAdminPanel();
}

function editAdminVehicle(id) {
  const vehicle = backendState.vehicles.find((current) => current.id === id);
  const form = document.getElementById("admin-vehicle-form");

  if (!vehicle || !form) {
    return;
  }

  form.elements.id.value = vehicle.id;
  form.elements.nombre.value = vehicle.nombre || "";
  form.elements.categoria.value = vehicle.categoria || "autos";
  form.elements.marca.value = vehicle.marca || "";
  form.elements.anio.value = vehicle.anio || "";
  form.elements.velocidad.value = vehicle.velocidad || "";
  form.elements.imagen.value = vehicle.imagen || "";
  form.elements.url_referencia.value = vehicle.url_referencia || "";
  form.elements.descripcion.value = vehicle.descripcion || "";
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetAdminForm() {
  const form = document.getElementById("admin-vehicle-form");

  if (form) {
    form.reset();
    form.elements.id.value = "";
  }
}

async function deleteAdminVehicle(id) {
  const vehicle = backendState.vehicles.find((current) => current.id === id);

  if (!vehicle) {
    return;
  }

  if (adminPendingDeleteId !== id) {
    adminPendingDeleteId = id;
    renderAdmin();
    showAdminMessage(`Pulsa Confirmar para borrar ${vehicle.nombre}.`, "warning");
    return;
  }

  try {
    await window.MuseumApi.deleteVehicle(id);
    adminPendingDeleteId = null;
    await refreshBackendData();
    renderAdmin();
  } catch (error) {
    showAdminMessage(error.message || "No se pudo borrar el registro.", "error");
  }
}

async function refreshAdminPanel() {
  await refreshBackendData();
  renderAdmin();
}

function showAdminMessage(message, type = "info") {
  const element = document.getElementById("admin-message");

  if (!element) {
    return;
  }

  element.textContent = message;
  element.dataset.type = type;
}

async function exportAdminVehicles() {
  let payload;

  try {
    payload = await window.MuseumApi.exportVehicles(adminFilters);
  } catch (error) {
    payload = {
      exportedAt: new Date().toISOString(),
      total: backendState.meta?.total ?? backendState.vehicles.length,
      filters: adminFilters,
      data: backendState.vehicles
    };
    showAdminMessage("No se pudo exportar desde API. Se genero copia visible.", "warning");
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ilovewheels-vehiculos.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showAdminMessage(`Exportacion JSON generada con ${payload.total} registros.`, "info");
}

function renderEasterEggPage() {
  app.innerHTML = `
    <section class="room-header easter-egg-page">
      <a class="back-link" href="#/">Regresar</a>
      <p class="eyebrow">Ruta secreta</p>
      <h1>¿Tienes 18 años?</h1>
      <div class="easter-age-actions" aria-label="Verificacion de edad">
        <button class="primary-button" type="button" onclick="showEasterEggContent()">Sí</button>
        <button class="secondary-button" type="button" onclick="window.AppRouter.navigate('/')">No</button>
      </div>
    </section>
  `;
}

function showEasterEggContent() {
  app.innerHTML = `
    <section class="room-header easter-egg-page">
      <a class="back-link" href="#/">Regresar</a>
      <p class="eyebrow">Ruta secreta</p>
      <h1>Bienvenido al Easter Egg</h1>
      <p>Más contenido próximamente...</p>
    </section>

    <section class="easter-poster" aria-label="Afiche promocional placeholder">
      <span>Exclusive Access</span>
      <strong>Premium Content</strong>
      <small>Coming Soon</small>
    </section>

    <section class="vehicle-grid easter-card-grid" aria-label="Afiches Easter Egg">
      ${EASTER_EGG_CARDS.map(renderEasterEggCard).join("")}
    </section>
  `;
}

function renderEasterEggCard(card) {
  return `
    <article class="vehicle-card easter-card">
      <a class="vehicle-link" href="#/wiki/${createSlug(card.name)}" aria-label="Abrir detalle de ${card.name}">
        <div class="image-frame">
          <img src="${card.image}" alt="${card.name}" loading="lazy" decoding="async" onerror="this.remove(); this.parentElement.classList.add('missing-image'); this.parentElement.innerHTML='Imagen placeholder';" />
        </div>
        <div class="vehicle-info">
          <h3>${card.name}</h3>
          <p>${card.detail}</p>
          <span class="card-action">Abrir ficha</span>
        </div>
      </a>
    </article>
  `;
}

function getMuseumStats() {
  return {
    rooms: Object.keys(window.MUSEUM_DATA.routes).length,
    items: getAllItems().length,
    pilots: (window.MUSEUM_DATA.pilots || []).length
  };
}

function getRoutesByArea(area) {
  const section = window.MUSEUM_DATA.sections.find((candidate) => candidate.title === area);
  return section ? section.routes : [];
}

function getPathByRoute(route) {
  const entry = Object.entries(window.MUSEUM_DATA.routes).find(([, candidate]) => candidate === route);
  return entry ? entry[0] : "";
}

function renderPilotCard(pilot) {
  return `
    <article class="pilot-card">
      <p class="eyebrow">${pilot.area}</p>
      <h3>${pilot.name}</h3>
      <p>${pilot.description}</p>
      <small>${pilot.highlight}</small>
    </article>
  `;
}

function renderFounderCard(founder) {
  return `
    <article class="founder-card">
      <p class="eyebrow">${founder.area}</p>
      <h3>${founder.name}</h3>
      <dl>
        <div><dt>Marca</dt><dd>${founder.brand}</dd></div>
        <div><dt>Anio</dt><dd>${founder.year}</dd></div>
      </dl>
      <p>${founder.description}</p>
    </article>
  `;
}

function getAllItems() {
  return Object.entries(window.MUSEUM_DATA.routes).flatMap(([roomPath, route]) =>
    getRoomItems(route).map((item) => ({
      item,
      route,
      roomPath,
      slug: createSlug(item.name)
    }))
  );
}

function getEasterEggEntries() {
  return EASTER_EGG_ROUTE.items.map((item) => ({
    item,
    route: EASTER_EGG_ROUTE,
    roomPath: "/easter-egg",
    slug: createSlug(item.name)
  }));
}

function getRandomEntry() {
  const items = getAllItems();
  return items[Math.floor(Math.random() * items.length)];
}

function getFavorites() {
  try {
    const savedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(savedFavorites) ? savedFavorites : [];
  } catch (error) {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(slug) {
  return getFavorites().includes(slug);
}

function toggleFavorite(slug) {
  const favorites = getFavorites();
  const nextFavorites = favorites.includes(slug)
    ? favorites.filter((favorite) => favorite !== slug)
    : [...favorites, slug];

  saveFavorites(nextFavorites);
  renderApp();
}

function findItemBySlug(slug) {
  return getAllItems().find((entry) => entry.slug === slug)
    || getEasterEggEntries().find((entry) => entry.slug === slug);
}

function createSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDate(value) {
  if (!value) {
    return "Pendiente";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}

function renderNotFound(path) {
  app.innerHTML = `
    <section class="hero-panel">
      <p class="eyebrow">Ruta no encontrada</p>
      <h1>No existe la ruta ${path}</h1>
      <p>Regresa al inicio y selecciona una sala disponible.</p>
      <a class="back-link dark" href="#/">Regresar</a>
    </section>
  `;
}

function handleRouteChange() {
  renderApp();
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
}

async function refreshBackendData() {
  if (!window.MuseumApi) {
    backendState = {
      checked: true,
      connected: false,
      vehicles: [],
      meta: null,
      message: "Cliente API no disponible"
    };
    return;
  }

  try {
    await window.MuseumApi.health();
    const result = await window.MuseumApi.listVehiclesPage(adminFilters);
    backendState = {
      checked: true,
      connected: true,
      vehicles: result.data,
      meta: result.meta,
      message: `${result.meta.total} registros en SQLite`
    };
  } catch (error) {
    backendState = {
      checked: true,
      connected: false,
      vehicles: [],
      meta: null,
      message: "Backend apagado o no disponible"
    };
  }
}

async function bootstrapApp() {
  renderApp();
  await refreshBackendData();

  if (window.AppRouter.getCurrentPath() === "/admin" || backendState.connected) {
    renderApp();
  }
}

window.toggleFavorite = toggleFavorite;
window.renderRandomizer = renderRandomizer;
window.renderComparison = renderComparison;
window.showEasterEggContent = showEasterEggContent;
window.aplicarOrdenamiento = aplicarOrdenamiento;
window.toggleSoloFavoritos = toggleSoloFavoritos;
window.editAdminVehicle = editAdminVehicle;
window.deleteAdminVehicle = deleteAdminVehicle;
window.resetAdminForm = resetAdminForm;
window.refreshAdminPanel = refreshAdminPanel;
window.clearAdminFilters = clearAdminFilters;
window.changeAdminPage = changeAdminPage;
window.exportAdminVehicles = exportAdminVehicles;
window.AppRouter.onChange(handleRouteChange);
bootstrapApp();
