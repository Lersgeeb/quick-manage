import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Board, Column, Task } from '../types';
import { useStorage } from './useStorage';

export const useBoard = () => {
  const [board, setBoard] = useState<Board>({ columns: [] });
  const { saveBoard, loadBoard, isLoading, setIsLoading } = useStorage();

  useEffect(() => {
    const loadedBoard = loadBoard();
    if (loadedBoard) {
      setBoard(loadedBoard);
    } else {
      // Initialize with default columns if no saved data
      const defaultColumns: Column[] = [
        { id: uuidv4(), title: 'Por hacer', tasks: [], order: 0 },
        { id: uuidv4(), title: 'En progreso', tasks: [], order: 1 },
        { id: uuidv4(), title: 'Completado', tasks: [], order: 2 },
      ];
      setBoard({ columns: defaultColumns });
    }
    setIsLoading(false);
  }, []);

  // Save board whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveBoard(board);
    }
  }, [board, isLoading]);

  const addColumn = (title: string) => {
    const newColumn: Column = {
      id: uuidv4(),
      title,
      tasks: [],
      order: board.columns.length
    };
    
    setBoard(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }));
  };

  const updateColumn = (columnId: string, title: string) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId ? { ...col, title } : col
      )
    }));
  };

  const deleteColumn = (columnId: string) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.id !== columnId)
    }));
  };

  const addTask = (columnId: string, task: Omit<Task, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    // Handle legacy client/clientColor properties if they exist
    const taskData = task as any;
    const newTask: Task = {
      ...task,
      // Ensure backwards compatibility
      tag: taskData.tag || taskData.client || '',
      tagColor: taskData.tagColor || taskData.clientColor || '#f87171',
      id: uuidv4(),
      columnId,
      order: 0, // Will be updated in the next step
      createdAt: now,
      updatedAt: now
    };

    setBoard(prev => {
      const updatedColumns = prev.columns.map(col => {
        if (col.id === columnId) {
          // Add task and update orders
          const updatedTasks = [...col.tasks, newTask].map((t, index) => ({
            ...t,
            order: index
          }));
          return { ...col, tasks: updatedTasks };
        }
        return col;
      });
      
      return { ...prev, columns: updatedColumns };
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setBoard(prev => {
      const updatedColumns = prev.columns.map(col => {
        const taskIndex = col.tasks.findIndex(t => t.id === taskId);
        if (taskIndex >= 0) {
          const updatedTasks = [...col.tasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return { ...col, tasks: updatedTasks };
        }
        return col;
      });
      
      return { ...prev, columns: updatedColumns };
    });
  };

  const deleteTask = (taskId: string) => {
    setBoard(prev => {
      const updatedColumns = prev.columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => t.id !== taskId)
      }));
      
      return { ...prev, columns: updatedColumns };
    });
  };

  const moveTask = (taskId: string, sourceColId: string, destColId: string, newOrder: number) => {
    setBoard(prev => {
      // Find the task to move
      let taskToMove: Task | null = null;
      let updatedColumns = prev.columns.map(col => {
        if (col.id === sourceColId) {
          const task = col.tasks.find(t => t.id === taskId);
          if (task) {
            taskToMove = { ...task, columnId: destColId, updatedAt: new Date().toISOString() };
          }
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId)
          };
        }
        return col;
      });

      if (!taskToMove) return prev;

      // Insert the task into the destination column
      updatedColumns = updatedColumns.map(col => {
        if (col.id === destColId) {
          const newTasks = [...col.tasks];
          newTasks.splice(newOrder, 0, taskToMove!);
          
          // Update order for all tasks
          return {
            ...col,
            tasks: newTasks.map((t, index) => ({ ...t, order: index }))
          };
        }
        return col;
      });

      return { ...prev, columns: updatedColumns };
    });
  };

  const moveColumnLeft = (columnId: string) => {
    setBoard(prev => {
      const currentColumns = [...prev.columns];
      const index = currentColumns.findIndex(col => col.id === columnId);
      
      // Si es la primera columna o no se encuentra, no hacer nada
      if (index <= 0) return prev;
      
      // Intercambiar con la columna anterior
      const tempOrder = currentColumns[index].order;
      currentColumns[index].order = currentColumns[index - 1].order;
      currentColumns[index - 1].order = tempOrder;
      
      return { ...prev, columns: currentColumns };
    });
  };

  const moveColumnRight = (columnId: string) => {
    setBoard(prev => {
      const currentColumns = [...prev.columns];
      const index = currentColumns.findIndex(col => col.id === columnId);
      
      // Si es la última columna o no se encuentra, no hacer nada
      if (index === -1 || index >= currentColumns.length - 1) return prev;
      
      // Intercambiar con la columna siguiente
      const tempOrder = currentColumns[index].order;
      currentColumns[index].order = currentColumns[index + 1].order;
      currentColumns[index + 1].order = tempOrder;
      
      return { ...prev, columns: currentColumns };
    });
  };

  return {
    board,
    isLoading,
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    moveColumnLeft,
    moveColumnRight
  };
};
