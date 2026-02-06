/**
 * ============================================================================
 * Servicio de Firma
 * ============================================================================
 * Usa la API de Firma para registrar eventos y validar empleados por CI.
 *
 * Base URL configurada con REACT_APP_FIRMA_API_URL
 */

const FIRMA_API_URL =
  process.env.REACT_APP_FIRMA_API_URL || "http://localhost:3001";

async function firmaApiRequest(endpoint, options = {}) {
  const url = `${FIRMA_API_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return { ok: true, data: null };
    }

    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage =
        data?.message || data?.error || `Error HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error en API Firma:", {
      endpoint,
      error: error.message,
    });
    throw error;
  }
}

const firmaService = {
  /**
   * Validar empleado por CI
   * GET /api/empleados/:ci
   */
  async validarEmpleado(ci) {
    return firmaApiRequest(`/api/empleados/${ci}`, { method: "GET" });
  },

  /**
   * Registrar firma del dia (ingreso/break/almuerzo/salida)
   * POST /api/firmas/registrar
   */
  async registrar(ci) {
    return firmaApiRequest("/api/firmas/registrar", {
      method: "POST",
      body: JSON.stringify({ ci }),
    });
  },

  /**
   * Obtener firma por CI (fecha opcional)
   * GET /api/firmas/:ci?fecha=YYYY-MM-DD
   */
  async obtener(ci, fecha) {
    const query = fecha ? `?fecha=${encodeURIComponent(fecha)}` : "";
    return firmaApiRequest(`/api/firmas/${ci}${query}`, { method: "GET" });
  },
};

export default firmaService;
