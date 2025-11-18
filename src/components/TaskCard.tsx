import React from 'react';
import { Task } from '../types';
import TaskStatusInProgressIcon from "../../resources/Time_atack_duotone.svg";
import TaskStatusCompletedIcon from "../../resources/Done_round_duotone.svg";
import TaskStatusWontDoIcon from "../../resources/close_ring_duotone.svg";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'in-progress':
      return TaskStatusInProgressIcon;
    case 'completed':
      return TaskStatusCompletedIcon;
    case 'wont-do':
      return TaskStatusWontDoIcon;
    default:
      return null;
  }
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div className={`task-card ${task.status}`} onClick={() => onClick(task)}>
      <div className="task-header">
        <span className="task-icon-card">{task.icon}</span>
        <span className="task-name">{task.name}</span>
        {task.status !== 'to-do' && (
          <img src={getStatusIcon(task.status)} alt={`${task.name} icon`} className={`task-status status-${task.status}`} />
        )}
      </div>
      <div className="task-content">
        {task.content}
      </div>
    </div>
  );
};