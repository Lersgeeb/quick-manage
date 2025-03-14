import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Column as ColumnType, Task as TaskType } from '../types';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
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
  onAddTask: (columnId: string, task: Omit<TaskType, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<TaskType>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveLeft: (columnId: string) => void;
  onMoveRight: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask,
  onUpdateColumn,
  onDeleteColumn,
  onMoveLeft,
  onMoveRight
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
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

  const handleAddTask = (taskData: Omit<TaskType, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>) => {
    onAddTask(column.id, taskData);
    setIsAddingTask(false);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleUpdateTask = (taskData: Omit<TaskType, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>) => {
    if (editingTaskId) {
      onUpdateTask(editingTaskId, taskData);
      setEditingTaskId(null);
    }
  };

  const taskBeingEdited = editingTaskId ? tasks.find(t => t.id === editingTaskId) : undefined;

  return (
    <div className="bg-gray-100 p-2 rounded-md w-72 flex flex-col max-h-full">
      <div className="flex justify-between items-center mb-2 p-2">
        {isEditingTitle ? (
          <div className="flex w-full">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md mr-1"
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
            <h2 className="font-bold text-gray-700">{column.title}</h2>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => onMoveLeft(column.id)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                title="Mover a la izquierda"
              >
                <ChevronLeftIcon fontSize="small" />
              </button>
              <button 
                onClick={() => onMoveRight(column.id)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                title="Mover a la derecha"
              >
                <ChevronRightIcon fontSize="small" />
              </button>
              <button 
                onClick={handleOpenMenu}
                className="text-gray-500 hover:text-gray-700"
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
              snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                onEdit={handleEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {!isAddingTask && !editingTaskId && (
        <button
          onClick={() => setIsAddingTask(true)}
          className="mt-2 w-full py-2 bg-white text-blue-500 border border-blue-300 rounded-md hover:bg-blue-50 flex items-center justify-center"
        >
          <AddIcon fontSize="small" className="mr-1" /> Añadir tarea
        </button>
      )}

      {isAddingTask && (
        <div className="mt-2">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddingTask(false)}
          />
        </div>
      )}

      {editingTaskId && taskBeingEdited && (
        <div className="mt-2">
          <TaskForm
            task={taskBeingEdited}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTaskId(null)}
          />
        </div>
      )}
    </div>
  );
};
