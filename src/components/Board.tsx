import React, { useState, useMemo, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Column } from './Column';
import { ImportExport } from './ImportExport';
import { TagFilter } from './TagFilter';
import { TaskFormModal } from './TaskFormModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { ThemeToggle } from './ThemeToggle';
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

export const Board: React.FC = () => {
  const { darkMode } = useTheme();
  const { 
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
    moveColumnRight,
    addComment,
    updateComment,
    deleteComment
  } = useBoard();
  
  const { handleDragEnd, handleDragStart } = useDragDrop(moveTask);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
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
      
      board.columns.forEach(col => {
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
  }, [board]);

  // Abrir modal para crear tarea
  const handleOpenAddTaskModal = (columnId: string) => {
    setTaskModal({ open: true, columnId });
  };

  // Abrir modal para editar tarea
  const handleOpenEditTaskModal = (taskId: string) => {
    // Buscar la tarea por ID
    let taskToEdit: Task | undefined;
    let columnId: string | undefined;
    
    board.columns.forEach(col => {
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
    
    board.columns.forEach(col => {
      const task = col.tasks.find(t => t.id === taskId);
      if (task) {
        taskToView = task;
      }
    });
    
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
  
  // Filter tasks by selected tag
  const getFilteredTasks = (tasks: Task[]) => {
    if (!selectedTag) return tasks;
    
    return tasks.filter(task => {
      // Handle both new and legacy properties
      const taskTag = task.tag || (task as any).client || '';
      return taskTag === selectedTag;
    });
  };
  
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">QuickManage</h1>
        <div className="flex space-x-2 items-center">
          <ThemeToggle />
          <ImportExport />
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

      {/* Tag Filter - ahora como selector desplegable */}
      <div className="flex items-center justify-start mb-2">
        {uniqueTags.length > 0 && (
          <TagFilter
            tags={uniqueTags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        )}
      </div>

      <DragDropContext 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="flex gap-0 overflow-x-auto pb-4 h-[calc(100vh-180px)] w-full">
          {board.columns
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
        <DialogTitle className={darkMode ? 'text-gray-100' : ''}>Nueva Columna</DialogTitle>
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
