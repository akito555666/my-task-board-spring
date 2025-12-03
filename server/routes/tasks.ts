import { Router } from 'express';
import { nanoid } from 'nanoid';
import { prisma } from '../db.js';
import type { Task } from '../../src/types/index.js';

const router = Router();

// POST /api/tasks
router.post('/', async (req, res) => {
  const { name, board_id, status_name, icon, content } = req.body;

  if (!name || !board_id || !status_name) {
    return res.status(400).json({ message: 'Missing required fields: name, board_id, status_name' });
  }

  try {
    // ボード全体でのタスク数を取得して並び順を決定
    const count = await prisma.task.count({
      where: {
        boardId: board_id
      }
    });

    const newTask: Task = {
      id: nanoid(),
      name,
      status_name,
      icon: icon || '',
      content: content || '',
    };

    await prisma.task.create({
      data: {
        id: newTask.id,
        boardId: board_id,
        name: newTask.name,
        statusName: newTask.status_name,
        icon: newTask.icon,
        content: newTask.content,
        taskOrder: count
      }
    });

    res.status(201).json(newTask);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// PUT /api/tasks/:taskId
router.put('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { name, content, icon, status_name } = req.body;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        name: name !== undefined ? name : task.name,
        content: content !== undefined ? content : task.content,
        icon: icon !== undefined ? icon : task.icon,
        statusName: status_name !== undefined ? status_name : task.statusName
      }
    });

    res.json({ 
      id: updatedTask.id, 
      name: updatedTask.name, 
      content: updatedTask.content, 
      icon: updatedTask.icon, 
      status_name: updatedTask.statusName
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// DELETE /api/tasks/:taskId
router.delete('/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    await prisma.task.delete({
      where: { id: taskId }
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;