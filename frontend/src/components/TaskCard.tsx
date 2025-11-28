import React from 'react';
import { Task } from '../types';
import TaskStatusInProgressIcon from "../../resources/Time_atack_duotone.svg";
import TaskStatusCompletedIcon from "../../resources/Done_round_duotone.svg";
import TaskStatusWontDoIcon from "../../resources/close_ring_duotone.svg";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const getStatusIcon = (status: Task['status_name']) => {
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
  const statusIcon = getStatusIcon(task.status_name);
  
  return (
    <div className={`task-card ${task.status_name || 'to-do'}`} onClick={() => onClick(task)}>
      <div className="task-header">
        <span className="task-icon-card">{task.icon}</span>
        <span className="task-name">{task.name}</span>
        {statusIcon && task.status_name !== 'to-do' && (
          <img
            src={statusIcon}
            alt={`${task.status_name} icon`}
            className={`task-status status-${task.status_name}`}
          />
        )}
      </div>
      <div className="task-content">
        {task.content}
      </div>
    </div>
  );
};