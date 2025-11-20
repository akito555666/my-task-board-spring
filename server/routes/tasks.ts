import { Router } from 'express';
import { nanoid } from 'nanoid';
import { query } from '../db';
import { Task } from '../../src/types';

const router = Router();

// POST /api/tasks
router.post('/', async (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const orderRes = await query('SELECT count(*) as count FROM tasks WHERE status = $1', [status]);
    const order = parseInt(orderRes.rows[0].count, 10);

    const newTask: Task = {
      id: nanoid(),
      name,
      status,
      icon: 'Add_round_duotone',
      content: '',
    };

    await query(
      'INSERT INTO tasks (id, name, status, icon, content, task_order) VALUES ($1, $2, $3, $4, $5, $6)',
      [newTask.id, newTask.name, newTask.status, newTask.icon, newTask.content, order]
    );

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/tasks/:taskId
router.put('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { name, content, icon, status } = req.body;

  try {
    const taskRes = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (taskRes.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const task = taskRes.rows[0];

    const newName = name ?? task.name;
    const newContent = content ?? task.content;
    const newIcon = icon ?? task.icon;
    const newStatus = status ?? task.status;
    // Note: task_order update is not handled here for simplicity.
    // A full implementation would require reordering tasks in both old and new columns.

    await query(
      'UPDATE tasks SET name = $1, content = $2, icon = $3, status = $4 WHERE id = $5',
      [newName, newContent, newIcon, newStatus, taskId]
    );

    res.json({ id: taskId, name: newName, content: newContent, icon: newIcon, status: newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/tasks/:taskId
router.delete('/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    const result = await query('DELETE FROM tasks WHERE id = $1', [taskId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
