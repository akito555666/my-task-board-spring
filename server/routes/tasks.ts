import { Router } from 'express';
import { nanoid } from 'nanoid';
import { query } from '../db';
import { Task } from '../../src/types';

const router = Router();

// POST /api/tasks
router.post('/', async (req, res) => {
  const { name, column_id, status } = req.body;

  if (!name || !column_id) {
    return res.status(400).json({ message: 'Missing required fields: name, column_id' });
  }

  try {
    // column_id でのタスク数を取得して並び順を決定
    const orderRes = await query('SELECT count(*) as count FROM tasks WHERE column_id = $1', [column_id]);
    const order = parseInt(orderRes.rows[0].count, 10);

    const newTask: Task = {
      id: nanoid(),
      name,
      status: status || 'to-do', // デフォルトは 'to-do'
      icon: 'Add_round_duotone',
      content: '',
    };

    await query(
      'INSERT INTO tasks (id, column_id, name, status, icon, content, task_order) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [newTask.id, column_id, newTask.name, newTask.status, newTask.icon, newTask.content, order]
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
  const { name, content, icon, status, column_id } = req.body;

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
    const newColumnId = column_id ?? task.column_id;

    await query(
      'UPDATE tasks SET name = $1, content = $2, icon = $3, status = $4, column_id = $5 WHERE id = $6',
      [newName, newContent, newIcon, newStatus, newColumnId, taskId]
    );

    res.json({ 
      id: taskId, 
      name: newName, 
      content: newContent, 
      icon: newIcon, 
      status: newStatus,
      column_id: newColumnId 
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
