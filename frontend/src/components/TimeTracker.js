import React, { useState, useEffect } from 'react';
import './TimeTracker.css';
import CompanyData from './CompanyData';
import Chronometer from './Chronometer';
import Signature from './Signature';

function TimeTracker() {
  const [employeeData, setEmployeeData] = useState(() => {
    const saved = localStorage.getItem('employeeData');
    return saved ? JSON.parse(saved) : {
      empleado: '',
      ingresoJornada: '',
      atrasoIngreso: '',
      salidaBreak: '',
      regresoBreak: '',
      atrasoBreak: '',
      salidaAlmuerzo: '',
      regresoAlmuerzo: '',
      atrasoAlmuerzo: '',
      salidaJornada: '',
      firma: ''
    };
  });

  const [breakTime, setBreakTime] = useState(0);
  const [almuerzoTime, setAlmuerzoTime] = useState(0);
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  const [isAlmuerzoRunning, setIsAlmuerzoRunning] = useState(false);

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('employeeData', JSON.stringify(employeeData));
  }, [employeeData]);

  // Cronómetro para Break
  useEffect(() => {
    let interval;
    if (isBreakRunning) {
      interval = setInterval(() => {
        setBreakTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakRunning]);

  // Cronómetro para Almuerzo
  useEffect(() => {
    let interval;
    if (isAlmuerzoRunning) {
      interval = setInterval(() => {
        setAlmuerzoTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAlmuerzoRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleBreak = () => {
    setIsBreakRunning(!isBreakRunning);
  };

  const handleToggleAlmuerzo = () => {
    setIsAlmuerzoRunning(!isAlmuerzoRunning);
  };

  const handleResetBreak = () => {
    setBreakTime(0);
    setIsBreakRunning(false);
  };

  const handleResetAlmuerzo = () => {
    setAlmuerzoTime(0);
    setIsAlmuerzoRunning(false);
  };

  const handleSave = () => {
    if (!employeeData.empleado) {
      alert('Por favor ingresa el nombre del empleado');
      return;
    }
    alert('Datos guardados correctamente');
    console.log('Datos guardados:', employeeData);
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
      setEmployeeData({
        empleado: '',
        ingresoJornada: '',
        atrasoIngreso: '',
        salidaBreak: '',
        regresoBreak: '',
        atrasoBreak: '',
        salidaAlmuerzo: '',
        regresoAlmuerzo: '',
        atrasoAlmuerzo: '',
        salidaJornada: '',
        firma: ''
      });
      setBreakTime(0);
      setAlmuerzoTime(0);
      setIsBreakRunning(false);
      setIsAlmuerzoRunning(false);
      localStorage.removeItem('employeeData');
    }
  };

  return (
    <div className="time-tracker-container">
      <div className="time-tracker-header">
        <h1>Inicio</h1>
      </div>
      
      <div className="time-tracker-content">
        <div className="left-section">
          <CompanyData 
            data={employeeData} 
            onChange={handleInputChange}
          />
        </div>

        <div className="right-section">
          <Chronometer 
            breakTime={formatTime(breakTime)}
            almuerzoTime={formatTime(almuerzoTime)}
            isBreakRunning={isBreakRunning}
            isAlmuerzoRunning={isAlmuerzoRunning}
            onToggleBreak={handleToggleBreak}
            onToggleAlmuerzo={handleToggleAlmuerzo}
            onResetBreak={handleResetBreak}
            onResetAlmuerzo={handleResetAlmuerzo}
          />
          <Signature 
            firma={employeeData.firma}
            onChange={(value) => setEmployeeData(prev => ({
              ...prev,
              firma: value
            }))}
          />
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleSave}>
              Guardar
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeTracker;
