import { Router } from 'express';
import { nanoid } from 'nanoid';
import { prisma } from '../db.js';
import type { Board, Task } from '../../src/types/index.js';

const router = Router();

// GET /api/boards/:boardId
router.get('/:boardId', async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        tasks: {
          orderBy: { taskOrder: 'asc' }
        }
      }
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Prismaのフィールド名をフロントエンドの形式に変換
    const tasksFormatted = board.tasks.map(task => ({
      id: task.id,
      name: task.name,
      icon: task.icon,
      content: task.content,
      status_name: task.statusName,
    }));

    res.json({ board, tasks: tasksFormatted });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// POST /api/boards
router.post('/', async (req, res) => {
  try {
    const boardId = nanoid();

    const board = await prisma.board.create({
      data: {
        id: boardId,
        name: 'My Task Board',
        description: 'Tasks to keep organised',
        tasks: {
          create: [
            { 
              id: nanoid(), 
              name: 'Task in Progress', 
              statusName: 'in-progress',
              icon: '⏰', 
              content: 'This is a task in progress.',
              taskOrder: 0
            },
            { 
              id: nanoid(), 
              name: 'Task Completed', 
              statusName: 'completed',
              icon: '🏋️‍♂️', 
              content: 'This is a completed task.',
              taskOrder: 1
            },
            { 
              id: nanoid(), 
              name: "Task Won't Do", 
              statusName: 'wont-do',
              icon: '☕', 
              content: "This is a task that won't be done.",
              taskOrder: 2
            },
            { 
              id: nanoid(), 
              name: 'Task To Do', 
              statusName: 'to-do',
              icon: '📚', 
              content: 'Work on a Challenge on devChallenges.io, learn TypeScript.',
              taskOrder: 3
            }
          ]
        }
      }
    });

    const newBoard: Board = {
      id: board.id,
      name: board.name,
      description: board.description || '',
    };

    res.status(201).json(newBoard);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// PUT /api/boards/:boardId
router.put('/:boardId', async (req, res) => {
  const { boardId } = req.params;
  const { name, description } = req.body;

  try {
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length > 0) {
      await prisma.board.update({
        where: { id: boardId },
        data: updateData
      });
    }

    res.status(200).json({ message: 'Board updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/boards/:boardId/tasks/reorder
router.put('/:boardId/tasks/reorder', async (req, res) => {
  const { boardId } = req.params;
  const { taskIds } = req.body;

  if (!Array.isArray(taskIds)) {
    return res.status(400).json({ message: 'taskIds must be an array' });
  }

  try {
    // トランザクションで一括更新
    await prisma.$transaction(
      taskIds.map((taskId, index) => 
        prisma.task.update({
          where: { id: taskId, boardId: boardId },
          data: { taskOrder: index }
        })
      )
    );

    res.status(200).json({ message: 'Tasks reordered' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// DELETE /api/boards/:boardId
router.delete('/:boardId', async (req, res) => {
  const { boardId } = req.params;

  try {
    await prisma.board.delete({
      where: { id: boardId }
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;