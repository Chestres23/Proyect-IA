import React from 'react';
import './PageContainer.css';

function PageContainer({ title, children, onGoBack }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={onGoBack}>
          ← Volver
        </button>
        <h2 className="page-title">{title}</h2>
      </div>
      <div className="page-body">
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
