import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { AddTaskCard } from './AddTaskCard';

interface TaskListProps {
  tasks: Task[];
  openModal: (task?: Task) => void;
  onStatusChange: (taskId: string, newStatus: Task['status_name']) => void;
  onReorderTasks: (newTasks: Task[]) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, openModal, onStatusChange, onReorderTasks }) => {
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTaskId?: string) => {
    e.preventDefault();
    const sourceTaskId = e.dataTransfer.getData('taskId');
    
    if (!sourceTaskId) return;
    if (sourceTaskId === targetTaskId) return;

    const sourceIndex = tasks.findIndex(t => t.id === sourceTaskId);
    if (sourceIndex === -1) return;

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(sourceIndex, 1);

    if (targetTaskId) {
      const targetIndex = newTasks.findIndex(t => t.id === targetTaskId);
      if (targetIndex !== -1) {
        newTasks.splice(targetIndex, 0, movedTask);
      }
    } else {
      newTasks.push(movedTask);
    }

    onReorderTasks(newTasks);
    setDraggedTaskId(null);
  };

  return (
    <div 
      className="task-list-container"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e)}
    >
      {tasks.map(task => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragOver={(e) => {
             e.preventDefault();
             e.stopPropagation();
          }}
          onDrop={(e) => {
             e.preventDefault();
             e.stopPropagation();
             handleDrop(e, task.id);
          }}
          className={`draggable-task-wrapper ${draggedTaskId === task.id ? 'dragging' : ''}`}
        >
          <TaskCard
            task={task}
            onClick={() => openModal(task)}
          />
        </div>
      ))}
      <AddTaskCard onClick={() => openModal()} />
    </div>
  );
};