import { useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';

export const useDragDrop = (moveTask: (taskId: string, sourceColId: string, destColId: string, newOrder: number) => void) => {
  const handleDragEnd = useCallback((result: DropResult) => {
    console.log('Drag end result:', result); // Para depuración
    
    const { destination, source, draggableId } = result;
    
    // Si no hay destino, la tarea se soltó fuera de un área válida
    if (!destination) {
      console.log('No destination found');
      return;
    }
    
    // Si la tarea se soltó en la misma posición, no hacer nada
    if (
      destination.droppableId === source.droppableId && 
      destination.index === source.index
    ) {
      console.log('Dropped in same position');
      return;
    }
    
    try {
      moveTask(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      );
    } catch (error) {
      console.error('Error moving task:', error);
    }
  }, [moveTask]);

  // Para depurar problemas con el inicio del arrastre
  const handleDragStart = useCallback((start: any) => {
    console.log('Drag started:', start);
  }, []);

  return { handleDragEnd, handleDragStart };
};
