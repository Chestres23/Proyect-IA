import api from './api';

/**
 * ============================================================================
 * Servicio de Pausas
 * ============================================================================
 * Consume la API externa de Pausas desarrollada por otro grupo.
 * Endpoint base: /api/pausas
 * 
 * Documentación: /APIS IA/Pausas/Proyecto Pausas.postman_collection.json
 * 
 * Tipos de pausas:
 * - Visita (Individual): V_clientes, V_proveedores, etc.
 * - Capacitación (Grupal - Activa): C_interna, C_externa
 * ============================================================================
 */

const pausaService = {
  /**
   * Obtener todos los empleados disponibles
   * GET /api/empleados
   * @returns {Promise<Array>} - Lista de empleados
   */
  async listarEmpleados() {
    try {
      const response = await api.get('/empleados');
      
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
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
   * Registrar una pausa individual (Visita)
   * POST /api/pausas/visita
   * @param {Object} pausaData - Datos de la pausa
   * @param {string} pausaData.firma - Firma/ID del empleado
   * @param {string} pausaData.tipo - Tipo de pausa (ej: "Visita")
   * @param {string} pausaData.sub_tipo - Subtipo (ej: "V_clientes", "V_proveedores")
   * @param {string} pausaData.observacion - Observación opcional
   * @returns {Promise<Object>} - Pausa creada
   */
  async registrarVisita(pausaData) {
    try {
      const response = await api.post('/pausas/visita', pausaData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error registrando visita:', error);
      throw new Error('No se pudo registrar la visita: ' + error.message);
    }
  },

  /**
   * Registrar pausas grupales (Capacitación - Activas)
   * POST /api/pausas/activas
   * @param {Object} pausaData - Datos de la pausa grupal
   * @param {Array<string>} pausaData.listaCedulas - Array de cédulas de empleados
   * @param {string} pausaData.tipo - Tipo de pausa (ej: "Capacitación")
   * @param {string} pausaData.sub_tipo - Subtipo (ej: "C_interna", "C_externa")
   * @param {string} pausaData.observacion - Observación
   * @param {string} pausaData.fecha - Fecha en formato YYYY-MM-DD
   * @param {string} pausaData.hora_inicio - Hora de inicio (HH:mm)
   * @param {string} pausaData.hora_fin - Hora de fin (HH:mm)
   * @returns {Promise<Object>} - Pausas grupales creadas
   */
  async registrarActivas(pausaData) {
    try {
      const response = await api.post('/pausas/activas', pausaData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error registrando pausas activas:', error);
      throw new Error('No se pudieron registrar las pausas activas: ' + error.message);
    }
  },

  /**
   * Actualizar una pausa existente
   * PUT /api/pausas/:id
   * @param {number} id - ID de la pausa
   * @param {Object} pausaData - Datos a actualizar
   * @param {string} pausaData.observacion - Nueva observación
   * @returns {Promise<Object>} - Pausa actualizada
   */
  async actualizar(id, pausaData) {
    try {
      const response = await api.put(`/pausas/${id}`, pausaData);
      
      if (response && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      console.error('Error actualizando pausa:', error);
      throw new Error('No se pudo actualizar la pausa: ' + error.message);
    }
  },
};

export default pausaService;
