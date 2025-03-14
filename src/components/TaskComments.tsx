import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Comment } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  onAddComment: (taskId: string, commentText: string) => void;
  onEditComment: (taskId: string, commentId: string, newText: string) => void;
  onDeleteComment: (taskId: string, commentId: string) => void;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({
  taskId,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment
}) => {
  const { darkMode } = useTheme();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(taskId, newComment);
      setNewComment(''); // Limpiar el campo después de agregar
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const saveComment = (commentId: string) => {
    if (editText.trim()) {
      onEditComment(taskId, commentId, editText);
      setEditingCommentId(null);
    }
  };

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

  // Ordenar comentarios por fecha (más recientes primero)
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Lista de comentarios */}
      {sortedComments.length > 0 ? (
        <List className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {sortedComments.map(comment => (
            <ListItem
              key={comment.id}
              className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              sx={{
                '.MuiListItemText-primary': {
                  color: darkMode ? 'white' : 'inherit'
                },
                '.MuiListItemText-secondary': {
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                }
              }}
              secondaryAction={
                <div>
                  {editingCommentId === comment.id ? (
                    <>
                      <IconButton 
                        edge="end" 
                        aria-label="save" 
                        onClick={() => saveComment(comment.id)}
                        sx={{ color: darkMode ? '#60a5fa' : 'primary.main' }}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="cancel" 
                        onClick={cancelEditing}
                        sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton 
                        edge="end" 
                        aria-label="edit" 
                        onClick={() => startEditing(comment)}
                        sx={{ color: darkMode ? '#60a5fa' : 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => onDeleteComment(taskId, comment.id)}
                        sx={{ color: darkMode ? '#f87171' : 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </div>
              }
            >
              {editingCommentId === comment.id ? (
                <TextField
                  fullWidth
                  multiline
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: darkMode ? 'white' : 'inherit',
                      '& fieldset': {
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'inherit'
                      },
                      '&:hover fieldset': {
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'inherit'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: darkMode ? '#60a5fa' : 'primary.main'
                      }
                    }
                  }}
                />
              ) : (
                <ListItemText
                  primary={comment.text}
                  secondary={
                    <span>
                      <span>Creado: {formatDate(comment.createdAt)}</span>
                      {comment.updatedAt !== comment.createdAt && (
                        <span className="ml-3">Actualizado: {formatDate(comment.updatedAt)}</span>
                      )}
                    </span>
                  }
                />
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No hay comentarios. Agrega el primer comentario.
        </div>
      )}

      {/* Formulario para agregar comentario */}
      <div className="mt-4">
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Nuevo comentario"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          variant="outlined"
          placeholder="Escribe un comentario..."
          sx={{
            '& .MuiOutlinedInput-root': {
              color: darkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'inherit'
              },
              '&:hover fieldset': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'inherit'
              },
              '&.Mui-focused fieldset': {
                borderColor: darkMode ? '#60a5fa' : 'primary.main'
              }
            },
            '& .MuiInputLabel-root': {
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
              '&.Mui-focused': {
                color: darkMode ? '#60a5fa' : 'primary.main'
              }
            }
          }}
        />
        <div className="mt-2 flex justify-end">
          <Button 
            variant="contained" 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            sx={{
              backgroundColor: darkMode ? '#60a5fa' : 'primary.main',
              '&:hover': {
                backgroundColor: darkMode ? '#3b82f6' : 'primary.dark'
              }
            }}
          >
            Agregar comentario
          </Button>
        </div>
      </div>
    </div>
  );
};
