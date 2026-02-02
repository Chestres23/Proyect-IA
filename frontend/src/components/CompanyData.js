import React from 'react';
import './CompanyData.css';

function CompanyData({ data, onChange }) {
  return (
    <div className="company-data">
      <h2 className="section-title">Datos de tu firma</h2>
      
      <div className="form-group">
        <label htmlFor="empleado">Empleado:</label>
        <input
          type="text"
          id="empleado"
          name="empleado"
          value={data.empleado}
          onChange={onChange}
          placeholder="Nombre completo"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ingresoJornada">Ingreso de tu jornada:</label>
          <input
            type="time"
            id="ingresoJornada"
            name="ingresoJornada"
            value={data.ingresoJornada}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="atrasoIngreso">Atraso:</label>
          <input
            type="time"
            id="atrasoIngreso"
            name="atrasoIngreso"
            value={data.atrasoIngreso}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="salidaBreak">Salida al break:</label>
        <input
          type="time"
          id="salidaBreak"
          name="salidaBreak"
          value={data.salidaBreak}
          onChange={onChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="regresoBreak">Regreso del break:</label>
          <input
            type="time"
            id="regresoBreak"
            name="regresoBreak"
            value={data.regresoBreak}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="atrasoBreak">Atraso:</label>
          <input
            type="time"
            id="atrasoBreak"
            name="atrasoBreak"
            value={data.atrasoBreak}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="salidaAlmuerzo">Salida al almuerzo:</label>
        <input
          type="time"
          id="salidaAlmuerzo"
          name="salidaAlmuerzo"
          value={data.salidaAlmuerzo}
          onChange={onChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="regresoAlmuerzo">Regreso del almuerzo:</label>
          <input
            type="time"
            id="regresoAlmuerzo"
            name="regresoAlmuerzo"
            value={data.regresoAlmuerzo}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="atrasoAlmuerzo">Atraso:</label>
          <input
            type="time"
            id="atrasoAlmuerzo"
            name="atrasoAlmuerzo"
            value={data.atrasoAlmuerzo}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="salidaJornada">Salida de tu jornada:</label>
        <input
          type="time"
          id="salidaJornada"
          name="salidaJornada"
          value={data.salidaJornada}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default CompanyData;
