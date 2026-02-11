import React, { useEffect, useState } from 'react';
import './ReportePausas.css';
import PageContainer from './PageContainer';
import empleadoService from '../services/empleadoService';

const PAUSAS_API_URL = process.env.REACT_APP_PAUSAS_VISITAS_API_URL || 'http://localhost:5173/api';

function toCsvValue(value) {
  const safe = value === null || value === undefined ? '' : String(value);
  const escaped = safe.replace(/"/g, '""');
  return `"${escaped}"`;
}

function downloadCsv({ rows, columns, filename }) {
  const header = columns.map((col) => col.label).map(toCsvValue).join(',');
  const lines = rows.map((row) =>
    columns.map((col) => toCsvValue(row[col.key])).join(',')
  );
  const csv = [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDateOnly(value) {
  if (!value) return '';
  const raw = String(value);
  return raw.includes('T') ? raw.split('T')[0] : raw;
}

function ReportePausas({ onGoBack }) {
  const [filters, setFilters] = useState({
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    empleado: 'todos'
  });
  const [data, setData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const lista = await empleadoService.listar();
        setEmpleados(Array.isArray(lista) ? lista : []);
      } catch (error) {
        console.error('Error cargando empleados:', error);
        setEmpleados([]);
      }
    };

    cargarEmpleados();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultar = async () => {
    const params = new URLSearchParams({
      fechaInicio: filters.fechaInicio,
      fechaFin: filters.fechaFin,
    });

    if (filters.empleado !== 'todos') {
      params.append('ci', filters.empleado);
    }

    try {
      setErrorMessage('');
      const response = await fetch(`${PAUSAS_API_URL}/reportes/pausas?${params.toString()}`);
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        const message = payload?.message || 'Error al consultar el reporte';
        throw new Error(message);
      }

      setData(Array.isArray(payload.data) ? payload.data : []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error consultando reporte:', error);
      setData([]);
      setHasSearched(true);
      setErrorMessage('No se pudo consultar el reporte. Intenta nuevamente.');
    }
  };

  const handleExportar = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    const columns = [
      { key: 'tipo', label: 'TIPO' },
      { key: 'sub_tipo', label: 'SUB_TIPO' },
      { key: 'nombres', label: 'NOMBRES' },
      { key: 'apellidos', label: 'APELLIDOS' },
      { key: 'ci', label: 'CI' },
      { key: 'observacion', label: 'OBSERVACION' },
      { key: 'fecha', label: 'FECHA' },
      { key: 'hora_ini', label: 'HORA_INI' },
      { key: 'hora_fin', label: 'HORA_FIN' },
      { key: 'fecha_e', label: 'FECHA_E' },
      { key: 'usuario', label: 'USUARIO' },
    ];
    const filename = `reporte_pausas_${filters.fechaInicio}_${filters.fechaFin}.csv`;
    const exportRows = data.map((row) => ({
      ...row,
      fecha: formatDateOnly(row.fecha),
      fecha_e: formatDateOnly(row.fecha_e),
    }));
    downloadCsv({ rows: exportRows, columns, filename });
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
                  <option value="todos">Todos</option>
                  {empleados.map((emp) => (
                    <option key={emp.ci} value={emp.ci}>
                      {`${emp.apellidos} ${emp.nombres}`}
                    </option>
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
                    <td>{formatDateOnly(row.fecha)}</td>
                    <td>{row.hora_ini}</td>
                    <td>{row.hora_fin}</td>
                    <td>{formatDateOnly(row.fecha_e)}</td>
                    <td>{row.usuario}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="empty-message">
                    {errorMessage
                      ? errorMessage
                      : hasSearched
                        ? 'No hay registros para el rango seleccionado'
                        : 'Presione Consultar para buscar'}
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
