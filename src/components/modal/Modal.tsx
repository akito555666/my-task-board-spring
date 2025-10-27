import React, { useState, useEffect, use } from "react";
import { Task } from "../../types";
import { useModal } from "./useModal";

const availableIcons = ['🧑‍💻', '💬', '⏰️', '🏋️‍♂️', '☕', '📚'];
const availableStatuses: Task['status'][] = ['in-progress', 'completed', 'wont-do'];

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, task, onSave, onDelete }) => {
  const [editTask, setEditTask] = useState<Partial<Task> | null>(task);

  const { handleInputChange, handleIconSelect, handleStatusSelect } = useModal({ setEditTask });  // Custom hook for modal logic

  useEffect(() => {
    setEditTask(task);
  }, [task]);

  if (!isOpen || !editTask) return null;

  const handleSave = () => {
    if (editTask && editTask.id !== undefined) {
      onSave(editTask as Task);
    }
  };

  const handleDelete = () => {
    if (editTask && editTask.id !== undefined) {
      onDelete(editTask.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Task details</h2>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Task name</label>
            <input type="text" name="name" value={editTask.name} onChange={handleInputChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="content" placeholder="Enter a short description" value={editTask.content} onChange={handleInputChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selector">
              {availableIcons.map(icon => (
                <span key={icon} className={`task-icon ${editTask.icon === icon ? 'selected' : ''}`} onClick={() => handleIconSelect(icon)}>{icon}</span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <div className="status-selector">
              {availableStatuses.map(status => (
                <span key={status} className={`task-status-option status-${status} ${editTask.status === status ? 'selected' : ''}`} onClick={() => handleStatusSelect(status)}>{status.replace('-', ' ')}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          <button onClick={handleSave} className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
};