import React, { useState, useEffect } from 'react';
import './Welcome.css';

function Welcome({ onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Buenos días');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }
  }, [currentTime]);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <h1 className="welcome-greeting">{greeting}</h1>
        <h2 className="welcome-title">Sistema de Gestión de Tiempo</h2>
        
        <div className="welcome-clock">
          <div className="clock-time">{formatTime(currentTime)}</div>
          <div className="clock-date">{formatDate(currentTime)}</div>
        </div>

        <div className="welcome-divider"></div>

        <p className="welcome-message">
          Bienvenido al sistema de control de asistencia y gestión de personal.
          Utilice el menú superior para acceder a las diferentes opciones.
        </p>

        <div className="quick-access">
          <h3>Acceso Rápido</h3>
          <div className="quick-buttons">
            <div className="quick-item" onClick={() => onNavigate && onNavigate('personal')}>
              <div className="quick-icon">👥</div>
              <span>Personal</span>
            </div>
            <div className="quick-item" onClick={() => onNavigate && onNavigate('turnos')}>
              <div className="quick-icon">🕐</div>
              <span>Turnos</span>
            </div>
            <div className="quick-item" onClick={() => onNavigate && onNavigate('recesos')}>
              <div className="quick-icon">☕</div>
              <span>Recesos</span>
            </div>
            <div className="quick-item" onClick={() => onNavigate && onNavigate('reporte-jornada')}>
              <div className="quick-icon">📊</div>
              <span>Reportes</span>
            </div>
          </div>
        </div>

        <div className="welcome-footer">
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">24</div>
              <div className="stat-label">Empleados Activos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">Turnos Configurados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">18</div>
              <div className="stat-label">Presentes Hoy</div>
            </div>
          </div>
        </div>
      </div>

      <div className="welcome-tips">
        <div className="tip-card">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <strong>Consejo del día:</strong>
            <p>Recuerde registrar su ingreso y salida para mantener un control preciso de su jornada laboral.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
