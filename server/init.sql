DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS columns;
DROP TABLE IF EXISTS boards;

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
    column_id VARCHAR(255) REFERENCES columns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    status VARCHAR(255),
    content TEXT,
    task_order INTEGER
);
