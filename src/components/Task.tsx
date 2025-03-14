import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task as TaskType } from '../types';
import { TagBadge } from './TagBadge';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskProps {
  task: TaskType;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const Task: React.FC<TaskProps> = ({ task, index, onEdit, onDelete }) => {
  // Compatibilidad con datos antiguos
  const tagToShow = task.tag || (task as any).client || '';
  const colorToShow = task.tagColor || (task as any).clientColor || '#f87171';
  const referenceToShow = task.reference || '';

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
          className={`p-4 mb-3 bg-white rounded-md shadow-sm border border-gray-200 
            ${snapshot.isDragging ? 'opacity-80 shadow-lg bg-blue-50 border-blue-300 rotate-1' : ''}
            transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-800">{task.title}</h3>
            <div 
              className="flex space-x-1"
              onClick={e => e.stopPropagation()}
              {...provided.dragHandleProps && {}} // Esto elimina el comportamiento de arrastre en los botones
            >
              <button 
                onClick={() => onEdit(task.id)}
                className="text-blue-500 hover:text-blue-700 p-1 cursor-pointer"
              >
                <EditIcon fontSize="small" />
              </button>
              <button 
                onClick={() => onDelete(task.id)}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
              >
                <DeleteIcon fontSize="small" />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex justify-between items-center">
            <TagBadge tag={tagToShow} color={colorToShow} />
            {referenceToShow && (
              <span className="text-xs text-gray-500 font-mono">
                {referenceToShow}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
