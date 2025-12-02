import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { AddTaskCard } from './AddTaskCard';

interface TaskListProps {
  tasks: Task[];
  openModal: (task?: Task) => void;
  onStatusChange: (taskId: string, newStatus: Task['status_name']) => void;
}

const STATUSES: Task['status_name'][] = ['to-do', 'in-progress', 'completed', 'wont-do'];

const STATUS_LABELS: Record<string, string> = {
  'to-do': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'wont-do': "Won't Do"
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, openModal, onStatusChange }) => {
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Task['status_name']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div className="task-board-columns">
      {STATUSES.map(status => (
        <div
          key={status}
          className="board-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <h3 className="column-header">{STATUS_LABELS[status]}</h3>
          <div className="column-tasks">
            {tasks
              .filter(task => task.status_name === status)
              .map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="draggable-task-wrapper"
                >
                  <TaskCard
                    task={task}
                    onClick={() => openModal(task)}
                  />
                </div>
              ))}
            {status === 'to-do' && (
              <AddTaskCard onClick={() => openModal()} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};