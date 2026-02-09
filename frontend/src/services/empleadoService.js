/**
 * ============================================================================
 * Servicio de Empleados (Personal)
 * ============================================================================
 * IMPORTANTE: Este servicio usa su propia URL ya que la API de Personal
 * corre en puerto 3001, diferente a las demás APIs (puerto 3000)
 * ============================================================================
 */

// URL específica para API de Personal (puerto 3001)
const PERSONAL_API_URL = process.env.REACT_APP_PERSONAL_API_URL || 'http://169.254.122.45:3001/api';

/**
 * Cliente HTTP específico para API de Personal
 */
async function personalApiRequest(endpoint, options = {}) {
  const url = `${PERSONAL_API_URL}${endpoint}`;
  
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
    console.error('Error en API Personal:', {
      endpoint,
      error: error.message
    });
    throw error;
  }
}

const personalApi = {
  get: (endpoint) => personalApiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, data) => personalApiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => personalApiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => personalApiRequest(endpoint, { method: 'DELETE' })
};

const empleadoService = {
  /**
   * Obtener todos los empleados
   * GET /api/empleados/
   * @returns {Promise<Array>} - Lista de empleados
   */
  async listar() {
    try {
      const response = await personalApi.get('/empleados');
      
      // La API externa retorna formato: {ok: true, data: [...]}
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      // Si la API retorna directamente el array
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error('Error listando empleados:', error);
      throw new Error('No se pudieron cargar los empleados: ' + error.message);
    }
  },

  /**
   * Obtener un empleado por cédula
   * GET /api/empleados/:ci
   * @param {string} ci - Cédula del empleado
   * @returns {Promise<Object>} - Datos del empleado
   */
  async obtener(ci) {
    try {
      const response = await personalApi.get(`/empleados/${ci}`);
      
      // La API externa retorna formato: {ok: true, data: {...}}
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error obteniendo empleado:', error);
      throw new Error('No se pudo obtener el empleado: ' + error.message);
    }
  },

  /**
   * Crear un nuevo empleado
   * POST /api/empleados
   * @param {Object} empleadoData - Datos del nuevo empleado
   * @returns {Promise<Object>} - Empleado creado
   */
  async crear(empleadoData) {
    try {
      const response = await personalApi.post('/empleados', empleadoData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error creando empleado:', error);
      throw new Error('No se pudo crear el empleado: ' + error.message);
    }
  },

  /**
   * Actualizar un empleado existente
   * PUT /api/empleados/:ci
   * @param {string} ci - Cédula del empleado
   * @param {Object} empleadoData - Datos actualizados
   * @returns {Promise<Object>} - Empleado actualizado
   */
  async actualizar(ci, empleadoData) {
    try {
      const response = await personalApi.put(`/empleados/${ci}`, empleadoData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error actualizando empleado:', error);
      throw new Error('No se pudo actualizar el empleado: ' + error.message);
    }
  },

  /**
   * Eliminar un empleado
   * DELETE /api/empleados/:ci
   * @param {string} ci - Cédula del empleado
   * @returns {Promise<Object>} - Confirmación de eliminación
   */
  async eliminar(ci) {
    try {
      const response = await personalApi.delete(`/empleados/${ci}`);
      
      // DELETE puede retornar 204 No Content
      return response || { ok: true };
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      throw new Error('No se pudo eliminar el empleado: ' + error.message);
    }
  },
};

export default empleadoService;

