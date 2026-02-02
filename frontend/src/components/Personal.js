import React, { useState, useEffect } from 'react';
import './Personal.css';
import PageContainer from './PageContainer';
import Modal from './Modal';
import empleadoService from '../services/empleadoService';

function Personal({ onGoBack }) {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    ci: '',
    direccion: '',
    telefonos: '',
    correo: '',
    fecha_na: ''
  });

  // Cargar empleados al montar el componente
  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      const empleados = await empleadoService.listar();
      setPersonal(empleados);
    } catch (err) {
      setError('Error al cargar empleados: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Proteger ante respuestas inesperadas (evita personal.filter is not a function)
  const filteredPersonal = Array.isArray(personal) ? personal.filter(p => 
    p.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ci?.includes(searchTerm)
  ) : [];

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setFormData({
      nombres: row.nombres || '',
      apellidos: row.apellidos || '',
      ci: row.ci || '',
      direccion: row.direccion || '',
      telefonos: row.telefonos || '',
      correo: row.correo || '',
      fecha_na: row.fecha_na || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!formData.nombres || !formData.apellidos || !formData.ci) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      
      if (selectedRow) {
        // Actualizar empleado existente
        await empleadoService.actualizar(selectedRow.ci, formData);
        alert('Empleado actualizado correctamente');
      } else {
        // Crear nuevo empleado
        const nuevoEmpleado = {
          ...formData,
          id_a: 1,  // Area por defecto
          id_t: 1,  // Turno por defecto
          id_b: 1,  // Break por defecto
          salario: 0
        };
        await empleadoService.crear(nuevoEmpleado);
        alert('Empleado creado correctamente');
      }
      
      // Recargar la lista de empleados
      await cargarEmpleados();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedRow(null);
    setFormData({
      nombres: '',
      apellidos: '',
      ci: '',
      direccion: '',
      telefonos: '',
      correo: '',
      fecha_na: ''
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
    <PageContainer title="Personal" onGoBack={onGoBack}>
      <div className="personal-container">
        <div className="section-box">
          <div className="table-header">
            <h3 className="section-title">Personal</h3>
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

          {loading && <p style={{textAlign: 'center', padding: '20px'}}>Cargando...</p>}
          {error && <p style={{color: 'red', textAlign: 'center', padding: '20px'}}>{error}</p>}

          <div className="table-container-full">
            <table className="data-table">
              <thead>
                <tr>
                  <th>CI</th>
                  <th>Area</th>
                  <th>Turno</th>
                  <th>Break</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Direccion</th>
                  <th>Telefonos</th>
                  <th>Correo</th>
                  <th>FechaNa</th>
                  <th>Salario</th>
                </tr>
              </thead>
              <tbody>
                {filteredPersonal.map((p, index) => (
                  <tr 
                    key={index} 
                    onClick={() => handleRowClick(p)}
                  >
                    <td>{p.ci}</td>
                    <td>{p.id_a}</td>
                    <td>{p.id_t}</td>
                    <td>{p.id_b}</td>
                    <td>{p.nombres}</td>
                    <td>{p.apellidos}</td>
                    <td>{p.direccion}</td>
                    <td>{p.telefonos}</td>
                    <td>{p.correo}</td>
                    <td>{p.fecha_na}</td>
                    <td>{p.salario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title={selectedRow ? "Editar Personal" : "Nuevo Personal"} onClose={handleCloseModal}>
          <div className="modal-form-container">
            <div className="form-grid">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombres:</label>
                  <input 
                    type="text" 
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Telefonos:</label>
                  <input 
                    type="text" 
                    name="telefonos"
                    value={formData.telefonos}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Apellidos:</label>
                  <input 
                    type="text" 
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Correo:</label>
                  <input 
                    type="email" 
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Doc. de identificacion:</label>
                  <input 
                    type="text" 
                    name="ci"
                    value={formData.ci}
                    onChange={handleInputChange}
                    disabled={selectedRow !== null}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de nacimiento:</label>
                  <input 
                    type="date" 
                    name="fecha_na"
                    value={formData.fecha_na}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row full-width">
                <div className="form-group">
                  <label>Dirección:</label>
                  <textarea 
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    rows="3"
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

export default Personal;
