import React, { useState, useEffect, useRef } from "react";
import { Board, Task } from "../../types";
import { useModal } from "./useModal";
import InProgressIcon from "../../../resources/Time_atack_duotone.svg";
import CompletedIcon from "../../../resources/Done_round_duotone.svg";
import WontDoIcon from "../../../resources/close_ring_duotone.svg";
import ToDoIcon from "../../../resources/Add_round_duotone.svg";
import StatusSelectIcon from "../../../resources/Done_round_duotone.svg";
import SaveIcon from "../../../resources/Done_round.svg";
import DeleteIcon from "../../../resources/Trash.svg";
import CloseIcon from "../../../resources/close_ring_duotone-1.svg";

const availableIcons = ['🧑‍💻', '💬', '☕', '🏋️‍♂️', '📚', '⏰️'];

const getStatusIcon = (statusName: string) => {
  if (statusName.toLowerCase().includes('progress')) return InProgressIcon;
  if (statusName.toLowerCase().includes('completed')) return CompletedIcon;
  if (statusName.toLowerCase().includes('do')) return WontDoIcon;
  return ToDoIcon;
};

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  board: Board | null;
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, board, task, onSave, onDelete }) => {
  const [editTask, setEditTask] = useState<Partial<Task> | null>(task);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { handleInputChange, handleIconSelect, handleStatusSelect } = useModal({ setEditTask });  // Custom hook for modal logic

  useEffect(() => {
    setEditTask(task);
  }, [task]);

  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(adjustTextareaHeight, 0);
    }
  }, [isOpen, task?.content]);

  if (!isOpen || !editTask) return null;

  const statusOptions = board?.columns.map(column => ({
    value: column.id,
    label: column.name,
    icon: getStatusIcon(column.name),
  })) || [];

  const handleSave = () => {
    if (editTask && editTask.name && editTask.status) {
      onSave(editTask as Task);
    } else {
      // Basic validation feedback
      alert("Task name and status are required.");
    }
  };

  const handleDelete = () => {
    if (editTask && editTask.id) {
      onDelete(editTask.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Task details</h2>
          <button onClick={onClose} className="modal-close-button" aria-label="Close">
            <img src={CloseIcon} alt="Close" className="modal-close-img" />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Task name</label>
            <input type="text" name="name" value={editTask.name} onChange={handleInputChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              ref={textareaRef}
              name="content"
              placeholder="Enter a short description"
              value={editTask.content}
              onChange={handleInputChange}
              onInput={adjustTextareaHeight}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selector">
              {availableIcons.map(icon => (
                <span key={icon} className={`task-icon-modal ${editTask.icon === icon ? 'selected' : ''}`} onClick={() => handleIconSelect(icon)}>{icon}</span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <div className="status-selector">
              {statusOptions.map(({ value, label, icon }) => (
                <div
                  key={value}
                  className={`task-status-option ${editTask.status === value ? 'selected' : ''}`}
                  onClick={() => handleStatusSelect(value)}
                >
                  <img src={icon} alt={label} className={`task-status status-${value} status-icon`} />
                  <span>{label}</span>
                  {editTask.status === value && (
                    <img src={StatusSelectIcon} alt="Status selected" className="status-select-icon" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleDelete} className="btn btn-danger" disabled={!editTask.id}>Delete<img src={DeleteIcon} alt="Delete" className="btn-delete-icon" /></button>
          <button onClick={handleSave} className="btn btn-primary">Save<img src={SaveIcon} alt="Save" className="btn-save-icon" /></button>
        </div>
      </div>
    </div>
  );
};