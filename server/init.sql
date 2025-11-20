-- boardsテーブル
CREATE TABLE boards (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- columnsテーブル
CREATE TABLE columns (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    board_id VARCHAR(255) REFERENCES boards(id) ON DELETE CASCADE
);

-- tasksテーブル
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(255) REFERENCES columns(id) ON DELETE CASCADE,
    icon VARCHAR(255),
    content TEXT,
    task_order INTEGER
);
