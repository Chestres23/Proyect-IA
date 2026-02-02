import React, { useState, useEffect } from 'react';
import './Recesos.css';
import PageContainer from './PageContainer';
import Modal from './Modal';
import recesoService from '../services/recesoService';
import turnoService from '../services/turnoService';

const horasOptions = [
  '<<SELECCIONA>>', '08:30:00', '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00',
  '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00',
  '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00'
];

const tiempoRecesoOptions = [
  '<<SELECCIONA>>', '00:15:00', '00:30:00', '00:45:00', '01:00:00'
];

const tiposOptions = ['<<SELECCIONA>>', 'BREAK', 'ALMUERZO'];

function Recesos({ onGoBack }) {
  const [recesos, setRecesos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    turno: '',
    nombre: '',
    descripcion: '',
    tipo: '<<SELECCIONA>>',
    horaInicio: '<<SELECCIONA>>',
    tiempoReceso: '<<SELECCIONA>>',
    total: ''
  });

  // Cargar recesos y turnos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar turnos y recesos en paralelo
      const [turnosData, recesosData] = await Promise.all([
        turnoService.listar(),
        recesoService.listar()
      ]);
      
      setTurnos(turnosData);
      
      // Mapear los datos de la API al formato del componente
      const recesosFormateados = recesosData.map(receso => ({
        id: receso.id_b,
        horaI: receso.hora_inicio_b,
        duracion: receso.tiempo_receso_b,
        total: receso.total_b,
        nombre: receso.nombre_b,
        descripcion: receso.descripcion_b,
        turno: receso.id_t,
        tipo: receso.tipo_b
      }));
      
      setRecesos(recesosFormateados);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecesos = recesos.filter(r => 
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setFormData({
      turno: row.turno,
      nombre: row.nombre,
      descripcion: row.descripcion,
      tipo: row.tipo,
      horaInicio: row.horaI,
      tiempoReceso: row.duracion,
      total: row.total
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'tiempoReceso' && value !== '<<SELECCIONA>>') {
        newData.total = value;
      }
      
      return newData;
    });
  };

  const handleGuardar = async () => {
    if (formData.horaInicio === '<<SELECCIONA>>' || formData.tiempoReceso === '<<SELECCIONA>>' || !formData.nombre || formData.tipo === '<<SELECCIONA>>') {
      alert('Por favor complete los campos requeridos');
      return;
    }

    try {
      // Preparar datos para la API
      const recesoData = {
        ID_T: parseInt(formData.turno),
        HORA_INICIO_B: formData.horaInicio,
        TIEMPO_RECESO_B: formData.tiempoReceso,
        TOTAL_B: formData.total,
        NOMBRE_B: formData.nombre,
        DESCRIPCION_B: formData.descripcion,
        TIPO_B: formData.tipo
      };

      if (selectedRow) {
        // Actualizar receso existente
        await recesoService.actualizar(selectedRow.id, recesoData);
        alert('Receso actualizado correctamente');
      } else {
        // Crear nuevo receso
        await recesoService.crear(recesoData);
        alert('Receso creado correctamente');
      }
      
      // Recargar la lista de recesos
      await cargarDatos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert('Error al guardar receso: ' + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setSelectedRow(null);
    setFormData({
      turno: turnos.length > 0 ? turnos[0].id_t : '',
      nombre: '',
      descripcion: '',
      tipo: '<<SELECCIONA>>',
      horaInicio: '<<SELECCIONA>>',
      tiempoReceso: '<<SELECCIONA>>',
      total: ''
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

  // Obtener el nombre del turno por ID
  const getTurnoNombre = (turnoId) => {
    const turno = turnos.find(t => t.id_t === turnoId);
    return turno ? turno.nombre_t : 'N/A';
  };

  return (
    <PageContainer title="Recesos" onGoBack={onGoBack}>
      <div className="recesos-container">
        <div className="section-box">
          <div className="table-header">
            <h3 className="section-title">Breaks / Recesos</h3>
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
                  <th>HORA_I</th>
                  <th>DURACION</th>
                  <th>TOTAL</th>
                  <th>NOMBRE</th>
                  <th>DESCRIPCIÓN</th>
                  <th>TURNO</th>
                  <th>TIPO</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecesos.map((r) => (
                  <tr 
                    key={r.id} 
                    onClick={() => handleRowClick(r)}
                  >
                    <td>{r.id}</td>
                    <td>{r.horaI}</td>
                    <td>{r.duracion}</td>
                    <td>{r.total}</td>
                    <td>{r.nombre}</td>
                    <td>{r.descripcion}</td>
                    <td>{r.turno}</td>
                    <td>{r.tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar */}
      {showModal && (
        <Modal title={selectedRow ? "Editar Receso" : "Nuevo Receso"} onClose={handleCloseModal}>
          <div className="modal-form-container">
            <div className="form-grid-recesos">
              <div className="form-row-full">
                <div className="form-group">
                  <label>Turno:</label>
                  <select 
                    name="turno"
                    value={formData.turno}
                    onChange={handleInputChange}
                  >
                    {turnos.map((t) => (
                      <option key={t.id_t} value={t.id_t}>
                        {t.id_t}: {t.nombre_t} -- Desde:{t.hora_inicio_t} - Hasta:{t.hora_fin_t}
                      </option>
                    ))}
                  </select>
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

              <div className="form-left">
                <div className="form-group">
                  <label>Nombre receso:</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea 
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-right">
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
                  <label>Tiempo receso:</label>
                  <select 
                    name="tiempoReceso"
                    value={formData.tiempoReceso}
                    onChange={handleInputChange}
                  >
                    {tiempoRecesoOptions.map((tiempo, i) => (
                      <option key={i} value={tiempo}>{tiempo}</option>
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

export default Recesos;
