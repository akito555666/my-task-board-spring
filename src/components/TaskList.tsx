import React from 'react';
import { Board, Task } from '../types';
import { TaskCard } from './TaskCard';
import { AddTaskCard } from './AddTaskCard';

interface TaskListProps {
  board: Board;
  tasks: Task[];
  openModal: (task?: Task, status?: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ board, tasks, openModal }) => {
  return (
    <div className="task-board">
      {board.columns.map(column => (
        <div key={column.id} className="task-item">
          {column.taskIds.map(taskId => {
            const task = tasks.find(t => t.id === taskId);
            return task ? <TaskCard key={task.id} task={task} onClick={() => openModal(task)} /> : null;
          })}
        </div>
      ))}
      <AddTaskCard onClick={() => openModal()} />
    </div>
  );
};