import React from 'react';
import AddIcon from "../../resources/Add_round_duotone.svg";

interface AddTaskCardProps {
  onClick: () => void;
}

export const AddTaskCard: React.FC<AddTaskCardProps> = ({ onClick }) => {
  return (
    <div className="task-card add-task" onClick={onClick}>
      <div className="task-header">
        <img src={AddIcon} alt="Add" className="task-icon-img" />
        <span className="task-add">タスクを追加</span>
      </div>
    </div>
  );
};