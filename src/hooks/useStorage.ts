import { useState, useEffect } from 'react';
import { Board, BoardViewMode } from '../types';

const STORAGE_KEY = 'quickmanage_board';
const VIEW_MODE_KEY = 'quickmanage_view_mode';

export const useStorage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const saveBoard = (board: Board): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  };

  const loadBoard = (): Board | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as Board;
    } catch (error) {
      console.error('Error parsing board data', error);
      return null;
    }
  };

  const clearBoard = (): void => {
    localStorage.removeItem(STORAGE_KEY);
  };

  // Métodos para el modo de visualización
  const saveViewMode = (mode: BoardViewMode): void => {
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const loadViewMode = (): BoardViewMode => {
    const mode = localStorage.getItem(VIEW_MODE_KEY) as BoardViewMode;
    return mode || 'normal';
  };

  return {
    saveBoard,
    loadBoard,
    clearBoard,
    saveViewMode,
    loadViewMode,
    isLoading,
    setIsLoading
  };
};
