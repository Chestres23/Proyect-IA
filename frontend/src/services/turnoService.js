/**
 * ============================================================================
 * Servicio de Turnos
 * ============================================================================
 * Consume la API externa de Turnos desarrollada por otro grupo.
 * Endpoint base: /api/turnos
 * 
 * Documentación: /APIS IA/Receso y turnos/turnos.postman_collection.json
 * 
 * Los turnos definen los horarios de trabajo de los empleados.
 * ============================================================================
 */

const TURNOS_API_URL =
  process.env.REACT_APP_TURNOS_API_URL || 'http://169.254.67.87:3007/api';

async function turnosApiRequest(endpoint, options = {}) {
  const url = `${TURNOS_API_URL}${endpoint}`;

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
    console.error('Error en API Turnos:', {
      endpoint,
      error: error.message
    });
    throw error;
  }
}

const turnosApi = {
  get: (endpoint) => turnosApiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, data) => turnosApiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => turnosApiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => turnosApiRequest(endpoint, { method: 'DELETE' })
};

const turnoService = {
  /**
   * Obtener todos los turnos
   * GET /api/turnos
   * @returns {Promise<Array>} - Lista de turnos
   */
  async listar() {
    try {
      const response = await turnosApi.get('/turnos');
      
      // La API retorna formato: {ok: true, data: [...]}
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error('Error listando turnos:', error);
      throw new Error('No se pudieron cargar los turnos: ' + error.message);
    }
  },

  /**
   * Obtener un turno por ID
   * GET /api/turnos/:id
   * @param {number} id - ID del turno
   * @returns {Promise<Object>} - Datos del turno
   */
  async obtener(id) {
    try {
      const response = await turnosApi.get(`/turnos/${id}`);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error obteniendo turno:', error);
      throw new Error('No se pudo obtener el turno: ' + error.message);
    }
  },

  /**
   * Crear un nuevo turno
   * POST /api/turnos
   * @param {Object} turnoData - Datos del nuevo turno
   * @param {string} turnoData.HORA_INICIO_T - Hora de inicio (HH:mm:ss)
   * @param {string} turnoData.HORA_FIN_T - Hora de fin (HH:mm:ss)
   * @param {string} turnoData.NOMBRE_T - Nombre del turno
   * @param {string} turnoData.DESCRIPCION_T - Descripción
   * @param {string} turnoData.TIPO_T - Tipo de turno (ej: "NORMAL")
   * @returns {Promise<Object>} - Turno creado
   */
  async crear(turnoData) {
    try {
      const response = await turnosApi.post('/turnos', turnoData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error creando turno:', error);
      throw new Error('No se pudo crear el turno: ' + error.message);
    }
  },

  /**
   * Actualizar un turno existente
   * PUT /api/turnos/:id
   * @param {number} id - ID del turno
   * @param {Object} turnoData - Datos actualizados
   * @returns {Promise<Object>} - Turno actualizado
   */
  async actualizar(id, turnoData) {
    try {
      const response = await turnosApi.put(`/turnos/${id}`, turnoData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error actualizando turno:', error);
      throw new Error('No se pudo actualizar el turno: ' + error.message);
    }
  },

  /**
   * Eliminar un turno
   * DELETE /api/turnos/:id
   * @param {number} id - ID del turno
   * @returns {Promise<Object>} - Confirmación de eliminación
   */
  async eliminar(id) {
    try {
      const response = await turnosApi.delete(`/turnos/${id}`);
      
      return response || { ok: true };
    } catch (error) {
      console.error('Error eliminando turno:', error);
      throw new Error('No se pudo eliminar el turno: ' + error.message);
    }
  },
};

export default turnoService;
