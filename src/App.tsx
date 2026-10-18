import React from 'react';
import { Board } from './components/Board';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="App h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Board />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
