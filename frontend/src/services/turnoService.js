import api from './api';

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

const turnoService = {
  /**
   * Obtener todos los turnos
   * GET /api/turnos
   * @returns {Promise<Array>} - Lista de turnos
   */
  async listar() {
    try {
      const response = await api.get('/turnos');
      
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
      const response = await api.get(`/turnos/${id}`);
      
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
      const response = await api.post('/turnos', turnoData);
      
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
      const response = await api.put(`/turnos/${id}`, turnoData);
      
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
      const response = await api.delete(`/turnos/${id}`);
      
      return response || { ok: true };
    } catch (error) {
      console.error('Error eliminando turno:', error);
      throw new Error('No se pudo eliminar el turno: ' + error.message);
    }
  },
};

export default turnoService;
