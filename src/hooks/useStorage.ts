import { useState, useEffect } from 'react';
import { Board } from '../types';

const STORAGE_KEY = 'quickmanage_board';

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

  return {
    saveBoard,
    loadBoard,
    clearBoard,
    isLoading,
    setIsLoading
  };
};
