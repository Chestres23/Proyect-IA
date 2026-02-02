import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Personal from './components/Personal';
import Turnos from './components/Turnos';
import Recesos from './components/Recesos';
import TiemposFuera from './components/TiemposFuera';
import ReporteJornada from './components/ReporteJornada';
import ReportePausas from './components/ReportePausas';

function App() {
  const [currentPage, setCurrentPage] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleGoBack = () => {
    setCurrentPage(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'personal':
        return <Personal onGoBack={handleGoBack} />;
      case 'turnos':
        return <Turnos onGoBack={handleGoBack} />;
      case 'recesos':
        return <Recesos onGoBack={handleGoBack} />;
      case 'tiempos':
        return <TiemposFuera onGoBack={handleGoBack} />;
      case 'reporte-jornada':
        return <ReporteJornada onGoBack={handleGoBack} />;
      case 'reporte-pausas':
        return <ReportePausas onGoBack={handleGoBack} />;
      default:
        return <Welcome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      <div className="main-content">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
