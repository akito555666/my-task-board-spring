export interface Task {
  id: string;
  name: string;
  status: string;
  icon: string;
  content: string;
}

export interface Column {
  id: string;
  name: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}
