import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Task, getTaskPriorityOption } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { TagBadge } from './TagBadge';
import { TaskComments } from './TaskComments';
import {
  getDialogActionsSx,
  getDialogContentSx,
  getDialogSx,
  getDialogTitleSx,
  getModalDividerSx,
  getModalInnerSurfaceSx,
  getModalMutedTextSx,
  getModalSectionSx,
  secondaryDialogButtonSx
} from './dialogTheme';

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

  const priority = getTaskPriorityOption(task.priority);
  
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
      sx={getDialogSx(darkMode)}
      PaperProps={{
        style: {
          overflowY: 'visible'
        }
      }}
    >
      <DialogTitle sx={getDialogTitleSx(darkMode)}>
        {task.title}
      </DialogTitle>
      
      <DialogContent sx={getDialogContentSx(darkMode)}>
        <div className="space-y-4 pt-2">
          {/* Información básica */}

          <Box sx={getModalSectionSx(darkMode)}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <TagBadge tag={task.tag} color={task.tagColor} />
              {task.reference && (
                <span className={`rounded-full px-3 py-1 text-xs font-mono ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                  Ref: {task.reference}
                </span>
              )}
            </div>
            <Typography variant="overline" sx={getModalMutedTextSx(darkMode)}>
              Resumen
            </Typography>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Typography sx={{ color: darkMode ? '#f8fafc' : '#0f172a', fontWeight: 600 }}>
                {task.title}
              </Typography>
              <TagBadge tag={priority.label} color={priority.color} />
            </div>
          </Box>
          
          {/* Descripción */}
          {task.description && (
            <Box sx={getModalSectionSx(darkMode)}>
              <Typography variant="overline" sx={getModalMutedTextSx(darkMode)}>
                Descripción
              </Typography>
              <Typography className="mt-1 whitespace-pre-wrap text-sm">
                {task.description}
              </Typography>
            </Box>
          )}
          
          {/* Fechas */}
          <Box sx={{ ...getModalInnerSurfaceSx(darkMode), p: 2.25 }}>
            <div className={`grid grid-cols-1 gap-2 text-xs md:grid-cols-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div>
                <span className="font-semibold">Creado:</span> {formatDate(task.createdAt)}
              </div>
              <div>
                <span className="font-semibold">Actualizado:</span> {formatDate(task.updatedAt)}
              </div>
            </div>
          </Box>
          
          {/* Componente de comentarios */}
          <Box sx={getModalSectionSx(darkMode)}>
            <h4 className={`mb-2 text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Bitácora de comentarios
            </h4>
            <TaskComments
              taskId={task.id}
              comments={task.comments || []}
              onAddComment={handleAddComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          </Box>
        </div>
      </DialogContent>
      
      <DialogActions sx={getDialogActionsSx(darkMode)}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={secondaryDialogButtonSx}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
