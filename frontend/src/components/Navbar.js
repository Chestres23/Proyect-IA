import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ onNavigate, currentPage }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleItemClick = (page) => {
    onNavigate(page);
    setActiveMenu(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-menu">
        <div className="nav-item">
          <button 
            className={`nav-button ${activeMenu === 'ingresar' ? 'active' : ''}`}
            onClick={() => handleMenuClick('ingresar')}
          >
            Ingresar
          </button>
          {activeMenu === 'ingresar' && (
            <div className="dropdown-menu">
              <button onClick={() => handleItemClick('personal')}>Personal</button>
              <button onClick={() => handleItemClick('turnos')}>Turnos</button>
              <button onClick={() => handleItemClick('recesos')}>Recesos</button>
              <button onClick={() => handleItemClick('tiempos')}>Tiempos fuera de trabajo</button>
            </div>
          )}
        </div>

        <div className="nav-item">
          <button 
            className={`nav-button ${activeMenu === 'reportes' ? 'active' : ''}`}
            onClick={() => handleMenuClick('reportes')}
          >
            Reportes
          </button>
          {activeMenu === 'reportes' && (
            <div className="dropdown-menu">
              <button onClick={() => handleItemClick('reporte-jornada')}>Jornada total</button>
              <button onClick={() => handleItemClick('reporte-pausas')}>Pausas / Visitas / Reuniones</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
