export interface Task {
  id: number;
  name: string;
  status: 'in-progress' | 'completed' | 'wont-do' | 'to-do';
  icon: string;
  content: string;
}
