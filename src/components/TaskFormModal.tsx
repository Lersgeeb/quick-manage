import React from 'react';
import { Task } from '../types';
import { TaskForm } from './TaskForm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '../contexts/ThemeContext';

interface TaskFormModalProps {
  open: boolean;
  task?: Task;
  columnId?: string;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>, columnId?: string) => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  task,
  columnId,
  onClose,
  onSubmit,
}) => {
  const { darkMode } = useTheme();
  
  const handleSubmit = (taskData: Omit<Task, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>) => {
    onSubmit(taskData, columnId);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }}
    >
      <DialogTitle className={darkMode ? 'text-gray-100 bg-gray-800' : 'text-gray-900 bg-white'}>
        {task ? 'Editar Tarea' : 'Nueva Tarea'}
      </DialogTitle>
      <DialogContent className={darkMode ? 'bg-gray-800' : 'bg-white'}>
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
