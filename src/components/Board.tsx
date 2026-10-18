import React, { useState, useMemo, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Column } from './Column';
import { ImportExport } from './ImportExport';
import { PriorityFilter } from './PriorityFilter';
import { TagFilter } from './TagFilter';
import { TaskSortControl } from './TaskSortControl';
import { TaskTextDisplayControl } from './TaskTextDisplayControl';
import { TaskFormModal } from './TaskFormModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { TaskNextStepModal } from './TaskNextStepModal';
import { LanguageSelector } from './LanguageSelector';
import { PresentationBoard } from './PresentationBoard';
import { ThemeToggle } from './ThemeToggle';
import { PresentationModeToggle } from './PresentationModeToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useBoard } from '../hooks/useBoard';
import { useDragDrop } from '../hooks/useDragDrop';
import { useTheme } from '../contexts/ThemeContext';
import { Task, TaskPriority, TaskSortField, TaskTextDisplayMode, getTaskPriorityOption } from '../types';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import ViewQuiltOutlinedIcon from '@mui/icons-material/ViewQuiltOutlined';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  getDialogActionsSx,
  getDialogContentSx,
  getDialogContentTextSx,
  getDialogSx,
  getDialogTextFieldSx,
  getDialogTitleSx,
  getPrimaryDialogButtonSx,
  secondaryDialogButtonSx
} from './dialogTheme';

