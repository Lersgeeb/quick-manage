import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task as TaskType, BoardViewMode } from '../types';
import { TagBadge } from './TagBadge';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';

interface TaskProps {
  task: TaskType;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
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
  viewMode = 'normal',
  showHiddenTasks = false
}) => {
  // Compatibilidad con datos antiguos
  const tagToShow = task.tag || (task as any).client || '';
  const colorToShow = task.tagColor || (task as any).clientColor || '#f87171';
  const referenceToShow = task.reference || '';
  const isHidden = task.hidden || false;

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
            transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">
              {task.title}
              {isHidden && showHiddenTasks && <span className="ml-2 text-xs text-gray-400">(oculta)</span>}
            </h3>
            <div 
              className="flex space-x-1"
              onClick={e => e.stopPropagation()}
              {...provided.dragHandleProps && {}} // Esto elimina el comportamiento de arrastre en los botones
            >
              <Tooltip title="Ver detalles">
                <button 
                  onClick={() => onViewDetails(task.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 cursor-pointer"
                >
                  <MoreHorizIcon fontSize="small" />
                </button>
              </Tooltip>
              <Tooltip title="Editar">
                <button 
                  onClick={() => onEdit(task.id)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 cursor-pointer"
                >
                  <EditIcon fontSize="small" />
                </button>
              </Tooltip>
              {viewMode === 'normal' && (
                <>
                  <Tooltip title={isHidden ? "Mostrar tarea" : "Ocultar tarea"}>
                    <button 
                      onClick={() => onToggleVisibility && onToggleVisibility(task.id)}
                      className={`${isHidden 
                        ? "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" 
                        : "text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                      } p-1 cursor-pointer`}
                    >
                      {isHidden ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                    </button>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 cursor-pointer"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </Tooltip>
                </>
              )}
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
        </div>
      )}
    </Draggable>
  );
};
