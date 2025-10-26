import { JSX } from "react";
import Logo from "../resources/Logo.svg";
import EditIcon from "../resources/Edit_duotone.svg";
import TaskStatusInProgressIcon from "../resources/Time_atack_duotone.svg";
import TaskStatusCompletedIcon from "../resources/Done_round_duotone.svg";
import TaskStatusWontDoIcon from "../resources/close_ring_duotone.svg";

declare module '*.svg' {
  const content: string;
  export default content;
}


export const TaskBoard = (): JSX.Element => {
  return (
    <>
      <div className="board-header">
        <div className="board-logo">
          <img src={Logo} alt="Logo" className="board-logo-img" />
        </div>
        <div className="board-text">
          <div className="board-title">My Task Board
            <div className="board-edit-icon">
              <img src={EditIcon} alt="Edit-Icon" className="board-edit-icon-img" />
            </div>
          </div>
          <div className="board-description">Tasks to keep organised</div>
        </div>
      </div>

      <div className="task-board">
        {/* ここにタスクボードの内容を追加します */}
        {/* <div>Enter a short description</div>
      <div>In Progress</div>
      <div>Completed</div>
      <div>Won’t do</div> */}
        <div className="task-card in-progress" onClick={() => { alert("Click Task in Progress") }}>
          <div className="task-header">
            <span className="task-icon">⏰️</span>
            <span className="task-name">Task in Progress</span>
            <img src={TaskStatusInProgressIcon} alt="Task-Status-In-Progress-Icon" className="task-status status-in-progress" />
          </div>
          <div className="task-content">
          </div>
        </div>
        <div className="task-card completed" onClick={() => { alert("Click Task Completed") }}>
          <div className="task-header">
            <span className="task-icon">🏋️‍♂️</span>
            <span className="task-name">Task Completed</span>
            <img src={TaskStatusCompletedIcon} alt="Task-Status-Completed-Icon" className="task-status status-completed" />
          </div>
          <div className="task-content">
          </div>
        </div>
        <div className="task-card wont-do" onClick={() => { alert("Click Task Won’t Do") }}>
          <div className="task-header">
            <span className="task-icon">☕</span>
            <span className="task-name">Task Won’t Do</span>
            <img src={TaskStatusWontDoIcon} alt="Task-Status-Won't-Do-Icon" className="task-status status-wont-do" />
          </div>
          <div className="task-content">
          </div>
        </div>
        <div className="task-card to-do" onClick={() => { alert("Click Task ToDo") }}>
          <div className="task-header">
            <span className="task-icon">📚</span>
            <span className="task-name">Task To Do
              <div className="task-content">
                Work on a Challenge on devchallenges.io,<br /> to
                learn TypeScript.
              </div>
            </span>
          </div>

        </div>
        <div className="task-card add-task" onClick={() => { alert("Click Add new task") }}>
          <div className="task-header">
            <span className="task-icon">➕️</span>
            <span className="task-add">Add new task</span>
          </div>
        </div>

        {/* <div id="1">
          <div className="task-icon">⏰️</div>
          <button className="task-card" onClick={() => { alert("Click Task in Progress") }}>Task in Progress</button>
        </div>
        <div id="2">
          <div className="task-icon">🏋️‍♂️</div>
          <button className="task-card" onClick={() => { alert("Click Task Completed") }}>Task Completed</button>
        </div>
        <div id="3">
          <div className="task-icon">☕</div>
          <button className="task-card" onClick={() => { alert("Click Task Won’t Do") }}>Task Won’t Do</button>
        </div>
        <div id="4">
          <div className="task-icon">📚</div>
          <button className="task-card" onClick={() => { alert("Click Task To Do") }}>Task To Do</button>
        </div>
        <button className="task-add-new" onClick={() => { alert("Add new task") }}>Add new task</button> */}
      </div>
    </>
  );
};