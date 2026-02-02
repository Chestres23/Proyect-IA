import React from 'react';
import './Modal.css';

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-icon">▼</div>
          <h2 className="modal-title">{title}</h2>
          <div className="modal-controls">
            <button className="modal-btn minimize" onClick={() => {}}>−</button>
            <button className="modal-btn maximize" onClick={() => {}}>□</button>
            <button className="modal-btn close" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
