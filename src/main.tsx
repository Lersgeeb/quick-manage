import React from 'react';
import ReactDOM from 'react-dom/client';
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
      <h1>Error al cargar la aplicación</h1>
      <p>Por favor, revisa la consola para más detalles.</p>
    </div>
  `;
}
