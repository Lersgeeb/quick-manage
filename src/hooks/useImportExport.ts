import { saveAs } from 'file-saver';
import { Board, Comment, Task } from '../types';

const escapeCsvValue = (value: string) => {
  const normalizedValue = value.replace(/\r\n/g, '\n');
  return `"${normalizedValue.replace(/"/g, '""')}"`;
};

const formatCsvDate = (dateValue: string) => {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toISOString().slice(0, 10);
};

const getLatestCommentsText = (comments: Comment[] = []) => {
  return comments
    .slice()
    .sort((firstComment, secondComment) => (
      new Date(secondComment.createdAt).getTime() - new Date(firstComment.createdAt).getTime()
    ))
    .slice(0, 3)
    .map((comment, index) => {
      const formattedComment = comment.text
        .trim()
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line, lineIndex) => (lineIndex === 0 ? line : `   ${line}`))
        .join('\n');

      return `${index + 1}. "${formattedComment}"`;
    })
    .filter(Boolean)
    .join('\n');
};

export const useImportExport = () => {
  const exportBoard = (board: Board) => {
    const boardData = JSON.stringify(board, null, 2);
    const blob = new Blob([boardData], { type: 'application/json' });
    saveAs(blob, `quickmanage-board-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const exportTasksCsv = (tasks: Task[], fileNamePrefix = 'quickmanage-tasks') => {
    const headers = [
      'Tag',
      'Name',
      'Reference',
      'Creation Date',
      'Last Modified Date',
      'Description',
      'Comments (last 3)'
    ];

    const rows = tasks.map(task => {
      const tag = task.tag || (task as any).client || '';
      const reference = task.reference || '';
      const latestComments = getLatestCommentsText(task.comments || []);

      return [
        tag,
        task.title,
        reference,
        formatCsvDate(task.createdAt),
        formatCsvDate(task.updatedAt),
        task.description || '',
        latestComments
      ].map(value => escapeCsvValue(String(value))).join(',');
    });

    const csvContent = `\uFEFF${[headers.map(escapeCsvValue).join(','), ...rows].join('\r\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    saveAs(blob, `${fileNamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`);
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
    exportTasksCsv,
    importBoard
  };
};
