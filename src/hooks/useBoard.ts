import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Board, Column, Task, Comment, BoardViewMode } from '../types';
import { useStorage } from './useStorage';

export const useBoard = () => {
  const [board, setBoard] = useState<Board>({ columns: [] });
  const [viewMode, setViewMode] = useState<BoardViewMode>('normal');
  const { saveBoard, loadBoard, isLoading, setIsLoading, saveViewMode, loadViewMode } = useStorage();

  useEffect(() => {
    const loadedBoard = loadBoard();
    const savedViewMode = loadViewMode();
    
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
    
    setViewMode(savedViewMode);
    setIsLoading(false);
  }, []);

  // Save board whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveBoard(board);
    }
  }, [board, isLoading]);

  // Save view mode whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveViewMode(viewMode);
    }
  }, [viewMode, isLoading]);

  const toggleViewMode = () => {
    const newMode = viewMode === 'normal' ? 'presentation' : 'normal';
    setViewMode(newMode);
    
    // If switching to presentation mode, create or reset presentation columns
    if (newMode === 'presentation') {
      setBoard(prev => {
        // Create default presentation columns if they don't exist
        const presentationCols = prev.presentationColumns || [
          { 
            id: uuidv4(), 
            title: 'Pendientes sin revisar', 
            tasks: [], 
            order: 0 
          },
          { 
            id: uuidv4(), 
            title: 'Pendientes revisados', 
            tasks: [], 
            order: 1 
          }
        ];
        
        // Reset the columns - don't keep task distribution between columns
        // First column gets all filtered tasks, other columns start empty
        return {
          ...prev,
          presentationColumns: presentationCols.map((col, index) => ({
            ...col,
            tasks: [] // All columns start empty, tasks will be added by columnsToRender
          }))
        };
      });
    }
  };

  // Get current columns based on view mode
  const getCurrentColumns = () => {
    return viewMode === 'presentation' 
      ? board.presentationColumns || []
      : board.columns;
  };

  // Get all tasks from all columns
  const getAllTasks = () => {
    const tasks: Task[] = [];
    board.columns.forEach(col => {
      tasks.push(...col.tasks);
    });
    return tasks;
  };
  
  const addColumn = (title: string) => {
    const newColumn: Column = {
      id: uuidv4(),
      title,
      tasks: [],
      order: getCurrentColumns().length
    };
    
    if (viewMode === 'normal') {
      setBoard(prev => ({
        ...prev,
        columns: [...prev.columns, newColumn]
      }));
    } else {
      // Add column to presentation mode
      setBoard(prev => ({
        ...prev,
        presentationColumns: [...(prev.presentationColumns || []), newColumn]
      }));
    }
  };

  const updateColumn = (columnId: string, title: string) => {
    if (viewMode === 'normal') {
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.map(col => 
          col.id === columnId ? { ...col, title } : col
        )
      }));
    } else {
      setBoard(prev => ({
        ...prev,
        presentationColumns: (prev.presentationColumns || []).map(col => 
          col.id === columnId ? { ...col, title } : col
        )
      }));
    }
  };

  const deleteColumn = (columnId: string) => {
    if (viewMode === 'normal') {
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.filter(col => col.id !== columnId)
      }));
    } else {
      setBoard(prev => ({
        ...prev,
        presentationColumns: (prev.presentationColumns || []).filter(col => col.id !== columnId)
      }));
    }
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
      reference: taskData.reference || '',
      id: uuidv4(),
      columnId,
      order: 0, // Will be updated in the next step
      createdAt: now,
      updatedAt: now
    };

    if (viewMode === 'normal') {
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
    } else {
      // En modo presentación, agregar la tarea a la primera columna en modo normal
      // y a la columna seleccionada en modo presentación
      setBoard(prev => {
        // Primero, agregar a la columna en modo presentación
        const updatedPresentationColumns = (prev.presentationColumns || []).map(col => {
          if (col.id === columnId) {
            const updatedTasks = [...col.tasks, newTask].map((t, index) => ({
              ...t,
              order: index
            }));
            return { ...col, tasks: updatedTasks };
          }
          return col;
        });
        
        // Luego, agregar a la primera columna en modo normal
        let firstColumn = prev.columns[0];
        if (firstColumn) {
          const firstColumnTask = {...newTask, columnId: firstColumn.id};
          const updatedColumns = prev.columns.map((col, index) => {
            if (index === 0) {
              const updatedTasks = [...col.tasks, firstColumnTask].map((t, idx) => ({
                ...t,
                order: idx
              }));
              return { ...col, tasks: updatedTasks };
            }
            return col;
          });
          
          return { 
            ...prev, 
            columns: updatedColumns,
            presentationColumns: updatedPresentationColumns
          };
        }
        
        return { 
          ...prev, 
          presentationColumns: updatedPresentationColumns
        };
      });
    }
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
    if (viewMode === 'normal') {
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
    } else {
      // In presentation mode, only update the presentation columns state
      // without changing the task's actual columnId or saving to normal mode
      setBoard(prev => {
        if (!prev.presentationColumns) return prev;

        // Find the task across all normal columns (not just in presentation columns)
        let taskToMove: Task | null = null;
        
        // First check in presentation columns
        prev.presentationColumns.forEach(col => {
          const task = col.tasks.find(t => t.id === taskId);
          if (task && !taskToMove) {
            taskToMove = { ...task };
          }
        });

        // If not found, check in normal columns (should be the source of truth)
        if (!taskToMove) {
          prev.columns.forEach(col => {
            const task = col.tasks.find(t => t.id === taskId);
            if (task) {
              taskToMove = { ...task };
            }
          });
        }

        if (!taskToMove) return prev;

        // Update presentation columns
        const updatedPresentationColumns = prev.presentationColumns.map(col => {
          // Remove from source column
          if (col.id === sourceColId) {
            return {
              ...col,
              tasks: col.tasks.filter(t => t.id !== taskId)
            };
          }
          
          // Add to destination column
          if (col.id === destColId) {
            const newTasks = [...col.tasks];
            newTasks.splice(newOrder, 0, taskToMove!);
            
            return {
              ...col,
              tasks: newTasks
            };
          }
          
          return col;
        });

        return { ...prev, presentationColumns: updatedPresentationColumns };
      });
    }
  };

  const moveColumnLeft = (columnId: string) => {
    if (viewMode === 'normal') {
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
    } else {
      setBoard(prev => {
        if (!prev.presentationColumns) return prev;
        
        const currentColumns = [...prev.presentationColumns];
        const index = currentColumns.findIndex(col => col.id === columnId);
        
        if (index <= 0) return prev;
        
        const tempOrder = currentColumns[index].order;
        currentColumns[index].order = currentColumns[index - 1].order;
        currentColumns[index - 1].order = tempOrder;
        
        return { ...prev, presentationColumns: currentColumns };
      });
    }
  };

  const moveColumnRight = (columnId: string) => {
    if (viewMode === 'normal') {
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
    } else {
      setBoard(prev => {
        if (!prev.presentationColumns) return prev;
        
        const currentColumns = [...prev.presentationColumns];
        const index = currentColumns.findIndex(col => col.id === columnId);
        
        if (index === -1 || index >= currentColumns.length - 1) return prev;
        
        const tempOrder = currentColumns[index].order;
        currentColumns[index].order = currentColumns[index + 1].order;
        currentColumns[index + 1].order = tempOrder;
        
        return { ...prev, presentationColumns: currentColumns };
      });
    }
  };

  // Funciones para manejar comentarios
  const addComment = (taskId: string, commentText: string) => {
    const now = new Date().toISOString();
    const newComment: Comment = {
      id: uuidv4(),
      text: commentText,
      createdAt: now,
      updatedAt: now
    };

    setBoard(prev => {
      const updatedColumns = prev.columns.map(col => {
        const updatedTasks = col.tasks.map(task => {
          if (task.id === taskId) {
            // Inicializar array de comentarios si no existe
            const comments = task.comments || [];
            return { 
              ...task, 
              comments: [...comments, newComment],
              updatedAt: now
            };
          }
          return task;
        });
        
        return { ...col, tasks: updatedTasks };
      });
      
      return { ...prev, columns: updatedColumns };
    });
  };

  const updateComment = (taskId: string, commentId: string, newText: string) => {
    const now = new Date().toISOString();
    
    setBoard(prev => {
      const updatedColumns = prev.columns.map(col => {
        const updatedTasks = col.tasks.map(task => {
          if (task.id === taskId && task.comments) {
            const updatedComments = task.comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, text: newText, updatedAt: now };
              }
              return comment;
            });
            
            return { 
              ...task, 
              comments: updatedComments,
              updatedAt: now
            };
          }
          return task;
        });
        
        return { ...col, tasks: updatedTasks };
      });
      
      return { ...prev, columns: updatedColumns };
    });
  };

  const deleteComment = (taskId: string, commentId: string) => {
    const now = new Date().toISOString();
    
    setBoard(prev => {
      const updatedColumns = prev.columns.map(col => {
        const updatedTasks = col.tasks.map(task => {
          if (task.id === taskId && task.comments) {
            return { 
              ...task, 
              comments: task.comments.filter(comment => comment.id !== commentId),
              updatedAt: now
            };
          }
          return task;
        });
        
        return { ...col, tasks: updatedTasks };
      });
      
      return { ...prev, columns: updatedColumns };
    });
  };

  return {
    board,
    viewMode,
    toggleViewMode,
    getCurrentColumns,
    getAllTasks,
    isLoading,
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    moveColumnLeft,
    moveColumnRight,
    addComment,
    updateComment,
    deleteComment
  };
};
