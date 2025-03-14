import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Column } from './Column';
import { ImportExport } from './ImportExport';
import { useBoard } from '../hooks/useBoard';
import { useDragDrop } from '../hooks/useDragDrop';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

export const Board: React.FC = () => {
  const { 
    board, 
    isLoading, 
    addColumn, 
    updateColumn, 
    deleteColumn, 
    addTask, 
    updateTask, 
    deleteTask, 
    moveTask,
    moveColumnLeft,
    moveColumnRight
  } = useBoard();
  
  const { handleDragEnd, handleDragStart } = useDragDrop(moveTask);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">QuickManage</h1>
        <div className="flex space-x-2">
          <ImportExport />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddingColumn(true)}
          >
            Nueva Columna
          </Button>
        </div>
      </div>

      <DragDropContext 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="flex space-x-4 overflow-x-auto pb-4 h-[calc(100vh-140px)]">
          {board.columns
            .sort((a, b) => a.order - b.order)
            .map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={column.tasks.sort((a, b) => a.order - b.order)}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onUpdateColumn={updateColumn}
                onDeleteColumn={deleteColumn}
                onMoveLeft={moveColumnLeft}
                onMoveRight={moveColumnRight}
              />
            ))}
        </div>
      </DragDropContext>

      {/* Dialog para agregar nueva columna */}
      <Dialog open={isAddingColumn} onClose={() => setIsAddingColumn(false)}>
        <DialogTitle>Nueva Columna</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingresa un título para la nueva columna.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="columnTitle"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddColumn();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingColumn(false)}>Cancelar</Button>
          <Button onClick={handleAddColumn} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
