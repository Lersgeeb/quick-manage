import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Task } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { TagBadge } from './TagBadge';
import { TaskComments } from './TaskComments';

interface TaskDetailsModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onAddComment: (taskId: string, commentText: string) => void;
  onEditComment: (taskId: string, commentId: string, newText: string) => void;
  onDeleteComment: (taskId: string, commentId: string) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  open,
  task,
  onClose,
  onAddComment,
  onEditComment,
  onDeleteComment
}) => {
  const { darkMode } = useTheme();
  
  if (!task) return null;
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Manejador personalizado para añadir comentarios que asegura actualización inmediata
  const handleAddComment = (taskId: string, commentText: string) => {
    onAddComment(taskId, commentText);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900',
        style: { 
          overflowY: 'visible' // Para evitar problemas de scroll con el tema
        }
      }}
    >
      <DialogTitle 
        className={`${darkMode ? 'text-gray-100 bg-gray-800' : 'text-gray-900 bg-white'}`}
      >
        {task.title}
      </DialogTitle>
      
      <DialogContent className={darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}>
        <div className="space-y-4 pt-2">
          {/* Información básica */}
          <div className="flex items-center justify-between">
            <TagBadge tag={task.tag} color={task.tagColor} />
            {task.reference && (
              <span className={`text-xs font-mono ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Ref: {task.reference}
              </span>
            )}
          </div>
          
          {/* Descripción */}
          {task.description && (
            <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              <h4 className="text-sm font-semibold">Descripción:</h4>
              <p className="mt-1 text-sm">{task.description}</p>
            </div>
          )}
          
          {/* Fechas */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div>
              <span className="font-semibold">Creado:</span> {formatDate(task.createdAt)}
            </div>
            <div>
              <span className="font-semibold">Actualizado:</span> {formatDate(task.updatedAt)}
            </div>
          </div>
          
          {/* Componente de comentarios */}
          <div className="mt-6">
            <h4 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Bitácora de comentarios
            </h4>
            <TaskComments
              taskId={task.id}
              comments={task.comments || []}
              onAddComment={handleAddComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          </div>
        </div>
      </DialogContent>
      
      <DialogActions className={darkMode ? 'bg-gray-800' : 'bg-white'}>
        <Button 
          onClick={onClose} 
          className={darkMode ? 'text-gray-300' : ''} 
          variant="outlined"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
