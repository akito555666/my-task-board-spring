export interface Task {
  id: string;
  name: string;
  status_name: 'in-progress' | 'completed' | 'wont-do' | 'to-do';
  icon: string;
  content: string;
  created_at?: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
}