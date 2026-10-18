import React, { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useLanguage } from '../contexts/LanguageContext';
import { Comment } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  onAddComment: (taskId: string, commentText: string) => void;
  onEditComment: (taskId: string, commentId: string, newText: string) => void;
  onDeleteComment: (taskId: string, commentId: string) => void;
  title?: string;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({
  taskId,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  title
}) => {
  const { darkMode } = useTheme();
  const { t, locale } = useLanguage();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const [commentsPerPage, setCommentsPerPage] = useState(5);

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
      return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return t('taskDetails.invalidDate');
    }
  };

  const sortedComments = useMemo(() => {
    const directionFactor = sortDirection === 'desc' ? -1 : 1;

    return [...comments].sort((firstComment, secondComment) => (
      (new Date(firstComment.createdAt).getTime() - new Date(secondComment.createdAt).getTime()) * directionFactor
    ));
  }, [comments, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedComments.length / commentsPerPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedComments = useMemo(() => {
    const startIndex = (page - 1) * commentsPerPage;
    return sortedComments.slice(startIndex, startIndex + commentsPerPage);
  }, [commentsPerPage, page, sortedComments]);

  const handleToggleSortDirection = () => {
    setSortDirection(currentDirection => currentDirection === 'desc' ? 'asc' : 'desc');
    setPage(1);
  };

  const handleCommentsPerPageChange = (event: SelectChangeEvent<number>) => {
    setCommentsPerPage(Number(event.target.value));
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Typography
          component="h4"
          className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
        >
          {title || t('comments.log')}
        </Typography>
        <Tooltip title={sortDirection === 'desc' ? t('comments.newestFirst') : t('comments.oldestFirst')}>
          <span>
            <IconButton
              size="small"
              onClick={handleToggleSortDirection}
              sx={{ color: darkMode ? 'white' : 'inherit' }}
            >
              {sortDirection === 'desc' ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </div>

      {/* Lista de comentarios */}
      {sortedComments.length > 0 ? (
        <>
          <List className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {paginatedComments.map(comment => (
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
                      <span>{t('comments.createdAt')} {formatDate(comment.createdAt)}</span>
                      {comment.updatedAt !== comment.createdAt && (
                      <span className="ml-3">{t('comments.updatedAt')} {formatDate(comment.updatedAt)}</span>
                      )}
                    </span>
                  }
                  sx={{
                    '.MuiListItemText-primary': {
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }
                  }}
                />
              )}
            </ListItem>
            ))}
          </List>

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 130
                }}
              >
                <Select
                  value={commentsPerPage}
                  onChange={handleCommentsPerPageChange}
                  sx={{
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : ''
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : ''
                    },
                    '.MuiSvgIcon-root': {
                      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : ''
                    },
                    color: darkMode ? 'white' : 'inherit'
                  }}
                  MenuProps={{
                    PaperProps: {
                      className: darkMode ? 'bg-gray-800' : ''
                    }
                  }}
                >
                  {[5, 10, 15, 20, 25, 30].map((size) => (
                    <MenuItem key={size} value={size} className={darkMode ? 'text-gray-100 hover:bg-gray-700' : ''}>
                      {t('comments.perPage', { count: size })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('comments.count', { count: sortedComments.length })}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="small"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: darkMode ? 'white' : 'inherit'
                    }
                  }}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {t('comments.noComments')}
        </div>
      )}

      {/* Formulario para agregar comentario */}
      <div className="mt-4">
        <TextField
          fullWidth
          multiline
          rows={3}
          label={t('comments.newComment')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          variant="outlined"
          placeholder={t('comments.placeholder')}
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
            {t('comments.add')}
          </Button>
        </div>
      </div>
    </div>
  );
};
