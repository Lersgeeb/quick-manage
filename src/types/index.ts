export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  reference: string; // Nuevo campo para referencia
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
}
