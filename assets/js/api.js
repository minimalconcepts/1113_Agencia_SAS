/*
 * Cliente API del frontend.
 * Centraliza la comunicacion con Express para que app.js no dependa de URLs sueltas.
 */
window.MuseumApi = (() => {
  const baseUrl = window.location.port === "3000" ? "" : "http://localhost:3000";

  async function request(path, options = {}) {
    const { timeoutMs = 6000, ...fetchOptions } = options;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers || {})
      },
      ...fetchOptions,
      signal: controller.signal,
    }).finally(() => window.clearTimeout(timeoutId));

    if (!response.ok) {
      let message = `Error API ${response.status}`;

      try {
        const errorBody = await response.json();
        message = errorBody.error || errorBody.detalle || message;
      } catch (error) {
        // Mantiene el mensaje generico cuando la respuesta no es JSON.
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  return {
    health() {
      return request("/api/health");
    },

    listVehicles() {
      return request("/api/vehiculos");
    },

    listVehiclesPage(params = {}) {
      const query = new URLSearchParams({
        format: "page",
        page: params.page || 1,
        limit: params.limit || 50
      });

      appendVehicleParams(query, params);

      return request(`/api/vehiculos?${query.toString()}`);
    },

    exportVehicles(params = {}) {
      const query = new URLSearchParams();
      appendVehicleParams(query, params);
      return request(`/api/export?${query.toString()}`);
    },

    createVehicle(vehicle) {
      return request("/api/vehiculos", {
        method: "POST",
        body: JSON.stringify(vehicle)
      });
    },

    updateVehicle(id, vehicle) {
      return request(`/api/vehiculos/${id}`, {
        method: "PUT",
        body: JSON.stringify(vehicle)
      });
    },

    deleteVehicle(id) {
      return request(`/api/vehiculos/${id}`, {
        method: "DELETE"
      });
    },

    searchReference(query) {
      return request(`/buscar?q=${encodeURIComponent(query)}`);
    }
  };

  function appendVehicleParams(query, params) {
    ["q", "categoria", "sort", "order"].forEach((key) => {
      if (params[key]) {
        query.set(key, params[key]);
      }
    });
  }
})();
