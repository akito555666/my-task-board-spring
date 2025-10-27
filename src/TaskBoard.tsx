import React, { useState } from "react";
import { Task } from "./types";
import { BoardHeader } from "./components/BoardHeader";
import { TaskList } from "./components/TaskList";
import { Modal } from "./components/Modal";

const initialTasks: Task[] = [
  { id: 1, name: 'Task in Progress', status: 'in-progress', icon: '⏰️', content: 'Work on a Challenge on devchallenges.io.' },
  { id: 2, name: 'Task Completed', status: 'completed', icon: '🏋️‍♂️', content: 'Work on a Challenge on devchallenges.io!' },
  { id: 3, name: 'Task Won’t Do', status: 'wont-do', icon: '☕', content: 'Work on a Challenge on devchallenges.io...' },
  { id: 4, name: 'Task To Do', status: 'to-do', icon: '📚', content: 'Work on a Challenge on devchallenges.io, to learn TypeScript.' },
];

export const TaskBoard = (): React.ReactElement => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openModal = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
    } else {
      const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setSelectedTask({ id: newId, name: '', content: '', icon: '➕️', status: 'to-do' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (savedTask: Task) => {
    const taskExists = tasks.some(task => task.id === savedTask.id);
    if (taskExists) {
      setTasks(tasks.map(task => task.id === savedTask.id ? savedTask : task));
    } else {
      setTasks([...tasks, savedTask]);
    }
    closeModal();
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    closeModal();
  };

  return (
    <>
      <BoardHeader />
      <TaskList tasks={tasks} openModal={openModal} />
      <Modal isOpen={modalOpen} onClose={closeModal} task={selectedTask} onSave={handleSaveTask} onDelete={handleDeleteTask} />
    </>
  );
};