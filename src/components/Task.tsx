import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task as TaskType, BoardViewMode } from '../types';
import { TagBadge } from './TagBadge';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldLess';
import UnfoldLessIcon from '@mui/icons-material/UnfoldMore';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface TaskProps {
  task: TaskType;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onToggleMinimize?: (id: string) => void;
  isMinimized?: boolean;
  viewMode?: BoardViewMode;
  showHiddenTasks?: boolean;
}

export const Task: React.FC<TaskProps> = ({ 
  task, 
  index, 
  onEdit, 
  onDelete, 
  onViewDetails,
  onToggleVisibility,
  onToggleMinimize,
  isMinimized = false,
  viewMode = 'normal',
  showHiddenTasks = false
}) => {
  // Compatibilidad con datos antiguos
  const tagToShow = task.tag || (task as any).client || '';
  const colorToShow = task.tagColor || (task as any).clientColor || '#f87171';
  const referenceToShow = task.reference || '';
  const isHidden = task.hidden || false;
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleAction = (action: () => void) => {
    action();
    handleCloseMenu();
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0px, 0px)'
          }}
          className={`p-4 mb-3 bg-white dark:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 
            ${snapshot.isDragging ? 'opacity-80 shadow-lg bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 rotate-1' : ''}
            ${isHidden && showHiddenTasks ? 'opacity-50 border-dashed' : ''}
            ${isMinimized ? 'py-2' : 'py-4'} 
            transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing`}
        >
          {/* When minimized, use a single row with all elements aligned */}
          {isMinimized ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {tagToShow && <TagBadge tag={tagToShow} color={colorToShow} />}
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  {task.title}
                  {isHidden && showHiddenTasks && <span className="ml-2 text-xs text-gray-400">(oculta)</span>}
                </h3>
              </div>
              
              <div 
                onClick={e => e.stopPropagation()}
                {...provided.dragHandleProps && {}}
              >
                <Tooltip title="Opciones">
                  <button 
                    onClick={handleOpenMenu}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 cursor-pointer"
                  >
                    <MoreVertIcon fontSize="small" />
                  </button>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                >
                  {onToggleMinimize && (
                    <MenuItem onClick={() => handleAction(() => onToggleMinimize(task.id))}>
                      <ListItemIcon>
                        {isMinimized ? <UnfoldMoreIcon fontSize="small" /> : <UnfoldLessIcon fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText>{isMinimized ? "Expandir" : "Minimizar"}</ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => handleAction(() => onViewDetails(task.id))}>
                    <ListItemIcon>
                      <MoreHorizIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ver detalles</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleAction(() => onEdit(task.id))}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" className="text-blue-500" />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                  </MenuItem>
                  {viewMode === 'normal' && (
                    <>
                      <MenuItem onClick={() => handleAction(() => onToggleVisibility && onToggleVisibility(task.id))}>
                        <ListItemIcon>
                          {isHidden ? 
                            <VisibilityIcon fontSize="small" /> : 
                            <VisibilityOffIcon fontSize="small" className="text-purple-500" />
                          }
                        </ListItemIcon>
                        <ListItemText>{isHidden ? "Mostrar tarea" : "Ocultar tarea"}</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => handleAction(() => onDelete(task.id))}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" className="text-red-500" />
                        </ListItemIcon>
                        <ListItemText>Eliminar</ListItemText>
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          ) : (
            // Regular expanded view
            <>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  {task.title}
                  {isHidden && showHiddenTasks && <span className="ml-2 text-xs text-gray-400">(oculta)</span>}
                </h3>
                <div 
                  onClick={e => e.stopPropagation()}
                  {...provided.dragHandleProps && {}}
                >
                  <Tooltip title="Opciones">
                    <button 
                      onClick={handleOpenMenu}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 cursor-pointer"
                    >
                      <MoreVertIcon fontSize="small" />
                    </button>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                  >
                    {onToggleMinimize && (
                      <MenuItem onClick={() => handleAction(() => onToggleMinimize(task.id))}>
                        <ListItemIcon>
                          <UnfoldLessIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Minimizar</ListItemText>
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleAction(() => onViewDetails(task.id))}>
                      <ListItemIcon>
                        <MoreHorizIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Ver detalles</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleAction(() => onEdit(task.id))}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" className="text-blue-500" />
                      </ListItemIcon>
                      <ListItemText>Editar</ListItemText>
                    </MenuItem>
                    {viewMode === 'normal' && (
                      <>
                        <MenuItem onClick={() => handleAction(() => onToggleVisibility && onToggleVisibility(task.id))}>
                          <ListItemIcon>
                            {isHidden ? 
                              <VisibilityIcon fontSize="small" /> : 
                              <VisibilityOffIcon fontSize="small" className="text-purple-500" />
                            }
                          </ListItemIcon>
                          <ListItemText>{isHidden ? "Mostrar tarea" : "Ocultar tarea"}</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleAction(() => onDelete(task.id))}>
                          <ListItemIcon>
                            <DeleteIcon fontSize="small" className="text-red-500" />
                          </ListItemIcon>
                          <ListItemText>Eliminar</ListItemText>
                        </MenuItem>
                      </>
                    )}
                  </Menu>
                </div>
              </div>
            
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{task.description}</p>
              )}
            
              <div className="flex justify-between items-center">
                <TagBadge tag={tagToShow} color={colorToShow} />
                {referenceToShow && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {referenceToShow}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};
