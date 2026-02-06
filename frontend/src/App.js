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
import FaceGate from './components/FaceGate';
import ChatBotWidget from './components/ChatBotWidget';

function App() {
  const [currentPage, setCurrentPage] = useState(null);
  const [faceVerified, setFaceVerified] = useState(false);

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

  if (!faceVerified) {
    return <FaceGate onVerified={() => setFaceVerified(true)} />;
  }

  return (
    <div className="App">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      <div className="main-content">
        {renderPage()}
      </div>

      <ChatBotWidget />
    </div>
  );
}

export default App;
