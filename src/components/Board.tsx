import React, { useState, useMemo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Column } from './Column';
import { ImportExport } from './ImportExport';
import { TagFilter } from './TagFilter';
import { TaskFormModal } from './TaskFormModal';
import { useBoard } from '../hooks/useBoard';
import { useDragDrop } from '../hooks/useDragDrop';
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
    moveColumnRight
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

  // Cerrar modal
  const handleCloseTaskModal = () => {
    setTaskModal({ open: false });
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
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">QuickManage</h1>
        <div className="flex space-x-2">
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

      {/* Dialog para agregar nueva columna */}
      <Dialog open={isAddingColumn} onClose={() => setIsAddingColumn(false)}>
        <DialogTitle>Nueva Columna</DialogTitle>
        <DialogContent>
          <DialogContentText>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingColumn(false)}>Cancelar</Button>
          <Button onClick={handleAddColumn} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
