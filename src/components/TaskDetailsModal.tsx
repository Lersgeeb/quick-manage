import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Task, getTaskPriorityOption } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { TagBadge } from './TagBadge';
import { TaskComments } from './TaskComments';
import {
  getDialogActionsSx,
  getDialogContentSx,
  getDialogSx,
  getDialogTextFieldSx,
  getDialogTitleSx,
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
  onSaveNextStep: (taskId: string, nextStep: string) => void;
  onCompleteNextStep: (taskId: string, nextStep: string) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  open,
  task,
  onClose,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onSaveNextStep,
  onCompleteNextStep
}) => {
  const { darkMode } = useTheme();
  const [isEditingNextStep, setIsEditingNextStep] = useState(false);
  const [nextStepDraft, setNextStepDraft] = useState('');

  useEffect(() => {
    setNextStepDraft(task?.nextStep || '');
    setIsEditingNextStep(false);
  }, [task]);

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

  const handleSaveNextStep = () => {
    onSaveNextStep(task.id, nextStepDraft);
    setIsEditingNextStep(false);
  };

  const handleCompleteNextStep = () => {
    onCompleteNextStep(task.id, nextStepDraft);
    setIsEditingNextStep(false);
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

          <Box sx={getModalSectionSx(darkMode)}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <Typography variant="overline" sx={getModalMutedTextSx(darkMode)}>
                Siguiente paso
              </Typography>
              <div className="flex items-center gap-1">
                <Tooltip title="Editar">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => setIsEditingNextStep(true)}
                      sx={{ color: darkMode ? '#60a5fa' : 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                {isEditingNextStep && (
                  <Tooltip title="Guardar">
                    <span>
                      <IconButton
                        size="small"
                        onClick={handleSaveNextStep}
                        disabled={!nextStepDraft.trim()}
                        sx={{ color: darkMode ? '#fbbf24' : 'warning.main' }}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
                <Tooltip title="Marcar como realizado">
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleCompleteNextStep}
                      disabled={isEditingNextStep || !nextStepDraft.trim()}
                      sx={{ color: darkMode ? '#4ade80' : 'success.main' }}
                    >
                      <TaskAltIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>
            {isEditingNextStep ? (
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={nextStepDraft}
                onChange={(event) => setNextStepDraft(event.target.value)}
                label="Siguiente paso"
                placeholder="Describe el siguiente paso..."
                sx={getDialogTextFieldSx(darkMode)}
              />
            ) : nextStepDraft.trim() ? (
              <Typography className="whitespace-pre-wrap text-sm">
                {nextStepDraft}
              </Typography>
            ) : (
              <Typography className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay un siguiente paso definido.
              </Typography>
            )}
          </Box>
          
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
