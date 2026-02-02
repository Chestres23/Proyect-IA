/**
 * ============================================================================
 * API Service - Cliente HTTP Base
 * ============================================================================
 * Este archivo contiene la configuración base para realizar peticiones HTTP
 * a las APIs externas. Todas las peticiones pasan por aquí.
 * ============================================================================
 */

/**
 * Configuración base de la API
 * La URL base se configura desde las variables de entorno
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Función genérica para hacer peticiones HTTP
 * @param {string} endpoint - Endpoint relativo a la URL base
 * @param {object} options - Opciones de configuración de fetch
 * @returns {Promise} - Respuesta de la API
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Manejar respuesta 204 No Content (común en DELETE)
    if (response.status === 204) {
      return { ok: true, data: null };
    }

    // Intentar parsear JSON
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorMessage = data?.mensaje || data?.error || data?.message || `Error HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error en petición API:', {
      endpoint,
      error: error.message
    });
    throw error;
  }
}

/**
 * ============================================================================
 * Métodos HTTP genéricos
 * ============================================================================
 */

const api = {
  /**
   * Petición GET
   */
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),

  /**
   * Petición POST
   */
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  /**
   * Petición PUT
   */
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  /**
   * Petición DELETE
   */
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),

  /**
   * Obtener la URL base configurada
   */
  getBaseUrl: () => API_BASE_URL,
};

export default api;