export const Board: React.FC = () => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const { 
    board, 
    viewMode,
    toggleViewMode,
    getCurrentColumns,
    isLoading, 
    addColumn, 
    updateColumn, 
    deleteColumn, 
    addTask, 
    updateTask, 
    deleteTask, 
    moveTask,
    moveColumnLeft,
    moveColumnRight,
    addComment,
    updateComment,
    deleteComment,
    setTaskNextStep,
    archiveTask,
    unarchiveTask,
    completeTaskNextStep,
    toggleTaskVisibility
  } = useBoard();
  
  const { handleDragEnd, handleDragStart } = useDragDrop(moveTask);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | null>(null);
  const [sortField, setSortField] = useState<TaskSortField>('manual');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [textDisplayMode, setTextDisplayMode] = useState<TaskTextDisplayMode>('description');
  const [showHiddenTasks, setShowHiddenTasks] = useState(false);
  const [showArchivedColumn, setShowArchivedColumn] = useState(false);
  const [minimizedTasks, setMinimizedTasks] = useState<Set<string>>(new Set());
  const [allTasksMinimized, setAllTasksMinimized] = useState(false);
  const [smallText, setSmallText] = useState(false);
  const [displayMenuAnchorEl, setDisplayMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  // Estado para el modal de task form
  const [taskModal, setTaskModal] = useState<{
    open: boolean;
    task?: Task;
    columnId?: string;
  }>({
    open: false
  });

  // Estado para el modal de detalles
  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    task: Task | null;
  }>({
    open: false,
    task: null
  });

  const [nextStepModal, setNextStepModal] = useState<{
    open: boolean;
    task: Task | null;
  }>({
    open: false,
    task: null
  });

  const findTaskById = (taskId: string) => {
    for (const column of board.columns) {
      const task = column.tasks.find(item => item.id === taskId);
      if (task) {
        return task;
      }
    }

    for (const column of getCurrentColumns()) {
      const task = column.tasks.find(item => item.id === taskId);
      if (task) {
        return task;
      }
    }

    return null;
  };

  const findTaskForEditing = (taskId: string) => {
    for (const column of board.columns) {
      const task = column.tasks.find(item => item.id === taskId);
      if (task) {
        return { task, columnId: column.id };
      }
    }

    for (const column of getCurrentColumns()) {
      const task = column.tasks.find(item => item.id === taskId);
      if (task) {
        return { task, columnId: column.id };
      }
    }

    return null;
  };

  // Efecto para actualizar la tarea en el modal de detalles cuando cambia el board
  useEffect(() => {
    if (detailsModal.open && detailsModal.task) {
      const updatedTask = findTaskById(detailsModal.task.id);
      if (updatedTask) {
        setDetailsModal({ open: true, task: updatedTask });
      }
    }
  }, [board, viewMode]);

  useEffect(() => {
    if (nextStepModal.open && nextStepModal.task) {
      const updatedTask = findTaskById(nextStepModal.task.id);
      if (updatedTask) {
        setNextStepModal({ open: true, task: updatedTask });
      }
    }
  }, [board, viewMode]);

  // Abrir modal para crear tarea
  const handleOpenAddTaskModal = (columnId: string) => {
    setTaskModal({ open: true, columnId });
  };

  // Abrir modal para editar tarea
  const handleOpenEditTaskModal = (taskId: string) => {
    const taskToEdit = findTaskForEditing(taskId);

    if (taskToEdit) {
      setTaskModal({ open: true, task: taskToEdit.task, columnId: taskToEdit.columnId });
    }
  };

  // Abrir modal de detalles
  const handleOpenDetailsModal = (taskId: string) => {
    const taskToView = findTaskById(taskId);

    if (taskToView) {
      setDetailsModal({ open: true, task: taskToView });
    }
  };

  const handleOpenNextStepModal = (taskId: string) => {
    const taskToManage = findTaskById(taskId);

    if (taskToManage) {
      setNextStepModal({ open: true, task: taskToManage });
    }
  };

  // Cerrar modal de tarea
  const handleCloseTaskModal = () => {
    setTaskModal({ open: false });
  };

  // Cerrar modal de detalles
  const handleCloseDetailsModal = () => {
    setDetailsModal({ open: false, task: null });
  };

  const handleCloseNextStepModal = () => {
    setNextStepModal({ open: false, task: null });
  };

  // Manejar submit del formulario
  const handleTaskFormSubmit = (
    taskData: Omit<Task, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>,
    columnId?: string
  ) => {
    if (taskModal.task && taskModal.task.id) {
      // Editar tarea existente
      updateTask(taskModal.task.id, taskData);
    } else if (columnId) {
      // Crear nueva tarea
      addTask(columnId, taskData);
    }
  };

  // Manejadores específicos para comentarios con actualización inmediata de UI
  const handleAddComment = (taskId: string, commentText: string) => {
    addComment(taskId, commentText);
    
    // Buscar la tarea actualizada si el modal está abierto
    if (detailsModal.open && detailsModal.task && detailsModal.task.id === taskId) {
      const task = detailsModal.task;
      const now = new Date().toISOString();
      
      // Crear un nuevo comentario localmente
      const newComment = {
        id: crypto.randomUUID(), // Generamos un ID temporal
        text: commentText,
        createdAt: now,
        updatedAt: now
      };
      
      // Actualizar el estado local de la tarea en el modal
      const updatedComments = [...(task.comments || []), newComment];
      const updatedTask = { ...task, comments: updatedComments, updatedAt: now };
      
      // Actualizar el estado del modal con la tarea actualizada
      setDetailsModal({ open: true, task: updatedTask });
    }
  };

  const handleUpdateComment = (taskId: string, commentId: string, newText: string) => {
    updateComment(taskId, commentId, newText);
    
    // Actualizar el estado local si es necesario
    if (detailsModal.open && detailsModal.task && detailsModal.task.id === taskId) {
      const task = detailsModal.task;
      const now = new Date().toISOString();
      
      if (task.comments) {
        const updatedComments = task.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, text: newText, updatedAt: now } 
            : comment
        );
        
        const updatedTask = { ...task, comments: updatedComments, updatedAt: now };
        setDetailsModal({ open: true, task: updatedTask });
      }
    }
  };

  const handleDeleteComment = (taskId: string, commentId: string) => {
    deleteComment(taskId, commentId);
    
    // Actualizar el estado local si es necesario
    if (detailsModal.open && detailsModal.task && detailsModal.task.id === taskId) {
      const task = detailsModal.task;
      const now = new Date().toISOString();
      
      if (task.comments) {
        const updatedComments = task.comments.filter(comment => comment.id !== commentId);
        const updatedTask = { ...task, comments: updatedComments, updatedAt: now };
        setDetailsModal({ open: true, task: updatedTask });
      }
    }
  };

  const handleSaveNextStep = (taskId: string, nextStep: string) => {
    const trimmedNextStep = nextStep.trim();
    setTaskNextStep(taskId, trimmedNextStep);

    if (detailsModal.open && detailsModal.task?.id === taskId) {
      setDetailsModal({
        open: true,
        task: {
          ...detailsModal.task,
          nextStep: trimmedNextStep,
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (nextStepModal.open && nextStepModal.task?.id === taskId) {
      setNextStepModal({
        open: true,
        task: {
          ...nextStepModal.task,
          nextStep: trimmedNextStep,
          updatedAt: new Date().toISOString()
        }
      });
    }
  };

  const handleCompleteNextStep = (taskId: string, nextStepText?: string) => {
    const resolvedNextStep = nextStepText?.trim() || findTaskById(taskId)?.nextStep?.trim() || '';

    if (!resolvedNextStep) {
      return;
    }

    completeTaskNextStep(taskId, resolvedNextStep);

    if (detailsModal.open && detailsModal.task?.id === taskId) {
      const now = new Date().toISOString();
      setDetailsModal({
        open: true,
        task: {
          ...detailsModal.task,
          nextStep: '',
          comments: [
            ...(detailsModal.task.comments || []),
            {
              id: crypto.randomUUID(),
              text: `Se completó el siguiente paso:\n${resolvedNextStep}`,
              createdAt: now,
              updatedAt: now
            }
          ],
          updatedAt: now
        }
      });
    }

    if (nextStepModal.open && nextStepModal.task?.id === taskId) {
      setNextStepModal({
        open: true,
        task: {
          ...nextStepModal.task,
          nextStep: '',
          updatedAt: new Date().toISOString()
        }
      });
    }
  };

  // Extract unique tags from all tasks
  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    const tagsMap = new Map<string, string>(); // tag -> color
    
    // Use all tasks from normal mode for tags
    board.columns
      .filter(column => showArchivedColumn || !column.isArchive)
      .forEach(column => {
      column.tasks.forEach(task => {
        // Handle both new and legacy properties
        const tag = task.tag || (task as any).client || '';
        const color = task.tagColor || (task as any).clientColor || '#f87171';
        
        if (tag && !tagsSet.has(tag)) {
          tagsSet.add(tag);
          tagsMap.set(tag, color);
        }
      });
    });
    
    return Array.from(tagsSet).map(tag => ({
      tag,
      color: tagsMap.get(tag) || '#f87171'
    })).sort((a, b) => a.tag.localeCompare(b.tag));
  }, [board, showArchivedColumn]);
  
  // Filter tasks by selected tag and visibility
  const taskMatchesFilters = (task: Task) => {
    if (!showHiddenTasks && task.hidden) {
      return false;
    }

    const taskTag = task.tag || (task as any).client || '';
    if (selectedTag && taskTag !== selectedTag) {
      return false;
    }

    if (selectedPriority && task.priority !== selectedPriority) {
      return false;
    }

    return true;
  };

  const getFilteredTasks = (tasks: Task[]) => {
    return tasks.filter(taskMatchesFilters);
  };

  const sortTasks = (tasks: Task[]) => {
    const sortedTasks = tasks.slice();

    if (sortField === 'manual') {
      return sortedTasks.sort((firstTask, secondTask) => firstTask.order - secondTask.order);
    }

    const directionFactor = sortDirection === 'asc' ? 1 : -1;

    return sortedTasks.sort((firstTask, secondTask) => {
      if (sortField === 'priority') {
        const priorityWeight = (task: Task) => TASK_PRIORITY_OPTIONS.findIndex(option => option.value === getTaskPriorityOption(task.priority).value);
        const result = priorityWeight(firstTask) - priorityWeight(secondTask);
        return result === 0 ? firstTask.order - secondTask.order : result * directionFactor;
      }

      const firstDate = new Date(firstTask[sortField]).getTime();
      const secondDate = new Date(secondTask[sortField]).getTime();
      const result = firstDate - secondDate;

      if (result === 0) {
        return firstTask.order - secondTask.order;
      }

      return result * directionFactor;
    });
  };

  // Prepare columns for rendering based on view mode and filters
  const columnsToRender = useMemo(() => {
    const currentColumns = getCurrentColumns();
    
    if (viewMode === 'presentation') {
      // Get all filtered tasks from normal mode
      const allFilteredTasks: Task[] = [];
      
      board.columns
        .filter(normalCol => !normalCol.isArchive)
        .forEach(normalCol => {
        const tasksForColumn = normalCol.tasks.filter(taskMatchesFilters);
        
        allFilteredTasks.push(...tasksForColumn);
      });
      
      const existingTaskIds = new Set<string>();
      currentColumns.forEach(col => {
        col.tasks.forEach(task => existingTaskIds.add(task.id));
      });
      
      // Find tasks that aren't already in presentation columns
      const newTasks = allFilteredTasks.filter(task => !existingTaskIds.has(task.id));
      
      // Create a copy of the presentation columns
      const updatedColumns = [...currentColumns];
      
      // Add any new tasks to the first column if it exists
      if (updatedColumns.length > 0 && newTasks.length > 0) {
        const firstColumn = updatedColumns.find(col => col.order === 0) || updatedColumns[0];
        const columnIndex = updatedColumns.findIndex(col => col.id === firstColumn.id);
        
        if (columnIndex >= 0) {
          updatedColumns[columnIndex] = {
            ...firstColumn,
            tasks: [...firstColumn.tasks, ...newTasks]
          };
        }
      }
      
      return updatedColumns;
    }
    
    // For normal mode, just return the columns
    return showArchivedColumn
      ? currentColumns
      : currentColumns.filter(column => !column.isArchive);
  }, [board, viewMode, selectedTag, selectedPriority, getCurrentColumns, showHiddenTasks, showArchivedColumn]);

  const visibleBoardColumns = useMemo(() => {
    return board.columns
      .slice()
      .sort((firstColumn, secondColumn) => firstColumn.order - secondColumn.order)
      .filter(column => showArchivedColumn || !column.isArchive)
      .map(column => ({
        ...column,
        tasks: sortTasks(getFilteredTasks(column.tasks))
      }));
  }, [board.columns, showHiddenTasks, showArchivedColumn, selectedTag, selectedPriority, sortField, sortDirection]);

  const presentationColumnsData = useMemo(() => {
    return visibleBoardColumns.filter(column => !column.isArchive);
  }, [visibleBoardColumns]);

  const filteredTasksForExport = useMemo(() => {
    return visibleBoardColumns.flatMap(column => column.tasks);
  }, [visibleBoardColumns]);

  // Toggle minimization for a single task
  const toggleTaskMinimization = (taskId: string) => {
    setMinimizedTasks(prev => {
      const newMinimized = new Set(prev);
      if (newMinimized.has(taskId)) {
        newMinimized.delete(taskId);
      } else {
        newMinimized.add(taskId);
      }
      return newMinimized;
    });
  };

  // Effect to handle minimization state when view mode changes
  useEffect(() => {
    // This ensures minimization state is preserved between mode switches
    if (viewMode === 'presentation') {
      // Force a re-render to apply minimization states immediately
      setMinimizedTasks(prev => new Set([...prev]));
    }
  }, [viewMode]);

  // Toggle minimization for all tasks - fixed version
  const toggleAllTasksMinimization = () => {
    // Use columnsToRender instead of getCurrentColumns() to ensure we get ALL visible tasks
    const currentlyVisibleColumns = columnsToRender;
    
    if (allTasksMinimized) {
      // Clear minimized tasks
      setMinimizedTasks(new Set());
      setAllTasksMinimized(false);
    } else {
      // Create a new set of ALL task IDs from currently visible columns
      const allTaskIds = new Set<string>();
      
      currentlyVisibleColumns.forEach(col => {
        const filteredTasks = getFilteredTasks(col.tasks);
        filteredTasks.forEach(task => {
          allTaskIds.add(task.id);
        });
      });
      
      // Log for debugging
      console.log(`Minimizing ${allTaskIds.size} tasks`);
      
      // Set the new minimized tasks
      setMinimizedTasks(allTaskIds);
      setAllTasksMinimized(true);
    }
  };

  // Toggle text size
  const toggleTextSize = () => {
    setSmallText(prev => !prev);
  };

  // Function definitions - order matters for React function components
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  // Handle visibility toggle for task
  const handleToggleTaskVisibility = (taskId: string) => {
    toggleTaskVisibility(taskId);
  };

  const handleOpenDisplayMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDisplayMenuAnchorEl(event.currentTarget);
  };

  const handleCloseDisplayMenu = () => {
    setDisplayMenuAnchorEl(null);
  };

  const handleArchiveToggle = (taskId: string) => {
    const task = findTaskById(taskId);

    if (!task) {
      return;
    }

    if (task.archivedAt) {
      unarchiveTask(taskId);
      return;
    }

    archiveTask(taskId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-4 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {viewMode === 'presentation' ? t('board.titlePresentation') : t('board.title')}
        </h1>
        <div className="flex space-x-2 items-center">
          <LanguageSelector />
          <ThemeToggle />
          <ImportExport board={board} filteredTasks={filteredTasksForExport} />
          <Button
            onClick={handleOpenDisplayMenu}
            variant="outlined"
            color="secondary"
            startIcon={<ViewQuiltOutlinedIcon />}
          >
            {t('board.view')}
          </Button>
          <Menu
            anchorEl={displayMenuAnchorEl}
            open={Boolean(displayMenuAnchorEl)}
            onClose={handleCloseDisplayMenu}
            MenuListProps={{ dense: true }}
            PaperProps={{
              className: darkMode ? 'bg-gray-800 text-gray-100' : ''
            }}
          >
            {viewMode === 'normal' && (
              <MenuItem onClick={toggleAllTasksMinimization} className={darkMode ? 'text-gray-100 hover:bg-gray-700' : ''}>
                <ListItemIcon>
                  {allTasksMinimized ? <UnfoldMoreIcon fontSize="small" /> : <UnfoldLessIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{allTasksMinimized ? t('board.expandTasks') : t('board.minimizeTasks')}</ListItemText>
              </MenuItem>
            )}
            <MenuItem onClick={toggleTextSize} className={darkMode ? 'text-gray-100 hover:bg-gray-700' : ''}>
              <ListItemIcon>
                {smallText ? <TextIncreaseIcon fontSize="small" /> : <TextDecreaseIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>{smallText ? t('board.normalText') : t('board.compactText')}</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => setShowHiddenTasks((currentValue) => !currentValue)}
              className={darkMode ? 'text-gray-100 hover:bg-gray-700' : ''}
            >
              <ListItemIcon>
                {showHiddenTasks ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>{showHiddenTasks ? t('board.hideHiddenTasks') : t('board.showHiddenTasks')}</ListItemText>
              <Switch
                edge="end"
                checked={showHiddenTasks}
                onChange={(event) => {
                  event.stopPropagation();
                  setShowHiddenTasks(event.target.checked);
                }}
                size="small"
              />
            </MenuItem>
            {viewMode === 'normal' && (
              <MenuItem
                onClick={() => setShowArchivedColumn((currentValue) => !currentValue)}
                className={darkMode ? 'text-gray-100 hover:bg-gray-700' : ''}
              >
                <ListItemIcon>
                  {showArchivedColumn ? <UnarchiveOutlinedIcon fontSize="small" /> : <ArchiveOutlinedIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{showArchivedColumn ? t('board.hideArchived') : t('board.showArchived')}</ListItemText>
                <Switch
                  edge="end"
                  checked={showArchivedColumn}
                  onChange={(event) => {
                    event.stopPropagation();
                    setShowArchivedColumn(event.target.checked);
                  }}
                  size="small"
                />
              </MenuItem>
            )}
          </Menu>
          <PresentationModeToggle viewMode={viewMode} onToggle={toggleViewMode} />
          {viewMode === 'normal' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddingColumn(true)}
            >
              {t('board.newColumn')}
            </Button>
          )}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {uniqueTags.length > 0 && (
            <TagFilter
              tags={uniqueTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          )}
          <PriorityFilter
            selectedPriority={selectedPriority}
            onPrioritySelect={setSelectedPriority}
          />
          <TaskTextDisplayControl
            displayMode={textDisplayMode}
            onDisplayModeChange={setTextDisplayMode}
          />
          <TaskSortControl
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {viewMode === 'presentation' ? (
          <PresentationBoard
            columns={presentationColumnsData}
            darkMode={darkMode}
            textDisplayMode={textDisplayMode}
            smallText={smallText}
            onViewDetails={handleOpenDetailsModal}
            onManageNextStep={handleOpenNextStepModal}
            onEditTask={handleOpenEditTaskModal}
            onAddTask={handleOpenAddTaskModal}
          />
        ) : (
          <DragDropContext 
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <div className="flex h-full w-full gap-0 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
              {columnsToRender
                .sort((a, b) => a.order - b.order)
                .map((column) => (
                  <Column
                    key={`${column.id}-${viewMode}`}
                    column={column}
                    tasks={sortTasks(getFilteredTasks(column.tasks))}
                    onAddTask={() => handleOpenAddTaskModal(column.id)}
                    onEditTask={handleOpenEditTaskModal}
                    onDeleteTask={deleteTask}
                    onViewDetails={handleOpenDetailsModal}
                    onManageNextStep={handleOpenNextStepModal}
                    onToggleArchive={handleArchiveToggle}
                    onUpdateColumn={updateColumn}
                    onDeleteColumn={deleteColumn}
                    onMoveLeft={moveColumnLeft}
                    onMoveRight={moveColumnRight}
                    onToggleTaskVisibility={handleToggleTaskVisibility}
                    onToggleMinimize={toggleTaskMinimization}
                    minimizedTasks={minimizedTasks}
                    viewMode={viewMode}
                    showHiddenTasks={showHiddenTasks}
                    smallText={smallText}
                    textDisplayMode={textDisplayMode}
                  />
                ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Modal para crear/editar tareas */}
      <TaskFormModal
        open={taskModal.open}
        task={taskModal.task}
        columnId={taskModal.columnId}
        onClose={handleCloseTaskModal}
        onSubmit={handleTaskFormSubmit}
      />

      {/* Modal para ver detalles de tarea */}
      <TaskDetailsModal
        open={detailsModal.open}
        task={detailsModal.task}
        onClose={handleCloseDetailsModal}
        onAddComment={handleAddComment}
        onEditComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onSaveNextStep={handleSaveNextStep}
        onCompleteNextStep={handleCompleteNextStep}
      />

      <TaskNextStepModal
        open={nextStepModal.open}
        task={nextStepModal.task}
        onClose={handleCloseNextStepModal}
        onSave={handleSaveNextStep}
        onComplete={handleCompleteNextStep}
      />

      {/* Dialog para agregar nueva columna */}
      <Dialog 
        open={isAddingColumn} 
        onClose={() => setIsAddingColumn(false)}
        sx={getDialogSx(darkMode)}
      >
        <DialogTitle sx={getDialogTitleSx(darkMode)}>
          {viewMode === 'presentation' ? t('board.newPresentationColumn') : t('board.newColumn')}
        </DialogTitle>
        <DialogContent sx={getDialogContentSx(darkMode)}>
          <DialogContentText sx={getDialogContentTextSx(darkMode)}>
            {t('board.columnDialogText')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="columnTitle"
            label={t('board.columnTitle')}
            type="text"
            fullWidth
            variant="outlined"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddColumn();
            }}
            sx={getDialogTextFieldSx(darkMode)}
          />
        </DialogContent>
        <DialogActions sx={getDialogActionsSx(darkMode)}>
          <Button onClick={() => setIsAddingColumn(false)} variant="outlined" sx={secondaryDialogButtonSx}>
            {t('board.cancel')}
          </Button>
          <Button onClick={handleAddColumn} variant="contained" color="primary" sx={getPrimaryDialogButtonSx(darkMode)}>
            {t('board.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
