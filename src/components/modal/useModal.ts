import { Dispatch, SetStateAction } from 'react';
import { Task } from '../../types';

interface UseModalProps {
  setEditTask: Dispatch<SetStateAction<Partial<Task> | null>>;
}

export const useModal = ({ setEditTask }: UseModalProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditTask((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleIconSelect = (icon: string) => {
    setEditTask(prev => {
      if (!prev) return null;
      if (prev.icon === icon) {
        return { ...prev, icon: '' };
      }
      return { ...prev, icon };
    });
  };

  const handleStatusSelect = (status_name: Task['status_name']) => {
    setEditTask(prev => {
      if (!prev) return null;
      if (prev.status_name === status_name) {
        return { ...prev, status_name: 'to-do' };
      }
      return { ...prev, status_name };
    });
  };

  return {
    handleInputChange,
    handleIconSelect,
    handleStatusSelect,
  };
};