import React from 'react';
import './Chronometer.css';

function Chronometer({ 
  breakTime, 
  almuerzoTime, 
  isBreakRunning, 
  isAlmuerzoRunning,
  onToggleBreak,
  onToggleAlmuerzo,
  onResetBreak,
  onResetAlmuerzo
}) {
  return (
    <div className="chronometer">
      <h2 className="section-title">Cronómetro</h2>
      
      <div className="chrono-item">
        <label>Break:</label>
        <div className="time-display">{breakTime}</div>
        <div className="chrono-buttons">
          <button 
            className={`btn-chrono ${isBreakRunning ? 'btn-stop' : 'btn-start'}`}
            onClick={onToggleBreak}
          >
            {isBreakRunning ? '⏸ Pausar' : '▶ Iniciar'}
          </button>
          <button 
            className="btn-chrono btn-reset"
            onClick={onResetBreak}
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>

      <div className="chrono-item">
        <label>Almuerzo:</label>
        <div className="time-display">{almuerzoTime}</div>
        <div className="chrono-buttons">
          <button 
            className={`btn-chrono ${isAlmuerzoRunning ? 'btn-stop' : 'btn-start'}`}
            onClick={onToggleAlmuerzo}
          >
            {isAlmuerzoRunning ? '⏸ Pausar' : '▶ Iniciar'}
          </button>
          <button 
            className="btn-chrono btn-reset"
            onClick={onResetAlmuerzo}
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chronometer;
