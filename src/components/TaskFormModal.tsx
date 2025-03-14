import React from 'react';
import { Task } from '../types';
import { TaskForm } from './TaskForm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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
    >
      <DialogTitle>
        {task ? 'Editar Tarea' : 'Nueva Tarea'}
      </DialogTitle>
      <DialogContent>
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
