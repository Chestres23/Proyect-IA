import React, { useState, useEffect } from 'react';
import './TiemposFuera.css';
import PageContainer from './PageContainer';
import Modal from './Modal';
import pausaService from '../services/pausaService';

const estadoOptions = ['<<Selecciona>>', 'PERMISO', 'REUNION', 'CAPACITACION', 'VISITA', 'OTRO'];
const subEstadoOptions = {
  'PERMISO': ['Médico', 'Personal', 'Familiar'],
  'REUNION': ['Interna', 'Externa', 'Cliente'],
  'CAPACITACION': ['Interna', 'Externa'],
  'VISITA': ['Cliente', 'Proveedor'],
  'OTRO': ['Otro']
};

const horasOptions = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];

function TiemposFuera({ onGoBack }) {
  const [registros, setRegistros] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    estado: '<<Selecciona>>',
    subEstado: '',
    empleadosSeleccionados: [],
    observacion: '',
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '08:00',
    horaFin: '09:00'
  });

  // Cargar empleados al montar el componente
  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pausaService.listarEmpleados();
      setEmpleados(data);
    } catch (err) {
      setError('Error al cargar empleados: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistros = registros.filter(r => 
    r.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.observacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'estado') {
        newData.subEstado = '';
      }
      return newData;
    });
  };

  const handleEmpleadoToggle = (empleadoId) => {
    setFormData(prev => {
      const seleccionados = prev.empleadosSeleccionados.includes(empleadoId)
        ? prev.empleadosSeleccionados.filter(id => id !== empleadoId)
        : [...prev.empleadosSeleccionados, empleadoId];
      return { ...prev, empleadosSeleccionados: seleccionados };
    });
  };

  const handleGuardar = async () => {
    if (formData.estado === '<<Selecciona>>') {
      alert('Por favor seleccione un estado');
      return;
    }
    if (formData.empleadosSeleccionados.length === 0) {
      alert('Por favor seleccione al menos un empleado');
      return;
    }
    
    try {
      // Mapear el tipo de pausa según la API
      const tipoMap = {
        'VISITA': 'Visita',
        'CAPACITACION': 'Capacitación',
        'REUNION': 'Reunión',
        'PERMISO': 'Permiso',
        'OTRO': 'Otro'
      };

      const subTipoMap = {
        'Cliente': 'V_clientes',
        'Proveedor': 'V_proveedores',
        'Interna': 'C_interna',
        'Externa': 'C_externa',
        'Médico': 'P_medico',
        'Personal': 'P_personal',
        'Familiar': 'P_familiar'
      };

      const tipo = tipoMap[formData.estado] || formData.estado;
      const subTipo = subTipoMap[formData.subEstado] || formData.subEstado;

      if (formData.empleadosSeleccionados.length === 1) {
        // Pausa individual (Visita)
        const empleado = empleados.find(e => e.ci === formData.empleadosSeleccionados[0]);
        const pausaData = {
          firma: empleado?.ci || formData.empleadosSeleccionados[0],
          tipo: tipo,
          sub_tipo: subTipo,
          observacion: formData.observacion
        };
        
        await pausaService.registrarVisita(pausaData);
      } else {
        // Pausas grupales (Capacitación - Activas)
        const pausaData = {
          listaCedulas: formData.empleadosSeleccionados,
          tipo: tipo,
          sub_tipo: subTipo,
          observacion: formData.observacion,
          fecha: formData.fecha,
          hora_inicio: formData.horaInicio,
          hora_fin: formData.horaFin
        };
        
        await pausaService.registrarActivas(pausaData);
      }
      
      alert('Pausa(s) registrada(s) correctamente');
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert('Error al registrar pausa: ' + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      estado: '<<Selecciona>>',
      subEstado: '',
      empleadosSeleccionados: [],
      observacion: '',
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: '08:00',
      horaFin: '09:00'
    });
  };

  const handleNuevo = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const currentSubEstados = formData.estado !== '<<Selecciona>>' 
    ? subEstadoOptions[formData.estado] || [] 
    : [];

  return (
    <PageContainer title="Tiempos Fuera de Trabajo" onGoBack={onGoBack}>
      <div className="tiempos-fuera-container">
        {error && (
          <div className="error-message" style={{color: 'red', padding: '10px', marginBottom: '10px'}}>
            {error}
          </div>
        )}
        <div className="section-box">
          <div className="table-header">
            <h3 className="section-title">Pausas / Permisos / Reuniones</h3>
            <div className="table-actions">
              <div className="search-bar">
                <label>Buscar:</label>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                />
              </div>
              <button className="btn-nuevo" onClick={handleNuevo}>+ Nuevo</button>
            </div>
          </div>

          <div className="table-container-full">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Sub Tipo</th>
                  <th>Empleado</th>
                  <th>Fecha</th>
                  <th>Hora Inicio</th>
                  <th>Hora Fin</th>
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistros.length > 0 ? (
                  filteredRegistros.map((registro) => (
                    <tr key={registro.id}>
                      <td>{registro.id}</td>
                      <td>{registro.tipo}</td>
                      <td>{registro.subTipo}</td>
                      <td>{registro.empleado}</td>
                      <td>{registro.fecha}</td>
                      <td>{registro.horaInicio}</td>
                      <td>{registro.horaFin}</td>
                      <td>{registro.observacion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-message">No hay registros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para agregar nuevo registro */}
      {showModal && (
        <Modal title="Nueva Pausa / Permiso" onClose={handleCloseModal}>
          <div className="modal-form-container">
            <div className="modal-grid">
              <div className="modal-left">
                <div className="form-group-modal">
                  <label>Estado:</label>
                  <select 
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    {estadoOptions.map((estado, i) => (
                      <option key={i} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-modal">
                  <label>Sub estado:</label>
                  <select 
                    name="subEstado"
                    value={formData.subEstado}
                    onChange={handleInputChange}
                    disabled={currentSubEstados.length === 0}
                  >
                    <option value=""></option>
                    {currentSubEstados.map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="empleados-modal-section">
                  <label>Empleados:</label>
                  <div className="empleados-list-modal">
                    {loading ? (
                      <div style={{padding: '10px'}}>Cargando empleados...</div>
                    ) : empleados.length === 0 ? (
                      <div style={{padding: '10px'}}>No hay empleados disponibles</div>
                    ) : (
                      empleados.map((emp) => (
                        <div key={emp.ci} className="empleado-item">
                          <input 
                            type="checkbox"
                            id={`modal-emp-${emp.ci}`}
                            checked={formData.empleadosSeleccionados.includes(emp.ci)}
                            onChange={() => handleEmpleadoToggle(emp.ci)}
                          />
                          <label htmlFor={`modal-emp-${emp.ci}`}>
                            {emp.nombres} {emp.apellidos}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-right">
                <div className="form-group-modal">
                  <label>Fecha:</label>
                  <input 
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group-modal">
                  <label>Hora inicio:</label>
                  <select 
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleInputChange}
                  >
                    {horasOptions.map((hora, i) => (
                      <option key={i} value={hora}>{hora}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-modal">
                  <label>Hora fin:</label>
                  <select 
                    name="horaFin"
                    value={formData.horaFin}
                    onChange={handleInputChange}
                  >
                    {horasOptions.map((hora, i) => (
                      <option key={i} value={hora}>{hora}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-modal">
                  <label>Observación:</label>
                  <textarea 
                    name="observacion"
                    value={formData.observacion}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Ingrese observaciones..."
                  />
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="btn-action btn-guardar" onClick={handleGuardar}>Guardar</button>
              <button className="btn-action btn-cancelar" onClick={handleCloseModal}>Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}

export default TiemposFuera;
