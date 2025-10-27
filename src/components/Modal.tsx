import React, { useState, useEffect } from "react";
import { Task } from "../types";

const availableIcons = ['⏰️', '🏋️‍♂️', '☕', '📚'];
const availableStatuses: Task['status'][] = ['in-progress', 'completed', 'wont-do'];

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, task, onSave, onDelete }) => {
  const [editTask, setEditTask] = useState<Task | null>(task);

  useEffect(() => {
    setEditTask(task);
  }, [task]);

  if (!isOpen || !editTask) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditTask(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleIconSelect = (icon: string) => {
    setEditTask(prev => {
      if (!prev) return null;
      if (prev.icon === icon) {
        return { ...prev, icon: '' };
      }
      return { ...prev, icon };
    });
  };

  const handleStatusSelect = (status: Task['status']) => {
    setEditTask(prev => {
      if (!prev) return null;
      if (prev.status === status) {
        return { ...prev, status: 'to-do' };
      }
      return { ...prev, status };
    });
  };

  const handleSave = () => {
    if (editTask) {
      onSave(editTask);
    }
  };

  const handleDelete = () => {
    if (editTask) {
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