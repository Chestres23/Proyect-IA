/**
 * ============================================================================
 * Servicio de Clientes
 * ============================================================================
 * IMPORTANTE: La API de Clientes corre en el mismo servidor que Personal
 * (puerto 3001), diferente a las demás APIs (puerto 3000)
 * ============================================================================
 */

// URL específica para API de Clientes (puerto 3001, mismo que Personal)
const CLIENTES_API_URL = process.env.REACT_APP_PERSONAL_API_URL || 'http://169.254.122.45:3001/api';

/**
 * Cliente HTTP específico para API de Clientes
 */
async function clientesApiRequest(endpoint, options = {}) {
  const url = `${CLIENTES_API_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 204) {
      return { ok: true, data: null };
    }

    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage = data?.mensaje || data?.error || data?.message || `Error HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error en API Clientes:', {
      endpoint,
      error: error.message
    });
    throw error;
  }
}

const clientesApi = {
  get: (endpoint) => clientesApiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, data) => clientesApiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => clientesApiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => clientesApiRequest(endpoint, { method: 'DELETE' })
};

const clienteApi = {
  /**
   * Obtener todos los clientes
   * GET /api/clientes
   * @returns {Promise<Array>} - Lista de clientes
   */
  listar: async () => {
    try {
      const response = await clientesApi.get('/clientes');
      
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error("Error al listar clientes:", error);
      throw new Error('No se pudieron cargar los clientes: ' + error.message);
    }
  },

  /**
   * Obtener cliente por ID
   * GET /api/clientes/:id
   * @param {string|number} id - ID del cliente
   * @returns {Promise<Object>} - Datos del cliente
   */
  obtener: async (id) => {
    try {
      const response = await clientesApi.get(`/clientes/${id}`);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error("Error al obtener cliente:", error);
      throw new Error('No se pudo obtener el cliente: ' + error.message);
    }
  },

  /**
   * Crear nuevo cliente
   * POST /api/clientes
   * @param {Object} clienteData - Datos del nuevo cliente
   * @returns {Promise<Object>} - Cliente creado
   */
  crear: async (clienteData) => {
    try {
      const response = await clientesApi.post('/clientes', clienteData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error("Error al crear cliente:", error);
      throw new Error('No se pudo crear el cliente: ' + error.message);
    }
  },

  /**
   * Actualizar cliente
   * PUT /api/clientes/:id
   * @param {string|number} id - ID del cliente
   * @param {Object} clienteData - Datos actualizados
   * @returns {Promise<Object>} - Cliente actualizado
   */
  actualizar: async (id, clienteData) => {
    try {
      const response = await clientesApi.put(`/clientes/${id}`, clienteData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      throw new Error('No se pudo actualizar el cliente: ' + error.message);
    }
  },

  /**
   * Eliminar cliente
   * DELETE /api/clientes/:id
   * @param {string|number} id - ID del cliente
   * @returns {Promise<Object>} - Confirmación de eliminación
   */
  eliminar: async (id) => {
    try {
      const response = await clientesApi.delete(`/clientes/${id}`);
      
      return response || { ok: true };
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      throw new Error('No se pudo eliminar el cliente: ' + error.message);
    }
  },

  /**
   * Buscar clientes por término
   * GET /api/clientes/buscar?termino=...
   * @param {string} termino - Término de búsqueda
   * @returns {Promise<Array>} - Clientes encontrados
   */
  buscar: async (termino) => {
    try {
      const response = await clientesApi.get(`/clientes/buscar?termino=${encodeURIComponent(termino)}`);
      
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error("Error al buscar clientes:", error);
      throw new Error('No se pudieron buscar clientes: ' + error.message);
    }
  },
};

export default clienteApi;

