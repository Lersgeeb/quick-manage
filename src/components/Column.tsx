import React, { useMemo, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Column as ColumnType, Task as TaskType, BoardViewMode, TASK_PRIORITY_OPTIONS, TaskTextDisplayMode } from '../types';
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
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import Tooltip from '@mui/material/Tooltip';
import { useLanguage } from '../contexts/LanguageContext';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onAddTask: (columnId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewDetails: (taskId: string) => void; // Nueva prop para ver detalles
  onManageNextStep: (taskId: string) => void;
  onToggleArchive: (taskId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveLeft: (columnId: string) => void;
  onMoveRight: (columnId: string) => void;
  viewMode?: BoardViewMode;
  onToggleTaskVisibility?: (taskId: string) => void;
  onToggleMinimize?: (taskId: string) => void;
  minimizedTasks?: Set<string>;
  showHiddenTasks?: boolean;
  smallText?: boolean;
  textDisplayMode: TaskTextDisplayMode;
}

export const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  onViewDetails, // Nueva prop
  onManageNextStep,
  onToggleArchive,
  onUpdateColumn,
  onDeleteColumn,
  onMoveLeft,
  onMoveRight,
  viewMode = 'normal',
  onToggleTaskVisibility,
  onToggleMinimize,
  minimizedTasks = new Set(),
  showHiddenTasks = false,
  smallText = false,
  textDisplayMode
}) => {
  const { t } = useLanguage();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isArchiveColumn = Boolean(column.isArchive);
  const priorityCounts = useMemo(
    () =>
      TASK_PRIORITY_OPTIONS.map(option => ({
        ...option,
        count: tasks.filter(task => task.priority === option.value).length
      })),
    [tasks]
  );

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
              {t('column.save')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-gray-700 dark:text-gray-200">{column.title}</h2>
              {isArchiveColumn && (
                <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  <ArchiveOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  {t('column.archiveBadge')}
                </span>
              )}
              <div className='bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-xl'>{tasks.length}</div>
            </div>
            <div className="flex items-center space-x-1">
              {!isArchiveColumn && (
                <Tooltip title={t('column.addTask')}>
                  <button
                    onClick={() => onAddTask(column.id)}
                    className="p-1 text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    title={t('column.addTask')}
                  >
                    <AddIcon fontSize="small" />
                  </button>
                </Tooltip>
              )}
              <button 
                onClick={() => onMoveLeft(column.id)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title={t('column.moveLeft')}
              >
                <ChevronLeftIcon fontSize="small" />
              </button>
              <button 
                onClick={() => onMoveRight(column.id)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title={t('column.moveRight')}
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
              {!isArchiveColumn && (
                <MenuItem onClick={handleEditColumnTitle}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('column.editTitle')}</ListItemText>
                </MenuItem>
              )}
              {!isArchiveColumn && (
                <MenuItem onClick={handleDeleteColumn}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('column.deleteColumn')}</ListItemText>
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow overflow-y-auto p-3 rounded-md transition-colors duration-200 min-h-[200px] custom-scrollbar ${
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
                onManageNextStep={onManageNextStep}
                onToggleArchive={onToggleArchive}
                onToggleVisibility={onToggleTaskVisibility}
                onToggleMinimize={onToggleMinimize}
                isMinimized={minimizedTasks.has(task.id)}
                viewMode={viewMode}
                showHiddenTasks={showHiddenTasks}
                smallText={smallText}
                textDisplayMode={textDisplayMode}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-3 pt-3">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
            {t('column.summary')}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
        </div>

        <div className="grid grid-cols-4 gap-2">
        {priorityCounts.map((priority) => (
          <div
            key={priority.value}
            className="flex items-center justify-center gap-2 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-100"
            title={t('column.priorityCount', { count: priority.count, priority: t(priority.label).toLowerCase() })}
            aria-label={t('column.priorityCount', { count: priority.count, priority: t(priority.label).toLowerCase() })}
          >
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: priority.color }} />
            <span>{priority.count}</span>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};
