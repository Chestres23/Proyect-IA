import React, { useState, useEffect } from 'react';
import './Turnos.css';
import PageContainer from './PageContainer';
import Modal from './Modal';
import turnoService from '../services/turnoService';

const horasOptions = [
  '<<SELECCIONA>>', '06:00:00', '06:30:00', '07:00:00', '07:30:00', '08:00:00', '08:30:00',
  '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00',
  '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00',
  '16:00:00', '16:30:00', '17:00:00', '17:30:00', '18:00:00', '18:30:00', '19:00:00',
  '19:30:00', '20:00:00', '20:30:00', '21:00:00', '21:30:00', '22:00:00'
];

const tiposOptions = ['<<SELECCIONA>>', 'NORMAL', 'ESPECIAL', 'NOCTURNO'];

function Turnos({ onGoBack }) {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    horaInicio: '<<SELECCIONA>>',
    horaFin: '<<SELECCIONA>>',
    total: '',
    nombre: '',
    descripcion: '',
    tipo: '<<SELECCIONA>>'
  });

  // Cargar turnos al montar el componente
  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await turnoService.listar();
      
      // Mapear los datos de la API al formato del componente
      const turnosFormateados = data.map(turno => ({
        id: turno.id_t,
        horaInicio: turno.hora_inicio_t,
        horaFin: turno.hora_fin_t,
        total: turno.total_t || calculateTotal(turno.hora_inicio_t, turno.hora_fin_t),
        nombre: turno.nombre_t,
        descripcion: turno.descripcion_t,
        tipo: turno.tipo_t || 'NORMAL'
      }));
      
      setTurnos(turnosFormateados);
    } catch (err) {
      setError('Error al cargar turnos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTurnos = turnos.filter(t => 
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotal = (inicio, fin) => {
    if (inicio === '<<SELECCIONA>>' || fin === '<<SELECCIONA>>') return '';
    
    const [h1, m1] = inicio.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    
    let totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setFormData({
      horaInicio: row.horaInicio,
      horaFin: row.horaFin,
      total: row.total,
      nombre: row.nombre,
      descripcion: row.descripcion,
      tipo: row.tipo
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'horaInicio' || name === 'horaFin') {
        newData.total = calculateTotal(
          name === 'horaInicio' ? value : prev.horaInicio,
          name === 'horaFin' ? value : prev.horaFin
        );
      }
      
      return newData;
    });
  };

  const handleGuardar = async () => {
    if (formData.horaInicio === '<<SELECCIONA>>' || formData.horaFin === '<<SELECCIONA>>' || !formData.nombre) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    try {
      // Preparar datos para la API (en el formato que espera la API externa)
      const turnoData = {
        HORA_INICIO_T: formData.horaInicio,
        HORA_FIN_T: formData.horaFin,
        NOMBRE_T: formData.nombre,
        DESCRIPCION_T: formData.descripcion,
        TIPO_T: formData.tipo === '<<SELECCIONA>>' ? 'NORMAL' : formData.tipo
      };

      if (selectedRow) {
        // Actualizar turno existente
        await turnoService.actualizar(selectedRow.id, turnoData);
        alert('Turno actualizado correctamente');
      } else {
        // Crear nuevo turno
        await turnoService.crear(turnoData);
        alert('Turno creado correctamente');
      }
      
      // Recargar la lista de turnos
      await cargarTurnos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert('Error al guardar turno: ' + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setSelectedRow(null);
    setFormData({
      horaInicio: '<<SELECCIONA>>',
      horaFin: '<<SELECCIONA>>',
      total: '',
      nombre: '',
      descripcion: '',
      tipo: '<<SELECCIONA>>'
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

  return (
    <PageContainer title="Turnos" onGoBack={onGoBack}>
      <div className="turnos-container">
        {error && (
          <div className="error-message" style={{color: 'red', padding: '10px', marginBottom: '10px'}}>
            {error}
          </div>
        )}
        
        <div className="section-box">
          <div className="table-header">
            <h3 className="section-title">Turnos</h3>
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
            {loading ? (
              <div style={{padding: '20px', textAlign: 'center'}}>Cargando turnos...</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Hora inicio</th>
                    <th>Hora fin</th>
                    <th>Total</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTurnos.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                        No hay turnos registrados
                      </td>
                    </tr>
                  ) : (
                    filteredTurnos.map((t) => (
                      <tr 
                        key={t.id} 
                        onClick={() => handleRowClick(t)}
                      >
                        <td>{t.id}</td>
                        <td>{t.horaInicio}</td>
                        <td>{t.horaFin}</td>
                        <td>{t.total}</td>
                        <td>{t.nombre}</td>
                        <td>{t.descripcion}</td>
                        <td>{t.tipo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar */}
      {showModal && (
        <Modal title={selectedRow ? "Editar Turno" : "Nuevo Turno"} onClose={handleCloseModal}>
          <div className="modal-form-container">
            <div className="form-grid-turnos">
              <div className="form-left">
                <div className="form-group">
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

                <div className="form-group">
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

                <div className="form-group">
                  <label>Total:</label>
                  <input 
                    type="text" 
                    name="total"
                    value={formData.total}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Nombre turno:</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-right">
                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea 
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="5"
                  />
                </div>

                <div className="form-group">
                  <label>Tipo:</label>
                  <select 
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                  >
                    {tiposOptions.map((tipo, i) => (
                      <option key={i} value={tipo}>{tipo}</option>
                    ))}
                  </select>
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

export default Turnos;
