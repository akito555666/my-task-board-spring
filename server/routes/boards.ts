import { Router } from 'express';
import { nanoid } from 'nanoid';
import pool, { query } from '../db';
import { Board, Column, Task } from '../../src/types';

const router = Router();

// GET /api/boards/:boardId
router.get('/:boardId', async (req, res) => {
  const { boardId } = req.params;

  try {
    const boardRes = await query('SELECT * FROM boards WHERE id = $1', [boardId]);
    if (boardRes.rows.length === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }
    const board: Board = {
      id: boardRes.rows[0].id,
      name: boardRes.rows[0].name,
      columns: [],
    };

    const columnsRes = await query('SELECT * FROM columns WHERE board_id = $1', [boardId]);
    const tasksRes = await query(
      'SELECT t.* FROM tasks t JOIN columns c ON t.status = c.id WHERE c.board_id = $1 ORDER BY t.task_order',
      [boardId]
    );

    const tasks = tasksRes.rows;
    board.columns = columnsRes.rows.map((c) => ({
      id: c.id,
      name: c.name,
      taskIds: tasks.filter((t) => t.status === c.id).map((t) => t.id),
    }));

    res.json({ board, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/boards
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const boardId = nanoid();
    await client.query('INSERT INTO boards (id, name) VALUES ($1, $2)', [boardId, 'My Task Board']);

    const columns = [
      { id: nanoid(), name: 'In Progress' },
      { id: nanoid(), name: 'Completed' },
      { id: nanoid(), name: "Won't do" },
    ];

    const defaultTasks = [
      { id: nanoid(), name: 'Task in Progress', status: columns[0].id, icon: 'Time_atack_duotone', content: 'This is a task in progress.' },
      { id: nanoid(), name: 'Task Completed', status: columns[1].id, icon: 'Done_round_duotone', content: 'This is a completed task.' },
      { id: nanoid(), name: "Task Won't Do", status: columns[2].id, icon: 'close_ring_duotone', content: "This is a task that won't be done." },
    ];

    for (const col of columns) {
      await client.query('INSERT INTO columns (id, name, board_id) VALUES ($1, $2, $3)', [col.id, col.name, boardId]);
    }

    let order = 0;
    for (const task of defaultTasks) {
      await client.query(
        'INSERT INTO tasks (id, name, status, icon, content, task_order) VALUES ($1, $2, $3, $4, $5, $6)',
        [task.id, task.name, task.status, task.icon, task.content, order++]
      );
    }
    
    const newBoard: Board = {
        id: boardId,
        name: 'My Task Board',
        columns: columns.map((c, i) => ({...c, taskIds: [defaultTasks[i].id]})),
    }

    await client.query('COMMIT');
    res.status(201).json(newBoard);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

// PUT /api/boards/:boardId
router.put('/:boardId', async (req, res) => {
    const { boardId } = req.params;
    const { name, columns } = req.body;

    try {
        if (name) {
            await query('UPDATE boards SET name = $1 WHERE id = $2', [name, boardId]);
        }
        if (columns) {
            // This is a complex operation. For simplicity, we'll only handle column reordering and name changes.
            // A full implementation would handle adding/deleting columns as well.
            for (const col of columns) {
                await query('UPDATE columns SET name = $1 WHERE id = $2', [col.name, col.id]);
                let order = 0;
                for (const taskId of col.taskIds) {
                    await query('UPDATE tasks SET status = $1, task_order = $2 WHERE id = $3', [col.id, order++, taskId]);
                }
            }
        }
        res.status(200).json({ message: 'Board updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/boards/:boardId
router.delete('/:boardId', async (req, res) => {
  const { boardId } = req.params;

  try {
    await query('DELETE FROM boards WHERE id = $1', [boardId]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
