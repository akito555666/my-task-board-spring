import { Router } from 'express';
import { nanoid } from 'nanoid';
import pool, { query } from '../db';
import { Board, Task } from '../../src/types';

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
      description: boardRes.rows[0].description || '',
    };

    const tasksRes = await query(
      'SELECT * FROM tasks WHERE board_id = $1 ORDER BY created_at ASC',
      [boardId]
    );

    const tasks = tasksRes.rows;

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
    await client.query(
      'INSERT INTO boards (id, name, description) VALUES ($1, $2, $3)', 
      [boardId, 'My Task Board', 'Tasks to keep organised']
    );

    const defaultTasks = [
      { 
        id: nanoid(), 
        name: 'Task in Progress', 
        status_name: 'in-progress',
        icon: '⏰', 
        content: 'This is a task in progress.',
        task_order: 1
      },
      { 
        id: nanoid(), 
        name: 'Task Completed', 
        status_name: 'completed',
        icon: '🏋️‍♂️', 
        content: 'This is a completed task.',
        task_order: 2
      },
      { 
        id: nanoid(), 
        name: "Task Won't Do", 
        status_name: 'wont-do',
        icon: '☕', 
        content: "This is a task that won't be done.",
        task_order: 3
      },
      { 
        id: nanoid(), 
        name: 'Task To Do', 
        status_name: 'to-do',
        icon: '📚', 
        content: 'Work on a Challenge on devChallenges.io, learn TypeScript.',
        task_order: 4
      }
    ];

    for (const task of defaultTasks) {
      await client.query(
        'INSERT INTO tasks (id, board_id, name, status_name, icon, content, task_order) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [task.id, boardId, task.name, task.status_name, task.icon, task.content, task.task_order]
      );
    }
    
    const newBoard: Board = {
      id: boardId,
      name: 'My Task Board',
      description: 'Tasks to keep organised',
    };

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
  const { name, description } = req.body;

  try {
    if (name !== undefined || description !== undefined) {
      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(description);
      }
      values.push(boardId);

      await query(
        `UPDATE boards SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
        values
      );
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