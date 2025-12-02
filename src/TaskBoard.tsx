import React, { useState, useEffect } from "react";
import { Board, Task } from "./types";
import { BoardHeader } from "./components/BoardHeader";
import { TaskList } from "./components/TaskList";
import { Modal } from "./components/modal/Modal";
import { API_URL } from "./config";

interface TaskBoardProps {
  onLogout?: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ onLogout }): React.ReactElement => {
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const boardId = localStorage.getItem('boardId');
    if (boardId) {
      fetchBoard(boardId);
    } else {
      createNewBoard();
    }
  }, []);

  const fetchBoard = async (boardId: string) => {
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}`, {
        headers: getAuthHeaders() as HeadersInit
      });
      if (response.ok) {
        const data = await response.json();
        setBoard(data.board);
        setTasks(data.tasks);
        localStorage.setItem('boardId', data.board.id);
      } else if (response.status === 401) {
        onLogout && onLogout();
      } else {
        localStorage.removeItem('boardId');
        createNewBoard();
      }
    } catch (error) {
      console.error('Failed to fetch board:', error);
      localStorage.removeItem('boardId');
    }
  };

  const createNewBoard = async () => {
    try {
      const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        } as HeadersInit
      });

      if (response.status === 401) {
        onLogout && onLogout();
        return;
      }

      if (!response.ok) {
        console.error('Failed to create board:', response.statusText);
        return;
      }

      const newBoard = await response.json();

      if (newBoard && newBoard.id) {
        localStorage.setItem('boardId', newBoard.id);
        await fetchBoard(newBoard.id);
      } else {
        console.error('Created board has no ID:', newBoard);
      }
    } catch (error) {
      console.error('Failed to create a new board:', error);
    }
  };

  const openModal = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
    } else {
      // 新規タスク作成 - デフォルトは空文字列
      setSelectedTask({
        id: '',
        name: 'New Task',
        content: '',
        icon: '',
        status_name: 'to-do'
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (savedTask: Task) => {
    if (!board) return;

    const isNewTask = !savedTask.id;
    const method = isNewTask ? 'POST' : 'PUT';
    const url = isNewTask ? `${API_URL}/tasks` : `${API_URL}/tasks/${savedTask.id}`;

    const bodyData: any = {
      name: savedTask.name,
      content: savedTask.content,
      icon: savedTask.icon,
      status_name: savedTask.status_name,
    };

    if (isNewTask) {
      bodyData.board_id = board.id;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        } as HeadersInit,
        body: JSON.stringify(bodyData),
      });

      if (response.status === 401) {
        onLogout && onLogout();
        return;
      }

      if (response.ok) {
        await fetchBoard(board.id);
      } else {
        const errorData = await response.json();
        console.error('Failed to save task:', errorData.message);
        alert(`Failed to save task: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
    closeModal();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!board) return;
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders() as HeadersInit
      });

      if (response.status === 401) {
        onLogout && onLogout();
        return;
      }

      if (response.ok) {
        await fetchBoard(board.id);
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    closeModal();
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BoardHeader onLogout={onLogout} />
      <TaskList tasks={tasks} openModal={openModal} />
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
};