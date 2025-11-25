import { Router } from 'express';
import { nanoid } from 'nanoid';
import { query } from '../db';
import { Task } from '../../src/types';

const router = Router();

// POST /api/tasks
router.post('/', async (req, res) => {
  const { name, board_id, status_name, icon, content } = req.body;

  if (!name || !board_id || !status_name) {
    return res.status(400).json({ message: 'Missing required fields: name, board_id, status_name' });
  }

  try {
    // status_name でのタスク数を取得して並び順を決定
    const orderRes = await query(
      'SELECT count(*) as count FROM tasks WHERE board_id = $1 AND status_name = $2',
      [board_id, status_name]
    );
    const order = parseInt(orderRes.rows[0].count, 10);

    const newTask: Task = {
      id: nanoid(),
      name,
      status_name,
      icon: icon || '',
      content: content || '',
    };

    await query(
      'INSERT INTO tasks (id, board_id, name, status_name, icon, content, task_order) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [newTask.id, board_id, newTask.name, newTask.status_name, newTask.icon, newTask.content, order]
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
  const { name, content, icon, status_name } = req.body;

  try {
    const taskRes = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (taskRes.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const task = taskRes.rows[0];

    const newName = name !== undefined ? name : task.name;
    const newContent = content !== undefined ? content : task.content;
    const newIcon = icon !== undefined ? icon : task.icon;
    const newStatusName = status_name !== undefined ? status_name : task.status_name;

    await query(
      'UPDATE tasks SET name = $1, content = $2, icon = $3, status_name = $4 WHERE id = $5',
      [newName, newContent, newIcon, newStatusName, taskId]
    );

    res.json({ 
      id: taskId, 
      name: newName, 
      content: newContent, 
      icon: newIcon, 
      status_name: newStatusName
    });
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