import { saveAs } from 'file-saver';
import { Board, Comment, Task, getTaskPriorityOption } from '../types';

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

const formatDateTime = (dateValue: string) => {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const normalizeMultilineText = (value: string) => {
  return value.trim().replace(/\r\n/g, '\n');
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

const getLatestCommentText = (comments: Comment[] = []) => {
  return comments
    .slice()
    .sort((firstComment, secondComment) => (
      new Date(secondComment.createdAt).getTime() - new Date(firstComment.createdAt).getTime()
    ))[0]?.text || '';
};

const getTasksExportData = (board: Board, tasks: Task[]) => {
  const columnTitlesById = new Map(board.columns.map(column => [column.id, column.title]));

  return tasks.map(task => {
    const priority = getTaskPriorityOption(task.priority);

    return {
      status: columnTitlesById.get(task.columnId) || '',
      tag: task.tag || (task as Task & { client?: string }).client || '',
      priorityLabel: priority.label,
      priorityColor: priority.color,
      name: task.title,
      reference: task.reference || '',
      nextStep: task.nextStep || '',
      createdAtRaw: task.createdAt,
      updatedAtRaw: task.updatedAt,
      createdAt: formatDateTime(task.createdAt),
      updatedAt: formatDateTime(task.updatedAt),
      description: task.description || '',
      lastComment: normalizeMultilineText(getLatestCommentText(task.comments || [])),
      latestComments: getLatestCommentsText(task.comments || [])
    };
  });
};

const hexToArgb = (hexColor: string) => {
  const normalizedColor = hexColor.replace('#', '');
  return `FF${normalizedColor.toUpperCase()}`;
};

const getExcelColumnLetter = (columnNumber: number) => {
  let dividend = columnNumber;
  let columnName = '';

  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
};

export const useImportExport = () => {
  const exportBoard = (board: Board) => {
    const boardData = JSON.stringify(board, null, 2);
    const blob = new Blob([boardData], { type: 'application/json' });
    saveAs(blob, `quickmanage-board-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const exportTasksCsv = (board: Board, tasks: Task[], fileNamePrefix = 'quickmanage-tasks') => {
    const headers = [
      'Status',
      'Tag',
      'Priority',
      'Name',
      'Reference',
      'Next Step',
      'Creation Date',
      'Last Modified Date',
      'Description',
      'Comments (last 3)'
    ];

    const rows = getTasksExportData(board, tasks).map(task => {
      return [
        task.status,
        task.tag,
        task.priorityLabel,
        task.name,
        task.reference,
        task.nextStep,
        formatCsvDate(task.createdAtRaw),
        formatCsvDate(task.updatedAtRaw),
        task.description,
        task.latestComments
      ].map(value => escapeCsvValue(String(value))).join(',');
    });

    const csvContent = `\uFEFF${[headers.map(escapeCsvValue).join(','), ...rows].join('\r\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    saveAs(blob, `${fileNamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const exportTasksExcel = async (board: Board, tasks: Task[], fileNamePrefix = 'quickmanage-tasks') => {
    const { Workbook } = await import('exceljs');
    const workbook = new Workbook();
    workbook.creator = 'QuickManage';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet('Tasks', {
      views: [{ state: 'frozen', ySplit: 1 }]
    });

    worksheet.columns = [
      { header: 'Status', key: 'status', width: 22 },
      { header: 'Tag', key: 'tag', width: 20 },
      { header: 'Priority', key: 'priorityLabel', width: 14 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Reference', key: 'reference', width: 18 },
      { header: 'Next Step', key: 'nextStep', width: 36 },
      { header: 'Creation Date', key: 'createdAt', width: 20 },
      { header: 'Last Modified Date', key: 'updatedAt', width: 20 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Last Comment', key: 'lastComment', width: 42 },
      { header: 'Comments (last 3)', key: 'latestComments', width: 48 }
    ];

    const exportRows = getTasksExportData(board, tasks);
    exportRows.forEach(row => {
      worksheet.addRow(row);
    });

    const lastColumnLetter = getExcelColumnLetter(worksheet.columns.length);
    worksheet.autoFilter = {
      from: 'A1',
      to: `${lastColumnLetter}1`
    };

    const headerRow = worksheet.getRow(1);
    headerRow.height = 24;
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1D4ED8' }
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      row.height = 22;

      row.eachCell(cell => {
        cell.alignment = {
          vertical: 'top',
          horizontal: 'left',
          wrapText: true
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };

        if (rowNumber % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' }
          };
        }
      });
    });

    exportRows.forEach((task, index) => {
      const rowNumber = index + 2;
      const priorityCell = worksheet.getCell(`C${rowNumber}`);
      priorityCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: hexToArgb(task.priorityColor) }
      };
      priorityCell.font = { bold: true, color: { argb: 'FF111827' } };
      priorityCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob(
      [buffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    saveAs(blob, `${fileNamePrefix}-${new Date().toISOString().slice(0, 10)}.xlsx`);
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
    exportTasksExcel,
    importBoard
  };
};
