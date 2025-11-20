import { Task } from "../../types";

type Props = {
  setEditTask: React.Dispatch<React.SetStateAction<Partial<Task> | null>>
};

export const useModal = ({ setEditTask }: Props) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditTask(prev => prev ? { ...prev, [name]: value } : null);
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

  const handleStatusSelect = (status: string) => {
    setEditTask(prev => {
      if (!prev) {
        return { status: '' };
      }
      return { ...prev, status };
    });
  };

  return { handleInputChange, handleIconSelect, handleStatusSelect }
}