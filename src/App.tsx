import React from 'react';
import { Board } from './components/Board';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Board />
      </div>
    </ThemeProvider>
  );
}

export default App;
