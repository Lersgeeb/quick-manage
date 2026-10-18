import React from 'react';
import ReactDOM from 'react-dom/client';
import { translate } from './i18n';
import App from './App';
import './index.css';

// Añadir un try-catch para detectar errores
try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  );
} catch (error) {
  console.error("Error al renderizar la aplicación:", error);
  // Mostrar un mensaje de error en la página
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>${translate('en', 'main.renderErrorTitle')}</h1>
      <p>${translate('en', 'main.renderErrorText')}</p>
    </div>
  `;
}
