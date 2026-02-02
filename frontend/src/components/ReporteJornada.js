import React, { useState } from 'react';
import './ReporteJornada.css';
import PageContainer from './PageContainer';

const empleadosOptions = [
  { value: 'todos', label: 'Todos' },
  { value: '1', label: 'AGUILAR FONTE ERIKA MABEL' },
  { value: '2', label: 'CASTILLO MERIZALDE GERMAN EMIL' },
  { value: '3', label: 'GALARZA GARCIA DAVID ESTEBAN' },
  { value: '4', label: 'HEREDIA LOPEZ EDSON ANDRES' },
];

const sampleData = [
  { ci: '17257536', fecha: '2026-01-14', nombres: 'ERIKA', apellidos: 'AGUILAR', ingreso: '08:30:00', salida: '17:30:00', inicioBreak: '10:30:00', regresoBreak: '10:45:00', inicioAlm: '12:30:00', regresoAlm: '13:30:00', atrasoBreak: '00:00:00', atrasoAlm: '00:00:00', almuerzo: '01:00:00', observacion: '' },
  { ci: '17266433', fecha: '2026-01-14', nombres: 'GERMAN', apellidos: 'CASTILLO', ingreso: '09:00:00', salida: '18:00:00', inicioBreak: '11:00:00', regresoBreak: '11:15:00', inicioAlm: '13:00:00', regresoAlm: '14:00:00', atrasoBreak: '00:00:00', atrasoAlm: '00:00:00', almuerzo: '01:00:00', observacion: '' },
];

function ReporteJornada({ onGoBack }) {
  const [filters, setFilters] = useState({
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    empleado: 'todos'
  });
  const [data, setData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultar = () => {
    // Simular consulta
    setData(sampleData);
    setHasSearched(true);
  };

  const handleExportar = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    alert('Exportando datos...');
    // Aquí iría la lógica de exportación
  };

  return (
    <PageContainer title="Reporte: Jornada total" onGoBack={onGoBack}>
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
                <th>CI</th>
                <th>FECHA</th>
                <th>NOMBRES</th>
                <th>APELLIDOS</th>
                <th>INGRESO</th>
                <th>SALIDA</th>
                <th>INICIO BREAK</th>
                <th>REGRESO BREAK</th>
                <th>INICIO ALM</th>
                <th>REGRESO ALM</th>
                <th>ATRASO BREAK</th>
                <th>ATRASO ALM</th>
                <th>ALMUERZO</th>
                <th>OBSERVACION</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.ci}</td>
                    <td>{row.fecha}</td>
                    <td>{row.nombres}</td>
                    <td>{row.apellidos}</td>
                    <td>{row.ingreso}</td>
                    <td>{row.salida}</td>
                    <td>{row.inicioBreak}</td>
                    <td>{row.regresoBreak}</td>
                    <td>{row.inicioAlm}</td>
                    <td>{row.regresoAlm}</td>
                    <td>{row.atrasoBreak}</td>
                    <td>{row.atrasoAlm}</td>
                    <td>{row.almuerzo}</td>
                    <td>{row.observacion}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="empty-message">
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

export default ReporteJornada;
