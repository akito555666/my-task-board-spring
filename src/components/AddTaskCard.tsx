import React from 'react';

interface AddTaskCardProps {
  onClick: () => void;
}

export const AddTaskCard: React.FC<AddTaskCardProps> = ({ onClick }) => {
  return (
    <div className="task-card add-task" onClick={onClick}>
      <div className="task-header">
        <span className="task-icon">➕️</span>
        <span className="task-add">Add new task</span>
      </div>
    </div>
  );
};