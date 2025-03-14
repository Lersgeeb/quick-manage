import { saveAs } from 'file-saver';
import { Board } from '../types';

export const useImportExport = () => {
  const exportBoard = (board: Board) => {
    const boardData = JSON.stringify(board, null, 2);
    const blob = new Blob([boardData], { type: 'application/json' });
    saveAs(blob, `quickmanage-board-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const importBoard = (file: File): Promise<Board> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (!event.target?.result) {
            throw new Error('No data loaded');
          }
          
          const boardData = JSON.parse(event.target.result as string) as Board;
          
          if (!boardData || !boardData.columns) {
            throw new Error('Invalid board data');
          }
          
          resolve(boardData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  };

  return {
    exportBoard,
    importBoard
  };
};
