export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export const DEFAULT_TASK_PRIORITY: TaskPriority = 'low';

export const TASK_PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string; color: string }> = [
  { value: 'low', label: 'Bajo', color: '#23C0DF' },
  { value: 'medium', label: 'Medio', color: '#FBC833' },
  { value: 'high', label: 'Alto', color: '#E77009' },
  { value: 'critical', label: 'Critico', color: '#FF5A50' }
];

export const getTaskPriorityOption = (priority?: TaskPriority | null) => {
  return TASK_PRIORITY_OPTIONS.find(option => option.value === priority) || TASK_PRIORITY_OPTIONS[0];
};

export type TaskSortField = 'manual' | 'priority' | 'createdAt' | 'updatedAt';

export const TASK_SORT_OPTIONS: Array<{ value: TaskSortField; label: string }> = [
  { value: 'manual', label: 'Manual' },
  { value: 'priority', label: 'Prioridad' },
  { value: 'createdAt', label: 'Fecha de creacion' },
  { value: 'updatedAt', label: 'Fecha de actualizacion' }
];

export interface Task {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  priority: TaskPriority;
  reference: string; // Nuevo campo para referencia
  hidden?: boolean;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[]; // Array de comentarios
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  order: number;
}

export interface Board {
  columns: Column[];
  presentationColumns?: Column[]; // Columnas para el modo presentación
}

// Modo de visualización del tablero
export type BoardViewMode = 'normal' | 'presentation';
