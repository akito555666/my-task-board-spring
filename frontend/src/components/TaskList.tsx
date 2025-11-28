import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { AddTaskCard } from './AddTaskCard';

interface TaskListProps {
  tasks: Task[];
  openModal: (task?: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, openModal }) => {
  return (
    <div className="task-board">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => openModal(task)}
        />
      ))}
      <AddTaskCard onClick={() => openModal()} />
    </div>
  );
};