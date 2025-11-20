import React, { useState, useEffect } from "react";
import { Board, Task } from "./types";
import { BoardHeader } from "./components/BoardHeader";
import { TaskList } from "./components/TaskList";
import { Modal } from "./components/modal/Modal";

const API_URL = 'http://localhost:3001/api';

export const TaskBoard = (): React.ReactElement => {
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
      const response = await fetch(`${API_URL}/boards/${boardId}`);
      if (response.ok) {
        const data = await response.json();
        setBoard(data.board);
        setTasks(data.tasks);
        localStorage.setItem('boardId', data.board.id);
      } else {
        // If board not found, create a new one
        createNewBoard();
      }
    } catch (error) {
      console.error('Failed to fetch board:', error);
    }
  };

  const createNewBoard = async () => {
    try {
      const response = await fetch(`${API_URL}/boards`, { method: 'POST' });
      const newBoard = await response.json();
      fetchBoard(newBoard.id);
    } catch (error) {
      console.error('Failed to create a new board:', error);
    }
  };

  const openModal = (task?: Task, status?: string) => {
    if (task) {
      setSelectedTask(task);
    } else {
      // For creating a new task.
      setSelectedTask({ id: '', name: '', content: '', icon: '➕️', status: status || '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (savedTask: Task) => {
    const isNewTask = !savedTask.id;
    const method = isNewTask ? 'POST' : 'PUT';
    const url = isNewTask ? `${API_URL}/tasks` : `${API_URL}/tasks/${savedTask.id}`;
    
    if (!board) return;

    // For new tasks, the status must be set.
    if (isNewTask && !savedTask.status) {
        alert("Please select a status for the new task.");
        return;
    }

    const body = JSON.stringify(savedTask);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        await fetchBoard(board.id); // Refetch to get the latest state
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
      const response = await fetch(`${API_URL}/tasks/${taskId}?boardId=${board.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchBoard(board.id); // Refetch to get the latest state
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
      <BoardHeader />
      <TaskList board={board} tasks={tasks} openModal={openModal} />
      <Modal isOpen={modalOpen} onClose={closeModal} board={board} task={selectedTask} onSave={handleSaveTask} onDelete={handleDeleteTask} />
    </>
  );
};