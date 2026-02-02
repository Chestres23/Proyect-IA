import React from 'react';
import './Signature.css';

function Signature({ firma, onChange }) {
  return (
    <div className="signature">
      <h2 className="section-title">Firma</h2>
      
      <div className="form-group">
        <label htmlFor="firma">Ingresa tu firma:</label>
        <input
          type="text"
          id="firma"
          value={firma}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu firma"
        />
      </div>
    </div>
  );
}

export default Signature;
