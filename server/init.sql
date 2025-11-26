DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS boards CASCADE;

-- boardsテーブル
CREATE TABLE boards (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- tasksテーブル
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    board_id VARCHAR(255) NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT '',
    icon VARCHAR(255) DEFAULT '',
    status_name VARCHAR(50) NOT NULL DEFAULT '',
    content TEXT DEFAULT '',
    task_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_board_status ON tasks(board_id, status_name);

-- taskuserの作成（パスワードなし - setup-db.tsで設定）
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'taskuser') THEN
        CREATE USER taskuser;
    END IF;
END
$$;

GRANT CONNECT ON DATABASE taskboard TO taskuser;
GRANT USAGE ON SCHEMA public TO taskuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taskuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taskuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO taskuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO taskuser;
