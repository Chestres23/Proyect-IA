import React, { useState } from 'react';
import './ReportePausas.css';
import PageContainer from './PageContainer';

const empleadosOptions = [
  { value: 'todos', label: 'Todos' },
  { value: '1', label: 'AGUILAR FONTE ERIKA MABEL' },
  { value: '2', label: 'CASTILLO MERIZALDE GERMAN EMIL' },
  { value: '3', label: 'GALARZA GARCIA DAVID ESTEBAN' },
  { value: '4', label: 'HEREDIA LOPEZ EDSON ANDRES' },
];

const sampleData = [
  { tipo: 'PERMISO', subTipo: 'Médico', nombres: 'ERIKA', apellidos: 'AGUILAR', ci: '17257536', observacion: 'Cita médica', fecha: '2026-01-14', horaIni: '10:00:00', horaFin: '12:00:00', fechaE: '2026-01-13', usuario: 'admin' },
  { tipo: 'REUNION', subTipo: 'Cliente', nombres: 'GERMAN', apellidos: 'CASTILLO', ci: '17266433', observacion: 'Reunion proyecto', fecha: '2026-01-14', horaIni: '14:00:00', horaFin: '15:00:00', fechaE: '2026-01-12', usuario: 'admin' },
];

function ReportePausas({ onGoBack }) {
  const [filters, setFilters] = useState({
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    empleado: 'todos'
  });
  const [data, setData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultar = () => {
    setData(sampleData);
    setHasSearched(true);
  };

  const handleExportar = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    alert('Exportando datos...');
  };

  return (
    <PageContainer title="Reporte: Pausas / Visitas / Reuniones" onGoBack={onGoBack}>
      <div className="reporte-container">
        <div className="section-box">
          <h3 className="section-title">Filtros</h3>
          
          <div className="filters-grid">
            <div className="filters-left">
              <div className="form-group-inline">
                <label>Fecha inicio:</label>
                <input 
                  type="date"
                  name="fechaInicio"
                  value={filters.fechaInicio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group-inline">
                <label>Fecha fin:</label>
                <input 
                  type="date"
                  name="fechaFin"
                  value={filters.fechaFin}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group-inline">
                <label>Empleados:</label>
                <select 
                  name="empleado"
                  value={filters.empleado}
                  onChange={handleInputChange}
                >
                  {empleadosOptions.map((emp) => (
                    <option key={emp.value} value={emp.value}>{emp.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filters-right">
              <button className="btn-action-large" onClick={handleConsultar}>Consultar</button>
              <button className="btn-action-large" onClick={handleExportar}>Exportar</button>
            </div>
          </div>
        </div>

        <div className="table-container-large">
          <table className="data-table">
            <thead>
              <tr>
                <th>TIPO</th>
                <th>SUB_TIPO</th>
                <th>NOMBRES</th>
                <th>APELLIDOS</th>
                <th>CI</th>
                <th>OBSERVACION</th>
                <th>FECHA</th>
                <th>HORA_INI</th>
                <th>HORA_FIN</th>
                <th>FECHA_E</th>
                <th>USUARIO</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.tipo}</td>
                    <td>{row.subTipo}</td>
                    <td>{row.nombres}</td>
                    <td>{row.apellidos}</td>
                    <td>{row.ci}</td>
                    <td>{row.observacion}</td>
                    <td>{row.fecha}</td>
                    <td>{row.horaIni}</td>
                    <td>{row.horaFin}</td>
                    <td>{row.fechaE}</td>
                    <td>{row.usuario}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="empty-message">
                    {hasSearched ? 'No se encontraron resultados' : 'Presione Consultar para buscar'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}

export default ReportePausas;
