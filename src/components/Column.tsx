import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Column as ColumnType, Task as TaskType, BoardViewMode } from '../types';
import { Task } from './Task';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onAddTask: (columnId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewDetails: (taskId: string) => void; // Nueva prop para ver detalles
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveLeft: (columnId: string) => void;
  onMoveRight: (columnId: string) => void;
  viewMode?: BoardViewMode;
  onToggleTaskVisibility?: (taskId: string) => void;
  onToggleMinimize?: (taskId: string) => void;
  minimizedTasks?: Set<string>;
  showHiddenTasks?: boolean;
}

export const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  onViewDetails, // Nueva prop
  onUpdateColumn,
  onDeleteColumn,
  onMoveLeft,
  onMoveRight,
  viewMode = 'normal',
  onToggleTaskVisibility,
  onToggleMinimize,
  minimizedTasks = new Set(),
  showHiddenTasks = false
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditColumnTitle = () => {
    setIsEditingTitle(true);
    handleCloseMenu();
  };

  const handleSaveColumnTitle = () => {
    if (newTitle.trim()) {
      onUpdateColumn(column.id, newTitle);
    }
    setIsEditingTitle(false);
  };

  const handleDeleteColumn = () => {
    onDeleteColumn(column.id);
    handleCloseMenu();
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md flex flex-col max-h-full flex-1 min-w-[300px] mr-4 last:mr-0 transition-colors duration-200">
      <div className="flex justify-between items-center mb-2 p-2">
        {isEditingTitle ? (
          <div className="flex w-full">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md mr-1 dark:bg-gray-700 dark:text-white"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSaveColumnTitle();
              }}
            />
            <button 
              onClick={handleSaveColumnTitle}
              className="px-2 py-1 bg-blue-500 text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-bold text-gray-700 dark:text-gray-200">{column.title}</h2>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => onMoveLeft(column.id)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Mover a la izquierda"
              >
                <ChevronLeftIcon fontSize="small" />
              </button>
              <button 
                onClick={() => onMoveRight(column.id)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Mover a la derecha"
              >
                <ChevronRightIcon fontSize="small" />
              </button>
              <button 
                onClick={handleOpenMenu}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <MoreVertIcon fontSize="small" />
              </button>
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleEditColumnTitle}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Editar título</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDeleteColumn}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Eliminar columna</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow overflow-y-auto p-3 rounded-md transition-colors duration-200 min-h-[200px] ${
              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-dashed border-blue-300 dark:border-blue-700' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onViewDetails={onViewDetails}
                onToggleVisibility={onToggleTaskVisibility}
                onToggleMinimize={onToggleMinimize}
                isMinimized={minimizedTasks.has(task.id)}
                viewMode={viewMode}
                showHiddenTasks={showHiddenTasks}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={() => onAddTask(column.id)}
        className="mt-2 w-full py-2 bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-300 border border-blue-300 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
      >
        <AddIcon fontSize="small" className="mr-1" /> Añadir tarea
      </button>
    </div>
  );
};
