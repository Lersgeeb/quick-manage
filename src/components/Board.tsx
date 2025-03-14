import React, { useState, useMemo, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Column } from './Column';
import { ImportExport } from './ImportExport';
import { TagFilter } from './TagFilter';
import { TaskFormModal } from './TaskFormModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { ThemeToggle } from './ThemeToggle';
import { PresentationModeToggle } from './PresentationModeToggle';
import { useBoard } from '../hooks/useBoard';
import { useDragDrop } from '../hooks/useDragDrop';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const Board: React.FC = () => {
  const { darkMode } = useTheme();
  const { 
    board, 
    viewMode,
    toggleViewMode,
    getCurrentColumns,
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
    deleteComment,
    toggleTaskVisibility
  } = useBoard();
  
  const { handleDragEnd, handleDragStart } = useDragDrop(moveTask);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showHiddenTasks, setShowHiddenTasks] = useState(false);
  
  // Estado para el modal de task form
  const [taskModal, setTaskModal] = useState<{
    open: boolean;
    task?: Task;
    columnId?: string;
  }>({
    open: false
  });

  // Estado para el modal de detalles
  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    task: Task | null;
  }>({
    open: false,
    task: null
  });

  // Efecto para actualizar la tarea en el modal de detalles cuando cambia el board
  useEffect(() => {
    if (detailsModal.open && detailsModal.task) {
      // Buscar la tarea actualizada por ID
      let updatedTask: Task | null = null;
      
      const currentColumns = getCurrentColumns();
      currentColumns.forEach(col => {
        const task = col.tasks.find(t => t.id === detailsModal.task?.id);
        if (task) {
          updatedTask = task;
        }
      });
      
      // Si se encuentra la tarea actualizada, actualizar el estado del modal
      if (updatedTask) {
        setDetailsModal({ open: true, task: updatedTask });
      }
    }
  }, [board, viewMode]);

  // Abrir modal para crear tarea
  const handleOpenAddTaskModal = (columnId: string) => {
    setTaskModal({ open: true, columnId });
  };

  // Abrir modal para editar tarea
  const handleOpenEditTaskModal = (taskId: string) => {
    // Buscar la tarea por ID
    let taskToEdit: Task | undefined;
    let columnId: string | undefined;
    
    const currentColumns = getCurrentColumns();
    currentColumns.forEach(col => {
      const task = col.tasks.find(t => t.id === taskId);
      if (task) {
        taskToEdit = task;
        columnId = col.id;
      }
    });
    
    if (taskToEdit) {
      setTaskModal({ open: true, task: taskToEdit, columnId });
    }
  };

  // Abrir modal de detalles
  const handleOpenDetailsModal = (taskId: string) => {
    // Buscar la tarea por ID
    let taskToView: Task | null = null;
    
    // En modo presentación, buscar la tarea en las columnas normales para tener todos los detalles
    if (viewMode === 'presentation') {
      board.columns.forEach(col => {
        const task = col.tasks.find(t => t.id === taskId);
        if (task) {
          taskToView = task;
        }
      });
    } else {
      // En modo normal, buscar en las columnas actuales
      const currentColumns = getCurrentColumns();
      currentColumns.forEach(col => {
        const task = col.tasks.find(t => t.id === taskId);
        if (task) {
          taskToView = task;
        }
      });
    }
    
    if (taskToView) {
      setDetailsModal({ open: true, task: taskToView });
    }
  };

  // Cerrar modal de tarea
  const handleCloseTaskModal = () => {
    setTaskModal({ open: false });
  };

  // Cerrar modal de detalles
  const handleCloseDetailsModal = () => {
    setDetailsModal({ open: false, task: null });
  };

  // Manejar submit del formulario
  const handleTaskFormSubmit = (
    taskData: Omit<Task, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>,
    columnId?: string
  ) => {
    if (taskModal.task && taskModal.task.id) {
      // Editar tarea existente
      updateTask(taskModal.task.id, taskData);
    } else if (columnId) {
      // Crear nueva tarea
      addTask(columnId, taskData);
    }
  };

  // Manejadores específicos para comentarios con actualización inmediata de UI
  const handleAddComment = (taskId: string, commentText: string) => {
    addComment(taskId, commentText);
    
    // Buscar la tarea actualizada si el modal está abierto
    if (detailsModal.open && detailsModal.task && detailsModal.task.id === taskId) {
      const task = detailsModal.task;
      const now = new Date().toISOString();
      
      // Crear un nuevo comentario localmente
      const newComment = {
        id: crypto.randomUUID(), // Generamos un ID temporal
        text: commentText,
        createdAt: now,
        updatedAt: now
      };
      
      // Actualizar el estado local de la tarea en el modal
      const updatedComments = [...(task.comments || []), newComment];
      const updatedTask = { ...task, comments: updatedComments, updatedAt: now };
      
      // Actualizar el estado del modal con la tarea actualizada
      setDetailsModal({ open: true, task: updatedTask });
    }
  };

  const handleUpdateComment = (taskId: string, commentId: string, newText: string) => {
    updateComment(taskId, commentId, newText);
    
    // Actualizar el estado local si es necesario
    if (detailsModal.open && detailsModal.task && detailsModal.task.id === taskId) {
      const task = detailsModal.task;
      const now = new Date().toISOString();
      
      if (task.comments) {
        const updatedComments = task.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, text: newText, updatedAt: now } 
            : comment
        );
        
        const updatedTask = { ...task, comments: updatedComments, updatedAt: now };
        setDetailsModal({ open: true, task: updatedTask });
      }
    }
  };

  const handleDeleteComment = (taskId: string, commentId: string) => {
    deleteComment(taskId, commentId);
    
    // Actualizar el estado local si es necesario
    if (detailsModal.open && detailsModal.task && detailsModal.task.id === taskId) {
      const task = detailsModal.task;
      const now = new Date().toISOString();
      
      if (task.comments) {
        const updatedComments = task.comments.filter(comment => comment.id !== commentId);
        const updatedTask = { ...task, comments: updatedComments, updatedAt: now };
        setDetailsModal({ open: true, task: updatedTask });
      }
    }
  };

  // Extract unique tags from all tasks
  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    const tagsMap = new Map<string, string>(); // tag -> color
    
    // Use all tasks from normal mode for tags
    board.columns.forEach(column => {
      column.tasks.forEach(task => {
        // Handle both new and legacy properties
        const tag = task.tag || (task as any).client || '';
        const color = task.tagColor || (task as any).clientColor || '#f87171';
        
        if (tag && !tagsSet.has(tag)) {
          tagsSet.add(tag);
          tagsMap.set(tag, color);
        }
      });
    });
    
    return Array.from(tagsSet).map(tag => ({
      tag,
      color: tagsMap.get(tag) || '#f87171'
    })).sort((a, b) => a.tag.localeCompare(b.tag));
  }, [board]);
  
  // Filter tasks by selected tag and visibility
  const getFilteredTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      // Filter by visibility
      if (!showHiddenTasks && task.hidden) {
        return false;
      }
      
      // Filter by tag
      if (!selectedTag) return true;
      
      // Handle both new and legacy properties
      const taskTag = task.tag || (task as any).client || '';
      return taskTag === selectedTag;
    });
  };
  
  // Prepare columns for rendering based on view mode and filters
  const columnsToRender = useMemo(() => {
    const currentColumns = getCurrentColumns();
    
    if (viewMode === 'presentation') {
      // Get all filtered tasks from normal mode
      const allFilteredTasks: Task[] = [];
      
      board.columns.forEach(normalCol => {
        const tasksForColumn = normalCol.tasks.filter(task => {
          // Apply visibility filter
          if (!showHiddenTasks && task.hidden) {
            return false;
          }
          
          // Apply tag filter
          if (selectedTag) {
            const taskTag = task.tag || (task as any).client || '';
            return taskTag === selectedTag;
          }
          return true;
        });
        
        allFilteredTasks.push(...tasksForColumn);
      });
      
      const existingTaskIds = new Set<string>();
      currentColumns.forEach(col => {
        col.tasks.forEach(task => existingTaskIds.add(task.id));
      });
      
      // Find tasks that aren't already in presentation columns
      const newTasks = allFilteredTasks.filter(task => !existingTaskIds.has(task.id));
      
      // Create a copy of the presentation columns
      const updatedColumns = [...currentColumns];
      
      // Add any new tasks to the first column if it exists
      if (updatedColumns.length > 0 && newTasks.length > 0) {
        const firstColumn = updatedColumns.find(col => col.order === 0) || updatedColumns[0];
        const columnIndex = updatedColumns.findIndex(col => col.id === firstColumn.id);
        
        if (columnIndex >= 0) {
          updatedColumns[columnIndex] = {
            ...firstColumn,
            tasks: [...firstColumn.tasks, ...newTasks]
          };
        }
      }
      
      return updatedColumns;
    }
    
    // For normal mode, just return the columns
    return currentColumns;
  }, [board, viewMode, selectedTag, getCurrentColumns, showHiddenTasks]);
  
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  // Handle visibility toggle for task
  const handleToggleTaskVisibility = (taskId: string) => {
    toggleTaskVisibility(taskId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4 h-full dark:bg-gray-900 dark:text-white transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          QuickManage {viewMode === 'presentation' && '- Modo Presentación'}
        </h1>
        <div className="flex space-x-2 items-center">
          <ThemeToggle />
          <ImportExport />
          <PresentationModeToggle viewMode={viewMode} onToggle={toggleViewMode} />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddingColumn(true)}
          >
            Nueva Columna
          </Button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {uniqueTags.length > 0 && (
            <TagFilter
              tags={uniqueTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          )}
        </div>
        
        <div className="flex items-center">
          {/* Toggle for hidden tasks */}
          <FormControlLabel
            control={
              <Switch
                checked={showHiddenTasks}
                onChange={(e) => setShowHiddenTasks(e.target.checked)}
                color="primary"
                icon={<VisibilityOffIcon />}
                checkedIcon={<VisibilityIcon />}
              />
            }
            label={showHiddenTasks ? "Mostrando tareas ocultas" : "Tareas ocultas: OFF"}
            sx={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              '.MuiSwitch-track': {
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : undefined
              }
            }}
          />
        </div>
      </div>

      <DragDropContext 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="flex gap-0 overflow-x-auto pb-4 h-[calc(100vh-180px)] w-full">
          {columnsToRender
            .sort((a, b) => a.order - b.order)
            .map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getFilteredTasks(column.tasks.sort((a, b) => a.order - b.order))}
                onAddTask={() => handleOpenAddTaskModal(column.id)}
                onEditTask={handleOpenEditTaskModal}
                onDeleteTask={deleteTask}
                onViewDetails={handleOpenDetailsModal}
                onUpdateColumn={updateColumn}
                onDeleteColumn={deleteColumn}
                onMoveLeft={moveColumnLeft}
                onMoveRight={moveColumnRight}
                onToggleTaskVisibility={handleToggleTaskVisibility}
                viewMode={viewMode}
                showHiddenTasks={showHiddenTasks}
              />
            ))}
        </div>
      </DragDropContext>

      {/* Modal para crear/editar tareas */}
      <TaskFormModal
        open={taskModal.open}
        task={taskModal.task}
        columnId={taskModal.columnId}
        onClose={handleCloseTaskModal}
        onSubmit={handleTaskFormSubmit}
      />

      {/* Modal para ver detalles de tarea */}
      <TaskDetailsModal
        open={detailsModal.open}
        task={detailsModal.task}
        onClose={handleCloseDetailsModal}
        onAddComment={handleAddComment}
        onEditComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />

      {/* Dialog para agregar nueva columna */}
      <Dialog 
        open={isAddingColumn} 
        onClose={() => setIsAddingColumn(false)}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-gray-100' : ''
        }}
      >
        <DialogTitle className={darkMode ? 'text-gray-100' : ''}>
          Nueva Columna {viewMode === 'presentation' ? 'de Presentación' : ''}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={darkMode ? 'text-gray-300' : ''}>
            Ingresa un título para la nueva columna.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="columnTitle"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddColumn();
            }}
            InputProps={{
              className: darkMode ? 'text-gray-100' : ''
            }}
            InputLabelProps={{
              className: darkMode ? 'text-gray-300' : ''
            }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : ''
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : ''
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingColumn(false)} className={darkMode ? 'text-gray-300' : ''}>
            Cancelar
          </Button>
          <Button onClick={handleAddColumn} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
