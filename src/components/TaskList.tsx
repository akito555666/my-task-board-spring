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
    <div className="task-list-container">
      {board.columns.map(column => (
        <div key={column.id} className="task-list">
          <h3 className="task-list-title">{column.name}</h3>
          {column.taskIds.map(taskId => {
            const task = tasks.find(t => t.id === taskId);
            return task ? <TaskCard key={task.id} task={task} onClick={() => openModal(task)} /> : null;
          })}
          <AddTaskCard onClick={() => openModal(undefined, column.id)} />
        </div>
      ))}
    </div>
  );
};