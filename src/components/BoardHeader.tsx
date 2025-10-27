import React, { useState } from 'react';
import Logo from "../../resources/Logo.svg";
import EditIcon from "../../resources/Edit_duotone.svg";

export const BoardHeader: React.FC = () => {
  const [boardTitle, setBoardTitle] = useState<string>('My Task Board');
  const [boardTitleDisabled, setBoardTitleDisabled] = useState<boolean>(true);

  const onClickBoardTitleEdit = () => setBoardTitleDisabled(!boardTitleDisabled);

  return (
    <div className="board-header">
      <div className="board-logo">
        <img src={Logo} alt="Logo" className="board-logo-img" />
      </div>
      <div className="board-text">
        <div className="board-title">
          <input
            type="text"
            disabled={boardTitleDisabled}
            placeholder="Your Board Title"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            className="board-title-input"
            size={boardTitle.length - 4}
          />
          <div className="board-edit-icon" onClick={onClickBoardTitleEdit}>
            <img src={EditIcon} alt="Edit-Icon" className="board-edit-icon-img" />
          </div>
        </div>
        <div className="board-description">Tasks to keep organised</div>
      </div>
    </div>
  );
};