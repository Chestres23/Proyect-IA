import api from './api';

/**
 * ============================================================================
 * Servicio de Recesos (Breaks)
 * ============================================================================
 * Consume la API externa de Recesos desarrollada por otro grupo.
 * Endpoint base: /api/breaks
 * 
 * Documentación: /APIS IA/Receso y turnos/recesos.postman_collection.json
 * 
 * Los recesos son pausas programadas asociadas a turnos (breaks, almuerzos, etc.)
 * ============================================================================
 */

const recesoService = {
  /**
   * Obtener todos los recesos
   * GET /api/breaks
   * @returns {Promise<Array>} - Lista de recesos
   */
  async listar() {
    try {
      const response = await api.get('/breaks');
      
      // La API retorna formato: {ok: true, data: [...]}
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error('Error listando recesos:', error);
      throw new Error('No se pudieron cargar los recesos: ' + error.message);
    }
  },

  /**
   * Obtener un receso por ID
   * GET /api/breaks/:id
   * @param {number} id - ID del receso
   * @returns {Promise<Object>} - Datos del receso
   */
  async obtener(id) {
    try {
      const response = await api.get(`/breaks/${id}`);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error obteniendo receso:', error);
      throw new Error('No se pudo obtener el receso: ' + error.message);
    }
  },

  /**
   * Crear un nuevo receso
   * POST /api/breaks
   * @param {Object} recesoData - Datos del nuevo receso
   * @param {number} recesoData.ID_T - ID del turno asociado
   * @param {string} recesoData.HORA_INICIO_B - Hora de inicio (HH:mm:ss)
   * @param {string} recesoData.TIEMPO_RECESO_B - Tiempo del receso (HH:mm:ss)
   * @param {string} recesoData.TOTAL_B - Tiempo total (HH:mm:ss)
   * @param {string} recesoData.NOMBRE_B - Nombre del receso
   * @param {string} recesoData.DESCRIPCION_B - Descripción
   * @param {string} recesoData.TIPO_B - Tipo (ej: "BREAK", "ALMUERZO")
   * @returns {Promise<Object>} - Receso creado
   */
  async crear(recesoData) {
    try {
      const response = await api.post('/breaks', recesoData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error creando receso:', error);
      throw new Error('No se pudo crear el receso: ' + error.message);
    }
  },

  /**
   * Actualizar un receso existente
   * PUT /api/breaks/:id
   * @param {number} id - ID del receso
   * @param {Object} recesoData - Datos actualizados
   * @returns {Promise<Object>} - Receso actualizado
   */
  async actualizar(id, recesoData) {
    try {
      const response = await api.put(`/breaks/${id}`, recesoData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error actualizando receso:', error);
      throw new Error('No se pudo actualizar el receso: ' + error.message);
    }
  },

  /**
   * Eliminar un receso
   * DELETE /api/breaks/:id
   * @param {number} id - ID del receso
   * @returns {Promise<Object>} - Confirmación de eliminación
   */
  async eliminar(id) {
    try {
      const response = await api.delete(`/breaks/${id}`);
      
      return response || { ok: true };
    } catch (error) {
      console.error('Error eliminando receso:', error);
      throw new Error('No se pudo eliminar el receso: ' + error.message);
    }
  },

  /**
   * Obtener recesos por turno
   * Filtra localmente los recesos por ID de turno
   * @param {number} idTurno - ID del turno
   * @returns {Promise<Array>} - Recesos del turno
   */
  async obtenerPorTurno(idTurno) {
    try {
      const recesos = await this.listar();
      return recesos.filter(receso => receso.id_t === idTurno);
    } catch (error) {
      console.error('Error obteniendo recesos por turno:', error);
      throw new Error('No se pudieron cargar los recesos del turno: ' + error.message);
    }
  },
};

export default recesoService;
